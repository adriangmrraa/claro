# Tasks (vertical slices) — claro

> Orden estricto por dependencia. Cada slice entrega valor end-to-end verificable. Nunca marcar [x] sin comprobación real (comando/test corrido o tx en explorer).
> Estado de avance se registra acá + `STATUS.md` + `PROJECT_STATE.md`.

- [ ] **S1 — Scaffold + fundaciones.** `npm create next-app` (TS + Tailwind + App Router) en la raíz del repo + deps (`@solana/kit`, `@solana-program/*` token/memo, `zod`, `qrcode`, `bs58`, `vitest`, `shadcn/ui` init) + schema SQLite (`node:sqlite`, `data/claro.db`) + estructura `lib/` (db, solana, classify, report, auth) + `.env.local.example` + README dev. **Criterio:** `npm run build` y `npm run dev` levantan; `node --experimental-sqlite` (o flag vigente en Node 22) crea las 4 tablas. **Tests:** smoke de boot.

- [ ] **S2 — Setup devnet + lib Solana.** `scripts/setup_devnet.ts`: crea mint `CLARO-TEST-USDC` (6 dec), payer pool de 5 keypairs, airdrop SOL, mintea USDC a payers → escribe addresses en `.env.local` + `data/devnet.json` (gitignored). `lib/solana.ts`: client kit devnet, `transferChecked` con reference account-meta, memo ix, parse de tx (reference en `accountKeys`), helpers ATA. **Criterio:** script corre contra devnet real → mint + 5 payers fondeados visibles en explorer; unit test de construcción de ix con reference. **Dep:** S1.

- [ ] **S3 — Auth demo + registro + wallet embebida.** `POST /api/session` (email→cookie httpOnly), `/registro` (email → `generateKeyPairSigner()` en cliente → localStorage → "tu cuenta" + QR + respaldo/importar base58), persistencia `users`. **Criterio (CA-1):** signup completo muestra address funcional, cero jerga, y el secret jamás toca el servidor (revisión de red). **Dep:** S1.

- [ ] **S4 — Link de cobro + checkout pagador (loop de plata).** `/app/cobrar` crea link (reference + monto opcional + descripción) → `/pagar/[slug]` público (checkout fiat fake) → `POST /api/checkout/pay` (payer pool firma `transferChecked` + reference → USDC devnet al ATA del trabajador) → pantalla "recibido". Manejo de error limpio (CA-13). **Criterio (CA-2, CA-3, CA-14):** 2 pagadores distintos pagan → 2 txs con references distintas en explorer; segundo pago por mismo link permitido. **Tests:** unit ix-building; integración devnet con asserts onchain. **Dep:** S2, S3.

- [ ] **S5 — Clasificador 3 tiers + dashboard.** `lib/classify.ts` pura (T1 reference-match / T3 ahorro / excluido self+ciclos / calidad de pagador con `getSignaturesForAddress`) + `vitest` con fixtures + `POST /api/history/sync` (incremental, cachea en `tx_cache`) + `/app` dashboard con badges por tier + totales. **Criterio (CA-4):** depósito sin referencia aparece "ahorro, no ingreso" y NO suma al total de ingresos. **Dep:** S4 (datos reales).

- [ ] **S6 — Informe + anclaje + página de verificación.** Canonical facts JSON + sha256 + scope picker (`/app/informe/nuevo`) → memo tx `CLARO-RPT:v1:<hash>` firmada en cliente → `reports` row + `/app/informes` (lista, estado, revocar) + `/verificar/[slug]` pública (hechos + badges + confianza + "verificar onchain": fetch anchor, recomputa hash, lista evidencias con links explorer; estados vencido/revocado). **Criterio (CA-5..CA-8, CA-11, CA-12):** link+hash onchain; scope respetado; revocación mata el acceso; datos alterados → verificación FALLA visible. **Dep:** S5.

- [ ] **S7 — Seed + pulido de demo.** `scripts/seed_history.ts` (≥3 pagadores × cobros variados + ≥1 depósito T3) + estados vacíos con guía + copy final español + check mobile + runbook de demo en README (7 beats, URLs, qué mirar). **Criterio:** corrida E2E de CA-1..CA-7 contra devnet con historial creíble; tiempo honesto documentado. **Dep:** S6.

## Notas de ejecución

- **Orden:** S1 → S2 → S3 → S4 → S5 → S6 → S7. S4 es el primer slice de valor real (loop de plata); S6 completa el producto.
- **Responsable:** agente (build automático autorizado) + revisión humana por slice si el usuario lo pide.
- **Pruebas:** ver `test-plan.md` — unit en cada slice de lib, integración devnet en S2/S4/S6/S7, E2E manual al final.
- **Regla:** marcar `[x]` solo con evidencia (suite verde, signature devnet, o screenshot de flujo).
