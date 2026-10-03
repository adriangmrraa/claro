// lib/reports.ts — report persistence + on-chain verification.
import "server-only";
import crypto from "node:crypto";
import { type Signature } from "@solana/kit";
import { db, type ReportRow, type TxCacheRow } from "./db";
import { buildFacts, factsHash, type ReportFacts, type ReportScope } from "./report";
import { rpc } from "./solana";
import { MEMO_PROGRAM_ADDRESS } from "@solana-program/memo";

export const MEMO_PREFIX = "CLARO-RPT:v1:";

export interface CreateReportInput {
  ownerPubkey: string;
  periodMonths: number;
  includeEvidence: boolean;
  ttlDays: number;
}

export function createReport(input: CreateReportInput): { row: ReportRow; facts: ReportFacts } {
  const txs = db
    .prepare(
      "SELECT * FROM tx_cache WHERE owner_pubkey = ? AND ts >= ? ORDER BY ts ASC"
    )
    .all(
      input.ownerPubkey,
      Date.now() - input.periodMonths * 30 * 24 * 60 * 60 * 1000
    ) as TxCacheRow[];

  const incomePayments = txs
    .filter((t) => t.tier === "T1" || t.tier === "T2")
    .map((t) => ({
      signature: t.sig,
      ts: t.ts ?? 0,
      amountMicro: BigInt(t.amount ?? "0"),
      payer: t.payer,
    }));
  const savingsDeposits = txs
    .filter((t) => t.tier === "T3")
    .map((t) => ({
      signature: t.sig,
      ts: t.ts ?? 0,
      amountMicro: BigInt(t.amount ?? "0"),
      payer: t.payer,
    }));

  const scope: ReportScope = {
    periodMonths: input.periodMonths,
    includeEvidence: input.includeEvidence,
  };
  const facts = buildFacts({ worker: input.ownerPubkey, scope, incomePayments, savingsDeposits });
  const hash = factsHash(facts);

  const row: ReportRow = {
    id: crypto.randomUUID(),
    slug: crypto.randomBytes(8).toString("base64url"),
    owner_pubkey: input.ownerPubkey,
    scope_json: JSON.stringify(scope),
    facts_json: JSON.stringify(facts),
    hash,
    anchor_sig: null,
    created_at: Date.now(),
    expires_at: Date.now() + input.ttlDays * 24 * 60 * 60 * 1000,
    revoked_at: null,
  };
  db.prepare(
    `INSERT INTO reports (id, slug, owner_pubkey, scope_json, facts_json, hash, anchor_sig, created_at, expires_at, revoked_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    row.id, row.slug, row.owner_pubkey, row.scope_json, row.facts_json,
    row.hash, row.anchor_sig, row.created_at, row.expires_at, row.revoked_at
  );
  return { row, facts };
}

export function getReportBySlug(slug: string): ReportRow | null {
  return (db.prepare("SELECT * FROM reports WHERE slug = ?").get(slug) as ReportRow | undefined) ?? null;
}

export function isExpired(row: ReportRow): boolean {
  return Date.now() > row.expires_at;
}

export function listReportsByOwner(ownerPubkey: string): ReportRow[] {
  return db
    .prepare("SELECT * FROM reports WHERE owner_pubkey = ? ORDER BY created_at DESC")
    .all(ownerPubkey) as ReportRow[];
}

export function revokeReport(slug: string, ownerPubkey: string): boolean {
  const res = db
    .prepare("UPDATE reports SET revoked_at = ? WHERE slug = ? AND owner_pubkey = ? AND revoked_at IS NULL")
    .run(Date.now(), slug, ownerPubkey);
  return res.changes > 0;
}

export function setAnchorSig(slug: string, sig: string): void {
  db.prepare("UPDATE reports SET anchor_sig = ? WHERE slug = ?").run(sig, slug);
}

// --- verification (public page) ---

export interface VerificationCheck {
  id: string;
  label: string;
  ok: boolean | null; // null = not applicable / pending
  detail?: string;
}

export interface ReportVerification {
  status: "valid" | "tampered" | "expired" | "revoked" | "unanchored";
  checks: VerificationCheck[];
  anchorMemo: string | null;
}

// Recomputes the hash from the stored facts and, when anchored, fetches the
// anchor tx on-chain and compares the memo payload. Any tampering with
// facts_json breaks the hash match → "tampered".
export async function verifyReport(row: ReportRow): Promise<ReportVerification> {
  const checks: VerificationCheck[] = [];

  if (row.revoked_at) {
    return {
      status: "revoked",
      anchorMemo: null,
      checks: [{ id: "revoked", label: "El informe no fue revocado", ok: false, detail: "Revocado por el titular" }],
    };
  }
  if (Date.now() > row.expires_at) {
    return {
      status: "expired",
      anchorMemo: null,
      checks: [{ id: "expired", label: "El informe está vigente", ok: false, detail: "Venció" }],
    };
  }

  // 1) facts integrity: recompute hash from stored facts_json
  let facts: ReportFacts | null = null;
  let recomputed: string | null = null;
  try {
    facts = JSON.parse(row.facts_json) as ReportFacts;
    recomputed = factsHash(facts);
  } catch {
    facts = null;
  }
  const hashOk = recomputed !== null && recomputed === row.hash;
  checks.push({
    id: "hash",
    label: "Los datos no fueron alterados",
    ok: hashOk,
    detail: hashOk ? `hash ${row.hash.slice(0, 16)}…` : "el hash no coincide con los datos",
  });

  // 2) on-chain anchor: memo must equal CLARO-RPT:v1:<hash>
  let anchorMemo: string | null = null;
  if (!row.anchor_sig) {
    checks.push({
      id: "anchor",
      label: "Anclado en blockchain",
      ok: null,
      detail: "sin anclaje — los datos no tienen sello de tiempo onchain",
    });
    return { status: "unanchored", checks, anchorMemo: null };
  }

  let anchorOk = false;
  try {
    const tx = await rpc
      .getTransaction(row.anchor_sig as Signature, {
        encoding: "jsonParsed",
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      })
      .send();
    if (tx && !tx.meta?.err) {
      const accountKeys: string[] = tx.transaction.message.accountKeys.map((k) =>
        String(typeof k === "string" ? k : k.pubkey)
      );
      const allIxs = [
        ...(tx.transaction.message.instructions ?? []),
        ...(tx.meta?.innerInstructions ?? []).flatMap((i) => i.instructions),
      ];
      for (const ix of allIxs) {
        const programId =
          "programId" in ix
            ? ix.programId.toString()
            : "programIdIndex" in ix
              ? accountKeys[(ix as { programIdIndex: number }).programIdIndex]
              : null;
        if (programId === MEMO_PROGRAM_ADDRESS.toString() && "parsed" in ix && typeof ix.parsed === "string") {
          anchorMemo = ix.parsed;
        }
      }
      // signer check: worker address must be a signer on the tx
      const signerOk = accountKeys.length > 0 && accountKeys[0] === row.owner_pubkey
        ? true
        : tx.transaction.message.accountKeys.some(
            (k) => typeof k !== "string" && k.signer && String(k.pubkey) === row.owner_pubkey
          );
      anchorOk = anchorMemo === `${MEMO_PREFIX}${row.hash}` && signerOk;
      checks.push({
        id: "signer",
        label: "El titular firmó el anclaje",
        ok: signerOk,
      });
    }
  } catch {
    anchorMemo = null;
  }
  checks.push({
    id: "anchor",
    label: "Anclado en blockchain",
    ok: anchorOk,
    detail: anchorOk
      ? `memo onchain coincide`
      : anchorMemo
        ? "el memo onchain no coincide con el informe"
        : "transacción de anclaje no encontrada",
  });

  return { status: anchorOk && hashOk ? "valid" : "tampered", checks, anchorMemo };
}

// --- fee grant for worker-signed anchors ---

export function expectedAnchorMemo(hash: string): string {
  return `${MEMO_PREFIX}${hash}`;
}
