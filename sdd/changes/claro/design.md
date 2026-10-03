# Diseño técnico — claro

> Estado: **COMPLETO — resuelve las 9 decisiones OPEN de `spec.md`** (fase `design`, modo automático; revisable por el humano en cualquier momento).
> Fecha: 03/10/2026 · Cambio: `claro` · Fuentes: `spec.md` (R-01..R-09, CA-1..CA-14, INV-1..INV-6) · dossier `docs/CANDIDATE_C_proof-of-income.md` §7-8bis · `.agents/skills/solana-dev/` (stack oficial).

## 1. Arquitectura general

**Una sola app Next.js 15 (App Router) + TypeScript** sirve todos los roles. No hay programa custom onchain: la superficie onchain es **SPL Token estándar + Memo program + lectura pública** — Solana es el riel de settlement y la capa de notarización; el producto vive offchain anclado a la chain.

```
Trabajador (browser)                Pagador (browser)              Evaluador (browser)
  │ registro → keypair client         │ checkout fiat fake             │ abre link informe
  │ genera link cobro                 │ "paga" tarjeta                 │ ve hechos + tiers
  │ genera informe → firma memo       ▼                                │ "verificar onchain"
  ▼                              POST /api/checkout/pay                    ▼
┌─────────────────────── Next.js (mismo proceso) ───────────────────────────────┐
│ API routes: session, links, checkout/pay, history/sync, report create/revoke │
│ Clasificador 3 tiers + calidad de pagador (lib pura, testeable)              │
│ SQLite (better-sqlite3): users, payment_links, reports, tx_cache             │
│ Signers server-side (solo demo): mint authority + payer pool (env, gitignored)│
└──────────────────────────────────┬───────────────────────────────────────────┘
                                   │ RPC devnet pública (api.devnet.solana.com)
                                   ▼
   onchain: SPL transfer workerATA con reference · Memo tx "CLARO-RPT:<sha256>" ·
   historial público de la wallet del trabajador (fuente de verdad del informe)
```

## 2. Decisiones tomadas (las 9 OPEN de spec, resueltas)

| # | Decisión | Resolución | Alternativa descartada / por qué |
|---|---|---|---|
| 1 | Wallet embebida | **Keypair generada en el cliente** (`generateKeyPairSigner()` de @solana/kit), `secretKey` guardada en `localStorage` del browser + opción "descargar respaldo" (base58) e "importar respaldo". La key NUNCA viaja al servidor. | Privy/MPC real: exceso para MVP (signup externo + costos). Custodial: viola INV-4. **Documentado demo-grade**: sin encriptación at-rest en MVP → riesgo declarado en README/verification. |
| 2 | USDC de prueba | **Mint propio `CLARO-TEST-USDC` (6 dec)** en devnet, mint authority = keypair del backend en `.env.local` (gitignored). Script `scripts/setup_devnet.ts` lo crea una vez y fondea el payer pool. | Transfer desde faucet único: haría TODOS los pagos del mismo pagador (N=1 — mata la demo). USDC devnet "real" (Circle faucet): no podemos mintear ni controlar pagadores. |
| 3 | Referencia en tx | **Solana Pay style**: el link de cobro genera un `reference = Keypair.generate().publicKey`; el checkout lo añade como **account meta readonly no-signer extra** en la ix `transferChecked` SPL. El programa Token ignora la cuenta extra; la referencia queda en `accountKeys` de la tx → detectable al parsear. | Memo program para referencia: mezcla datos con el pago y ensucia el memo; la reference-as-account es el estándar probado de Solana Pay. |
| 4 | Anclaje del informe | **Memo tx firmada por la wallet del trabajador en el cliente**: `CLARO-RPT:v1:<sha256hex>` del JSON canónico de hechos. Firma del trabajador = consentimiento + timestamp + identidad del anclante, todo onchain. | SAS attestation: SHOULD diferido (más piezas: credential+schema; el memo es suficiente para probar integridad+timestamp+emisor). Cuenta propia: requeriría programa custom (fuera). |
| 5 | T2 (attestation pagador) | **Modelo soportado, flujo FUERA del MVP.** El clasificador y la UI conocen el tier T2 ("ingreso declarado"), pero el flujo de firma del pagador (que requeriría wallet del pagador — contradice "pagador no toca crypto") queda para roadmap. La spec lo permitía como placeholder. | Forzar T2 real ahora: infla scope y rompe la UX del pagador. |
| 6 | Backend / detección de pagos | **Next.js API routes** (mismo proceso). Detección: **sync incremental bajo demanda** — al abrir dashboard/informe, `getSignaturesForAddress(workerATA)` → fetch `getTransaction` parsed de las nuevas → clasificar → cachear en `tx_cache`. El checkout devuelve la signature directamente (confirmación optimista + re-sync). | Servicio separado/indexer propio/websocket: complejidad innecesaria para volúmenes demo (~50-200 txs). |
| 7 | Store | **SQLite via `node:sqlite` (builtin de Node 22)** — `data/claro.db` (gitignored el contenido). Sin dependencia nativa: la máquina no tiene MSVC para compilar `better-sqlite3` y los prebuilds pueden fallar — el builtin lo elimina de raíz. Tablas: `users(id,email,wallet_pubkey,created_at)`, `payment_links(id,slug,owner_pubkey,reference,amount,memo,created_at)`, `reports(id,slug,owner_pubkey,scope_json,facts_json,hash,anchor_sig,created_at,expires_at,revoked_at)`, `tx_cache(sig,owner_pubkey,payer,amount,ts,tier,quality,raw_json)`. | Postgres/servicio: overkill local. Todo-onchain: revocación y scopes no caben onchain sin PII/programa. |
| 8 | Indexación historial | **RPC pública devnet** (`getSignaturesForAddress` + `getTransaction` con `maxSupportedTransactionVersion: 1`, encoding `jsonParsed`). Cache en `tx_cache` para no re-leer. Rate-limits aceptables para volúmenes demo; retry con backoff simple. | Helius/indexer pago: innecesario. `@solana/pay` validation helpers: opcional, la lectura propia ya basta. |
| 9 | Pago duplicado por link (CA-14) | **Permitido y honesto**: cada pago con la reference del link cuenta como cobro T1 del mismo pagador; el link muestra "N cobros recibidos". Un mismo pagador nunca cuenta 2× como "pagador distinto". | Rechazar segundos pagos: rompe el caso real "pagador recurrente" (que es lo BUENO del producto). |

