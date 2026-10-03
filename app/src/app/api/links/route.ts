import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { createLink, listLinksByOwner } from "@/lib/links";

const bodySchema = z.object({
  amountMicro: z.string().regex(/^\d+$/).optional(),
  memo: z.string().trim().max(120).optional(),
});

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!user.wallet_pubkey) {
    return NextResponse.json({ error: "Tu cuenta no tiene dirección registrada" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const link = await createLink({
    ownerPubkey: user.wallet_pubkey,
    amountMicro: parsed.data.amountMicro ? BigInt(parsed.data.amountMicro) : null,
    memo: parsed.data.memo ?? null,
  });
  return NextResponse.json({
    link: {
      slug: link.slug,
      reference: link.reference,
      amountMicro: link.amount,
      memo: link.memo,
    },
  });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user?.wallet_pubkey) {
    return NextResponse.json({ links: [] });
  }
  return NextResponse.json({ links: listLinksByOwner(user.wallet_pubkey) });
}
