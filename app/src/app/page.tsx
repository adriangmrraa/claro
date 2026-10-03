import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Wordmark } from "@/components/brand";
import { addressUrl } from "@/lib/explorer";

const STEPS = [
  {
    n: "01",
    title: "Cobrás por un link",
    body: "Creás un link de cobro y se lo mandás a quien te debe. La plata entra a tu cuenta — sin vueltas.",
  },
  {
    n: "02",
    title: "Cada cobro deja prueba",
    body: "Cada pago queda registrado en blockchain: real, con fecha, con pagador. Nadie lo puede inventar ni borrar.",
  },
  {
    n: "03",
    title: "Generás tu informe",
    body: "Cuando lo necesitás — alquiler, crédito, trabajo — compartís un link que cualquiera puede verificar onchain.",
  },
];

export default function Home() {
  const mint = process.env.NEXT_PUBLIC_USDC_MINT;
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* soft gradient wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(60rem 32rem at 85% -10%, oklch(0.9 0.07 163 / 0.5), transparent 60%), radial-gradient(50rem 30rem at -10% 110%, oklch(0.93 0.05 200 / 0.35), transparent 55%)",
        }}
      />

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-6">
        <Wordmark size="md" />
        <Link
          href="/registro"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Entrar
        </Link>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Prueba de ingresos verificable · Solana
        </p>
        <h1 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          De cobrar en negro
          <br />
          a cobrar en{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            CLARO
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Trabajás y cobrás de verdad — pero sin recibo de sueldo no podés probarlo.
          CLARO convierte tu historial de cobros en evidencia que cualquiera puede
          verificar. <span className="font-medium text-foreground">Sin mentiras, sin papeles truchos.</span>
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/registro" className={buttonVariants({ size: "lg", className: "px-8" })}>
            Crear mi cuenta
          </Link>
          <p className="text-xs text-muted-foreground">
            ¿Te llegó un link de cobro? Abrilo directo — no necesitás cuenta.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border bg-card p-5 text-left shadow-sm"
            >
              <p className="font-heading text-xs font-bold text-primary">{s.n}</p>
              <p className="mt-2 font-heading font-semibold tracking-tight">{s.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Demo en Solana devnet — cada cobro es una transacción real, visible en el{" "}
          {mint ? (
            <a
              href={addressUrl(mint)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              explorador público
            </a>
          ) : (
            "explorador público"
          )}
          . No es un banco, no es un score: son hechos verificables.
        </p>
      </section>
    </main>
  );
}