## 3. Modelo de datos del informe (canonical)

```json
{
  "version": "claro-report/1",
  "owner": "<worker pubkey>",
  "period": { "from": "2026-07-03", "to": "2026-10-03" },
  "totals": { "t1_usdc": "1820.00", "t2_usdc": "0", "t3_savings_usdc": "300.00" },
  "payers": { "distinct": 4, "established": 2, "low_confidence": 2 },
  "activity": { "active_days": 12, "first_seen": "2026-07-05", "last_seen": "2026-10-02" },
  "detail": [] // opt-in: txs individuales solo si scope lo permite
}
```

`sha256(JSON.stringify(canonical(facts)))` → `hash` → memo tx `CLARO-RPT:v1:<hash>` firmada por el trabajador → `anchor_sig`. Verificación: recomputar hash de los hechos mostrados y comparar contra el memo onchain + chequear estado del link (vigente/vencido/revocado) server-side.

**Honestidad temporal:** los "meses" del informe derivan de timestamps REALES de las txs. El seed no puede falsificar tiempo — la demo muestra el período real que cubre el historial sembrado (documentado: en devnet el tiempo no se actúa).

## 4. Clasificador 3 tiers (lib pura — corazón testeable)

Para cada SPL transfer **entrante** al ATA del trabajador (mint = USDC-test):

1. Si `accountKeys` contiene una `reference` de algún `payment_links` del owner → **T1** (pagador = owner de la ATA origen).
2. Si la ATA origen pertenece a una wallet declarada del propio usuario o del faucet/plataforma conocida → **excluido** (self-transfer).
3. Si forma ciclo conocido (A→B→A detectable en la ventana) → **excluido** + flag.
4. Attestation T2 matcheada → **T2** (no fluye en MVP).
5. Resto (depósito sin referencia) → **T3 — ahorro**.

**Calidad del pagador** (por cada pagador distinto T1): `getSignaturesForAddress(payer, limit:100)` → `establecido` si (txs ≥ 10 **y** sig más vieja ≥ 7 días); si no → `baja confianza`. Declarado en el informe; heurística documentada como tal.

## 5. Rutas / páginas (subset MVP del dossier §8bis)

