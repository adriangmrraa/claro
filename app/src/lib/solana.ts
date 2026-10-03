// Server-side Solana devnet helpers for CLARO.
// Pattern verified against @solana/kit@8.4.0: keypair signers are
// partial/modifying signers (no TransactionSendingSigner), so sends go through
// signTransactionMessageWithSigners + sendAndConfirmTransactionFactory.
//
// Custody model (spec S3/CA-1): the WORKER keypair is generated client-side and
// never reaches the server. The only server-side signers are the devnet demo
// payer pool + test-mint authority, loaded from env secrets.

import {
  AccountRole,
  address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromPrivateKeyBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type AccountMeta,
  type Address,
  type Instruction,
  type KeyPairSigner,
  type Signature,
} from "@solana/kit";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstructionAsync,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { getAddMemoInstruction } from "@solana-program/memo";
import bs58 from "bs58";
import { env } from "./env";

export const USDC_DECIMALS = 6;
const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

export function usdcMint(): Address {
  if (!env.usdcMint) {
    throw new Error("CLARO_USDC_MINT is not set — run scripts/setup_devnet.ts");
  }
  return address(env.usdcMint);
}

export const rpc = createSolanaRpc(env.rpcUrl);
const rpcSubscriptions = createSolanaRpcSubscriptions(env.wsUrl);
const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

// --- signers (devnet demo only; worker keys are client-side, never here) ---

// Secrets in env are base58-encoded raw 32-byte Ed25519 seeds, as written by
// scripts/setup_devnet.ts (pkcs8 DER sliced down to the seed).
export async function signerFromSecretB58(secretB58: string): Promise<KeyPairSigner> {
  return createKeyPairSignerFromPrivateKeyBytes(bs58.decode(secretB58));
}

export async function loadPayerSigners(): Promise<KeyPairSigner[]> {
  if (env.payerSecrets.length === 0) {
    throw new Error("CLARO_PAYER_SECRETS is empty — run scripts/setup_devnet.ts");
  }
  return Promise.all(env.payerSecrets.map(signerFromSecretB58));
}

export async function loadMintAuthority(): Promise<KeyPairSigner> {
  if (!env.mintAuthoritySecret) {
    throw new Error("CLARO_MINT_AUTHORITY_SECRET is not set — run scripts/setup_devnet.ts");
  }
  return signerFromSecretB58(env.mintAuthoritySecret);
}

// --- associated token accounts ---

export async function usdcAta(owner: Address): Promise<Address> {
  const [ata] = await findAssociatedTokenPda({
    mint: usdcMint(),
    owner,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  return ata;
}

async function ataExists(owner: Address): Promise<boolean> {
  const ata = await usdcAta(owner);
  const { value } = await rpc.getAccountInfo(ata, { encoding: "base64" }).send();
  return value !== null;
}

export async function usdcBalanceMicro(owner: Address): Promise<bigint> {
  const ata = await usdcAta(owner);
  try {
    const { value } = await rpc.getTokenAccountBalance(ata).send();
    return BigInt(value.amount);
  } catch {
    return 0n;
  }
}

// --- payment transactions ---

export interface UsdcPaymentInput {
  from: KeyPairSigner;
  to: Address;
  amountMicro: bigint;
  reference: Address;
  memo: string;
}

// Builds, signs, sends and confirms a USDC transfer carrying the Solana Pay
// reference (readonly extra account on the transfer ix) and a memo.
// Returns the confirmed signature (base58).
export async function sendUsdcPayment(input: UsdcPaymentInput): Promise<string> {
  const { from, to, amountMicro, reference, memo } = input;

  const source = await usdcAta(from.address);
  const destination = await usdcAta(to);
  const instructions: Instruction[] = [];

  if (!(await ataExists(to))) {
    instructions.push(
      await getCreateAssociatedTokenInstructionAsync({
        payer: from,
        mint: usdcMint(),
        owner: to,
      })
    );
  }

  const transfer = getTransferCheckedInstruction({
    source,
    mint: usdcMint(),
    destination,
    authority: from,
    amount: amountMicro,
    decimals: USDC_DECIMALS,
  });
  // Solana Pay reference: readonly extra account identifying this payment.
  (transfer.accounts as AccountMeta[]).push({
    address: reference,
    role: AccountRole.READONLY,
  });
  instructions.push(transfer);
  instructions.push(getAddMemoInstruction({ memo }));

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(from, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions(instructions, m)
  );

  const signedTx = await signTransactionMessageWithSigners(message);
  assertIsTransactionWithBlockhashLifetime(signedTx);
  await sendAndConfirm(signedTx, { commitment: "confirmed" });
  return getSignatureFromTransaction(signedTx);
}

// --- on-chain verification reads (public page, S6) ---

export interface ParsedPayment {
  signature: string;
  referenceOk: boolean;
  hasMemoProgram: boolean;
  memoText: string | null;
  tokenDeltaToWorker: bigint | null;
  payerAddress: string | null;
  confirmed: boolean;
}

// Re-derives the payment facts on-chain: signature exists and confirmed, the
// Solana Pay reference is among the tx account keys, and USDC moved into the
// worker's ATA for the claimed amount.
export async function inspectPayment(params: {
  signature: string;
  expectedReference: string;
  workerAddress: string;
}): Promise<ParsedPayment> {
  const tx = await rpc
    .getTransaction(params.signature as Signature, {
      encoding: "jsonParsed",
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    })
    .send();

  const empty: ParsedPayment = {
    signature: params.signature,
    referenceOk: false,
    hasMemoProgram: false,
    memoText: null,
    tokenDeltaToWorker: null,
    payerAddress: null,
    confirmed: false,
  };
  if (!tx || tx.meta?.err) return empty;

  const accountKeys: string[] = tx.transaction.message.accountKeys.map((k) =>
    String(typeof k === "string" ? k : k.pubkey)
  );
  const workerAta = (await usdcAta(address(params.workerAddress))).toString();
  const mintStr = usdcMint().toString();
  const referenceOk = accountKeys.includes(params.expectedReference);
  const payerAddress = accountKeys[0] ?? null;

  // USDC delta into the worker ATA via token balance diffs (authoritative).
  const pre = tx.meta?.preTokenBalances ?? [];
  let tokenDelta: bigint | null = null;
  for (const p of tx.meta?.postTokenBalances ?? []) {
    if (p.mint !== mintStr) continue;
    if (accountKeys[p.accountIndex] !== workerAta) continue;
    const preMatch = pre.find((q) => q.accountIndex === p.accountIndex);
    const delta = BigInt(p.uiTokenAmount.amount) - BigInt(preMatch?.uiTokenAmount.amount ?? "0");
    if (delta > 0n) tokenDelta = (tokenDelta ?? 0n) + delta;
  }

  let hasMemoProgram = false;
  let memoText: string | null = null;
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
    if (programId === MEMO_PROGRAM_ID) {
      hasMemoProgram = true;
      if ("parsed" in ix && typeof ix.parsed === "string") memoText = ix.parsed;
    }
  }

  return {
    signature: params.signature,
    referenceOk,
    hasMemoProgram,
    memoText,
    tokenDeltaToWorker: tokenDelta,
    payerAddress,
    confirmed: true,
  };
}
