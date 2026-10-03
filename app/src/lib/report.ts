// lib/report.ts — canonical report facts + content hash.
// The hash is what gets anchored on-chain (memo tx CLARO-RPT:v1:<hash>) and
// what the public verification page recomputes. Canonical JSON = stable key
// order + stable separators, so the same facts always hash the same.

import { createHash } from "node:crypto";

export interface ReportScope {
  periodMonths: number;
  includeEvidence: boolean;
}

export interface ReportEvidenceItem {
  signature: string;
  ts: number;
  amountMicro: string;
  payer: string | null;
  tier: "T1" | "T3";
}

export interface ReportFacts {
  version: 1;
  worker: string;
  periodMonths: number;
  generatedAt: number;
  income: {
    totalMicro: string;
    monthlyAvgMicro: string;
    paymentCount: number;
    payerCount: number;
    currency: "USDC";
  };
  savings: {
    totalMicro: string;
    depositCount: number;
  };
  evidence: ReportEvidenceItem[];
}

// Canonical JSON: object keys sorted recursively, no whitespace.
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`);
  return `{${entries.join(",")}}`;
}

export function sha256Hex(canonical: string): string {
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

export function factsHash(facts: ReportFacts): string {
  return sha256Hex(canonicalJson(facts));
}

export function buildFacts(params: {
  worker: string;
  scope: ReportScope;
  incomePayments: { signature: string; ts: number; amountMicro: bigint; payer: string | null }[];
  savingsDeposits: { signature: string; ts: number; amountMicro: bigint; payer: string | null }[];
}): ReportFacts {
  const { worker, scope, incomePayments, savingsDeposits } = params;
  const months = Math.max(1, scope.periodMonths);
  const incomeTotal = incomePayments.reduce((acc, p) => acc + p.amountMicro, 0n);
  const savingsTotal = savingsDeposits.reduce((acc, p) => acc + p.amountMicro, 0n);
  const payers = new Set(incomePayments.map((p) => p.payer).filter(Boolean));

  return {
    version: 1,
    worker,
    periodMonths: months,
    generatedAt: Date.now(),
    income: {
      totalMicro: incomeTotal.toString(),
      monthlyAvgMicro: (incomeTotal / BigInt(months)).toString(),
      paymentCount: incomePayments.length,
      payerCount: payers.size,
      currency: "USDC",
    },
    savings: {
      totalMicro: savingsTotal.toString(),
      depositCount: savingsDeposits.length,
    },
    evidence: scope.includeEvidence
      ? [
          ...incomePayments.map((p) => ({ ...p, tier: "T1" as const })),
          ...savingsDeposits.map((p) => ({ ...p, tier: "T3" as const })),
        ]
          .sort((a, b) => a.ts - b.ts)
          .map((p) => ({
            signature: p.signature,
            ts: p.ts,
            amountMicro: p.amountMicro.toString(),
            payer: p.payer,
            tier: p.tier,
          }))
      : [],
  };
}
