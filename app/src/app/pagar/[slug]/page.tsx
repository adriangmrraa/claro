import { notFound } from "next/navigation";
import { getLinkBySlug } from "@/lib/links";
import { CheckoutForm } from "./checkout-form";
import { formatUsdc } from "@/lib/money";
import { Wordmark } from "@/components/brand";

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
        <div className="flex justify-center">
          <Wordmark size="sm" href="/" />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Solicitud de pago</p>
          {link.amount ? (
            <p className="mt-1 font-heading text-4xl font-bold tracking-tight">
              ${formatUsdc(BigInt(link.amount))}
            </p>
          ) : (
            <p className="mt-1 font-heading text-2xl font-bold tracking-tight">Monto libre</p>
          )}
          {link.memo && <p className="mt-2 text-sm text-muted-foreground">{link.memo}</p>}
        </div>
        <CheckoutForm slug={link.slug} fixedAmountMicro={link.amount} />
        <p className="text-center text-xs text-muted-foreground">
          El pago es simulado — el registro onchain es real y verificable
          (Solana devnet).
        </p>
      </div>
    </main>
  );
}
