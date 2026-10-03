// scripts/setup_devnet.ts — bootstraps the CLARO demo environment on Solana
// devnet: creates the CLARO-TEST-USDC mint (6 decimals), a pool of 5 funded
// payer wallets, and writes `.env.local` + `data/devnet.json`.
//
// Idempotent: if data/devnet.json exists it aborts (pass --force to regenerate).
// Devnet only — never run against mainnet. Run: npx tsx scripts/setup_devnet.ts

import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromPrivateKeyBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Address,
  type Instruction,
  type KeyPairSigner,
  type Signature,
} from "@solana/kit";
import { getCreateAccountInstruction, getTransferSolInstruction } from "@solana-program/system";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstructionAsync,
  getInitializeMint2Instruction,
  getMintSize,
  getMintToInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import bs58 from "bs58";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const RPC_URL = process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
const WS_URL = process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com";
const DECIMALS = 6;
const PAYER_COUNT = 5;
const PAYER_USDC = 10_000n * 10n ** BigInt(DECIMALS); // 10k USDC each
const DATA_FILE = path.join(process.cwd(), "data", "devnet.json");
const ENV_FILE = path.join(process.cwd(), ".env.local");

const rpc = createSolanaRpc(RPC_URL);
const rpcSubscriptions = createSolanaRpcSubscriptions(WS_URL);
const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Secrets are stored as base58 of the raw 32-byte Ed25519 seed (what kit's
// createKeyPairSignerFromPrivateKeyBytes expects). WebCrypto exports private
// keys only as PKCS#8-DER: 16-byte header + 32-byte seed.
function pkcs8ToSeed(pkcs8: Uint8Array): Uint8Array {
  if (pkcs8.length === 32) return pkcs8;
  if (pkcs8.length === 48) return pkcs8.slice(16);
  throw new Error(`unexpected private key encoding length: ${pkcs8.length}`);
}

async function exportSecretB58(signer: KeyPairSigner): Promise<string> {
  const pkcs8 = new Uint8Array(
    await crypto.subtle.exportKey("pkcs8", signer.keyPair.privateKey)
  );
  return bs58.encode(pkcs8ToSeed(pkcs8));
}

async function sendTx(payer: KeyPairSigner, instructions: Instruction[]): Promise<string> {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions(instructions, m)
  );
  const signedTx = await signTransactionMessageWithSigners(message);
  assertIsTransactionWithBlockhashLifetime(signedTx);
  await sendAndConfirm(signedTx, { commitment: "confirmed" });
  return getSignatureFromTransaction(signedTx);
}

// Devnet airdrops are rate-limited — retry with backoff and honest logging.
// AIRDROP_MAX_ATTEMPTS / AIRDROP_WAIT_S let a background run wait out a dry faucet.
const AIRDROP_MAX_ATTEMPTS = Number(process.env.AIRDROP_MAX_ATTEMPTS ?? 4);
const AIRDROP_WAIT_S = Number(process.env.AIRDROP_WAIT_S ?? 0); // 0 → backoff 5/10/15s
async function airdropWithRetry(to: Address, sol: number, label: string): Promise<void> {
  const lamportsAmount = lamports(BigInt(Math.round(sol * 1e9)));
  for (let attempt = 1; attempt <= AIRDROP_MAX_ATTEMPTS; attempt++) {
    try {
      const sig = (await rpc
        .requestAirdrop(to, lamportsAmount, { commitment: "confirmed" })
        .send()) as Signature;
      console.log(`  airdrop ${sol} SOL -> ${label}: ${sig}`);
      // confirm via polling (airdrop sig is a normal tx)
      for (let i = 0; i < 30; i++) {
        const { value } = await rpc
          .getSignatureStatuses([sig])
          .send();
        const st = value[0];
        if (st?.confirmationStatus === "confirmed" || st?.confirmationStatus === "finalized") return;
        await sleep(1000);
      }
      return;
    } catch (e) {
      const wait = AIRDROP_WAIT_S > 0 ? AIRDROP_WAIT_S : attempt * 5;
      console.warn(
        `  airdrop ${label} attempt ${attempt}/${AIRDROP_MAX_ATTEMPTS} failed (${e instanceof Error ? e.message.slice(0, 120) : e}), retrying in ${wait}s…`
      );
      await sleep(wait * 1000);
    }
  }
  throw new Error(
    `Airdrop failed for ${label} after retries. Devnet faucet is rate-limiting — ` +
      `use https://faucet.solana.com for ${to} and re-run.`
  );
}

function writeEnvLocal(vars: Record<string, string>) {
  let existing = "";
  if (existsSync(ENV_FILE)) existing = readFileSync(ENV_FILE, "utf8");
  const map = new Map<string, string>();
  for (const line of existing.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) map.set(m[1], m[2]);
  }
  for (const [k, v] of Object.entries(vars)) map.set(k, v);
  const cluster = RPC_URL.includes("devnet")
    ? "devnet"
    : `custom&customUrl=${encodeURIComponent(RPC_URL)}`;
  const body = [
    "# CLARO — devnet only. Generado por scripts/setup_devnet.ts. NUNCA commitear.",
    `SOLANA_RPC_URL=${RPC_URL}`,
    `SOLANA_WS_URL=${WS_URL}`,
    `NEXT_PUBLIC_SOLANA_RPC_URL=${RPC_URL}`,
    `NEXT_PUBLIC_CLUSTER=${cluster}`,
    `CLARO_SESSION_SECRET=${map.get("CLARO_SESSION_SECRET") ?? "claro-dev-secret-change-me"}`,
    ...Object.entries(vars).map(([k, v]) => `${k}=${v}`),
    "",
  ].join("\n");
  writeFileSync(ENV_FILE, body);
  console.log(`  wrote ${ENV_FILE}`);
}

