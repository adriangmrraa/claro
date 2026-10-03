# Spec comportamental — claro (proof-of-income para economía informal)

> Estado: **BORRADOR — contenido completo** (fase `spec` en modo automático autorizado por el usuario; queda sujeta a revisión humana en cualquier momento).
> Fecha: 03/10/2026 · Cambio SDD: `claro` · Fuentes canónicas: `sdd/changes/claro/proposal.md` · `docs/CANDIDATE_C_proof-of-income.md` (diseño acordado completo) · `docs/04_RESEARCH_GATE.md` (alcance cerrado) · `docs/05_PRODUCT_SPEC.md` (baseline) · `docs/DECISIONS.md` · `docs/ENVIRONMENT.md` (toolchain).

## Para quién / problema / outcome

Para un **trabajador informal o freelancer de mercado emergente** que cobra plata real todos los días pero **no puede probar sus ingresos ante evaluadores** (inmobiliarias, prestamistas, emisores de tarjeta, empleadores), el sistema debe hacer que **cobrar por un link genere un historial de cobros verificable onchain, que el trabajador convierte en un informe de hechos derivados — con divulgación selectiva — que cualquier evaluador verifica contra la blockchain sin cuenta y sin confiar en la plataforma**.

Roles cubiertos: trabajador (usuario principal), pagador (cliente/empleador que paga por checkout web sin crypto visible), evaluador/verificador (abre el link del informe, verifica), observador/jurado (ve la demo end-to-end).

## Requisitos MUST (observables y testeables)

> Convención: **"hechos derivados"** = datos agregados del historial (totales por período, N pagadores distintos, continuidad en meses, tier de cada flujo, confianza declarada) — nunca el historial crudo salvo opt-in explícito. Todo requisito onchain es verificable en explorer devnet.

- **R-01 — Registro + wallet embebida no-custodial.** El trabajador crea cuenta con email → el sistema genera una keypair Solana en el cliente (la plataforma nunca custodia la key ni la ve en claro) → el trabajador obtiene su dirección de cobro visible como "tu cuenta" + QR. La UI no muestra jerga crypto.
- **R-02 — Link de cobro con referencia.** El trabajador genera un link de cobro (monto opcional + descripción en lenguaje natural) → produce una URL pública única que lleva una **referencia criptográfica de una sola vez** destinada a aparecer en la tx del pago.
- **R-03 — Checkout pagador fiat simulado.** El pagador abre el link → ve checkout web estilo fintech (monto, descripción, formulario de tarjeta fake) → al "pagar", el backend mintea/transfiere USDC de prueba **devnet** a la wallet del trabajador **con la referencia del link embebida en la transacción** (verificable onchain). Sin ramp real, sin fondos reales, sin jerga crypto en pantalla.
- **R-04 — Clasificador de historial 3 tiers.** Todo depósito USDC entrante a la wallet del trabajador se clasifica y etiqueta: **T1 — ingreso probado** (transfer de tercero que lleva la referencia de un link de cobro emitido por el trabajador), **T2 — ingreso declarado** (attestation del pagador + depósito que matchea monto), **T3 — ahorro** (depósito sin referencia de cobro = auto-fondeo, etiquetado aparte y **nunca sumado como ingreso**), **excluido** (self-transfer de wallets propias/ciclos detectados). Además pondera la **calidad del pagador** (antigüedad de su wallet, actividad/counterparties propios) y declara la confianza ("pagador establecido" / "baja confianza").
- **R-05 — Generador de informe con divulgación selectiva.** El trabajador elige scope (período, qué revelar: totales/conteo/continuidad/tiers — con o sin detalle de txs) → el sistema genera el informe de hechos derivados → produce un **link único de verificación con vencimiento y revocable** → el hash del informe queda **anclado onchain** (mecanismo exacto: OPEN → diseño). El informe declara su propia confianza (calidad de pagadores, cantidad por tier).
- **R-06 — Página de verificación pública.** Sin cuenta: el evaluador abre el link → ve los hechos derivados + badges por tier + confianza declarada + estado del link (vigente/vencido/revocado) → botón **"verificar en la blockchain"** que muestra las evidencias onchain reales (referencias, txs, hash del informe anclado) con enlaces al explorer. Si los hechos mostrados no reproducen el hash anclado → la página lo marca inválido.
- **R-07 — Dashboard del trabajador.** Historial de cobros clasificado por tier con badges visuales, totales por período, fuentes conectadas, CTAs ("generar link de cobro", "generar informe"), lista de links de informe activos con opción revocar. Español, mobile-first, cero jerga crypto.
- **R-08 — Seed devnet para la demo.** Script idempotente que genera un historial creíble de 2-3 meses en la wallet demo: **≥3 pagadores distintos**, montos y frecuencia variados, referencias correctas en pagos T1, y **≥1 depósito T3** que el dashboard muestra como "ahorro, no ingreso".
- **R-09 — Devnet solamente + cero secretos.** Todo en devnet con USDC de prueba propio; ninguna key/seed/PII en repo, artefactos ni prompts; el checkout nunca toca fondos reales.

