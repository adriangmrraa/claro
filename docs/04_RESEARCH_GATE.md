# RESEARCH GATE — Candidato C: CLARO — prueba de ingresos portable para la economía informal

> **Estado del gate:** **CERRADO — CONSTRUIR** (03/10/2026, decisión del usuario).
> Dossier fuente: `docs/CANDIDATE_C_proof-of-income.md` (compilado 01/10/2026, 2da pasada de research incluida) · Competencia: `docs/03_COMPETITORS.md` · Fuentes: `docs/SOURCES.md` ([S1]-[S32], [C1]-[C66]).
> **Proveniencia:** este gate se ejecuta en un repo nuevo dedicado a CLARO. La investigación previa vivió en el repo hermano (`../Hackaton Solana`), donde el Candidato O (`agentic-dni`) ya completó su ciclo SDD y quedó archivado. E-001 y el dossier se trasladan como evidencia vigente.

## 1. Problema real [HIPÓTESIS con evidencia de contexto + 1 caso validado]

Trabajadores informales y freelancers de mercados emergentes con ingresos reales no pueden probarlos ante evaluadores (inmobiliarias, prestamistas, emisores de tarjeta, empleadores). El workaround actual es falsificable: "constancia de trabajo" firmada por un conocido, capturas de billetera editables, o exclusión directa del sistema formal.

- **E-001 [VALIDADO n=1]:** el fundador es el ICP — ~10 años de ingresos reales en negro, cero historial crediticio ("si esto existía hace 10 años, hoy tendría historial — no lo tengo").
- **Contexto mercado:** Argentina lidera adopción de stablecoins global (61.8% [S24][S25]); Destácame (7M+ usuarios, 40+ bancos) prueba que evaluadores aceptan evidencia alternativa estructurada.
- **[SIN VERIFICAR]:** entrevistas a 2-3 trabajadores/freelancers adicionales + 1-2 evaluadores (inmobiliaria/prestamista). Registrado como condición — ver §11.

## 2. Usuario y comprador [HIPÓTESIS — parcialmente verificado]

- **Trabajador (usuario principal):** informal local que puede mover cobros a USDC, y **wedge refinado:** freelancers/creadores de mercados emergentes que YA cobran en USDC de clientes extranjeros — ingreso real invisible para el sistema formal local (E-001 valida este perfil).
- **Evaluador (verificador):** inmobiliarias, prestamistas/fintechs de consumo, empleadores remotos. No paga ni necesita cuenta — abre un link y verifica. Adopción por evaluadores = riesgo comercial principal.
- **Pagador:** cliente/empleador del trabajador. Checkout web estilo Mercado Pago, sin cuenta, sin crypto visible.
- **Quién paga (modelo, post-MVP):** el trabajador (informes premium) o el evaluador (verificaciones) — no decidido, fuera del MVP.

## 3. Cómo se resuelve hoy [EVIDENCIA]

| Solución actual | Limitación |
|---|---|
| Constancia de trabajo (papel de conocido) | Falsificación trivial — es el estándar que reemplazamos |
| Extractos bancarios / historial Mercado Pago | Excluye informales; PDF falsificable; propiedad de la plataforma |
| Veraz / Nosis (AR) | Solo sistema formal — el informal no existe ahí |
| Destácame (Chile/MX, 7M users) | Score opaco, depende de su plataforma, no captura a quien no tiene servicios a su nombre |
| zkTLS / Reclaim | Infra potente pero requiere que el dato ya exista en un banco/app — el informal puro no tiene nada que probar ahí |
| Esusu / rent-reporting, Argyle/Pinwheel/Truv | Solo US / solo alquiler / solo nómina formal |

## 4. Antecedentes Colosseum con URLs — COMPLETADO (01/10/2026, 2 barridos)

- **~12 proyectos intentaron lending/score para informales — CERO premios:** CredIA, Strand, V3LA, uLendMe, Openvouch, Tribe, Lendra, CreditChain, CredenceChain, CampusFi, Saathi, wren. Patrón de muerte: lending (capital + regulación + morosos, indemostrable) o scores/reputación opinables (falsificable, sin ancla en dinero real).
- **MAINDOCS 🏆 (Renaissance, WINNER):** wallet → documento verificable con QR + portal de validación — valida el mecanismo central, pero apuntó a contabilidad/empresas, no a ingresos de informales.
- **EarnID, Seel, ZK Credit Passport, giogio (todos Frontier, sin premio):** income verification con entrada manual (falsificable), attestation→lending, portabilidad de crédito formal, EWA — ninguno hace informe verificable de cobros reales para evaluadores offchain.
- URLs y fichas completas en `docs/03_COMPETITORS.md` y `docs/SOURCES.md` [C*].

## 5. Productos/protocolos actuales — COMPLETADO

Ver tabla §3. Gap que sobrevive [HIPÓTESIS]: nadie construyó **historial de ingresos = pagos USDC reales recibidos de terceros**, empaquetado como informe verificable que un evaluador offchain chequea sin confiar en nadie — para el segmento que cobra (o podría cobrar) en stablecoins.

## 6. Gap falsable + incertidumbre

