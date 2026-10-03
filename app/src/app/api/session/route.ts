import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { cookies } from "next/headers";

const bodySchema = z.object({
  email: z.string().trim().email().max(254),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  const user = await createSession(parsed.data.email);
  return NextResponse.json({ user: { id: user.id, email: user.email, wallet: user.wallet_pubkey } });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete("claro_session");
  return NextResponse.json({ ok: true });
}