## Criterios de aceptación — mapeo 1:1 con los beats de la demo + edge cases

**CA-1 ↔ Beat 1 — registro y wallet.**
DADO un trabajador nuevo, CUANDO completa el registro con email, ENTONCES existe una dirección de cobro funcional en devnet asociada a su cuenta, visible como "tu cuenta" con QR, generada en el cliente, y la plataforma no tiene su key. PASS = address existe y recibe USDC devnet + cero jerga visible; FAIL = key custodiada por el servidor o jerga crypto expuesta.

**CA-2 ↔ Beat 2 — cobro por link → T1.**
DADO el trabajador con wallet, CUANDO genera un link de cobro ($50 "trabajo de diseño") y un pagador abre el checkout y "paga" con tarjeta fake, ENTONCES: (a) llega una tx USDC devnet a la wallet del trabajador **con la referencia del link**; (b) el dashboard muestra el cobro clasificado **T1 — ingreso probado** con el pagador correcto. PASS = tx onchain con referencia + badge T1; FAIL = sin referencia, sin llegada, o mal clasificado.

**CA-3 ↔ Beat 3 — segundo pagador distinto.**
DADO el cobro de CA-2, CUANDO un **segundo pagador** paga por otro link, ENTONCES el dashboard muestra **2 pagadores distintos** y el informe contará N=2. PASS = conteo correcto de pagadores distintos; FAIL = mismo pagador contado dos veces o pagador erróneo.

**CA-4 ↔ Beat 4 — depósito propio → T3 (momento honestidad).**
DADO el historial anterior, CUANDO la wallet del trabajador recibe un depósito USDC **sin referencia de cobro** (auto-fondeo desde faucet/exchange simulado), ENTONCES el dashboard lo etiqueta **T3 — ahorro** y **NO lo suma como ingreso** en totales ni en el informe. PASS = depósito visible como "ahorro" y excluido del ingreso; FAIL = sumado como ingreso u oculto.

**CA-5 ↔ Beat 5 — informe con scope + anclaje.**
DADO el historial de 2-3 meses (seed + pagos en vivo), CUANDO el trabajador genera un informe con scope "totales + N pagadores + continuidad, últimos 3 meses, sin detalle de txs", ENTONCES: (a) se produce un link único con vencimiento; (b) el hash del informe queda anclado onchain; (c) el informe muestra solo los hechos del scope elegido. PASS = link + hash onchain + scope respetado; FAIL = expone más de lo elegido o falta el anclaje.

**CA-6 ↔ Beat 6 — verificación pública.**
DADO el link del informe, CUANDO el evaluador lo abre sin cuenta, ENTONCES ve los hechos derivados + badges por tier (verde=probado, amarillo=declarado, gris=ahorro) + confianza declarada → aprieta "verificar en la blockchain" → se muestran las evidencias onchain reales con links al explorer → la página confirma que los hechos reproducen el hash anclado. PASS = verificación navegable y self-contained; FAIL = requiere cuenta, confianza en el emisor, o no hay evidencia onchain.

**CA-7 ↔ Beat 7 — revocación en vivo.**
DADO un link de informe vigente, CUANDO el trabajador lo revoca y el evaluador recarga, ENTONCES la página muestra **"informe revocado"** y no expone los hechos. PASS = revocación efectiva e inmediata; FAIL = sigue mostrando los hechos.

**Edge cases a cubrir en pruebas:**

- **CA-8** — Link vencido → la página de verificación muestra "vencido" (no los hechos).
- **CA-9** — Pagador con wallet creada hace <24h y un solo pago → el informe lo marca **"baja confianza"** y declara por qué.
- **CA-10** — Transfer desde otra wallet del mismo usuario (self-transfer) → excluido del ingreso; si hay ciclo A→B→A, se marca como excluido/sospechoso.
- **CA-11** — Informe con scope "totales solamente" → la página NO expone txs, pagadores ni montos individuales; solo hechos agregados.
- **CA-12** — Datos de informe alterados (modificar totales en la página) → la verificación contra el hash anclado **falla visiblemente** ("el informe no coincide con lo anclado").
- **CA-13** — Checkout con tarjeta rechazada/error → mensaje de error limpio en español, sin mint, sin entrada en historial, sin jerga.
- **CA-14** — Segundo pago por el MISMO link (pago duplicado/reutilizado) → se procesa como pago adicional del mismo pagador (no infla N) o se rechaza — comportamiento definido en diseño, consistente y visible.