| Ruta | Rol | Notas |
|---|---|---|
| `/` | público | landing "cobrá en claro" |
| `/registro` | trabajador | email → keypair client-side → "tu cuenta" + QR |
| `/app` | trabajador | dashboard: historial por tier, totales, CTAs, sync on-load |
| `/app/cobrar` | trabajador | crear link (monto opcional + descripción) → URL `/pagar/<slug>` + QR |
| `/pagar/[slug]` | pagador (público) | checkout fiat fake → POST pay → "recibido" |
| `/app/informe/nuevo` | trabajador | scope picker → facts → firma memo en cliente → link |
| `/app/informes` | trabajador | lista de informes, estado, revocar |
| `/verificar/[slug]` | evaluador (público) | hechos + badges tier + confianza + "verificar onchain" + estado del link |
| `/app/config` | trabajador | respaldo/importar key, fuentes |

**Auth demo-grade (documentado):** `POST /api/session {email}` → user row + cookie httpOnly firmada. Sin password. La wallet se vincula al primer dispositivo que la generó (mismo `wallet_pubkey`).

## 6. Stack y libs

- **Next.js 15 + React 19 + TS + Tailwind 4 + shadcn/ui** (stack del dossier).
- **`@solana/kit` 8** (`createClient().use(signer|solanaDevnetRpc)`, tx `version: 1`) + `@solana-program/token` (mint/ATA/transferChecked) + memo ix para el anclaje — conforme a `solana-dev` skill. Client-side: mismo kit en el browser para generar keypair y firmar el memo.
- **`node:sqlite`** (sync, cero infra, builtin Node 22 — sin toolchain nativo), **`zod`** (validación), **`qrcode`** (QR de cobro/cuenta), **`bs58`** (respaldo de key).
- **Vitest** para la lib pura (clasificador, canonicalización, heurística de pagador).

## 7. Onchain vs offchain (tabla explícita)

| Onchain (devnet) | Offchain (SQLite/server) |
|---|---|
| SPL transfers USDC-test con reference | users, links de cobro (slug↔reference), scopes |
| Memo `CLARO-RPT:<hash>` (firma del trabajador) | facts derivados, hash, anchor_sig, expiry/revocación |
| historial público de wallets (fuente de verdad) | cache de clasificación, UI, sesiones |
| — NUNCA: email, nombre, descripción del trabajo | TODA la PII, descripciones, detalle no-scope |

## 8. Amenazas y mitigaciones

| Amenaza | Mitigación |
|---|---|
| Adivinar slug de informe | `crypto.randomUUID()` 128-bit + sin listado público |
| Alterar hechos del informe | hash canónico anclado por firma del trabajador → mismatch visible |
| Link reenviado a terceros | vencimiento + revocación (aceptado residual: reenvío mientras vigente) |
| PII en tx (memo/descripción del link) | descripción del cobro NUNCA va onchain; memo solo lleva hash |
| Key del trabajador robada | client-side only + respaldo exportable; demo-grade documentado |
| Falsificación de historial | costo real (terceros moviendo USDC) + calidad de pagador declarada |
| Replay de checkout | cada link tiene reference única; pagos duplicados cuentan honestamente |
| RPC rate-limit | cache + backoff + sync incremental |

## 9. Pruebas (mapeo a test-plan)

- **Unit (vitest):** clasificador (T1/T3/excluido/ciclo, calidad de pagador con fixtures de sigs), canonicalización+sha256 (vectores fijos), scope-filtering (CA-11), estado de links (vencido/revocado).
- **Integración devnet (scripts):** `setup_devnet` (mint + payer pool), checkout real → tx con reference parseada, anchor memo → lectura del memo, seed.
- **E2E manual:** runbook de los 7 beats (CA-1..CA-7) con URLs y checks observables; edge cases CA-8..CA-14 via scripts/unit según aplique.
- **Sin programa custom → sin tests Anchor/Surfpool** (decisión: no aplica; la superficie es SPL estándar).

## 10. ADR resumidos

- **ADR-1 Sin programa custom:** la verificabilidad no lo requiere — SPL+memo+lectura pública bastan. Menos superficie = menos auditoría. Si post-MVP se necesita policy onchain (ej. T2 con slashing), ahí se evalúa Anchor.
- **ADR-2 Auth demo-grade:** email→cookie sin password. Hackathon ≠ producción; documentado, nunca presentado como auth real.
- **ADR-3 Mint propio + payer pool:** para que la demo muestre N pagadores distintos reales con historia, no un solo faucet.
- **ADR-4 Tiempo honesto:** el seed no puede actuar timestamps — el informe reporta el período real. Si la demo necesita "3 meses", se siembra durante días previos o se declara "historial de X días" con la narrativa.
