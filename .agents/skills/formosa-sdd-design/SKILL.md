---
name: formosa-sdd-design
description: "Diseño onchain/offchain y arquitectura; fase del SDD del starter Road to Colosseum Formosa."
---

# Diseño onchain/offchain y arquitectura — skill local Formosa.dev

> Skill de **autoría propia del starter**, no copiada de otro repositorio. AGENTS.md manda sobre esta skill.

## Cuándo invocar

Al comenzar la fase `design` según `harness/SDD_PLAYBOOK.md`, exclusivamente cuando se cumpla su entrada. Si el agente no carga la skill, leer este fichero y seguir su procedimiento textualmente.

## Procedimiento

Revisar Superteam Stack/SOLANA-RULES.md y Solana Dev Skill instaladas si código onchain. Decidir necesidad real de chain, SDK, wallet/RPC/devnet, datos y trust boundaries. Registrar tradeoffs y seguridad. No tocar mainnet/fondos reales.

## Artefactos esperados

`docs/06_SOLANA_DECISION.md, docs/07_ARCHITECTURE.md, sdd/changes/<slug>/design.md`

## Cierre

Actualizar `PROJECT_STATE.md` con fase, estado, fecha, bloqueos y próxima acción; registrar evento en `docs/SESSION_LOG.md`; persistir memoria curada Engram si MCP funciona (con enlace al archivo canónico, sin secretos). No avanzar al siguiente gate sin confirmación de humano y prueba real.
