import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CobrarForm } from "./cobrar-form";

export default async function CobrarPage() {
  const user = await getSessionUser();
  if (!user) redirect("/registro");

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mx-auto w-full max-w-md space-y-6 pt-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crear link de cobro</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Compartí el link y te pagan — el cobro queda registrado y verificable.
          </p>
        </div>
        <CobrarForm />
      </div>
    </main>
  );
}
