# Propuesta claro

Research Gate aprobado (link / fecha / quién): `docs/04_RESEARCH_GATE.md` — **CONSTRUIR**, usuario, 03/10/2026. Excepción registrada: build aprobado sin completar entrevistas de validación (condición: claims de demanda quedan [SIN VERIFICAR]; kit de entrevistas en `docs/08_VALIDATION.md`).

## Problema / usuario / evidencia

Trabajadores informales y freelancers de mercados emergentes con ingresos reales no pueden probarlos: sin recibo de sueldo no alquilan, no acceden a crédito ni tarjeta. Workarounds actuales falsificables (constancia de conocido, capturas de billetera). Evidencia: E-001 dolor validado n=1 (fundador = ICP, ~10 años en negro, cero historial); ~12 antecesores Colosseum murieron haciendo lending/score (0 premios); MAINDOCS🏆 validó el mecanismo wallet→documento verificable; Destácame (7M users) valida que evaluadores aceptan evidencia alternativa. Dossier: `docs/CANDIDATE_C_proof-of-income.md`.

## Outcome y por qué ahora

Outcome: un MVP funcional en **devnet** que demuestra el loop completo — el trabajador cobra por un link (pagador paga fiat simulado, llega USDC con referencia), el historial se clasifica en 3 tiers de evidencia honesta, y genera un informe de hechos derivados que cualquier evaluador verifica onchain sin confiar en nosotros. Por qué ahora: adopción stablecoin AR líder mundial [S24][S25], freelancers EM ya cobran USDC sin poder probarlos, y el vacío competitivo está verificado (nadie hizo informe-de-hechos para ingresos informales).

## Alcance MVP (IN)

1. Registro email + wallet embebida no-custodial (keypair client-side, demo-grade documentado).
2. Link de cobro con `reference` única (Solana Pay) — distingue T1 (pago de tercero) de T3 (auto-fondeo).
3. Checkout pagador fiat **simulado** → mint/transfer USDC devnet a la wallet del trabajador con la referencia.
4. Clasificador de historial 3 tiers + ponderación de calidad del pagador con confianza declarada.
5. Generador de informe: hechos derivados, scope elegido por usuario, link con vencimiento + revocación, hash anclado onchain.
6. Página de verificación pública: hechos + badges por tier + botón "verificar en la blockchain" con txs reales.
7. Seed devnet: 2-3 meses de cobros variados (varios pagadores) + depósitos T3 para demo creíble y honesta.
8. UI Next.js + Tailwind + shadcn; español; mobile-first; cero jerga crypto (trabajador y pagador).

## Alternativas y OUT OF SCOPE

- OUT: lending/crédito (mató a los 12 antecesores), token propio, score opaco, attestations auto-firmables como prueba base, PII onchain, custodia de fondos, ramp/conversión real (siempre licenciado externo; en MVP simulado), zkTLS retroactivo, KYC real, mainnet.
- Alternativas evaluadas en dossier/gate y descartadas: lending, score reputacional, attestation-pura, perfil público de ingresos (doxxing + riesgo fiscal).

## Riesgos principales

Adopción del evaluador [SIN VERIFICAR] (condición del gate); bootstrapping de pagadores; wallet embebida demo-grade (pérdida de keys → documentar, recovery post-MVP); percepción fiscal del usuario (mitigado: nada público por defecto).

## Decisión humana

CONSTRUIR — usuario, 03/10/2026 (junto a la aprobación del gate; modo automático autorizado para las fases SDD).
