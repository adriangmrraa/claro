// scripts/seed_demo_worker.ts — prepares the demo worker end-to-end against a
// running dev server: account + client-side-equivalent wallet + payment link
// (phase 1), then after seed_history.ts runs, sync + report + worker-signed
// onchain anchor (phase 2, --finish). Saves credentials to data/demo_worker.json
// (gitignored) — the demoer logs in with email + "Ya tengo una clave de acceso".
//
// Usage:
//   npx tsx scripts/seed_demo_worker.ts           # create account/link
//   npx tsx scripts/seed_history.ts <addr> <slug> # real payments on-chain
//   npx tsx scripts/seed_demo_worker.ts --finish  # sync + report + anchor

import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromPrivateKeyBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type KeyPairSigner,
} from "@solana/kit";
import { getAddMemoInstruction } from "@solana-program/memo";
import bs58 from "bs58";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const RPC_URL = process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
const WS_URL = process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com";
const EMAIL = process.env.DEMO_EMAIL ?? "demo@claro.lat";
const OUT = path.join(process.cwd(), "data", "demo_worker.json");

const rpc = createSolanaRpc(RPC_URL);
const rpcSubscriptions = createSolanaRpcSubscriptions(WS_URL);
const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

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

let cookie = "";
async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

function must(cond: boolean, label: string, detail?: unknown) {
  if (!cond) {
    console.error(`FAIL ${label}`, detail ?? "");
    process.exit(1);
  }
  console.log(`  ok ${label}`);
}

async function sendAndConfirmPolling(
  signedTx: Parameters<typeof sendAndConfirm>[0]
): Promise<string> {
  const signature = getSignatureFromTransaction(signedTx);
  try {
    await sendAndConfirm(signedTx, { commitment: "confirmed" });
    return signature;
  } catch {
    const deadline = Date.now() + 60_000;
    while (Date.now() < deadline) {
      const { value } = await rpc.getSignatureStatuses([signature]).send();
      const st = value[0];
      if (st) {
        if (st.err) throw new Error(`tx failed: ${JSON.stringify(st.err)}`);
        if (st.confirmationStatus === "confirmed" || st.confirmationStatus === "finalized")
          return signature;
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    throw new Error("confirmation timeout");
  }
}

async function session() {
  const r = await api("/api/session", {
    method: "POST",
    body: JSON.stringify({ email: EMAIL }),
  });
  must(r.status === 200 && !!cookie, "session", r.status);
}

interface DemoWorker {
  email: string;
  address: string;
  secretB58: string;
  slug: string;
  reference: string;
  reportSlug?: string;
  reportHash?: string;
  anchorSig?: string;
}

async function create() {
  const worker = await generateKeyPairSigner(true);
  const secretB58 = await exportSecretB58(worker);
  console.log(`demo worker: ${worker.address} (${EMAIL})`);

  await session();
  let r = await api("/api/user/wallet", {
    method: "POST",
    body: JSON.stringify({ wallet: worker.address }),
  });
  must(r.status === 200, "wallet registered", r.status);

  r = await api("/api/links", {
    method: "POST",
    body: JSON.stringify({ memo: "Trabajo freelance" }),
  });
  must(r.status === 200, "link created", JSON.stringify(r.json));
  const link = (r.json as { link: { slug: string; reference: string } }).link;

  const data: DemoWorker = {
    email: EMAIL,
    address: worker.address.toString(),
    secretB58,
    slug: link.slug,
    reference: link.reference,
  };
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log(`  link: /pagar/${link.slug}`);
  console.log(`  wrote ${OUT}`);
  console.log(`\nNext: npx tsx scripts/seed_history.ts ${worker.address} ${link.slug}`);
  console.log(`Then: npx tsx scripts/seed_demo_worker.ts --finish`);
}

async function finish() {
  if (!existsSync(OUT)) {
    console.error("data/demo_worker.json not found — run without --finish first.");
    process.exit(1);
  }
  const data = JSON.parse(readFileSync(OUT, "utf8")) as DemoWorker;
  const worker = await createKeyPairSignerFromPrivateKeyBytes(bs58.decode(data.secretB58));
  console.log(`finishing demo worker ${data.address}`);

  await session();

  let r = await api("/api/history/sync", { method: "POST" });
  must(r.status === 200, "history sync", JSON.stringify(r.json));

  r = await api("/api/reports", {
    method: "POST",
    body: JSON.stringify({ periodMonths: 12, includeEvidence: true, ttlDays: 30 }),
  });
  must(r.status === 200, "report created", JSON.stringify(r.json));
  const report = (r.json as { report: { slug: string; hash: string } }).report;

  r = await api("/api/reports/anchor-fee", {
    method: "POST",
    body: JSON.stringify({ worker: data.address }),
  });
  must(r.status === 200, "anchor fee grant", r.status);

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(worker, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstructions(
        [getAddMemoInstruction({ memo: `CLARO-RPT:v1:${report.hash}`, signers: [worker] })],
        m
      )
  );
  const signedTx = await signTransactionMessageWithSigners(message);
  assertIsTransactionWithBlockhashLifetime(signedTx);
  const anchorSig = await sendAndConfirmPolling(signedTx);
  console.log(`  anchor tx: ${anchorSig}`);

  r = await api(`/api/reports/${report.slug}/anchor`, {
    method: "POST",
    body: JSON.stringify({ signature: anchorSig }),
  });
  must(r.status === 200, "anchor registered", JSON.stringify(r.json));

  data.reportSlug = report.slug;
  data.reportHash = report.hash;
  data.anchorSig = anchorSig;
  writeFileSync(OUT, JSON.stringify(data, null, 2));

  console.log(`\nDEMO READY — credentials in ${OUT}`);
  console.log(`  login:    ${data.email} + "Ya tengo una clave de acceso" (secret in json)`);
  console.log(`  pay link: /pagar/${data.slug}`);
  console.log(`  verify:   /verificar/${report.slug}`);
}

const isFinish = process.argv.includes("--finish");
(isFinish ? finish() : create()).catch((e) => {
  console.error(e);
  process.exit(1);
});
