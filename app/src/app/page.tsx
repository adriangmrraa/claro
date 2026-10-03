import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">CLARO</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            De cobrar en negro a cobrar en CLARO.
          </p>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Cobrás por un link. Cada cobro queda registrado y es verificable.
          Cuando lo necesites — para alquilar, un crédito, un trabajo — generás
          un informe que cualquiera puede comprobar.{" "}
          <span className="font-medium text-foreground">
            Tus cobros son tu prueba de ingresos.
          </span>
        </p>

        <div className="space-y-3">
          <Link href="/registro" className={buttonVariants({ size: "lg", className: "w-full" })}>
            Crear mi cuenta
          </Link>
          <p className="text-xs text-muted-foreground">
            ¿Te llegó un link de cobro? Abrilo directamente — no necesitás cuenta.
          </p>
        </div>
      </div>
    </main>
  );
}
