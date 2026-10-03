import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { address } from "@solana/kit";
import { getSessionUser } from "@/lib/auth";
import { loadMintAuthority, sendSolTransfer, solBalanceLamports } from "@/lib/solana";

const bodySchema = z.object({ worker: z.string().min(32).max(64) });
const GRANT = 10_000_000n; // 0.01 SOL — plenty for one memo tx
const MIN_BALANCE = 5_000_000n;

// Fee grant: worker accounts hold no SOL, but anchors are worker-signed txs
// (spec). The demo authority tops the worker up just enough to pay the fee.
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user?.wallet_pubkey) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.worker !== user.wallet_pubkey) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const worker = address(parsed.data.worker);
  const balance = await solBalanceLamports(worker);
  if (balance >= MIN_BALANCE) {
    return NextResponse.json({ granted: false, balanceLamports: balance.toString() });
  }
  try {
    const authority = await loadMintAuthority();
    const sig = await sendSolTransfer({ from: authority, to: worker, amountLamports: GRANT });
    return NextResponse.json({ granted: true, signature: sig });
  } catch {
    return NextResponse.json(
      { error: "No se pudo preparar el anclaje — servicio no configurado" },
      { status: 503 }
    );
  }
}
