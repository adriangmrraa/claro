// lib/links.ts — payment link persistence + reference generation.
import "server-only";
import crypto from "node:crypto";
import { generateKeyPair, getAddressFromPublicKey } from "@solana/kit";
import { db, type PaymentLinkRow } from "./db";

export async function createLink(params: {
  ownerPubkey: string;
  amountMicro: bigint | null;
  memo: string | null;
}): Promise<PaymentLinkRow> {
  // Solana Pay reference: a fresh address included as a readonly account in
  // the transfer — makes the payment uniquely identifiable on-chain.
  const refKeypair = await generateKeyPair();
  const reference = await getAddressFromPublicKey(refKeypair.publicKey);
  const row: PaymentLinkRow = {
    id: crypto.randomUUID(),
    slug: crypto.randomBytes(8).toString("base64url"),
    owner_pubkey: params.ownerPubkey,
    reference: reference.toString(),
    amount: params.amountMicro?.toString() ?? null,
    memo: params.memo,
    created_at: Date.now(),
  };
  db.prepare(
    `INSERT INTO payment_links (id, slug, owner_pubkey, reference, amount, memo, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(row.id, row.slug, row.owner_pubkey, row.reference, row.amount, row.memo, row.created_at);
  return row;
}

export function getLinkBySlug(slug: string): PaymentLinkRow | null {
  const row = db
    .prepare("SELECT * FROM payment_links WHERE slug = ?")
    .get(slug) as PaymentLinkRow | undefined;
  return row ?? null;
}

export function listLinksByOwner(ownerPubkey: string): PaymentLinkRow[] {
  return db
    .prepare("SELECT * FROM payment_links WHERE owner_pubkey = ? ORDER BY created_at DESC")
    .all(ownerPubkey) as PaymentLinkRow[];
}
