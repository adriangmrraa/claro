import { NextResponse } from "next/server";
import { getLinkBySlug } from "@/lib/links";

// Public checkout info — the payer needs no account (INV-1).
export async function GET(_request: Request, ctx: RouteContext<"/api/links/[slug]">) {
  const { slug } = await ctx.params;
  const link = getLinkBySlug(slug);
  if (!link) return NextResponse.json({ error: "Link no encontrado" }, { status: 404 });
  return NextResponse.json({
    link: {
      slug: link.slug,
      amountMicro: link.amount,
      memo: link.memo,
      createdAt: link.created_at,
    },
  });
}
