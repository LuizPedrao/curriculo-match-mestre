import { normalize } from "@/lib/ats/normalize";

type SectionKey =
  | "resumo" | "competencias" | "experiencia" | "formacao" | "certificacoes" | "projetos" | "idiomas" | "outras";

const TITLES: Record<SectionKey, string> = {
  resumo: "RESUMO PROFISSIONAL",
  competencias: "COMPETÊNCIAS",
  experiencia: "EXPERIÊNCIA PROFISSIONAL",
  formacao: "FORMAÇÃO ACADÊMICA",
  certificacoes: "CURSOS E CERTIFICAÇÕES",
  projetos: "PROJETOS",
  idiomas: "IDIOMAS",
  outras: "OUTRAS INFORMAÇÕES",
};

const ORDER: SectionKey[] = ["resumo", "competencias", "experiencia", "formacao", "certificacoes", "projetos", "idiomas", "outras"];

const HEADINGS: [SectionKey, string[]][] = [
  ["resumo", ["resumo", "resumo profissional", "objetivo", "objetivo profissional", "perfil", "perfil profissional", "sobre mim", "apresentacao"]],
  ["competencias", ["competencias", "habilidades", "competencias tecnicas", "habilidades tecnicas", "conhecimentos", "conhecimentos tecnicos", "skills", "hard skills", "soft skills"]],
  ["experiencia", ["experiencia", "experiencias", "experiencia profissional", "experiencias profissionais", "historico profissional"]],
  ["formacao", ["formacao", "formacao academica", "escolaridade", "educacao"]],
  ["certificacoes", ["cursos", "certificacoes", "cursos e certificacoes", "certificados", "cursos complementares", "qualificacoes"]],
  ["projetos", ["projetos", "projetos academicos", "projetos pessoais"]],
  ["idiomas", ["idiomas", "linguas"]],
  ["outras", ["outras informacoes", "informacoes adicionais", "atividades extracurriculares", "voluntariado"]],
];

export function detectHeading(line: string): SectionKey | null {
  const raw = line.trim();
  if (!raw || raw.length > 45) return null;
  const n = normalize(raw.replace(/[:\-–—]+\s*$/, "")).trim();
  for (const [key, names] of HEADINGS) if (names.includes(n)) return key;
  return null;
}

function formatLine(line: string): string {
  const t = line.trim();
  const m = t.match(/^[•\-*–—·▪●○◦>]+\s*(.*)$/);
  return m ? `- ${m[1]}` : t;
}

function cleanBlock(lines: string[]): string {
  const out: string[] = [];
  for (const l of lines.map(formatLine)) {
    if (!l && (!out.length || out[out.length - 1] === "")) continue;
    out.push(l);
  }
  while (out.length && out[out.length - 1] === "") out.pop();
  return out.join("\n");
}

export interface ReorganizeResult {
  text: string;
  structured: boolean; // false => original order kept with minimal formatting
}

export function reorganizeResume(resume: string, foundSkills: string[]): ReorganizeResult {
  const lines = resume.replace(/\r\n?/g, "\n").split("\n");
  const header: string[] = [];
  const sections = new Map<SectionKey, string[]>();
  let current: SectionKey | null = null;
  let headingCount = 0;

  for (const line of lines) {
    const h = detectHeading(line);
    if (h) {
      headingCount++;
      current = h;
      if (!sections.has(h)) sections.set(h, []);
      else sections.get(h)!.push("");
      continue;
    }
    if (current) sections.get(current)!.push(line);
    else header.push(line);
  }

  const skillsBlock = foundSkills.length
    ? `COMPETÊNCIAS IDENTIFICADAS NO CURRÍCULO\n${foundSkills.join(" | ")}`
    : "";

  if (headingCount < 2) {
    const body = cleanBlock(lines);
    return { text: [body, skillsBlock].filter(Boolean).join("\n\n"), structured: false };
  }

  const parts: string[] = [];
  const head = cleanBlock(header);
  if (head) parts.push(head);
  for (const key of ORDER) {
    const content = sections.get(key);
    if (key === "competencias" && skillsBlock && !content) {
      parts.push(skillsBlock);
      continue;
    }
    if (!content) continue;
    const body = cleanBlock(content);
    if (!body) continue;
    parts.push(`${TITLES[key]}\n${body}`);
    if (key === "competencias" && skillsBlock) parts.push(skillsBlock);
  }
  if (skillsBlock && !parts.includes(skillsBlock)) parts.splice(head ? 1 : 0, 0, skillsBlock);
  return { text: parts.join("\n\n"), structured: true };
}
