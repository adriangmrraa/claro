# Arquitectura — claro

> 03/10/2026 · Fuente canónica y decisiones completas: `sdd/changes/claro/design.md`.

**Una app Next.js 15** (App Router + TS + Tailwind + shadcn) sirve los tres roles (trabajador / pagador / evaluador). Sin programa custom onchain.

```
[Worker UI]  registro → keypair client-side (no-custodial, demo-grade)
             dashboard clasificado T1/T2/T3 · link de cobro · generar informe (firma memo)
[Payer UI]   /pagar/<slug> checkout fiat fake → API mint/transfiere USDC-test devnet + reference
[Verifier UI]/verificar/<slug> hechos derivados + badges tier + "verificar onchain" (hash vs memo + txs reales)

Servidor: API routes (session/links/checkout/sync/report) · lib clasificador pura ·
          SQLite (users, payment_links, reports, tx_cache) · signers demo en .env.local (mint auth + payer pool)
Chain:    SPL transferChecked con reference → historial público del trabajador ·
          Memo tx "CLARO-RPT:<sha256>" = anclaje del informe firmado por el trabajador
```

Trust boundaries: la key del trabajador jamás sale del cliente; la plataforma solo custodia keys de DEMO (mint authority + payer pool — declarado, nunca fondos reales); onchain lleva solo montos/referencias/timestamps/hash — cero PII.
