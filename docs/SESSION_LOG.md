# Bitácora de sesiones (append-only)

Plantilla: fecha | meta | máquina y acceso real | archivos revisados | tareas ejecutadas | pruebas y resultado | decisiones/permiso | bloqueos | siguiente acción y responsable | Engram topic_key (si hubo).

## Sesión 1 — 03/10/2026

- **Meta:** retomar Candidato C (CLARO) en repo dedicado — bootstrap del proyecto + Research Gate + arranque SDD en modo automático.
- **Máquina y acceso real:** LOCAL_USER, Windows + Git Bash; lectura/escritura verificadas en `PROYECTO C/`. Repo remoto: `github.com/adriangmrraa/claro` (creado por el usuario).
- **Archivos revisados (repo hermano, solo lectura):** `AGENTS.md`, `PROJECT_STATE.md`, `docs/CANDIDATE_C_proof-of-income.md` (310 líneas, completo), `docs/DECISIONS.md`, `docs/SESSION_LOG.md` (sesiones 1-22), `harness/SDD_PLAYBOOK.md`, `docs/04_RESEARCH_GATE.md` (gate de O), `docs/08_VALIDATION.md`, `docs/05_PRODUCT_SPEC.md`, `docs/01_IDEATION.md`, `.agents/skills/formosa-sdd-{research-gate,propose}/SKILL.md`, `sdd/templates/*`.
- **Tareas ejecutadas:** (1) carga de contexto completa del dossier CLARO; (2) Engram MCP verificado OPERATIVO (memoria #4651: usuario ya había decidido retomar C); (3) `git init` en `PROYECTO C/` + scaffold copiado (AGENTS/CLAUDE/copilot-instructions, `harness/`, `sdd/templates/`, `.agents/skills/`, docs de research: dossier C, SOURCES, 02_MARKET_RESEARCH, 03_COMPETITORS, ENVIRONMENT); (4) Research Gate de CLARO escrito y cerrado CONSTRUIR con excepción documentada (entrevistas pendientes); (5) `DECISIONS.md`, `PROJECT_STATE.md`, `01_IDEATION.md` creados; (6) remoto `origin` → `adriangmrraa/claro`.
- **Pruebas y resultado:** `git init` OK; scaffold verificado en `git status`. Ninguna prueba técnica — fase documental.
- **Decisiones/permiso:** usuario aprobó gate CONSTRUIR + modo automático + repo separado (no tocar `demo/` ni el hermano) + remoto GitHub. Excepción registrada: build sin entrevistas de validación completadas.
- **Bloqueos:** ninguno.
- **Continuación (misma sesión, modo automático):** fases documentales SDD completas — `sdd/changes/claro/spec.md` (R-01..R-09, CA-1..CA-14, INV-1..INV-6), `design.md` (9/9 decisiones: sin programa custom, @solana/kit 8 tx v1, reference-as-account Solana Pay, memo-anchor firmado por trabajador, node:sqlite, payer pool ×5, T2 diferido, tiempo honesto), `tasks.md` (S1..S7 verticales) + `test-plan.md`; `docs/05`, `06`, `07` escritos; commit `3c459e5` pusheado a `adriangmrraa/claro` (rebase sobre LICENSE inicial).
- **Siguiente acción:** APPLY — S1 scaffold.
- **Engram topic_key:** `sdd/claro/*`, `decision/claro-gate-build`.

## Sesión 1 (cont.) — APPLY S1 — 03/10/2026

- **Meta:** S1 — scaffold Next.js + deps + schema SQLite + lib skeleton.
- **Tareas ejecutadas:** (1) `create-next-app` en `app/` (Next 16.3.8, React 19.2.8, TS, Tailwind 4, Turbopack); (2) deps instaladas — fix ERESOLVE subiendo `@types/node` a ^22 (vitest 5 lo exige); shadcn init (button + utils); (3) `lib/`: env, db (4 tablas), auth (cookie HMAC), solana (kit 8: sendUsdcPayment con reference+memo, inspectPayment para verificación), classify (3 tiers puro), report (canonical JSON + sha256); (4) vitest config + 14 tests unitarios; (5) docs Next 16 consultadas (params Promise, cookies async, RouteContext) por regla AGENTS de la app.
- **Pruebas y resultado REAL:** `vitest run` **14/14 ✓** · `tsc --noEmit` ✓ (tras typegen + target ES2022) · `eslint` ✓ · `next build` ✓ (2.9min compile).
- **Decisiones técnicas verificadas en código:** (a) keypair signers de kit NO son TransactionSendingSigner → patrón `signTransactionMessageWithSigners` + `sendAndConfirmTransactionFactory` (único válido server-side); (b) `assertIsTransactionWithBlockhashLifetime` para el narrowing de lifetime; (c) secrets de demo = base58(PKCS8-DER); (d) worker keypair NUNCA server-side (spec S3/CA-1) — encrypt/decrypt descartado como dead code.
- **ADR registrado:** better-sqlite3 (prebuild OK) reemplaza `node:sqlite` del design (flag experimental en Node 22) → DECISIONS.md.
- **Bloqueos:** ninguno.
- **Siguiente acción:** S2 — setup_devnet.ts contra devnet real.
- **Engram topic_key:** `sdd/claro/apply`.

## Sesión 1 (cont. 2) — APPLY S2→S7 — 03/10/2026

- **Meta:** completar los slices restantes del change claro en modo automático.
- **Tareas ejecutadas:** (S2) `scripts/setup_devnet.ts` — mint CLARO-TEST-USDC 6dec + payer pool ×5; refactor a UN solo airdrop (autoridad fondea payers por transfers, crea ATAs y mintea USDC); retries configurables `AIRDROP_MAX_ATTEMPTS/AIRDROP_WAIT_S`. (S3) `POST /api/session` cookie HMAC httpOnly; `/registro` con keygen client-side (`generateKeyPairSigner(true)` + seed 32B), backup/import base58, QR; `/app` protegido; landing. (S4) `lib/links.ts` + `POST /api/links` (reference única Solana Pay); `/pagar/[slug]` checkout público simulado; `POST /api/checkout/pay` con payer pool server-side y errores limpios (`pool-missing` CA-13). (S5) `POST /api/history/sync` incremental (getSignaturesForAddress → 1 fetch/tx → match reference local → classify → tx_cache); dashboard con totales ingreso/ahorro + badges T1/T3. (S6) `lib/reports.ts` canonical facts + sha256; `POST /api/reports`; ancla `CLARO-RPT:v1:<hash>` en memo FIRMADA POR EL TRABAJADOR (client `lib/anchor.ts`, fee grant `api/reports/anchor-fee`); revocación; `/verificar/[slug]` público con checks onchain live. (S7) `scripts/seed_history.ts` (8 cobros de 5 pagadores + 1 depósito T3) + runbook de 7 beats en README.
- **Fixes técnicos:** `generateKeyPairSigner(true)` positional (extractable); `createKeyPairSignerFromPrivateKeyBytes` necesita seed crudo 32B no PKCS8-DER (extraído vía índices DER); classify: auto-depósito sin referencia de link = T3 ahorro (no ciclo excluido — ciclo solo si paga SU link); `buttonVariants` patrón Base UI (Button nuevo sin asChild); `isExpired` helper server-side (Date.now impuro en render); `useRouter` vs window.location; vitest testTimeout 60s (WebCrypto lento).
- **Pruebas y resultado REAL:** vitest **22/22 ✓** · `tsc --noEmit` ✓ · `eslint` ✓ · `next build` ✓ (18 rutas). Smoke local: link creado (slug+reference), `/pagar` 200, checkout → `{"code":"pool-missing"}` limpio.
- **Bloqueos:** **faucet devnet público 429 global** — sin SOL real: S2 setup NO completado, checkout real NO verificado, seed NO corrido. Bypass documentado (faucet.solana.com captcha → mint authority → re-run).
- **Commits:** `4d33e75` (S1), `48dbd8f` (S3), `d71177a` (S4+S5+S6), `6eda814` (S7) — todos pusheados a `adriangmrraa/claro` main.
- **Siguiente acción:** conseguir SOL devnet → setup_devnet.ts → E2E real → VERIFY + ARCHIVE.
- **Engram topic_key:** `sdd/claro/apply`.

## Sesión 1 (cont. 3) — E2E real en surfpool + fix confirmación — 03/10/2026

- **Meta:** verificar el loop completo con txs reales tras el bloqueo del faucet devnet.
- **Contexto:** faucet devnet 429 persistente → Surfpool instalado en WSL (`~/.local/bin/surfpool`) como simnet local con fork de devnet (RPC `localhost:8899`, WS `8900`, daemon `--ci --daemon --host 0.0.0.0` — alcanzable desde Windows).
- **Debug real (causa raíz por capas):** (1) kit `sendAndConfirm` WS crasheaba parseando errores de surfnet sin campo `data` (`Cannot destructure 'err'`); (2) `sendTransaction` HTTP en surfnet modo `--offline` acepta pero nunca procesa → `InvalidProgramForExecution` (programa Memo no existe en genesis offline); (3) en modo fork, el `sendTransaction` falla intermitente con `Failed to fetch accounts from remote` — WSL tiene conectividad flaky a devnet; (4) la simulación de la tx SIEMPRE pasó limpia (err:null) — la construcción es correcta.
- **Fix:** `sendAndConfirmHttp` en `lib/solana.ts` — `sendTransaction` HTTP con 8 reintentos (idempotente por firma) + polling `getSignatureStatuses`; mismo patrón en `anchor.ts` (cliente).
- **E2E VERIFICADO REAL (surfpool fork devnet):** `scripts/e2e_localnet.ts` — los 7 beats completos: sesión+cookie, wallet solo-pubkey, link con reference, checkout público, **2 pagos USDC reales confirmados onchain de payers distintos** (`27nHe2TNGk…`, `MLTP2Ea3z…`), sync clasificando 2 txs, informe con hash `b8404a0c…`, **ancla memo firmada por el trabajador onchain** (`5rfwuShD…`), página `/verificar` con todos los checks. Commit `027aabf`.
- **Nota honesta:** las txs verificadas son REALES pero en surfnet local (fork de devnet), NO en devnet público — explorer público no las muestra. Falta: SOL devnet real → mismo setup + e2e contra `api.devnet.solana.com`.
- **Siguiente acción:** captcha faucet.solana.com para mint authority → `setup_devnet.ts` (apuntando a devnet) → `e2e_localnet.ts` con `E2E_BASE_URL` + RPC devnet → VERIFY + ARCHIVE.

## Sesión 2 — E2E REAL EN DEVNET — 03/10/2026

- **Desbloqueo:** usuario fondeó manualmente 5 SOL devnet a la autoridad `EHTi9z86JAdxi6dCrvydXzRTUkaXEgphshZkTCESWbtf` (faucet RPC globalmente 429 — el setup ahora acepta `CLARO_MINT_AUTHORITY_SECRET` pre-fondeado, commit `e69a60f`).
- **Setup devnet real:** mint CLARO-TEST-USDC `F213GtRA4bZDAHY7bpDYyhtKj67ynV6UWRLfkyHgXG4C` (6 dec, supply 50k), creado en tx `517phmGuhG3yb47AZ4hZAxNLa2tARMznCDAvRDDPKeiMo6zdAoQzPNEvwVw9nXmJfrNQLPVv8tG4VbjmarA4Hyr2`; 5 payers con 10k USDC c/u (txs públicas).
- **E2E COMPLETO EN DEVNET REAL** (`e2e_localnet.ts` contra api.devnet.solana.com):
  - worker `BEmpqUDV3qXaPhqxYBR9EAW3LspQn5tZHVwmAQusTfRx`, link `/pagar/-xhFKZY4nkQ`
  - pago 1: `CKJAsqegcZnGEEtiecNYTndeYtyrEj8ftF1RhinuZc33i7qa4f6565KZnCfNKMjF69UrNRNrK1kQPMThNAL15eC` — memo onchain `CLARO:PAY:-xhFKZY4nkQ`, err:null
  - pago 2: `21wH7RGe9tiyLEPui4u9gTxvfR17h62XcYcxuXHkSWMai1ERLFg348v2b3fp3EGojNKRZCyYm9hgdcCsry19Vi9Q`
  - informe `/verificar/A3LbSdNCJmI` hash `69ca860f…`
  - ancla firmada por el trabajador: `54pAZXu66KXpWwKTA5pQrnfy4xi71qv9pdDnjHy66axU9Lr5ZSvRUe9uw6Tc96jMxRoA71Ji3etwCpbpZLCTEoi3`
  - verificación pública OK — TODAS las txs son visibles en explorer.solana.com/?cluster=devnet
- **Pendiente:** verificar presencia de página pública de perfil (pedido del usuario), VERIFY + ARCHIVE final.

## Sesión 3 — Worker demo sembrado + pulido UX/UI — 03/10/2026

- **Worker demo (devnet real):** `demo@claro.lat` → `7N2sfV6XyxY5fvp2teBgwdMrK6nRQ7ixssPaTxrPbcx2`. Script `scripts/seed_demo_worker.ts` (2 fases: create → --finish). Credenciales en `app/data/demo_worker.json` (gitignored). Login en demo: email + "Ya tengo una clave de acceso" (import).
- **Seed onchain real:** 8 cobros USDC de 5 pagadores distintos ($180/95/220/150/75/310/140/205) + depósito T3 $400 sin referencia → clasifica "ahorro, no ingreso". Link `/pagar/ALDjg0Iaz-4`. Informe anclado por el worker: `/verificar/bK37sXPYfUI` (ancla `5BCXtf4Lbzkb6qAXhhq9amA71ra2hBtNtKzgzmBeKFPNcJ8HyFPvyaGpAJgj9y6ciLPRbeW7FFhXPPLzMKHGnxg5`).
- **UX/UI:** tema esmeralda+papel en globals.css, Space Grotesk (font-heading), `components/brand.tsx` (LogoMark+Wordmark), landing rediseñada (hero gradiente, 3 pasos, link al mint en explorer), wordmark en registro/dashboard/cobrar/informes/verificar/pagar, back-nav consistente.
- **Verificación:** tsc 0 · eslint 0 · `next build` 18 rutas OK · páginas clave 200 con links explorer reales.
