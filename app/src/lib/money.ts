// lib/money.ts — USDC amount parsing/formatting (6 decimals, no floats).
const DECIMALS = 6;
const SCALE = 10n ** BigInt(DECIMALS);

// "123.45" -> 123450000n. Accepts "." or "," decimal separator, up to 6 dp.
export function parseUsdc(input: string): bigint | null {
  const t = input.trim().replace(/\s+/g, "").replace(",", ".");
  if (!/^\d+(\.\d{0,6})?$/.test(t)) return null;
  const [whole, frac = ""] = t.split(".");
  return BigInt(whole) * SCALE + BigInt(frac.padEnd(DECIMALS, "0") || "0");
}

// 123450000n -> "123.45" (trailing zeros trimmed)
export function formatUsdc(micro: bigint): string {
  const whole = micro / SCALE;
  const frac = (micro % SCALE).toString().padStart(DECIMALS, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}

export function formatUsdcFixed(micro: bigint): string {
  const whole = micro / SCALE;
  const frac = (micro % SCALE).toString().padStart(DECIMALS, "0").slice(0, 2);
  return `${whole}.${frac}`;
}