// Reads .env.local so a pre-funded CLARO_MINT_AUTHORITY_SECRET (e.g. funded
// manually via https://faucet.solana.com) is picked up — skips the airdrop.
function readEnvLocal(): Map<string, string> {
  const map = new Map<string, string>();
  if (!existsSync(ENV_FILE)) return map;
  for (const line of readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) map.set(m[1], m[2]);
  }
  return map;
}

async function main() {
  const force = process.argv.includes("--force");
  if (existsSync(DATA_FILE) && !force) {
    console.error(`data/devnet.json already exists — pass --force to regenerate.`);
    process.exit(1);
  }

  console.log(`CLARO devnet setup — ${RPC_URL}`);

  // extractable: demo secrets are exported to .env.local (devnet only).
  const envLocal = readEnvLocal();
  const prefundedSecret =
    process.env.CLARO_MINT_AUTHORITY_SECRET ?? envLocal.get("CLARO_MINT_AUTHORITY_SECRET");
  const mintAuthority = prefundedSecret
    ? await createKeyPairSignerFromPrivateKeyBytes(bs58.decode(prefundedSecret))
    : await generateKeyPairSigner(true);
  const mint = await generateKeyPairSigner(true);
  console.log(`mint authority: ${mintAuthority.address}${prefundedSecret ? " (pre-funded)" : ""}`);
  console.log(`mint account:   ${mint.address}`);

  // Single faucet dependency: only the authority needs SOL.
  // It then funds every payer via a normal transfer inside their funding tx.
  if (prefundedSecret) {
    const { value: balance } = await rpc.getBalance(mintAuthority.address).send();
    console.log(`  authority balance: ${Number(balance) / 1e9} SOL`);
    if (balance < 2_000_000_000n) {
      throw new Error(
        `Authority has ${Number(balance) / 1e9} SOL — needs ~2 SOL. ` +
          `Fund ${mintAuthority.address} via https://faucet.solana.com and re-run.`
      );
    }
  } else {
    await airdropWithRetry(mintAuthority.address, 3, "mint-authority");
  }

  const rentExempt = await rpc.getMinimumBalanceForRentExemption(BigInt(getMintSize())).send();
  const mintSig = await sendTx(mintAuthority, [
    getCreateAccountInstruction({
      payer: mintAuthority,
      newAccount: mint,
      lamports: rentExempt,
      space: getMintSize(),
      programAddress: TOKEN_PROGRAM_ADDRESS,
    }),
    getInitializeMint2Instruction({
      mint: mint.address,
      decimals: DECIMALS,
      mintAuthority: mintAuthority.address,
      freezeAuthority: null,
    }),
  ]);
  console.log(`mint created: ${mintSig}`);

  const payers: { address: string; ata: string; secret: string; fundSig: string }[] = [];
  for (let i = 0; i < PAYER_COUNT; i++) {
    const payer = await generateKeyPairSigner(true);
    const [ata] = await findAssociatedTokenPda({
      mint: mint.address,
      owner: payer.address,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    const fundSig = await sendTx(mintAuthority, [
      // payer needs SOL for future checkout tx fees
      getTransferSolInstruction({
        source: mintAuthority,
        destination: payer.address,
        amount: 100_000_000n, // 0.1 SOL
      }),
      await getCreateAssociatedTokenInstructionAsync({
        payer: mintAuthority,
        mint: mint.address,
        owner: payer.address,
      }),
      getMintToInstruction({
        mint: mint.address,
        token: ata,
        mintAuthority,
        amount: PAYER_USDC,
      }),
    ]);
    console.log(`payer-${i + 1} funded ${Number(PAYER_USDC) / 1e6} USDC: ${fundSig}`);
    payers.push({
      address: payer.address,
      ata: ata.toString(),
      secret: await exportSecretB58(payer),
      fundSig,
    });
    await sleep(1500); // be kind to the public faucet
  }

  const envVars = {
    CLARO_USDC_MINT: mint.address,
    NEXT_PUBLIC_USDC_MINT: mint.address,
    CLARO_MINT_AUTHORITY_SECRET: prefundedSecret ?? (await exportSecretB58(mintAuthority)),
    CLARO_PAYER_SECRETS: payers.map((p) => p.secret).join(","),
  };
  writeEnvLocal(envVars);

  mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  writeFileSync(
    DATA_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        cluster: "devnet",
        mint: { address: mint.address, authority: mintAuthority.address, createSig: mintSig },
        payers: payers.map(({ address: a, ata, fundSig }) => ({ address: a, ata, fundSig })),
        // secrets live only in .env.local (gitignored) — never here
      },
      null,
      2
    )
  );
  console.log(`  wrote ${DATA_FILE}`);
  console.log("Done. npm run dev — demo payer pool funded on devnet.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