## Errores / seguridad / accesibilidad / invariantes

**Invariantes de spec (no negociables — violarlos = FAIL):**

- **INV-1 — Cero PII onchain.** Onchain solo: montos, referencias, timestamps, hash/compromiso del informe y attestations mínimas. NUNCA nombre, email, documento, tipo de trabajo identificable.
- **INV-2 — Nada público por defecto.** El historial es privado; compartir es acción explícita del usuario con scope + vencimiento + revocación. No existe perfil público de ingresos.
- **INV-3 — Honestidad de tiers.** T3 nunca suma como ingreso; self-transfers excluidos; la confianza del pagador se declara, no se esconde. Un informe que mienta por omisión es un bug de spec.
- **INV-4 — No custodia ni intermediación de fondos.** La plataforma nunca tiene la key del trabajador ni toca la plata del pagador (el mint de USDC-test devnet es solo faucet de demo, declarado así).
- **INV-5 — Devnet + sin secretos.** Solo devnet; ninguna key/seed/credencial en repo ni artefactos.
- **INV-6 — Cero jerga crypto en UI** de trabajador y pagador ("tu cuenta", "dólares digitales", "tu comprobante" — nunca "wallet/tx/address/USDC/onchain"). La página de verificación SÍ puede mostrar evidencia técnica (es el punto), siempre explicada en lenguaje simple.

**Errores (observables):** estados de link distinguibles (vigente/vencido/revocado/no-existe); checkout fallido con mensaje claro; clasificación ambigua declarada como tal ("sin clasificar — revisar") en vez de adivinar.

**Seguridad:** links de verificación criptográficamente únicos e inadivinables; revocación efectiva server-side (mínima información retenida); la key del trabajador nunca sale del cliente; referencias de un solo uso previenen replay de checkout; hash anclado hace evidente cualquier alteración del informe.

**Accesibilidad / legibilidad de la demo:** un jurado puede seguir el arco completo (~2-3 min) y verificar cada hecho contra el explorer sin explicación técnica adicional. Mobile-first real (el trabajador vive en el celu). Español rioplatense claro.

## No objetivos (OUT of scope — explícito)

- **Lending / crédito / score numérico** de cualquier forma — somos la prueba, no el juez.
- **Token propio** o tokenomics.
- **Ramp/conversión fiat real** — checkout simulado en MVP; ramp licenciado por país es post-hackathon.
- **zkTLS de historiales** (Binance/MP, retroactivo) — roadmap v2 (necesario para CEX-ledger, ver E-001).
- **KYC real** ni verificación de identidad del trabajador/evaluador.
- **Mainnet / fondos reales.**
- **Flujo T2 completo** (attestation SAS del pagador + match) puede quedar como mock/placeholder si el tiempo aprieta — T1 y T3 son los musts demostrables; si T2 entra, entra real.
- **Cuentas de pagador**, pagos recurrentes, multi-idioma (i18n preparado pero solo español visible), app mobile nativa.
- **Push de verificadores** (verificador registrado solicita acceso) — SHOULD diferible a v2; el pull por link es el MUST.
- Cualquier modificación al repo hermano (`demo/`, `agentic-dni`, `platform/`).

## Decisiones ABIERTAS — reservadas para la fase `design` (NO decidir en spec)

1. Implementación de wallet embebida demo-grade (keypair en cliente: almacenamiento y recuperación).
2. USDC de prueba: mint propio con authority del backend vs transfer desde faucet wallet.
3. Mecanismo de referencia en la tx: Solana Pay `reference` key vs memo program.
4. Anclaje del hash del informe: attestation SAS vs memo-tx vs cuenta propia.
5. Si T2 (attestation del pagador) entra al MVP real o queda placeholder.
6. Backend: Next.js API routes único servicio vs servicios separados; detección del pago (polling vs websocket vs webhook simulado).
7. Store de links/scopes/revocaciones: DB local vs derivado onchain.
8. Stack exacto de indexación del historial (RPC calls directas vs caché local).
9. Comportamiento de pago duplicado por el mismo link (CA-14).

## Quién aprobó y cuándo

**Modo automático** autorizado por el usuario 03/10/2026: la spec se produce como artefacto SDD completo y queda sujeta a revisión humana posterior — cualquier corrección del usuario supersede este documento. La spec habilita `design`; el build arranca tras `tasks.md`.
