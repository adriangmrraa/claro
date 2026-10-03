import { describe, expect, it } from "vitest";
import { buildFacts, canonicalJson, factsHash, sha256Hex } from "../../src/lib/report";

describe("canonicalJson", () => {
  it("produces stable output regardless of key order", () => {
    const a = canonicalJson({ b: 2, a: 1, c: { y: 2, x: 1 } });
    const b = canonicalJson({ c: { x: 1, y: 2 }, a: 1, b: 2 });
    expect(a).toBe(b);
    expect(a).toBe('{"a":1,"b":2,"c":{"x":1,"y":2}}');
  });

  it("drops undefined fields", () => {
    expect(canonicalJson({ a: 1, b: undefined })).toBe('{"a":1}');
  });
});

describe("factsHash", () => {
  it("is deterministic for identical facts", () => {
    const params = {
      worker: "W1",
      scope: { periodMonths: 3, includeEvidence: true },
      incomePayments: [
        { signature: "s1", ts: 1000, amountMicro: 100_000_000n, payer: "P1" },
        { signature: "s2", ts: 2000, amountMicro: 50_000_000n, payer: "P2" },
      ],
      savingsDeposits: [{ signature: "s3", ts: 1500, amountMicro: 30_000_000n, payer: "W1" }],
    };
    const f1 = buildFacts(params);
    const f2 = buildFacts(params);
    // generatedAt differs? buildFacts uses Date.now() — same-ms runs hash equal;
    // to keep determinism we compare with fixed generatedAt:
    f2.generatedAt = f1.generatedAt;
    expect(factsHash(f1)).toBe(factsHash(f2));
    expect(factsHash(f1)).toMatch(/^[0-9a-f]{64}$/);
  });

  it("changes when facts are tampered (verification must fail)", () => {
    const params = {
      worker: "W1",
      scope: { periodMonths: 1, includeEvidence: true },
      incomePayments: [{ signature: "s1", ts: 1, amountMicro: 100n, payer: "P1" }],
      savingsDeposits: [],
    };
    const original = buildFacts(params);
    const tampered = buildFacts({
      ...params,
      incomePayments: [{ signature: "s1", ts: 1, amountMicro: 999n, payer: "P1" }],
    });
    tampered.generatedAt = original.generatedAt;
    expect(factsHash(original)).not.toBe(factsHash(tampered));
  });
});

describe("buildFacts", () => {
  it("separates income from savings and counts distinct payers", () => {
    const facts = buildFacts({
      worker: "W1",
      scope: { periodMonths: 2, includeEvidence: true },
      incomePayments: [
        { signature: "s1", ts: 1, amountMicro: 100_000_000n, payer: "P1" },
        { signature: "s2", ts: 2, amountMicro: 60_000_000n, payer: "P1" },
        { signature: "s3", ts: 3, amountMicro: 40_000_000n, payer: "P2" },
      ],
      savingsDeposits: [{ signature: "s4", ts: 4, amountMicro: 20_000_000n, payer: "W1" }],
    });
    expect(facts.income.totalMicro).toBe("200000000");
    expect(facts.income.monthlyAvgMicro).toBe("100000000");
    expect(facts.income.paymentCount).toBe(3);
    expect(facts.income.payerCount).toBe(2);
    expect(facts.savings.totalMicro).toBe("20000000");
    expect(facts.savings.depositCount).toBe(1);
    expect(facts.evidence).toHaveLength(4);
    expect(facts.evidence.map((e) => e.tier)).toEqual(["T1", "T1", "T1", "T3"]);
  });

  it("omits evidence when scope excludes it (selective disclosure)", () => {
    const facts = buildFacts({
      worker: "W1",
      scope: { periodMonths: 1, includeEvidence: false },
      incomePayments: [{ signature: "s1", ts: 1, amountMicro: 5n, payer: "P1" }],
      savingsDeposits: [],
    });
    expect(facts.evidence).toHaveLength(0);
    expect(facts.income.paymentCount).toBe(1);
  });
});

describe("sha256Hex", () => {
  it("hashes canonical payloads to hex", () => {
    expect(sha256Hex("{}")).toBe(
      "44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a"
    );
  });
});
