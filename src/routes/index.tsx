import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FlaskConical, Radar, ScanSearch, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { analyze, type AnalysisResult as Result, type JobType } from "@/lib/ats/analyze";
import { reorganizeResume } from "@/lib/resume/reorganize";
import { EXAMPLE_JOB, EXAMPLE_RESUME } from "@/data/example";
import { AnalysisResult } from "@/components/cvradar/AnalysisResult";
import { ResumeEditor } from "@/components/cvradar/ResumeEditor";
import { PrintableResume } from "@/components/cvradar/PrintableResume";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CVRadar ATS | Analise seu currículo para vagas" },
      { name: "description", content: "Compare seu currículo com a descrição da vaga, veja palavras-chave presentes e ausentes e gere uma versão ATS-friendly. Grátis, sem cadastro." },
      { property: "og:title", content: "CVRadar ATS | Analise seu currículo para vagas" },
      { property: "og:description", content: "Seu currículo com mais clareza para cada oportunidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const MIN_JOB = 80;
const MIN_RESUME = 150;

function Index() {
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [type, setType] = useState<JobType>("geral");
  const [isExample, setIsExample] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [finalText, setFinalText] = useState("");
  const [structured, setStructured] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

  function run() {
    const errs: string[] = [];
    if (job.trim().length < MIN_JOB) errs.push(`Cole a descrição da vaga com pelo menos ${MIN_JOB} caracteres.`);
    if (resume.trim().length < MIN_RESUME) errs.push(`Cole seu currículo com pelo menos ${MIN_RESUME} caracteres.`);
    setErrors(errs);
    if (errs.length) return;
    const r = analyze(job, resume, type);
    const re = reorganizeResume(resume, r.found.map((k) => k.label));
    setResult(r);
    setFinalText(re.text);
    setStructured(re.structured);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function loadExample() {
    setJob(EXAMPLE_JOB);
    setResume(EXAMPLE_RESUME);
    setType("tecnologia");
    setIsExample(true);
    setErrors([]);
    setResult(null);
    setFinalText("");
  }

  function clear() {
    const has = job || resume || result;
    if (has && !window.confirm("Limpar a vaga, o currículo e o resultado desta sessão?")) return;
    setJob(""); setResume(""); setResult(null); setFinalText(""); setErrors([]); setIsExample(false); setType("geral");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient text-primary-foreground"><Radar className="h-5 w-5" aria-hidden /></span>
            <span className="text-lg font-bold tracking-tight">CVRadar <span className="text-primary">ATS</span></span>
          </div>
          <Badge variant="secondary" className="text-xs">Gratuito · Sem cadastro</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:py-12">
        <section className="max-w-3xl space-y-3">
          <p className="text-sm font-medium text-primary">Seu currículo com mais clareza para cada oportunidade.</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Descubra como seu currículo conversa com a vaga</h1>
          <p className="text-muted-foreground">
            Estimamos a compatibilidade comparando competências e termos da vaga com o que está escrito no seu currículo. Tudo é processado no seu navegador; nada é salvo ou enviado.
          </p>
          <p className="flex items-center gap-2 text-sm font-medium text-success-strong">
            <ShieldCheck className="h-4 w-4" aria-hidden /> Otimizamos a apresentação das suas experiências. Não inventamos qualificações.
          </p>
        </section>

        <Card className="shadow-soft">
          <CardContent className="space-y-5 pt-6">
            {isExample && <Badge className="bg-warning-soft text-warning-strong hover:bg-warning-soft">Exemplo fictício</Badge>}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="job">Descrição da vaga</Label>
                <Textarea id="job" value={job} onChange={(e) => { setJob(e.target.value); setIsExample(false); }}
                  placeholder="Cole aqui a descrição completa: cargo, responsabilidades, requisitos e diferenciais."
                  className="min-h-[300px] text-sm" aria-describedby="job-count" />
                <p id="job-count" className="text-right text-xs text-muted-foreground">{job.length} caracteres</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">Seu currículo</Label>
                <Textarea id="resume" value={resume} onChange={(e) => { setResume(e.target.value); setIsExample(false); }}
                  placeholder="Cole aqui o texto do seu currículo, com títulos como Resumo, Experiência, Formação…"
                  className="min-h-[300px] text-sm" aria-describedby="resume-count" />
                <p id="resume-count" className="text-right text-xs text-muted-foreground">{resume.length} caracteres</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <Label id="type-label">Tipo de vaga</Label>
                <Tabs value={type} onValueChange={(v) => setType(v as JobType)} aria-labelledby="type-label">
                  <TabsList>
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="tecnologia">Tecnologia</TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-xs text-muted-foreground">Ajusta apenas o vocabulário usado na extração.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={clear}><Trash2 /> Limpar dados</Button>
                <Button variant="outline" onClick={loadExample}><FlaskConical /> Testar com exemplo</Button>
                <Button size="lg" onClick={run}><ScanSearch /> Analisar currículo</Button>
              </div>
            </div>
            <div aria-live="assertive">
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription><ul className="list-disc pl-4">{errors.map((e) => <li key={e}>{e}</li>)}</ul></AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <div ref={resultRef} aria-live="polite" className="scroll-mt-6 space-y-8">
          {result && <AnalysisResult result={result} />}
          {result && finalText !== "" && <ResumeEditor value={finalText} onChange={setFinalText} structured={structured} />}
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        CVRadar ATS · Projeto educacional · As análises são estimativas, não garantias de aprovação.
      </footer>
      <PrintableResume text={finalText} />
    </div>
  );
}
