// lib/classify.ts — pure evidence classifier (3-tier model).
// T1: third-party payment that carries a registered payment-link reference.
// T2: payer attestation + matched deposit — deferred (spec spec.md / INV-5).
// T3: deposit with no verifiable payer proof — savings, never income.
// Excluded: self-payments with a reference (attempted self-checkout cycles).
//
// The classifier is pure: it takes already-fetched chain facts and returns a
// label. Honesty invariant (INV-2/CA-4): T3 is always shown, never counted
// as income.

export type EvidenceTier = "T1" | "T2" | "T3" | "excluded";

export interface PaymentFactInput {
  signature: string;
  /** payer address = fee payer / first account key of the tx */
  payer: string | null;
  /** worker wallet that received the funds */
  worker: string;
  /** USDC delta into the worker ATA (micro, 6 decimals); null if none */
  amountMicro: bigint | null;
  /** the tx carries the registered payment-link reference */
  referenceOk: boolean;
  /** link slug when referenceOk; null when no link reference matched */
  linkSlug: string | null;
}

export interface ClassifiedPayment {
  signature: string;
  tier: EvidenceTier;
  /** human-auditable reason for the label (report transparency) */
  reason:
    | "third-party-linked-payment"
    | "self-payment-cycle"
    | "deposit-no-payer-proof"
    | "no-funds-to-worker";
  amountMicro: bigint;
  linkSlug: string | null;
}

export function classifyPayment(p: PaymentFactInput): ClassifiedPayment {
  const amount = p.amountMicro ?? 0n;
  const base = { signature: p.signature, linkSlug: null as string | null };

  if (amount <= 0n) {
    return { ...base, tier: "excluded", reason: "no-funds-to-worker", amountMicro: amount };
  }
  if (p.payer === p.worker && p.linkSlug) {
    // Worker paying through their own link — a cycle attempt, not income.
    return { ...base, tier: "excluded", reason: "self-payment-cycle", amountMicro: amount };
  }
  if (p.referenceOk && p.linkSlug && p.payer !== p.worker) {
    return {
      ...base,
      tier: "T1",
      reason: "third-party-linked-payment",
      amountMicro: amount,
      linkSlug: p.linkSlug,
    };
  }
  // Funds arrived but the payer cannot be tied to a checkout — savings bucket.
  // Includes the worker's own unreferenced deposits (T3 spec: depósitos propios).
  return { ...base, tier: "T3", reason: "deposit-no-payer-proof", amountMicro: amount };
}

export function classifyAll(inputs: PaymentFactInput[]): ClassifiedPayment[] {
  return inputs.map(classifyPayment);
}

export function isIncome(p: ClassifiedPayment): boolean {
  return p.tier === "T1" || p.tier === "T2";
}
