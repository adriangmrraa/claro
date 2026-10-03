---
name: formosa-sdd-apply
description: "Implementación incremental/TDD; fase del SDD del starter Road to Colosseum Formosa."
---

# Implementación incremental/TDD — skill local Formosa.dev

> Skill de **autoría propia del starter**, no copiada de otro repositorio. AGENTS.md manda sobre esta skill.

## Cuándo invocar

Al comenzar la fase `apply` según `harness/SDD_PLAYBOOK.md`, exclusivamente cuando se cumpla su entrada. Si el agente no carga la skill, leer este fichero y seguir su procedimiento textualmente.

## Procedimiento

Comprobar gate y spec/tareas. Plan breve; una slice cada vez, test fallando cuando procede, implementar, probar, refactorizar. Usar Pocock tdd/implement si disponibles, pero no modificar spec tácitamente. Registrar resultados literales saneados, no inventar pass.

## Artefactos esperados

`código, tests, docs/SESSION_LOG.md, PROJECT_STATE.md`

## Cierre

Actualizar `PROJECT_STATE.md` con fase, estado, fecha, bloqueos y próxima acción; registrar evento en `docs/SESSION_LOG.md`; persistir memoria curada Engram si MCP funciona (con enlace al archivo canónico, sin secretos). No avanzar al siguiente gate sin confirmación de humano y prueba real.
