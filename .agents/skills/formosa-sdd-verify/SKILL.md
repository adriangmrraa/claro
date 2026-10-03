---
name: formosa-sdd-verify
description: "Revisión de spec, pruebas y demo; fase del SDD del starter Road to Colosseum Formosa."
---

# Revisión de spec, pruebas y demo — skill local Formosa.dev

> Skill de **autoría propia del starter**, no copiada de otro repositorio. AGENTS.md manda sobre esta skill.

## Cuándo invocar

Al comenzar la fase `verify` según `harness/SDD_PLAYBOOK.md`, exclusivamente cuando se cumpla su entrada. Si el agente no carga la skill, leer este fichero y seguir su procedimiento textualmente.

## Procedimiento

Comparar cada criterio con evidencia real. Ejecutar typecheck, tests y smoke devnet cuando aplique; bug→repro→fix→regresión. Usar code-review de Pocock si existe. Declarar PASS/PARTIAL/FAIL honestamente y pedir plan de cierre.

## Artefactos esperados

`sdd/changes/<slug>/verification.md, docs/08_VALIDATION.md`

## Cierre

Actualizar `PROJECT_STATE.md` con fase, estado, fecha, bloqueos y próxima acción; registrar evento en `docs/SESSION_LOG.md`; persistir memoria curada Engram si MCP funciona (con enlace al archivo canónico, sin secretos). No avanzar al siguiente gate sin confirmación de humano y prueba real.
