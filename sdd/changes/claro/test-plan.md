# Plan de pruebas — claro

> Estado: PLANEADO. RED → GREEN → REFACTOR en lib pura; integración devnet con asserts onchain; E2E manual con runbook. Evidencia real adjunta (signatures, suite output) sin secretos.

## Unit (vitest) — lib pura

| Sujeto | Casos |
|---|---|
| `lib/classify.ts` | T1 por reference-match · T3 depósito sin referencia · self-transfer excluido · ciclo A→B→A excluido/flag · pagador establecido (≥10 txs y ≥7 días) vs baja confianza · pagador desconocido primer pago |
| `lib/report.ts` (canonical) | sha256 de vectores fijos (canonización determinista: key-sort, decimales string) · scope-filter: totals-only no emite txs/pagadores/montos individuales (CA-11) · facts derivados correctos de un historial fixture |
| `lib/links.ts` | estado: vigente / vencido por `expires_at` / revocado por `revoked_at` / slug inexistente |
| ix-building `lib/solana.ts` | transferChecked incluye la reference como account-meta readonly no-signer |

## Integración (scripts devnet — asserts onchain)

| Script | Assert |
|---|---|
| `setup_devnet.ts` | mint existe (6 dec) · 5 payers con balance USDC + SOL |
| `scripts/itest_checkout.ts` | pago real → `getTransaction` muestra: transfer al ATA worker, monto exacto, reference en `accountKeys` |
| `scripts/itest_anchor.ts` | memo `CLARO-RPT:v1:<hash>` legible onchain con signer = worker |
| `scripts/itest_classify.ts` | historial real sembrado → clasificación esperada por sig |

## E2E manual — runbook beats (devnet real)

| Beat | CA | Cómo verificar |
|---|---|---|
| Registro→cuenta | CA-1 | address recibe USDC devnet; UI sin jerga; secret nunca en requests |
| Cobro por link | CA-2 | tx con reference + badge T1 en dashboard |
| 2do pagador | CA-3 | N=2 pagadores distintos |
| Depósito propio | CA-4 | badge "ahorro", excluido del ingreso |
| Informe+anclaje | CA-5 | link generado + memo-hash en explorer |
| Verificación | CA-6 | página pública navegable, botón muestra txs reales, hash reproduce |
| Revocación | CA-7 | link revocado → "revocado" al recargar |

## Edge cases

CA-8 vencido · CA-9 wallet fresca → baja confianza · CA-10 self/ciclo · CA-11 scope totals-only · CA-12 datos alterados → hash mismatch visible · CA-13 checkout falla limpio · CA-14 pago duplicado mismo link.

## Smoke / higiene

`npm run build` verde · `npx tsc --noEmit` verde · `npx eslint` sin errores nuevos · scan de secretos (keypairs solo en `data/`+`.env.local` gitignored) · `git ls-files` sin keys.
