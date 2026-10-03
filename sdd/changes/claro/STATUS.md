# Change claro — tracking

Estado: **IMPLEMENTANDO** (S1 scaffold ✓ — sigue S2 setup devnet)
Fecha: 03/10/2026 · Owner alias: equipo 2-3 (sin PII) · Research Gate: `docs/04_RESEARCH_GATE.md` (CONSTRUIR, usuario, excepción de validación registrada) · Próximo slice: S2 setup devnet · Bloqueos: ninguno · Engram keys: `sdd/claro/*`, `decision/claro-*`

## Fases

- [x] Research Gate — CONSTRUIR (03/10/2026, usuario)
- [x] Proposal — aprobada con el gate (03/10/2026)
- [x] Spec — R-01..R-09, CA-1..CA-14, INV-1..INV-6 (modo automático)
- [x] Design — 9/9 decisiones resueltas (sin programa custom; kit 8; memo-anchor; node:sqlite)
- [x] Tasks + test-plan — 7 slices S1..S7
- [~] Apply (slices) — S1 ✓ verde (build+tests); S2..S7 pendientes
- [ ] Verify
- [ ] Archive

## Apply — evidencia por slice

- **S1 ✓ (03/10/2026):** Next.js 16.3.8 + React 19 + Tailwind 4 + shadcn en `app/`; deps solana (`@solana/kit` 8.4.0, `@solana-program/{token,memo,system}`, bs58, qrcode, zod, better-sqlite3). Lib: `env/db/solana/classify/report/auth`. Schema SQLite 4 tablas (users, payment_links, reports, tx_cache). **ADR:** better-sqlite3 reemplaza node:sqlite (prebuild OK vs flag experimental) — registrado en DECISIONS. **Criterio verificado:** `vitest run` 14/14 ✓ · `tsc --noEmit` ✓ · `eslint` ✓ · `next build` ✓. API kit 8: signers keypair no pueden enviar (no TransactionSendingSigner) → patrón sign+sendAndConfirm verificado en código.
