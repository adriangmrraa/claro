import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, setUserWallet } from "@/lib/auth";
import { address } from "@solana/kit";

const bodySchema = z.object({
  wallet: z.string().trim().min(32).max(64),
});

// Registers the worker's PUBLIC address. The private key is generated and kept
// client-side — it never reaches this endpoint (CA-1).
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dirección inválida" }, { status: 400 });
  }
  try {
    address(parsed.data.wallet); // validates base58 address format
  } catch {
    return NextResponse.json({ error: "Dirección inválida" }, { status: 400 });
  }
  setUserWallet(user.id, parsed.data.wallet);
  return NextResponse.json({ ok: true });
}
