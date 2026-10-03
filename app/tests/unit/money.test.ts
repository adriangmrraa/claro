import { describe, expect, it } from "vitest";
import { formatUsdc, formatUsdcFixed, parseUsdc } from "../../src/lib/money";

describe("parseUsdc", () => {
  it("parses plain and decimal amounts", () => {
    expect(parseUsdc("100")).toBe(100_000_000n);
    expect(parseUsdc("123.45")).toBe(123_450_000n);
    expect(parseUsdc("0.000001")).toBe(1n);
    expect(parseUsdc("1,5")).toBe(1_500_000n);
  });
  it("rejects invalid input", () => {
    expect(parseUsdc("abc")).toBeNull();
    expect(parseUsdc("1.1234567")).toBeNull();
    expect(parseUsdc("-5")).toBeNull();
    expect(parseUsdc("")).toBeNull();
  });
});

describe("formatUsdc", () => {
  it("round-trips with parse", () => {
    expect(formatUsdc(123_450_000n)).toBe("123.45");
    expect(parseUsdc(formatUsdc(123_450_000n))).toBe(123_450_000n);
    expect(formatUsdc(100_000_000n)).toBe("100");
    expect(formatUsdc(1n)).toBe("0.000001");
  });
  it("fixed variant always shows cents", () => {
    expect(formatUsdcFixed(100_000_000n)).toBe("100.00");
    expect(formatUsdcFixed(123_456_789n)).toBe("123.45");
  });
});
