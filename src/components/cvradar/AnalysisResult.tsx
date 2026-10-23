import { AlertTriangle, CheckCircle2, CircleDashed, Lightbulb } from "lucide-react";
import type { AnalysisResult as Result } from "@/lib/ats/analyze";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

function Chip({ label, tone, optional }: { label: string; tone: "ok" | "miss"; optional?: boolean }) {
  return (
    <li
      className={
        tone === "ok"
          ? "inline-flex items-center gap-1 rounded-full border border-success/40 bg-success-soft px-3 py-1 text-sm font-medium text-success-strong"
          : "inline-flex items-center gap-1 rounded-full border border-warning/50 bg-warning-soft px-3 py-1 text-sm font-medium text-warning-strong"
      }
    >
      {tone === "ok" ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <CircleDashed className="h-3.5 w-3.5" aria-hidden />}
      {label}
      {optional && <span className="text-xs opacity-75">(diferencial)</span>}
    </li>
  );
}

export function AnalysisResult({ result }: { result: Result }) {
  if (result.inconclusive) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Análise inconclusiva: descrição insuficiente</AlertTitle>
        <AlertDescription>
          Não identificamos competências ou termos profissionais confiáveis na descrição da vaga. Cole a descrição completa,
          com requisitos e responsabilidades, e tente novamente.
        </AlertDescription>
      </Alert>
    );
  }
  const score = result.score ?? 0;
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl">Resultado da análise</CardTitle>
        <CardDescription>Estimativa baseada em palavras-chave. Não é uma garantia de aprovação.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
          <div className="rounded-xl border bg-secondary p-5 text-center">
            <p className="text-sm font-medium text-muted-foreground">Compatibilidade estimada</p>
            <p className="mt-1 text-5xl font-bold tracking-tight text-foreground">
              {score}
              <span className="text-xl text-muted-foreground">/100</span>
            </p>
            <Progress value={score} className="mt-3" aria-label={`Compatibilidade estimada ${score} de 100`} />
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Métrica interna baseada em termos identificados; não é pontuação oficial de um ATS.
            </p>
            <p className="font-medium">
              {result.found.length} de {result.keywords.length} competências/termos identificados
            </p>
            <dl className="grid grid-cols-3 gap-3 text-center">
              {[
                ["Na vaga", result.keywords.length, "text-foreground"],
                ["Encontrados", result.found.length, "text-success-strong"],
                ["Ausentes", result.missing.length, "text-warning-strong"],
              ].map(([l, v, c]) => (
                <div key={l as string} className="rounded-lg border bg-card p-3">
                  <dt className="text-xs text-muted-foreground">{l}</dt>
                  <dd className={`text-2xl font-semibold ${c}`}>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-muted-foreground">
              Requisitos técnicos têm peso maior; diferenciais contam metade.
            </p>
          </div>
        </div>
        <Separator />
        <div className="grid gap-6 md:grid-cols-2">
          <section aria-labelledby="found-h">
            <h3 id="found-h" className="mb-3 font-semibold text-success-strong">Palavras-chave encontradas</h3>
            {result.found.length ? (
              <ul className="flex flex-wrap gap-2">{result.found.map((k) => <Chip key={k.label} label={k.label} tone="ok" optional={k.optional} />)}</ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum termo da vaga foi encontrado no currículo.</p>
            )}
          </section>
          <section aria-labelledby="miss-h">
            <h3 id="miss-h" className="mb-1 font-semibold text-warning-strong">Palavras-chave ausentes</h3>
            <p className="mb-3 text-xs text-muted-foreground">Oportunidades de revisão. Adicione manualmente apenas se forem verdadeiras.</p>
            {result.missing.length ? (
              <ul className="flex flex-wrap gap-2">{result.missing.map((k) => <Chip key={k.label} label={k.label} tone="miss" optional={k.optional} />)}</ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum termo ausente.</p>
            )}
          </section>
        </div>
        <Separator />
        <section aria-labelledby="rec-h">
          <h3 id="rec-h" className="mb-3 flex items-center gap-2 font-semibold"><Lightbulb className="h-4 w-4 text-primary" aria-hidden /> Recomendações</h3>
          <ul className="space-y-2">
            {result.recommendations.map((r) => (
              <li key={r} className="rounded-lg border-l-4 border-primary bg-secondary px-4 py-2 text-sm">{r}</li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
