import { describe, expect, it } from "vitest";
import { classifyPayment, isIncome } from "../../src/lib/classify";

const WORKER = "WorkerAddr1111111111111111111111111111111";
const PAYER = "PayerAddr2222222222222222222222222222222";

describe("classifyPayment — 3-tier evidence model", () => {
  it("T1: third-party payment carrying a link reference is income", () => {
    const c = classifyPayment({
      signature: "sig1",
      payer: PAYER,
      worker: WORKER,
      amountMicro: 150_000_000n,
      referenceOk: true,
      linkSlug: "abc123",
    });
    expect(c.tier).toBe("T1");
    expect(c.reason).toBe("third-party-linked-payment");
    expect(isIncome(c)).toBe(true);
  });

  it("T3: deposit without reference is savings, never income", () => {
    const c = classifyPayment({
      signature: "sig2",
      payer: PAYER,
      worker: WORKER,
      amountMicro: 50_000_000n,
      referenceOk: false,
      linkSlug: null,
    });
    expect(c.tier).toBe("T3");
    expect(c.reason).toBe("deposit-no-payer-proof");
    expect(isIncome(c)).toBe(false);
  });

  it("excluded: worker paying their own link is a cycle, not income", () => {
    const c = classifyPayment({
      signature: "sig3",
      payer: WORKER,
      worker: WORKER,
      amountMicro: 100_000_000n,
      referenceOk: true,
      linkSlug: "abc123",
    });
    expect(c.tier).toBe("excluded");
    expect(c.reason).toBe("self-payment-cycle");
    expect(isIncome(c)).toBe(false);
  });

  it("excluded: no USDC delta to the worker ATA", () => {
    const c = classifyPayment({
      signature: "sig4",
      payer: PAYER,
      worker: WORKER,
      amountMicro: null,
      referenceOk: true,
      linkSlug: "abc123",
    });
    expect(c.tier).toBe("excluded");
    expect(c.reason).toBe("no-funds-to-worker");
  });

  it("excluded: self-deposit with reference still not income", () => {
    const c = classifyPayment({
      signature: "sig5",
      payer: WORKER,
      worker: WORKER,
      amountMicro: 25_000_000n,
      referenceOk: false,
      linkSlug: null,
    });
    expect(c.tier).toBe("excluded");
    expect(isIncome(c)).toBe(false);
  });
});
