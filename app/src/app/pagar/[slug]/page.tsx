import { notFound } from "next/navigation";
import { getLinkBySlug } from "@/lib/links";
import { CheckoutForm } from "./checkout-form";
import { formatUsdc } from "@/lib/money";

export default async function PagarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const link = getLinkBySlug(slug);
  if (!link) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Solicitud de pago</p>
          {link.amount ? (
            <p className="mt-1 text-4xl font-bold tracking-tight">
              ${formatUsdc(BigInt(link.amount))}
            </p>
          ) : (
            <p className="mt-1 text-2xl font-bold tracking-tight">Monto libre</p>
          )}
          {link.memo && <p className="mt-2 text-sm text-muted-foreground">{link.memo}</p>}
        </div>
        <CheckoutForm slug={link.slug} fixedAmountMicro={link.amount} />
        <p className="text-center text-xs text-muted-foreground">
          El cobro queda registrado de forma verificable. Demo — pagos simulados,
          sin dinero real.
        </p>
      </div>
    </main>
  );
}
