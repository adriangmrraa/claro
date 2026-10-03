"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { anchorReportOnChain } from "@/lib/anchor";

type Phase = "scope" | "anchoring" | "done";

export function InformeForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("scope");
  const [months, setMonths] = useState(3);
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [ttl, setTtl] = useState(30);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [anchored, setAnchored] = useState(false);
  const [copied, setCopied] = useState(false);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPhase("anchoring");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodMonths: months, includeEvidence, ttlDays: ttl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "error");
      const slug: string = data.report.slug;
      const hash: string = data.report.hash;

      // Worker-signed on-chain anchor — proves the holder consented.
      try {
        const sig = await anchorReportOnChain(`CLARO-RPT:v1:${hash}`);
        const reg = await fetch(`/api/reports/${slug}/anchor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signature: sig }),
        });
        setAnchored(reg.ok);
      } catch {
        setAnchored(false); // report still valid; anchor can be retried
      }
      setUrl(`${window.location.origin}/verificar/${slug}`);
      setPhase("done");
    } catch {
      setError("No se pudo generar el informe. Probá de nuevo.");
      setPhase("scope");
    }
  }

  if (phase === "done") {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-center font-medium">Tu informe está listo</p>
          {anchored ? (
            <p className="rounded-lg bg-green-50 p-3 text-center text-xs text-green-800">
              Anclado en blockchain — sellado contra modificaciones.
            </p>
          ) : (
            <p className="rounded-lg bg-amber-50 p-3 text-center text-xs text-amber-800">
              Sin anclaje onchain — el informe funciona igual, pero quien lo verifique
              verá que no tiene sello de tiempo.
            </p>
          )}
          <div className="rounded-lg bg-muted p-3">
            <p className="break-all font-mono text-xs">{url}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copiado" : "Copiar link"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/app/informes")}>
              Mis informes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onGenerate} className="space-y-5">
          <div className="space-y-2">
            <Label>Período a mostrar</Label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 6, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    months === m ? "border-primary bg-primary/5 font-medium" : "border-border"
                  }`}
                >
                  {m} meses
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Vigencia del link</Label>
            <div className="grid grid-cols-3 gap-2">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setTtl(d)}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    ttl === d ? "border-primary bg-primary/5 font-medium" : "border-border"
                  }`}
                >
                  {d} días
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeEvidence}
              onChange={(e) => setIncludeEvidence(e.target.checked)}
              className="mt-1"
            />
            <span>
              Incluir el detalle de cobros
              <span className="block text-xs text-muted-foreground">
                Sin esto, el informe solo muestra totales — más privado.
              </span>
            </span>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={phase === "anchoring"}>
            {phase === "anchoring" ? "Generando y anclando…" : "Generar informe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
