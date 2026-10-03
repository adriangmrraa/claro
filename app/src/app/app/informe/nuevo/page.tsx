import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { InformeForm } from "./informe-form";
import { Wordmark } from "@/components/brand";

export default async function NuevoInformePage() {
  const user = await getSessionUser();
  if (!user) redirect("/registro");

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mx-auto w-full max-w-md space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <Wordmark size="sm" href="/app" />
          <Link href="/app" className="text-sm text-muted-foreground hover:underline">
            Volver
          </Link>
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Generar informe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Un resumen de hechos verificables que podés compartir. El link vence
            y lo podés revocar cuando quieras.
          </p>
        </div>
        <InformeForm />
      </div>
    </main>
  );
}