- **Falsable #1:** "trabajadores/freelancers cobrarían por el riel que deja prueba" — E-001 dice que sí n=1; falta muestra.
- **Falsable #2:** "evaluadores aceptan un informe de hechos onchain" — SIN VERIFICAR, falsable con 1-2 entrevistas.
- **Incertidumbres honestas:** (a) bootstrapping — sin pagadores que usen el link no hay T1; (b) cash puro no es verificable (aceptado por diseño: T2/T3 honestos); (c) adopción del evaluador es comercial, no técnica; (d) percepción de riesgo fiscal del usuario (mitigado: nada público por defecto).

## 7. Diferenciación/ventaja para el usuario

- **Informe de hechos, no score opaco:** "recibió $X de N pagadores en Y meses" — auditable, vs "87/100" incuestionable.
- **Propiedad del usuario:** historial vive en su wallet, sobrevive a la app; divulgación selectiva con scope + vencimiento + revocación; nada público por defecto.
- **Verificación sin confianza:** el evaluador verifica contra la chain sin cuenta ni intermediario — vs Destácame (confiar en la plataforma) y vs PDF (confiar en el papel).
- **Honestidad estructural como feature:** tiers de evidencia declarados (probado/declarado/ahorro), confianza del pagador explícita — nadie más muestra sus propias debilidades.
- **Lección de los ~12 muertos:** no lending, no token, no attestation auto-firmable como prueba base.

## 8. Por qué Solana es esencial — prueba de extracción

**Pasa.** Sin chain queda un Excel editable que el evaluador no puede distinguir de una mentira. Concreto: (a) settlement USDC con fee ~$0.00025 — cobros chicos viables; (b) historial público auditable por cualquiera, no falsificable como un PDF ni revocable por una empresa; (c) anclaje del informe onchain (hash/SAS) = tamper-proof + timestamp; (d) portabilidad — el historial es del usuario, no de la app. PII, historial crudo compartido y el informe completo NO van onchain — solo compromisos/hechos derivados.

## 9. MVP — demo-able en devnet

1. **Registro + wallet embebida** (email; keypair client-side no custodial — el usuario nunca ve jerga).
2. **Link de cobro** con `reference` única (Solana Pay) — distingue pago-de-checkout (T1) de auto-fondeo (T3).
3. **Checkout pagador fiat simulado:** tarjeta fake → backend mintea USDC **devnet** a la wallet del trabajador con la referencia del link. Sin ramp real ni fondos reales.
4. **Historial clasificado 3 tiers:** T1 pago directo de tercero con referencia / T2 attestation SAS del pagador + depósito matcheado / T3 depósito propio etiquetado "ahorro" — nunca ingreso. Ponderación por calidad del pagador (antigüedad, actividad) con confianza declarada.
5. **Generador de informe:** hechos derivados (totales por período, N pagadores, continuidad), scope elegido por el usuario, link con vencimiento + revocación, hash anclado onchain.
6. **Página de verificación pública** — la estrella: hechos derivados + badges por tier + "verificar en la blockchain" que muestra las txs reales.
7. **Seed devnet** para la demo: 2-3 meses de cobros variados de varios pagadores + al menos un depósito T3 visible como "ahorro, no ingreso".
8. **UI:** Next.js + Tailwind + shadcn, español, mobile-first, cero jerga crypto en trabajador y pagador.

## 10. Evidencia y SOURCES — COMPLETADO

Dossier `docs/CANDIDATE_C_proof-of-income.md` (2 pasadas de Copilot + web research); fuentes `docs/SOURCES.md` [S1]-[S32], [C1]-[C66]; competencia `docs/03_COMPETITORS.md`; validación `docs/08_VALIDATION.md`.

## 11. Decisión humana — **CONSTRUIR** ✅ — GATE CERRADO (03/10/2026)

**Decisión emitida:** CONSTRUIR — aprobada por el usuario en sesión ("quiero que construyamos, damos por aprobado el Research Gate"). Modo de ejecución autorizado: **automático** (fases SDD encadenadas sin gate intermedio, con registro en SESSION_LOG/PROJECT_STATE por fase).

**Excepción registrada (transparencia, no ocultamiento):** el usuario aprobó el build **sin completar las entrevistas de validación** (2-3 trabajadores + 1-2 evaluadores, compromiso pendiente desde 01/10). Riesgo aceptado explícitamente: cualquier claim de demanda real queda **[SIN VERIFICAR]** hasta que las entrevistas ocurran; el kit de entrevistas queda listo en `docs/08_VALIDATION.md` para ejecutarse en paralelo al build o post-demo.

**Restricciones duras del alcance [DECISIÓN DEL EQUIPO]:**
- Solana **devnet** solamente; cero fondos reales, cero mainnet.
- Cero PII onchain — solo hashes/compromisos/attestations con datos mínimos.
- NO lending, NO token propio, NO score opaco, NO attestations auto-firmables como prueba base, NO prometer bancarización.
- Cero jerga crypto en UI de trabajador y pagador; español, mobile-first.
- Nada público por defecto — informe = hechos derivados con divulgación selectiva.
- Producto en este repo (`PROYECTO C/`); el repo hermano (`demo/`, `agentic-dni`) NO se toca.

**Condición asociada:** completar las entrevistas pendientes para destrabar claims de mercado y ajustar wedge (freelancer-crypto vs informal-cash) con datos reales antes de cualquier pitch de adopción.

**Gate: CERRADO — APROBADO PARA CONSTRUIR.** Se habilita `sdd/changes/claro/` y el trabajo SDD (proposal → spec → design → tasks → apply → verify → archive) en modo automático.
