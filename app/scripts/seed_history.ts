// scripts/seed_history.ts — seeds a realistic devnet payment history for a
// worker: N payers pay an existing payment link + one unreferenced deposit
// (shows up as T3 savings, never income — CA-4 demo beat).
//
// Honest-time note: blockTime is real — seeded payments show today's date.
// For a multi-month LOOK, run this periodically before the demo; facts are
// always real (INV-2).
//
// Usage: npx tsx scripts/seed_history.ts <workerAddress> [linkSlug]
// Requires .env.local from setup_devnet.ts (funded payer pool).

import { address, generateKeyPair } from "@solana/kit";
import { getAddressFromPublicKey } from "@solana/kit";
import {
  loadPayerSigners,
  sendUsdcPayment,
  usdcAta,
  USDC_DECIMALS,
} from "../src/lib/solana";
import { db } from "../src/lib/db";

const PAYMENTS: { usdc: number; payerIdx: number }[] = [
  { usdc: 180, payerIdx: 0 },
  { usdc: 95, payerIdx: 1 },
  { usdc: 220, payerIdx: 2 },
  { usdc: 150, payerIdx: 0 },
  { usdc: 75, payerIdx: 1 },
  { usdc: 310, payerIdx: 3 },
  { usdc: 140, payerIdx: 4 },
  { usdc: 205, payerIdx: 0 },
];

async function main() {
  const worker = process.argv[2];
  if (!worker) {
    console.error("usage: npx tsx scripts/seed_history.ts <workerAddress> [linkSlug]");
    process.exit(1);
  }
  const workerAddr = address(worker);

  const linkSlug = process.argv[3];
  let reference: string | null = null;
  if (linkSlug) {
    const link = db
      .prepare("SELECT reference FROM payment_links WHERE slug = ?")
      .get(linkSlug) as { reference: string } | undefined;
    if (!link) {
      console.error(`link ${linkSlug} not found in db`);
      process.exit(1);
    }
    reference = link.reference;
  } else {
    // demo link — still carries a reference so payments classify T1
    const kp = await generateKeyPair();
    reference = (await getAddressFromPublicKey(kp.publicKey)).toString();
    console.log(`no link slug given — using ad-hoc reference ${reference}`);
  }

  const pool = await loadPayerSigners();
  console.log(`seeding ${PAYMENTS.length} payments to ${worker} via ATA ${await usdcAta(workerAddr)}`);

  for (const [i, p] of PAYMENTS.entries()) {
    const payer = pool[p.payerIdx % pool.length];
    const amountMicro = BigInt(Math.round(p.usdc * 10 ** USDC_DECIMALS));
    const sig = await sendUsdcPayment({
      from: payer,
      to: workerAddr,
      amountMicro,
      reference: address(reference),
      memo: `CLARO:PAY:seed-${i + 1}`,
    });
    console.log(`  [${i + 1}/${PAYMENTS.length}] $${p.usdc} from payer-${p.payerIdx + 1}: ${sig}`);
    await new Promise((r) => setTimeout(r, 1500)); // be gentle with the RPC
  }

  // T3: unreferenced deposit into the worker ATA — shows as savings, not income.
  const t3 = await sendUsdcPayment({
    from: pool[0],
    to: workerAddr,
    amountMicro: 400n * 10n ** BigInt(USDC_DECIMALS),
    reference: address((await getAddressFromPublicKey((await generateKeyPair()).publicKey)).toString()),
    memo: "CLARO:DEPOSIT:propio",
  });
  // NOTE: this deposit uses a fresh reference NOT registered in payment_links,
  // so the classifier cannot tie it to a checkout → T3.
  console.log(`  T3 deposit $400 (ahorro, no ingreso): ${t3}`);

  console.log("Done. Hit POST /api/history/sync in the app to reclassify.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
