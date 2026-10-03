---
name: formosa-sdd-init
description: "Onboarding y diagnóstico de herramientas; fase del SDD del starter Road to Colosseum Formosa."
---

# Onboarding y diagnóstico de herramientas — skill local Formosa.dev

> Skill de **autoría propia del starter**, no copiada de otro repositorio. AGENTS.md manda sobre esta skill.

## Cuándo invocar

Al comenzar la fase `init` según `harness/SDD_PLAYBOOK.md`, exclusivamente cuando se cumpla su entrada. Si el agente no carga la skill, leer este fichero y seguir su procedimiento textualmente.

## Procedimiento

Confirmar contexto real, acceso, nivel y permisos. Leer scripts de diagnóstico; registrar comprobaciones no destructivas. Plan mínimo para Go→Engram y skills externas si hacen falta. NUNCA instalar sin permiso ni confundir VM con notebook.

## Artefactos esperados

`docs/00_ONBOARDING.md, docs/ENVIRONMENT.md, PROJECT_STATE.md`

## Cierre

Actualizar `PROJECT_STATE.md` con fase, estado, fecha, bloqueos y próxima acción; registrar evento en `docs/SESSION_LOG.md`; persistir memoria curada Engram si MCP funciona (con enlace al archivo canónico, sin secretos). No avanzar al siguiente gate sin confirmación de humano y prueba real.
