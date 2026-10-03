// lib/anchor.ts — client-side report anchoring (worker-signed, spec S6/design).
// The worker builds, signs and sends a memo tx `CLARO-RPT:v1:<hash>` with
// themselves as fee payer and required signer — proof that the report holder
// consented to the anchor. Server verifies the tx afterwards.

"use client";

import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { getAddMemoInstruction } from "@solana-program/memo";
import { loadWorkerSigner } from "./wallet";

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
const WS_URL = RPC_URL.replace(/^http/, "ws");

// Returns the confirmed signature, or throws with a user-safe message.
export async function anchorReportOnChain(memo: string): Promise<string> {
  const worker = await loadWorkerSigner();
  if (!worker) throw new Error("No encontramos tu clave en este dispositivo");

  // Fee grant if the worker has no SOL (they never need to know why).
  await fetch("/api/reports/anchor-fee", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ worker: worker.address }),
  }).catch(() => {});

  const rpc = createSolanaRpc(RPC_URL);
  const rpcSubscriptions = createSolanaRpcSubscriptions(WS_URL);
  const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(worker, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstructions(
        [getAddMemoInstruction({ memo, signers: [worker] })],
        m
      )
  );

  const signedTx = await signTransactionMessageWithSigners(message);
  assertIsTransactionWithBlockhashLifetime(signedTx);
  await sendAndConfirm(signedTx, { commitment: "confirmed" });
  return getSignatureFromTransaction(signedTx);
}
