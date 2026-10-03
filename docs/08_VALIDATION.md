# Registro de validación

Estado: **E-001 (n=1) heredada del repo hermano** + **entrevistas pendientes** — kit listo abajo. Claims de demanda: **[SIN VERIFICAR]** hasta completar la muestra (condición del gate, `docs/04_RESEARCH_GATE.md` §11).

Hipótesis: trabajadores con ingresos reales no formales/no declarables carecen de prueba de ingresos verificable para evaluadores (inmobiliarias, prestamistas, emisores de tarjeta).

## Entrevistas (anonimizadas + consentimiento + fecha)

### E-001 — 01/10/2026 — Fundador del equipo (él mismo es el ICP)
- Perfil: freelance, 28 años, ~10 años trabajando y cobrando en negro (banco + billeteras virtuales), algunas veces en USDC vía Binance. Monotributo desde hace <1 año.
- **Dolor confirmado [VALIDADO n=1]:** "si hace 10 años existiese esto y hubiese recibido mi dinero ahí, hoy tendría un historial grande — no lo tengo". Sin historial crediticio pese a ~10 años de ingresos reales.
- **Matiz técnico [IMPORTANTE]:** pagos recibidos *dentro* de Binance NO son visibles onchain (ledger interno del CEX). Solo cuentan si se retiran a self-custody o si se prueba el historial vía zkTLS. Insumo para roadmap v2.

---

## Kit de entrevistas pendientes (para cerrar la condición del gate)

> Ejecutar cuando el equipo consiga entrevistados. Anonimizar (E-00X, rol, fecha) y volcar acá. Nunca inventar respuestas.

### Guion A — Trabajador informal / freelancer (objetivo: 2-3)

1. ¿Cómo cobrás hoy tu trabajo? (cash / transferencia / billetera / crypto — dejar hablar, no sugerir)
2. ¿Alguna vez te pidieron probar cuánto ganás? ¿Para qué? (alquiler / crédito / tarjeta / laburo)
3. ¿Qué mostraste? ¿Te lo aceptaron? ¿Qué pasó después?
4. ¿Te bloqueó alguna vez no poder probar ingresos? Contame la situación concreta.
5. (Si cobra en crypto/billetera) ¿Dónde te llega la plata? ¿La movés?
6. Si existiera un comprobante de tus cobros que nadie puede falsificar, ¿lo usarías? ¿Para qué primero?
7. ¿Te preocuparía que un evaluador vea tus cobros? ¿Qué te gustaría ocultar?

**Señal de ÉXITO (hipótesis confirmada):** ≥2 de 3 reportan un bloqueo concreto (alquiler/crédito/tarjeta negado o traba) por falta de prueba de ingresos.
**Señal de FALLO:** el dolor no existe o se resuelve hoy con workaround aceptado (ej. la inmobiliaria acepta extracto MP sin problema).

### Guion B — Evaluador: inmobiliaria / prestamista / empleador (objetivo: 1-2)

1. ¿Qué prueba de ingresos pedís hoy a alguien sin recibo de sueldo?
2. ¿Qué aceptás como alternativa? (extracto, garantía, constancia) ¿Qué rechazaste alguna vez por dudoso?
3. ¿Cómo verificás que un documento no esté falsificado?
4. Si te muestro un informe que dice "esta persona recibió $X de N pagadores distintos durante Y meses" y podés verificarlo vos mismo en un link público (sin depender de quien lo emite), ¿lo considerarías? ¿Qué te faltaría para aceptarlo?
5. ¿Qué peso le darías vs un recibo de sueldo / extracto bancario?
6. ¿Qué te haría desconfiar de ese informe?

**Señal de ÉXITO:** el evaluador dice que lo usaría *como input* (aunque sea complementario) y describe qué le faltaría.
**Señal de FALLO:** rechazo categórico ("solo acepto recibo de sueldo/veraz") sin apertura a evidencia alternativa — invalida el wedge evaluador.

## Feedback de usuarios/testers

- Pendiente: completar muestra trabajadores + evaluadores (condición del gate).

## Experimentos, observaciones vs inferencias, decisiones

- Observación: dolor real y personal del fundador (observado, no inferido).
- Inferencia pendiente: que evaluadores acepten un informe onchain como prueba — SIN VERIFICAR.
- Decisión: build aprobado con validación pendiente (excepción registrada en gate §11 y DECISIONS.md — el kit queda para ejecutar en paralelo o post-demo).

---

## Validación técnica de la demo — fase VERIFY

PENDIENTE — se completa al finalizar el build contra `sdd/changes/claro/spec.md` criterio por criterio.
