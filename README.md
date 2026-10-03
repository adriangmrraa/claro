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

## Runbook de demo (7 beats)

Precondición: `.env.local` generado por `setup_devnet.ts` (faucet devnet puede tardar — ver nota abajo).

1. **Registro** — `/registro`: email → cuenta creada, clave descargable (cero jerga, secret solo en el dispositivo).
2. **Link de cobro** — `/app` → "Crear link de cobro" → QR + URL `/pagar/<slug>`.
3. **Checkout del pagador** — abrir el link (sin cuenta): checkout tipo fiat → "Pagar" → USDC real llega a la cuenta del trabajador en devnet.
4. **Historial clasificado** — `/app` → "Actualizar historial": el cobro aparece como *Ingreso verificado* (T1); el depósito sin origen como *Ahorro — no es ingreso* (T3).
5. **Seed de historial** — `npx tsx scripts/seed_history.ts <workerAddress> [linkSlug]` siembra 8 cobros de 5 pagadores + 1 depósito T3. (Nota honesta: blockTime es real — los timestamps muestran cuándo se sembró; no se puede backdatear en devnet.)
6. **Informe** — `/app/informe/nuevo`: período + vigencia + evidencia → hash anclado onchain **firmado por el trabajador**.
7. **Verificación pública** — `/verificar/<slug>` (sin cuenta): hechos + checks onchain en vivo (hash íntegro, ancla firmada, evidencias con link a explorer). Revocar en `/app/informes` mata el acceso — demo de privacidad.

**Si el faucet devnet está seco** (429 en airdrops): ir a https://faucet.solana.com, pegar la dirección del mint authority que imprime el script y completar el captcha — luego re-correr `setup_devnet.ts`.
