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
