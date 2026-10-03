import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { isExpired, listReportsByOwner } from "@/lib/reports";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportActions } from "./report-actions";

export default async function InformesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/registro");
  const reports = user.wallet_pubkey ? listReportsByOwner(user.wallet_pubkey) : [];

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mx-auto w-full max-w-md space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Mis informes</h1>
          <Link href="/app" className="text-sm text-muted-foreground hover:underline">
            Volver
          </Link>
        </div>

        <Link href="/app/informe/nuevo" className={buttonVariants({ className: "w-full" })}>
          Generar nuevo informe
        </Link>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">Sin informes todavía.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {reports.map((r) => {
                  const expired = isExpired(r);
                  const status = r.revoked_at
                    ? { text: "Revocado", cls: "bg-red-100 text-red-800" }
                    : expired
                      ? { text: "Vencido", cls: "bg-slate-100 text-slate-600" }
                      : r.anchor_sig
                        ? { text: "Anclado", cls: "bg-green-100 text-green-800" }
                        : { text: "Vigente", cls: "bg-blue-100 text-blue-800" };
                  return (
                    <li key={r.slug} className="space-y-2 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(r.created_at).toLocaleDateString("es-AR")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            vence {new Date(r.expires_at).toLocaleDateString("es-AR")}
                          </p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${status.cls}`}>
                          {status.text}
                        </span>
                      </div>
                      <ReportActions
                        slug={r.slug}
                        revoked={!!r.revoked_at || expired}
                      />
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
