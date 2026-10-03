import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { revokeReport } from "@/lib/reports";

export async function POST(_request: Request, ctx: RouteContext<"/api/reports/[slug]/revoke">) {
  const user = await getSessionUser();
  if (!user?.wallet_pubkey) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const ok = revokeReport(slug, user.wallet_pubkey);
  if (!ok) return NextResponse.json({ error: "Informe no encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
