# SDD end-to-end — Road to Colosseum × Formosa, v3

**Este documento operacionaliza `AGENTS.md`.** SDD es el método de trabajo que manda en el proyecto. Las skills locales `.agents/skills/formosa-sdd-*/SKILL.md` son procedimientos ORIGINALMENTE CREADOS PARA ESTE STARTER y no una copia del trabajo de Matt Pocock, GitHub Spec Kit o Gentle-AI. El slash command es opcional; leer SKILL.md y ejecutar sus pasos es obligatorio cuando corresponda.

## Principios

- Idea y research también tienen especificación: escribir qué se busca demostrar y qué observaciones invalidarían la hipótesis.
- Git/documentos locales como fuente de verdad compartida; Engram como memoria personal curada complementaria. En un equipo, una decisión de Engram solo se considera acordada al reflejarse en Markdown y revisarse.
- Gates humanos explícitos; una respuesta «sí, entiendo» a una pregunta no equivale a permiso para iniciar implementación.
- Una feature = una modificación SDD rastreable y testeable; no escribir código nuevo del producto hasta `docs/04_RESEARCH_GATE.md` APROBADO.
- Diferenciar artefacto, evidencia, decisión, operación ejecutada y resultado verificado. Plantilla ≠ evidencia.

## Cadena completa de trabajo (un solo recorrido)

| Paso / skill local | Objetivo | Escritura obligatoria | Gate |
|---|---|---|---|
| `formosa-sdd-init` | identificar entorno, herramientas, nivel, contexto, Engram | `docs/00_ONBOARDING.md`, `docs/ENVIRONMENT.md`, `PROJECT_STATE.md` | permisos y plan aprobados |
| `formosa-sdd-explore` | observar problema, usuarios, alternativas, por qué ahora | `docs/01_IDEATION.md`, `docs/02_MARKET_RESEARCH.md`, `docs/SOURCES.md` | hipótesis clara |
| `formosa-sdd-research-gate` | Copilot/competencia/mercado y decisión de no duplicar | `docs/03_COMPETITORS.md`, `docs/04_RESEARCH_GATE.md` | **HUMANO: CONSTRUIR/PIVOT/DESCARTAR/INVESTIGAR**; no avanzar por inferencia |
| `formosa-sdd-propose` | propuesta de producto/valor y alcance | `docs/05_PRODUCT_SPEC.md`, `sdd/changes/<slug>/proposal.md` | aceptar propuesta |
| `formosa-sdd-spec` | requisitos observables, flujo central, aceptación, fuera de scope | `sdd/changes/<slug>/spec.md` | revisión humana de spec |
| `formosa-sdd-design` | arquitectura, Solana onchain/offchain, wallet, datos/seguridad | `docs/06_SOLANA_DECISION.md`, `docs/07_ARCHITECTURE.md`, `sdd/changes/<slug>/design.md` | viabilidad/seguridad revisadas |
| `formosa-sdd-tasks` | tareas verticales, pruebas y orden ejecutable | `sdd/changes/<slug>/tasks.md`, `test-plan.md` | aprobar primer slice |
| `formosa-sdd-apply` | TDD e implementación slice-by-slice | código, test, `docs/SESSION_LOG.md`, `PROJECT_STATE.md` | tests/validación real |
| `formosa-sdd-verify` | comparar implementación con spec y demo end-to-end | `sdd/changes/<slug>/verification.md`, `docs/08_VALIDATION.md` | declarar PASS/PARTIAL/FAIL con evidencia |
| `formosa-sdd-archive` | entregar demo, próximos pasos y lecciones | `docs/09_DEMO_SUBMISSION.md`, `docs/10_ROADMAP.md`, `sdd/changes/<slug>/STATUS.md` | siguiente iteración acordada |

### Carpeta de un cambio después del Research Gate

`sdd/changes/<slug>/`: copiar los 7 archivos de `sdd/templates/` (proposal/spec/design/tasks/test-plan/verification/STATUS), reemplazar `[PLACEHOLDER]`, fechar decisiones y enlazarlos desde `PROJECT_STATE.md`. No crear cambio ficticio aprobado; no abrir 5 cambios paralelos para un equipo principiante. Mantener requirements del cambio en `spec.md`; `docs/05_PRODUCT_SPEC.md` resume baseline del producto y se consolida cuando se archiva un cambio. Ante contradicción, preguntar al humano y registrar en `docs/DECISIONS.md`.

### Cómo trabajar con Matt Pocock SIN duplicar autoridad

- `grill-with-docs`: entrevista rigurosa de problema, términos y decisiones; alimenta `formosa-sdd-explore` y, después del gate, `formosa-sdd-spec`.
- `research`: investigación con enlaces, alimenta `docs/SOURCES.md`; Colosseum Copilot cubre proyectos históricos, complementado con mercado actual.
- `to-spec`: síntesis de decisiones ya consensuadas; mapear resultado a `sdd/changes/<slug>/spec.md`. Puede crear issue externo si el equipo eligió tracker: no sustituir el archivo local.
- `to-tickets`: descomposición en tareas comprobables; copiar/mapear a `tasks.md`. Usar tracker de archivos locales si no hay cuenta GitHub Issues.
- `implement` / `tdd`: solo después de `spec.md` y `tasks.md` aprobados, por slices; no dejar que implement rediseñe spec silenciosamente.
- `code-review`, `diagnosing-bugs`, `handoff`: se usan en `verify`, al depurar, y al cerrar; dejar hallazgos en `verification.md` / `docs/SESSION_LOG.md`.

Si el participante ya tiene otras SDD skills instaladas (Gentle-AI/Spec-Kit/OpenSpec etc.): no instalar orquestadores duplicados; mapear sus fases al esquema local y mantener estos archivos como contrato portable. Evitar que dos plugins autoaprueben o archive un mismo cambio por caminos distintos.

## Engram como memory layer secundaria

Al iniciar, si MCP existe: identificar proyecto (`mem_current_project`), recuperar resumen (`mem_context`), buscar decisiones relevantes (`mem_search`). Si no existe, leer PROJECT_STATE + SESSION_LOG + DECISIONS. Al documentar un acuerdo, primero actualizar repo; luego `mem_save` en un topic_key estable, por ejemplo `sdd/<slug>/spec` o `project/research-gate`, con ubicación del archivo canónico y resumen de cambios, SIN PII/secretos. Antes de cerrar, `mem_session_summary` y un resumen humano equivalente en `docs/SESSION_LOG.md`. Si SQLite de Engram reside en HOME global, no prometer que viaja en ZIP/Git. No hacer dumps automáticos o sincronización cloud sin consentimiento.

## Ciclo de 20–45 min por sesión

1. Recuperar estado (repo+Engram) → 2. explicar dónde estamos, qué falta y próximo gate → 3. acordar una acción pequeña → 4. investigar/implementar solo dentro de la fase → 5. ejecutar verificación real y registrar evidencia → 6. actualizar 3 lugares: `PROJECT_STATE.md`, artefacto SDD/doc relevante y `docs/SESSION_LOG.md` → 7. guardar memoria curada Engram si disponible → 8. consultar al humano si abrir siguiente fase.

## Stop rules

NO IMPLEMENTAR si: Research Gate no aprobado, no se sabe usuario/problema, no hay spec para la feature, se va a usar mainnet/fondos reales sin decisión específica, existen keys sin aislamiento, se pretende inventar métricas/entrevistas. No declarar FINALIZADO si la demo, tests o entrega no se verificaron. Entrega de Colosseum y Superteam Earn son DOS acciones distintas: comprobar bases vigentes y registrar enlaces reales.
