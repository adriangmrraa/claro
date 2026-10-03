import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { listLinksByOwner } from "@/lib/links";
import { db, type TxCacheRow } from "@/lib/db";
import { formatUsdc } from "@/lib/money";
import { txUrl } from "@/lib/explorer";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "./logout-button";
import { SyncButton } from "./sync-button";

const TIER_LABEL: Record<string, { text: string; className: string }> = {
  T1: { text: "Ingreso verificado", className: "bg-green-100 text-green-800" },
  T2: { text: "Ingreso declarado", className: "bg-amber-100 text-amber-800" },
  T3: { text: "Ahorro — no es ingreso", className: "bg-slate-100 text-slate-700" },
  excluded: { text: "No cuenta", className: "bg-muted text-muted-foreground" },
};

export default async function AppPage() {
  const user = await getSessionUser();
  if (!user) redirect("/registro");

  const shortWallet = user.wallet_pubkey
    ? `${user.wallet_pubkey.slice(0, 6)}…${user.wallet_pubkey.slice(-4)}`
    : null;
  const links = user.wallet_pubkey ? listLinksByOwner(user.wallet_pubkey) : [];

  const txs = user.wallet_pubkey
    ? (db
        .prepare("SELECT * FROM tx_cache WHERE owner_pubkey = ? ORDER BY ts DESC LIMIT 50")
        .all(user.wallet_pubkey) as TxCacheRow[])
    : [];
  const incomeTotal = txs
    .filter((t) => t.tier === "T1" || t.tier === "T2")
    .reduce((a, t) => a + BigInt(t.amount ?? "0"), 0n);
  const savingsTotal = txs
    .filter((t) => t.tier === "T3")
    .reduce((a, t) => a + BigInt(t.amount ?? "0"), 0n);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mx-auto w-full max-w-md space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">CLARO</h1>
          <LogoutButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{user.email}</CardTitle>
            <CardDescription>
              {shortWallet ? `Cuenta ${shortWallet}` : "Cuenta sin dirección registrada"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Link href="/app/cobrar" className={buttonVariants()}>
              Crear link de cobro
            </Link>
            <Link href="/app/informe/nuevo" className={buttonVariants({ variant: "outline" })}>
              Generar informe
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Tu historial</CardTitle>
              <SyncButton />
            </div>
            <CardDescription>
              Ingresos verificados y ahorros — todo comprobable onchain.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {txs.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-green-50 p-3 text-center">
                  <p className="text-xs text-green-800">Ingresos verificados</p>
                  <p className="text-lg font-bold text-green-900">
                    ${formatUsdc(incomeTotal)}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-600">Ahorros (no es ingreso)</p>
                  <p className="text-lg font-bold text-slate-800">
                    ${formatUsdc(savingsTotal)}
                  </p>
                </div>
              </div>
            )}
            {txs.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">Sin movimientos todavía.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cuando te paguen por un link, aparece acá.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {txs.map((t) => {
                  const tier = TIER_LABEL[t.tier] ?? TIER_LABEL.excluded;
                  return (
                    <li key={t.sig} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">${formatUsdc(BigInt(t.amount ?? "0"))}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.ts ? new Date(t.ts).toLocaleDateString("es-AR") : "—"}
                          {t.payer ? ` · de ${t.payer.slice(0, 4)}…${t.payer.slice(-4)}` : ""}
                        </p>
                        <a
                          href={txUrl(t.sig)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary underline-offset-4 hover:underline"
                        >
                          ver en explorer →
                        </a>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tier.className}`}
                      >
                        {tier.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tus links de cobro</CardTitle>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Todavía no creaste ningún link.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cada cobro por link suma a tu historial verificable.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {links.map((l) => (
                  <li key={l.slug} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">
                        {l.amount ? `$${formatUsdc(BigInt(l.amount))}` : "Monto libre"}
                      </p>
                      {l.memo && (
                        <p className="text-xs text-muted-foreground">{l.memo}</p>
                      )}
                    </div>
                    <Link
                      href={`/pagar/${l.slug}`}
                      className="text-xs text-primary underline-offset-4 hover:underline"
                    >
                      Abrir
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
