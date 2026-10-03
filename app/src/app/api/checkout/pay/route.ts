import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { address } from "@solana/kit";
import { db } from "@/lib/db";
import { getLinkBySlug } from "@/lib/links";
import { loadPayerSigners, sendUsdcPayment, usdcBalanceMicro } from "@/lib/solana";
import { env } from "@/lib/env";

const bodySchema = z.object({
  slug: z.string().trim().min(4).max(32),
  amountMicro: z.string().regex(/^\d+$/).optional(),
});

// Simulated fiat checkout: the payer "pays with Mercado Pago" and a pool
// wallet releases real USDC on devnet to the worker — the ramp is simulated,
// the payment is real (design: payer pool x5, docs/07).
export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const link = getLinkBySlug(parsed.data.slug);
  if (!link) return NextResponse.json({ error: "Link no encontrado" }, { status: 404 });

  const amountMicro = link.amount ? BigInt(link.amount) : parsed.data.amountMicro ? BigInt(parsed.data.amountMicro) : null;
  if (!amountMicro || amountMicro <= 0n) {
    return NextResponse.json({ error: "Monto requerido" }, { status: 400 });
  }

  let payer;
  try {
    const pool = await loadPayerSigners();
    payer = pool[Math.floor(Math.random() * pool.length)];
  } catch {
    return NextResponse.json(
      { error: "Servicio de pago no configurado", code: "pool-missing" },
      { status: 503 }
    );
  }

  try {
    const balance = await usdcBalanceMicro(payer.address);
    if (balance < amountMicro) {
      return NextResponse.json(
        { error: "El pago no pudo procesarse, intentá de nuevo", code: "pool-insufficient" },
        { status: 503 }
      );
    }

    const signature = await sendUsdcPayment({
      from: payer,
      to: address(link.owner_pubkey),
      amountMicro,
      reference: address(link.reference),
      memo: `CLARO:PAY:${link.slug}`,
    });

    // Classified on write as T1 — the reference match is guaranteed because
    // this server built the transaction. S5 sync re-verifies from chain.
    db.prepare(
      `INSERT OR IGNORE INTO tx_cache (sig, owner_pubkey, payer, amount, ts, tier, link_slug)
       VALUES (?, ?, ?, ?, ?, 'T1', ?)`
    ).run(signature, link.owner_pubkey, payer.address, amountMicro.toString(), Date.now(), link.slug);

    return NextResponse.json({
      signature,
      explorer: `https://explorer.solana.com/tx/${signature}?cluster=${env.cluster}`,
    });
  } catch (e) {
    console.error("checkout pay failed", e);
    return NextResponse.json(
      { error: "El pago no pudo confirmarse. Nada se cobró.", code: "tx-failed" },
      { status: 502 }
    );
  }
}
