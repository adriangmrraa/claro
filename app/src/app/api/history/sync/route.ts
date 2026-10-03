import { NextResponse } from "next/server";
import { address, type Signature } from "@solana/kit";
import { getSessionUser } from "@/lib/auth";
import { db, type TxCacheRow } from "@/lib/db";
import { inspectPayment, rpc, usdcAta } from "@/lib/solana";
import { classifyPayment } from "@/lib/classify";
import { listLinksByOwner } from "@/lib/links";

// Incremental on-chain history sync: scans the worker's USDC ATA, parses each
// tx once, classifies (T1/T3/excluded) and upserts into tx_cache. Everything
// shown comes from chain, never fabricated (INV-2). Timestamps use the tx
// blockTime when the RPC returns it.
export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!user.wallet_pubkey) {
    return NextResponse.json({ synced: 0, total: 0 });
  }

  const worker = address(user.wallet_pubkey);
  const ata = await usdcAta(worker);
  const links = listLinksByOwner(user.wallet_pubkey);
  const referenceToSlug = new Map(links.map((l) => [l.reference, l.slug]));
  const references = links.map((l) => l.reference);

  // Signatures touching the worker ATA — payments land here.
  let signatures: Signature[] = [];
  try {
    const res = await rpc.getSignaturesForAddress(ata, { limit: 100 }).send();
    signatures = res.map((s) => s.signature);
  } catch {
    // ATA may not exist yet (no payments ever) — empty history is honest.
  }

  const known = new Set(
    (db.prepare("SELECT sig FROM tx_cache WHERE owner_pubkey = ?").all(user.wallet_pubkey) as {
      sig: string;
    }[]).map((r) => r.sig)
  );

  const insert = db.prepare(
    `INSERT OR REPLACE INTO tx_cache (sig, owner_pubkey, payer, amount, ts, tier, link_slug, raw_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  let synced = 0;
  for (const sig of signatures) {
    if (known.has(sig)) continue;
    const parsed = await inspectPayment({
      signature: sig,
      expectedReferences: references,
      workerAddress: user.wallet_pubkey,
    });
    if (!parsed.confirmed) continue;
    const matchedSlug = parsed.matchedReference
      ? referenceToSlug.get(parsed.matchedReference) ?? null
      : null;
    const classified = classifyPayment({
      signature: sig,
      payer: parsed.payerAddress,
      worker: user.wallet_pubkey,
      amountMicro: parsed.tokenDeltaToWorker,
      referenceOk: parsed.matchedReference !== null,
      linkSlug: matchedSlug,
    });
    insert.run(
      sig,
      user.wallet_pubkey,
      parsed.payerAddress,
      classified.amountMicro.toString(),
      parsed.blockTime ? parsed.blockTime * 1000 : Date.now(),
      classified.tier,
      classified.linkSlug,
      JSON.stringify({ memoText: parsed.memoText, reason: classified.reason })
    );
    synced++;
  }

  const rows = db
    .prepare("SELECT * FROM tx_cache WHERE owner_pubkey = ? ORDER BY ts DESC")
    .all(user.wallet_pubkey) as TxCacheRow[];

  return NextResponse.json({ synced, total: rows.length });
}
