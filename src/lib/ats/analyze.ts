import { containsPhrase, normalize } from "./normalize";
import { GENERAL_TERMS, TECH_TERMS, type DictTerm } from "./dictionary";

export type JobType = "geral" | "tecnologia";

export interface Keyword {
  label: string;
  weight: number;
  kind: "tech" | "general" | "extracted";
  optional: boolean; // appears in "diferenciais/desejável"
  found: boolean;
}

export interface AnalysisResult {
  inconclusive: boolean;
  score: number | null;
  keywords: Keyword[];
  found: Keyword[];
  missing: Keyword[];
  recommendations: string[];
}

const MAX_TERMS = 15;

const STOPWORDS = new Set(
  (
    "a o as os um uma uns umas de da do das dos em na no nas nos para por com sem sobre entre e ou que se sua seu suas seus ao aos a la como mais menos muito ja nao sim ser estar ter fazer atuar atuacao conhecimento conhecimentos experiencia experiencias vaga vagas empresa empresas candidato candidata candidatos requisitos requisito diferenciais diferencial desejavel desejaveis obrigatorio responsabilidades atividades beneficios salario local trabalho area areas buscamos procuramos oportunidade junior pleno senior analista profissional perfil time equipe nivel bom boa basico basica avancado avancada fundamentos todos todas cada outros outras pessoas etc ate apos durante tambem sendo onde quando nosso nossa voce isso este esta esse essa ambiente dia dias anos ano horario modelo hibrido remoto presencial contratacao clt vale"
  ).split(" "),
);

function dictionaryFor(type: JobType): DictTerm[] {
  // Tech vocabulary still applies to "geral" (e.g. Excel/SQL), but general-first ordering.
  return type === "tecnologia" ? [...TECH_TERMS, ...GENERAL_TERMS] : [...GENERAL_TERMS, ...TECH_TERMS];
}

function optionalSplitIndex(normJob: string): number {
  const markers = [" diferenciais ", " diferencial ", " desejavel ", " desejaveis ", " sera um diferencial "];
  const idx = markers.map((m) => normJob.indexOf(m)).filter((i) => i >= 0);
  return idx.length ? Math.min(...idx) : -1;
}

export function analyze(job: string, resume: string, type: JobType): AnalysisResult {
  const normJob = normalize(job);
  const normResume = normalize(resume);
  const split = optionalSplitIndex(normJob);

  // Match longest variants first, blanking matched spans so "Windows Server" doesn't also yield "Windows".
  const entries = dictionaryFor(type).flatMap((term) =>
    term.variants.map((v) => ({ term, variant: normalize(v).trim() })),
  );
  entries.sort((a, b) => b.variant.length - a.variant.length);

  let working = normJob;
  const matched = new Map<string, { term: DictTerm; firstIndex: number }>();
  for (const { term, variant } of entries) {
    const needle = ` ${variant} `;
    let i = working.indexOf(needle);
    if (i < 0) continue;
    const prev = matched.get(term.label);
    if (!prev || i < prev.firstIndex) matched.set(term.label, { term, firstIndex: i });
    while (i >= 0) {
      working = working.slice(0, i + 1) + "_".repeat(variant.length) + working.slice(i + 1 + variant.length);
      i = working.indexOf(needle);
    }
  }

  const keywords: Keyword[] = [];
  for (const { term, firstIndex } of matched.values()) {
    const optional = split >= 0 && firstIndex > split;
    const base = term.kind === "tech" ? 3 : 2;
    keywords.push({
      label: term.label,
      kind: term.kind,
      optional,
      weight: optional ? base / 2 : base,
      found: term.variants.some((v) => containsPhrase(normResume, normalize(v))),
    });
  }

  // Conservative complement: meaningful words repeated in the job (>=2x), not covered by the dictionary.
  const counts = new Map<string, number>();
  for (const w of working.split(" ")) {
    if (w.length < 5 || w.includes("_") || STOPWORDS.has(w) || /^\d+$/.test(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  const extracted = [...counts.entries()].filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 4);
  for (const [w] of extracted) {
    keywords.push({
      label: w.charAt(0).toUpperCase() + w.slice(1),
      kind: "extracted",
      optional: false,
      weight: 1,
      found: containsPhrase(normResume, w),
    });
  }

  keywords.sort((a, b) => b.weight - a.weight);
  const top = keywords.slice(0, MAX_TERMS);
  const found = top.filter((k) => k.found);
  const missing = top.filter((k) => !k.found);

  if (top.length === 0) {
    return { inconclusive: true, score: null, keywords: [], found: [], missing: [], recommendations: [] };
  }

  return {
    inconclusive: false,
    score: computeScore(top),
    keywords: top,
    found,
    missing,
    recommendations: buildRecommendations(found, missing, resume),
  };
}

export function computeScore(keywords: Pick<Keyword, "weight" | "found">[]): number | null {
  const total = keywords.reduce((s, k) => s + k.weight, 0);
  if (total <= 0) return null;
  const got = keywords.filter((k) => k.found).reduce((s, k) => s + k.weight, 0);
  return Math.min(100, Math.max(0, Math.round((got / total) * 100)));
}

function buildRecommendations(found: Keyword[], missing: Keyword[], resume: string): string[] {
  const recs: string[] = [];
  const reqMissing = missing.filter((k) => !k.optional);
  const optMissing = missing.filter((k) => k.optional);

  for (const k of reqMissing.slice(0, 2)) {
    recs.push(
      `Se você realmente utiliza ${k.label}, descreva a experiência de forma verificável (onde, quando e como usou). Se não utiliza, não inclua.`,
    );
  }
  if (optMissing.length) {
    recs.push(
      `${optMissing.map((k) => k.label).join(", ")} aparece(m) como diferencial. Inclua apenas se tiver contato real, mesmo que em estudos ou projetos.`,
    );
  }
  if (found.length) {
    recs.push(
      `Você já tem evidências de ${found.slice(0, 3).map((k) => k.label).join(", ")}. Use os mesmos termos da vaga nas experiências onde eles realmente aparecem.`,
    );
  }
  const n = normalize(resume);
  if (!/ (resumo|objetivo|perfil profissional|sobre mim) /.test(n)) {
    recs.push("Não identificamos uma seção de resumo. Considere escrever 2–3 linhas com sua experiência real relacionada à vaga.");
  }
  if (!/\d+ ?%|\d+ (chamados|usuarios|clientes|projetos|pessoas)/.test(n.replace(/ % /g, "% "))) {
    recs.push("Se houver números reais (volume de chamados, prazos, resultados), acrescente-os às experiências para torná-las mais concretas.");
  }
  if (missing.length === 0) {
    recs.push("Todos os termos identificados foram encontrados. Revise a clareza das descrições antes de enviar.");
  }
  return recs.slice(0, 5);
}
