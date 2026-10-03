import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "./logout-button";

export default async function AppPage() {
  const user = await getSessionUser();
  if (!user) redirect("/registro");

  const shortWallet = user.wallet_pubkey
    ? `${user.wallet_pubkey.slice(0, 6)}…${user.wallet_pubkey.slice(-4)}`
    : null;

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
          <CardContent>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Todavía no tenés cobros registrados.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Creá tu primer link de cobro para empezar a construir tu historial.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
