# Estado del proyecto — CLARO | fuente compartida resumida

- Estado: **RESEARCH GATE CERRADO — CONSTRUIR (03/10/2026)** — change `claro` creado, fase **PROPOSE** completada; próxima fase: SPEC.
- Proyecto: **CLARO** — prueba de ingresos portable para la economía informal: historial de cobros USDC onchain → informe verificable de hechos derivados para evaluadores (inmobiliarias, prestamistas, empleadores). NO lending, NO score — la prueba, no el juez.
- Repo: **propio y separado** del proyecto hermano `agentic-dni` (`../Hackaton Solana`, archivado — no tocar). Dossier, fuentes y research competitivo copiados como referencia a `docs/`.
- Participante/equipo: equipo 2-3 personas (sin PII registrada). El fundador es el ICP (E-001).
- Fase SDD actual: **PROPOSE done** → `sdd/changes/claro/proposal.md` + `STATUS.md`. Siguiente: SPEC (`spec.md` requisitos observables + criterios de aceptación).
- Research Gate: `docs/04_RESEARCH_GATE.md` — **CONSTRUIR aprobado por usuario 03/10/2026**, modo automático autorizado. Excepción registrada: entrevistas de validación pendientes → claims de demanda quedan [SIN VERIFICAR]; kit de entrevistas listo en `docs/08_VALIDATION.md`.
- Decisiones de diseño ya cerradas (dossier): modelo 3 tiers de evidencia (T1 pago directo / T2 attestation+depósito / T3 ahorro); `reference` de Solana Pay distingue checkout-pago vs auto-fondeo; wallet embebida no-custodial; checkout fiat→USDC simulado en devnet (sin ramp real); informe = hechos derivados con scope+vencimiento+revocación; cero jerga crypto UI; mobile-first español; stack sugerido Next.js+Tailwind+shadcn.
- Entorno real: toolchain completo en la máquina (ver `docs/ENVIRONMENT.md` heredado): Windows + Git Bash; WSL Ubuntu con solana-cli 4.3.0 + anchor 1.2.0 + node 22 (comando: `wsl -d Ubuntu -- bash -lc "<cmd>"`); Node 22 + npm/pnpm nativos en Windows.
- Engram: **MCP OPERATIVO en esta sesión** (memoria #4651 recuperada — decisión previa de retomar C). Fallback Markdown sigue siendo fuente de verdad.
- Restricciones duras: devnet only; cero PII onchain; no lending/token/score opaco/attestations auto-firmables; nada público por defecto.
- Próxima acción: fase SPEC — `sdd/changes/claro/spec.md` (requisitos observables MUST, criterios CA-*, invariantes INV-*, OUT explícito).
- Bloqueos: ninguno activo.
- Última actualización: sesión 1 — 03/10/2026.

Al cerrar cada sesión: registrar log y resultado real; NO inferir cumplimiento por existencia de archivos.
