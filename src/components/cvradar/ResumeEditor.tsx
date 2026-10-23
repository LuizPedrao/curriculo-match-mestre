import { useState } from "react";
import { Copy, Download, FileText, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  value: string;
  onChange: (v: string) => void;
  structured: boolean;
}

export function ResumeEditor({ value, onChange, structured }: Props) {
  const [status, setStatus] = useState("");
  const disabled = !value.trim();

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Currículo copiado para a área de transferência.");
    } catch {
      setStatus("Não foi possível copiar. Selecione o texto e use Ctrl+C.");
    }
  }

  function download() {
    const blob = new Blob(["\ufeff" + value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculo-cvradar-ats.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus("Arquivo curriculo-cvradar-ats.txt baixado.");
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl">Currículo ATS-friendly</CardTitle>
        <CardDescription>
          {structured
            ? "Seções reorganizadas em uma coluna, com títulos padronizados. O conteúdo original foi preservado."
            : "Não reconhecemos os títulos das seções com segurança, então mantivemos o texto original na mesma ordem, com formatação mínima."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="final-resume">Versão final (editável)</Label>
          <Textarea
            id="final-resume"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[420px] font-mono text-sm leading-relaxed"
          />
          <p className="text-xs text-muted-foreground">
            A seção "Competências identificadas no currículo" reúne apenas termos da vaga que já estavam no seu texto.
          </p>
        </div>
        <p className="flex items-center gap-2 rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning-strong">
          <Info className="h-4 w-4 shrink-0" aria-hidden /> Revise todas as informações antes de enviar.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={copy} disabled={disabled} variant="outline"><Copy /> Copiar currículo</Button>
          <Button onClick={download} disabled={disabled} variant="outline"><Download /> Baixar .txt</Button>
          <Button onClick={() => window.print()} disabled={disabled}><FileText /> Exportar PDF</Button>
        </div>
        <p className="text-xs text-muted-foreground">Na janela de impressão, selecione Salvar como PDF.</p>
        <p role="status" aria-live="polite" className="min-h-5 text-sm font-medium text-success-strong">{status}</p>
      </CardContent>
    </Card>
  );
}
