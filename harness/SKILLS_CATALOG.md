# Catálogo de skills y cómo comprobarlas — v3.0

## Ya incluidas en ESTE ZIP (no requieren descargar)

Las 10 skills locales de Formosa están en `.agents/skills/formosa-sdd-*/SKILL.md`. Son instrucciones operativas, no ejecutables ni garantías de autodescubrimiento. Un agente compatible con Agent Skills puede detectarlas; si no, **leer el SKILL.md de la fase expresamente**. El `AGENTS.md` las invoca por nombre y el playbook explica los gates. Orden: init → explore → research-gate → propose → spec → design → tasks → apply → verify → archive.

## Skills externas para INSTALAR CON PERMISO

| Skill / herramienta | URL canónica | Momento de usarla | Verificación mínima |
|---|---|---|---|
| Matt Pocock Skills | https://github.com/mattpocock/skills | discovery, research, specs, tasks, TDD, revisión | agente detecta selección instalada y `setup-matt-pocock-skills` configurado |
| Colosseum Copilot v2 | https://github.com/ColosseumOrg/colosseum-copilot · https://docs.colosseum.com/copilot/getting-started | antes de Research Gate y al investigar cambios | `copilot-connect status` + consulta histórica enlazada |
| Solana Dev Skill | https://github.com/solana-foundation/solana-dev-skill | antes de programar Solana | agente puede leer/invocar skill y contrastar SDK actual |
| Superteam Stack/Rules | https://superteam.ar/stack · https://superteam.ar/stack/rules?lang=en | evaluar uso real de Web3 y durante build | `SOLANA-RULES.md` revisado cuando se descargue; HTTP correcto, contenido no vacío |
| Engram (MCP, no skill de research) | https://github.com/Gentleman-Programming/engram | desde init, memoria entre sesiones | CLI + MCP + guardar/buscar memoria inocua |

## Comandos documentados (ver prerrequisitos en `INSTALLATION_GUIDE.md`)

```bash
# SOLO tras confirmar Node/npm, compatibilidad y permiso:
npx skills@latest add mattpocock/skills
npx skills add ColosseumOrg/colosseum-copilot -g
npx @colosseum-org/copilot-connect login
npx @colosseum-org/copilot-connect status
npx skills add https://github.com/solana-foundation/solana-dev-skill
# Go preinstalado y PATH correcto, tras aprobación:
go install github.com/Gentleman-Programming/engram/cmd/engram@latest
engram version
# Después: engram setup opencode | engram setup codex | plugin Claude según guía
```

No son comandos para ejecutar todos de golpe. No atribuir skills a Matt que pertenezcan a otro repo; SDD de Formosa se incluye realmente en el ZIP.
