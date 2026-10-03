import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { createReport, listReportsByOwner } from "@/lib/reports";

const bodySchema = z.object({
  periodMonths: z.number().int().min(1).max(12),
  includeEvidence: z.boolean().default(true),
  ttlDays: z.number().int().min(1).max(90).default(30),
});

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!user.wallet_pubkey) {
    return NextResponse.json({ error: "Sin dirección registrada" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const { row } = createReport({
    ownerPubkey: user.wallet_pubkey,
    ...parsed.data,
  });
  return NextResponse.json({
    report: { slug: row.slug, hash: row.hash, expiresAt: row.expires_at },
  });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user?.wallet_pubkey) return NextResponse.json({ reports: [] });
  return NextResponse.json({ reports: listReportsByOwner(user.wallet_pubkey) });
}
