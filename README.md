# CLARO — prueba de ingresos portable para la economía informal

Tu historial de cobros es tu prueba de ingresos. Un trabajador informal/freelance cobra por un link (el pagador paga en moneda local, llega USDC onchain en Solana devnet) y el historial acumulado se convierte en un informe de hechos derivados que cualquier evaluador — inmobiliaria, prestamista, empleador — verifica contra la blockchain, sin confiar en nosotros.

**No es lending ni un score: somos la prueba, no el juez.**

De cobrar en negro → a cobrar en CLARO.

## Documentación

- `AGENTS.md` — contrato de trabajo (reglas obligatorias)
- `PROJECT_STATE.md` — estado compacto y próxima acción
- `docs/04_RESEARCH_GATE.md` — gate aprobado CONSTRUIR (03/10/2026)
- `docs/CANDIDATE_C_proof-of-income.md` — dossier completo de investigación
- `sdd/changes/claro/` — change SDD activo (proposal → spec → design → tasks → apply → verify)
- `harness/SDD_PLAYBOOK.md` — proceso SDD del proyecto

## Restricciones duras

Devnet solamente · cero PII onchain · no lending · no token · no score opaco · nada público por defecto · cero jerga crypto en UI.

## Desarrollo

La app vive en `app/` (Next.js 16 + React 19 + Tailwind 4 + `@solana/kit` 8).

```bash
cd app
cp .env.local.example .env.local   # completar tras correr el setup
npm install
npx tsx scripts/setup_devnet.ts    # crea mint + payer pool en devnet, escribe .env.local
npm run dev                        # http://localhost:3000
```

Verificación: `npm test` (vitest) · `npx tsc --noEmit` · `npx eslint src tests` · `npm run build`.
