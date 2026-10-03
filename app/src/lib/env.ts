// Centralized env access. Server-side only for secrets.
export const env = {
  rpcUrl: process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
  wsUrl: process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com",
  publicRpcUrl:
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
  cluster: process.env.NEXT_PUBLIC_CLUSTER ?? "devnet",
  usdcMint: process.env.CLARO_USDC_MINT ?? process.env.NEXT_PUBLIC_USDC_MINT ?? "",
  mintAuthoritySecret: process.env.CLARO_MINT_AUTHORITY_SECRET ?? "",
  payerSecrets: (process.env.CLARO_PAYER_SECRETS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  sessionSecret: process.env.CLARO_SESSION_SECRET ?? "dev-secret",
};

export const USDC_DECIMALS = 6;
