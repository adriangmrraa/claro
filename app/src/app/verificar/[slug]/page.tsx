import { notFound } from "next/navigation";
import { getReportBySlug, verifyReport } from "@/lib/reports";
import { formatUsdc } from "@/lib/money";
import { txUrl } from "@/lib/explorer";
import type { ReportFacts } from "@/lib/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_UI: Record<string, { title: string; sub: string; cls: string }> = {
  valid: {
    title: "Informe verificado",
    sub: "Los datos coinciden con lo registrado en blockchain y no fueron alterados.",
    cls: "border-green-300 bg-green-50 text-green-900",
  },
  tampered: {
    title: "Verificación fallida",
    sub: "Los datos no coinciden con el registro en blockchain. No confíes en este informe.",
    cls: "border-red-300 bg-red-50 text-red-900",
  },
  expired: {
    title: "Informe vencido",
    sub: "El link expiró. Pedile a la persona que genere uno nuevo.",
    cls: "border-slate-300 bg-slate-50 text-slate-700",
  },
  revoked: {
    title: "Informe revocado",
    sub: "El titular revocó el acceso a este informe.",
    cls: "border-slate-300 bg-slate-50 text-slate-700",
  },
  unanchored: {
    title: "Informe sin anclaje onchain",
    sub: "Los datos son consistentes pero no tienen sello de tiempo en blockchain.",
    cls: "border-amber-300 bg-amber-50 text-amber-900",
  },
};

// Public verification — no account needed (INV-1). Every render re-runs the
// on-chain checks live; the evaluator never trusts our database.
export default async function VerificarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = getReportBySlug(slug);
  if (!report) notFound();

  const verification = await verifyReport(report);
  const ui = STATUS_UI[verification.status];
  const facts = JSON.parse(report.facts_json) as ReportFacts;

  const showFacts = verification.status === "valid" || verification.status === "unanchored";

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-lg space-y-6 pt-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            CLARO · verificación de informe
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Prueba de ingresos</h1>
        </div>

        <div className={`rounded-xl border p-4 text-center ${ui.cls}`}>
          <p className="font-semibold">{ui.title}</p>
          <p className="mt-1 text-sm opacity-90">{ui.sub}</p>
        </div>

        {showFacts && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hechos declarados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground">Recibió en {facts.periodMonths} meses</p>
                  <p className="text-xl font-bold">${formatUsdc(BigInt(facts.income.totalMicro))}</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground">Promedio mensual</p>
                  <p className="text-xl font-bold">${formatUsdc(BigInt(facts.income.monthlyAvgMicro))}</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground">Pagadores distintos</p>
                  <p className="text-xl font-bold">{facts.income.payerCount}</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground">Cobros verificados</p>
                  <p className="text-xl font-bold">{facts.income.paymentCount}</p>
                </div>
              </div>
              {facts.savings.depositCount > 0 && (
                <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                  Además registra ${formatUsdc(BigInt(facts.savings.totalMicro))} en ahorros
                  propios ({facts.savings.depositCount} depósitos) —{" "}
                  <strong>no se cuentan como ingresos.</strong>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Generado el {new Date(facts.generatedAt).toLocaleDateString("es-AR")} ·
                montos en USD (stablecoin). CLARO presenta hechos verificables;
                la decisión es del evaluador.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Verificación onchain</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {verification.checks.map((c) => (
                <li key={c.id} className="flex items-start gap-2 text-sm">
                  <span
                    className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      c.ok === true
                        ? "bg-green-100 text-green-700"
                        : c.ok === false
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {c.ok === true ? "✓" : c.ok === false ? "✗" : "!"}
                  </span>
                  <div>
                    <p>{c.label}</p>
                    {c.detail && <p className="text-xs text-muted-foreground">{c.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
            {report.anchor_sig && (
              <a
                href={txUrl(report.anchor_sig)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center text-xs text-primary underline-offset-4 hover:underline"
              >
                Ver el anclaje en el explorador de blockchain →
              </a>
            )}
          </CardContent>
        </Card>

        {showFacts && facts.evidence.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Cobros ({facts.evidence.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {facts.evidence.map((e) => (
                  <li key={e.signature} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <p className="font-medium">${formatUsdc(BigInt(e.amountMicro))}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(e.ts).toLocaleDateString("es-AR")} ·{" "}
                        {e.tier === "T1" ? "ingreso verificado" : "ahorro"}
                      </p>
                    </div>
                    <a
                      href={txUrl(e.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline-offset-4 hover:underline"
                    >
                      verificar →
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <p className="pb-8 text-center text-xs text-muted-foreground">
          Esta página verifica datos directamente contra la blockchain pública.
          Nadie — ni CLARO — puede alterar el historial.
        </p>
      </div>
    </main>
  );
}
