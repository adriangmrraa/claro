# Decisión Solana — claro

> 03/10/2026 · Detalle completo en `sdd/changes/claro/design.md`.

- **Cluster:** devnet exclusivamente (INV-5). RPC pública `api.devnet.solana.com` para volúmenes demo.
- **Sin programa custom (ADR-1):** la superficie onchain es SPL Token estándar + Memo program + lectura pública. La verificabilidad de CLARO no requiere programa propio — si aparece una necesidad de policy onchain (T2 con slashing, v2) se evalúa Anchor entonces.
- **Token:** mint propio `CLARO-TEST-USDC` (6 dec) creado por `scripts/setup_devnet.ts`; mint authority en backend `.env.local` (gitignored). Payer pool de ~5 keypairs fondeadas para pagadores distintos reales.
- **SDK:** `@solana/kit` 8 (createClient + plugins, tx `version: 1`, `maxSupportedTransactionVersion: 1` en lecturas) + `@solana-program/token`. Cliente browser: mismo kit para keypair embebida + firma del memo de anclaje.
- **Referencia de cobro:** Solana Pay style — `reference` pubkey como account meta readonly extra en `transferChecked` (detectable en `accountKeys`, ignorada por el Token program).
- **Anclaje del informe:** Memo tx `CLARO-RPT:v1:<sha256>` firmada por la wallet del trabajador en el cliente (consentimiento + timestamp + emisor, todo onchain). SAS queda como SHOULD/roadmap.
- **Onchain NO lleva:** email, nombre, descripción del trabajo, PII, historial crudo compartido — solo montos, referencias, timestamps y el hash del informe.
