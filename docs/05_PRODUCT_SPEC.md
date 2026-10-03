# Baseline de producto / negocio (no reemplaza SDD por cambio)

Estado: **BASELINE INICIAL — 03/10/2026 (propuesta de `claro`, pre-build)**. Los requisitos observables viven en `sdd/changes/claro/spec.md`; este archivo resume el producto.

ICP y contexto: trabajadores informales y freelancers de mercados emergentes con ingresos reales no declarables/no trazables — invisibles para evaluadores (inmobiliarias, prestamistas, tarjetas, empleadores). Wedge afilado: freelancers/creadores que **ya cobran en USDC** de clientes extranjeros (ingreso real, invisible al sistema formal local). E-001: el fundador es el ICP (n=1).

Usuario/pagador/decisor: el trabajador usa y genera el informe; el evaluador verifica sin cuenta ni confianza en el emisor; el pagador (cliente/empleador) paga en fiat por checkout estilo Mercado Pago sin tocar crypto. Quién paga por el producto (post-MVP): informes premium del trabajador o verificaciones del evaluador — no decidido, fuera del MVP. [HIPÓTESIS — adopción del evaluador sin verificar: condición del gate.]

Propuesta de valor y alternativa actual: **"tu historial de cobros es tu prueba de ingresos"** — cobrás por un link (pagador paga en moneda local, llega USDC onchain) y el historial acumulado se convierte en informe de hechos derivados verificable por cualquiera contra la chain. Alternativa actual: constancia de trabajo falsificable, extractos MP/banco (excluye informales, PDF editable), Veraz (solo formal), Destácame (score opaco de plataforma). Diferenciador: hechos auditable-verificables, propiedad del usuario, self-serve sin permiso, honestidad de tiers explícita — **somos la prueba, no el juez**.

Recorrido central (MVP): registro email → wallet embebida invisible → generar link de cobro (referencia única) → pagador checkout fiat simulado → USDC devnet llega con referencia → historial se clasifica (T1 probado / T2 declarado / T3 ahorro) → trabajador genera informe con scope → evaluador abre link, ve hechos + badges por tier + verifica las txs reales onchain.

MUST / SHOULD / LATER / OUT:
- MUST: wallet embebida no-custodial (client-side, demo-grade documentado); link de cobro con `reference` Solana Pay; checkout fiat simulado → USDC devnet con referencia; clasificador 3 tiers + calidad de pagador con confianza declarada; generador de informe (hechos derivados, scope, vencimiento, revocación); página de verificación pública con pruebas onchain clickeables; seed devnet 2-3 meses para demo; UI español mobile-first cero jerga crypto.
- SHOULD: attestation SAS anclando hash del informe; solicitudes push de verificadores (aprobar/rechazar con scope); firma mutua T2 (pagador attesta + depósito matcheado).
- LATER (post-hackathon): ramp real licenciado por país, zkTLS de historiales (Binance/MP — necesario para retroactivo y CEX-ledger, ver E-001), ZK proofs para unlinkability fuerte, cuentas de pagador recurrente, multi-idioma.
- OUT: lending de cualquier forma, token propio, score numérico opaco, PII onchain, custodia de fondos, mainnet/fondos reales, conversión fiat propia (siempre vía ramp licenciado), KYC real, promesa de bancarización.

Métrica/hipótesis y modo de prueba: hipótesis de producto = "evaluadores offchain aceptan un informe de hechos onchain como evidencia de ingresos" — falsable con 1-2 entrevistas evaluador (**PENDIENTE — condición del gate**). Criterio técnico del MVP = el loop completo corre en devnet: link → pago → clasificación → informe → verificación onchain navegable, con historial pre-sembrado creíble.

Cambios SDD: `sdd/changes/claro/` — ACTIVO (proposal aprobada por el usuario junto al gate; spec pendiente).
