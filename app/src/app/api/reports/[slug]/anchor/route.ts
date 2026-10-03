import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { expectedAnchorMemo, getReportBySlug, setAnchorSig } from "@/lib/reports";
import { rpc } from "@/lib/solana";
import { MEMO_PROGRAM_ADDRESS } from "@solana-program/memo";
import type { Signature } from "@solana/kit";

const bodySchema = z.object({ signature: z.string().min(40).max(120) });

// Registers the worker-signed anchor tx. The tx was built+signed+sent by the
// worker client-side; here we verify on-chain that (a) it exists and
// confirmed, (b) the worker signed it, (c) the memo matches the report hash.
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/reports/[slug]/anchor">
) {
  const user = await getSessionUser();
  if (!user?.wallet_pubkey) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const report = getReportBySlug(slug);
  if (!report || report.owner_pubkey !== user.wallet_pubkey) {
    return NextResponse.json({ error: "Informe no encontrado" }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  let tx;
  try {
    tx = await rpc
      .getTransaction(parsed.data.signature as Signature, {
        encoding: "jsonParsed",
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      })
      .send();
  } catch {
    tx = null;
  }
  if (!tx || tx.meta?.err) {
    return NextResponse.json(
      { error: "La transacción no está confirmada todavía — esperá unos segundos" },
      { status: 400 }
    );
  }

  const accountKeys: string[] = tx.transaction.message.accountKeys.map((k) =>
    String(typeof k === "string" ? k : k.pubkey)
  );
  const allIxs = [
    ...(tx.transaction.message.instructions ?? []),
    ...(tx.meta?.innerInstructions ?? []).flatMap((i) => i.instructions),
  ];
  let memoOk = false;
  const signerOk = tx.transaction.message.accountKeys.some(
    (k) => typeof k !== "string" && k.signer && String(k.pubkey) === report.owner_pubkey
  );
  for (const ix of allIxs) {
    const programId =
      "programId" in ix
        ? ix.programId.toString()
        : "programIdIndex" in ix
          ? accountKeys[(ix as { programIdIndex: number }).programIdIndex]
          : null;
    if (
      programId === MEMO_PROGRAM_ADDRESS.toString() &&
      "parsed" in ix &&
      typeof ix.parsed === "string" &&
      ix.parsed === expectedAnchorMemo(report.hash)
    ) {
      memoOk = true;
    }
  }

  if (!memoOk || !signerOk) {
    return NextResponse.json(
      { error: "La transacción no prueba el anclaje de este informe" },
      { status: 400 }
    );
  }

  setAnchorSig(slug, parsed.data.signature);
  return NextResponse.json({ ok: true, signature: parsed.data.signature });
}
