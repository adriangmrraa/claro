// Explorer links for on-chain evidence. NEXT_PUBLIC_CLUSTER is inlined into
// client bundles by Next — safe to use from both server and client code.
const CLUSTER = process.env.NEXT_PUBLIC_CLUSTER ?? "devnet";

export function txUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${CLUSTER}`;
}

export function addressUrl(addr: string): string {
  return `https://explorer.solana.com/address/${addr}?cluster=${CLUSTER}`;
}
