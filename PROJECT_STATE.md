# Estado del proyecto — CLARO | fuente compartida resumida

- Estado: **APPLY — S1, S3–S7 código completo y pusheado (03/10/2026)** — 18 rutas (9 páginas + 11 API): registro + wallet client-side, links de cobro, checkout público, sync de historial, clasificador 3 tiers, informes con ancla onchain firmada por el trabajador, verificación pública, seed de demo. Verificado: vitest 22/22, tsc+eslint+build limpios. Remoto: `github.com/adriangmrraa/claro` @ `6eda814`.
- Proyecto: **CLARO** — prueba de ingresos portable para la economía informal: historial de cobros USDC onchain → informe verificable de hechos derivados para evaluadores (inmobiliarias, prestamistas, empleadores). NO lending, NO score — la prueba, no el juez.
- Repo: **propio y separado** del proyecto hermano `agentic-dni` (`../Hackaton Solana`, archivado — no tocar). Dossier, fuentes y research competitivo copiados como referencia a `docs/`.
- Participante/equipo: equipo 2-3 personas (sin PII registrada). El fundador es el ICP (E-001).
- Fase SDD actual: **APPLY** → implementar `sdd/changes/claro/tasks.md` S1→S7 por slices verticales.
- Research Gate: `docs/04_RESEARCH_GATE.md` — **CONSTRUIR aprobado por usuario 03/10/2026**, modo automático autorizado. Excepción registrada: entrevistas de validación pendientes → claims de demanda quedan [SIN VERIFICAR]; kit de entrevistas listo en `docs/08_VALIDATION.md`.
- Decisiones de diseño ya cerradas (dossier): modelo 3 tiers de evidencia (T1 pago directo / T2 attestation+depósito / T3 ahorro); `reference` de Solana Pay distingue checkout-pago vs auto-fondeo; wallet embebida no-custodial; checkout fiat→USDC simulado en devnet (sin ramp real); informe = hechos derivados con scope+vencimiento+revocación; cero jerga crypto UI; mobile-first español; stack sugerido Next.js+Tailwind+shadcn.
- Entorno real: toolchain completo en la máquina (ver `docs/ENVIRONMENT.md` heredado): Windows + Git Bash; WSL Ubuntu con solana-cli 4.3.0 + anchor 1.2.0 + node 22 (comando: `wsl -d Ubuntu -- bash -lc "<cmd>"`); Node 22 + npm/pnpm nativos en Windows.
- Engram: **MCP OPERATIVO en esta sesión** (memoria #4651 recuperada — decisión previa de retomar C). Fallback Markdown sigue siendo fuente de verdad.
- Restricciones duras: devnet only; cero PII onchain; no lending/token/score opaco/attestations auto-firmables; nada público por defecto.
- Próxima acción: **desbloquear devnet SOL** → correr `scripts/setup_devnet.ts` (mint + payer pool) → checkout real → seed_history.ts → E2E → VERIFY + ARCHIVE.
- Bloqueos: **faucet público devnet devuelve 429 global** (probado RPC público + alternativos + API web con captcha). Sin SOL no hay mint/pool ni txs reales. Bypass: captcha en faucet.solana.com para la dirección del mint authority que imprime el script, luego re-correrlo. S2 marcado como código-listo / devnet-pendiente.
- Stack real instalado: Next 16.3.8, React 19.2.8, Tailwind 4, `@solana/kit` 8.4.0, `@solana-program/token` 0.17, `@solana-program/memo` 0.15, better-sqlite3 13 (ADR en DECISIONS — reemplaza node:sqlite del design), vitest 5.
- Última actualización: sesión 1 — 03/10/2026.

Al cerrar cada sesión: registrar log y resultado real; NO inferir cumplimiento por existencia de archivos.
