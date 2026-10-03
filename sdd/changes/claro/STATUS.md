# Change claro — tracking

Estado: **IMPLEMENTANDO — código completo S1+S3–S7; falta verificación onchain real**
Fecha: 03/10/2026 · Owner alias: equipo 2-3 (sin PII) · Research Gate: `docs/04_RESEARCH_GATE.md` (CONSTRUIR, usuario, excepción de validación registrada) · Próximo paso: desbloquear SOL devnet → setup_devnet.ts → E2E real · **Bloqueo: faucet público devnet 429 global** · Engram keys: `sdd/claro/*`, `decision/claro-*`

## Fases

- [x] Research Gate — CONSTRUIR (03/10/2026, usuario)
- [x] Proposal — aprobada con el gate (03/10/2026)
- [x] Spec — R-01..R-09, CA-1..CA-14, INV-1..INV-6 (modo automático)
- [x] Design — 9/9 decisiones resueltas (sin programa custom; kit 8; memo-anchor; node:sqlite→better-sqlite3 por ADR)
- [x] Tasks + test-plan — 7 slices S1..S7
- [~] Apply (slices) — S1 ✓ · S2 código listo / devnet PENDIENTE (faucet 429) · S3–S7 código ✓ verificados offchain
- [ ] Verify — requiere devnet real para CAs onchain
- [ ] Archive

## Apply — evidencia por slice

- **S1 ✓ (03/10/2026):** Next.js 16.3.8 + React 19 + Tailwind 4 + shadcn en `app/`; deps solana (`@solana/kit` 8.4.0, `@solana-program/{token,memo,system}`, bs58, qrcode, zod, better-sqlite3). Lib: `env/db/solana/classify/report/auth`. Schema SQLite 4 tablas (users, payment_links, reports, tx_cache). **ADR:** better-sqlite3 reemplaza node:sqlite (prebuild OK vs flag experimental) — registrado en DECISIONS. **Criterio verificado:** `vitest run` 14/14 ✓ · `tsc --noEmit` ✓ · `eslint` ✓ · `next build` ✓. API kit 8: signers keypair no pueden enviar (no TransactionSendingSigner) → patrón sign+sendAndConfirm verificado en código.
- **S2 código listo / devnet PENDIENTE (03/10/2026):** `scripts/setup_devnet.ts` — mint CLARO-TEST-USDC + payer pool ×5; refactor a UN airdrop (autoridad fondea payers). **Bloqueado:** faucet público 429 global; requiere captcha en faucet.solana.com o faucet recuperado. Sin verificación explorer todavía.
- **S3 ✓ código (03/10/2026):** `POST /api/session` cookie HMAC; `/registro` keygen client-side (secret nunca al servidor, backup/import b58, QR); `/app` protegido. Test wallet roundtrip ✓ (CA-1).
- **S4 ✓ código (03/10/2026):** `POST /api/links` con reference única; `/pagar/[slug]` público; `POST /api/checkout/pay` payer pool. Smoke local: link creado, página 200, error `pool-missing` limpio (CA-13). Pago real onchain pendiente de devnet.
- **S5 ✓ código (03/10/2026):** `POST /api/history/sync` incremental (1 fetch/tx, blockTime real); dashboard ingreso vs ahorro + badges por tier. Clasificador puro 3 tiers testeado ✓.
- **S6 ✓ código (03/10/2026):** canonical facts + sha256; ancla `CLARO-RPT:v1:<hash>` memo **firmada por trabajador** + fee grant; revocación + expiración; `/verificar/[slug]` público con checks onchain.
- **S7 ✓ código (03/10/2026):** `scripts/seed_history.ts` (8 cobros × 5 pagadores + 1 depósito T3); runbook 7 beats en README. Nota honesta: blockTime real, no backdateable.
- **Verificación global:** vitest 22/22 · tsc ✓ · eslint ✓ · next build 18 rutas ✓ · commits `4d33e75`→`6eda814` en main.
