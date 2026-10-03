---
name: formosa-sdd-spec
description: "Especificación ejecutable y aceptación; fase del SDD del starter Road to Colosseum Formosa."
---

# Especificación ejecutable y aceptación — skill local Formosa.dev

> Skill de **autoría propia del starter**, no copiada de otro repositorio. AGENTS.md manda sobre esta skill.

## Cuándo invocar

Al comenzar la fase `spec` según `harness/SDD_PLAYBOOK.md`, exclusivamente cuando se cumpla su entrada. Si el agente no carga la skill, leer este fichero y seguir su procedimiento textualmente.

## Procedimiento

Usar preguntas estilo Matt Pocock grill-with-docs; convertir decisiones en escenarios observables, criterios de aceptación y fallos/edge cases. Mantener design separado; solicitar aprobación de spec, no asumir que respuesta conversacional habilita build.

## Artefactos esperados

`sdd/changes/<slug>/spec.md`

## Cierre

Actualizar `PROJECT_STATE.md` con fase, estado, fecha, bloqueos y próxima acción; registrar evento en `docs/SESSION_LOG.md`; persistir memoria curada Engram si MCP funciona (con enlace al archivo canónico, sin secretos). No avanzar al siguiente gate sin confirmación de humano y prueba real.
