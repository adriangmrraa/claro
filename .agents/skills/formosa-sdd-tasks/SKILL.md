---
name: formosa-sdd-tasks
description: "Plan vertical, dependencias y pruebas; fase del SDD del starter Road to Colosseum Formosa."
---

# Plan vertical, dependencias y pruebas — skill local Formosa.dev

> Skill de **autoría propia del starter**, no copiada de otro repositorio. AGENTS.md manda sobre esta skill.

## Cuándo invocar

Al comenzar la fase `tasks` según `harness/SDD_PLAYBOOK.md`, exclusivamente cuando se cumpla su entrada. Si el agente no carga la skill, leer este fichero y seguir su procedimiento textualmente.

## Procedimiento

Derivar tasks y orden a partir de spec/diseño aprobados: slices de punta a punta, tests unit/integration/e2e/smoke. Usar to-tickets de Pocock solo si está disponible y respetando archivo local canónico.

## Artefactos esperados

`sdd/changes/<slug>/tasks.md, sdd/changes/<slug>/test-plan.md`

## Cierre

Actualizar `PROJECT_STATE.md` con fase, estado, fecha, bloqueos y próxima acción; registrar evento en `docs/SESSION_LOG.md`; persistir memoria curada Engram si MCP funciona (con enlace al archivo canónico, sin secretos). No avanzar al siguiente gate sin confirmación de humano y prueba real.
