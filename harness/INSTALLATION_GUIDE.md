# Instalación guiada del harness — fuente técnica para el AGENTE, v3.0

**Regla absoluta:** primero ejecutar diagnóstico NO DESTRUCTIVO y pedir aprobación humana ANTES de instalar/alterar PATH/configurar MCP/conectar cuentas. Revisar versión vigente de las fuentes enlazadas; comandos documentados con revisión 01/10/2026, no garantía eterna. No ejecutar scripts remotos pipe a shell sin revisión y permiso. Si el agente funciona en nube, estas comprobaciones son de la máquina REMOTA, no de la notebook.

## Orden adaptativo de preparación

1. Localizar directorio real, OS, arquitectura, tipo de shell, acceso y si ya hay repo. `scripts/diagnostico.sh` (macOS/Linux/WSL) o `scripts/diagnostico.ps1` (PowerShell) hacen inventario LOCAL de solo lectura. Leer su código primero; ejecutar solo con autorización. Anotar salida saneada en `docs/ENVIRONMENT.md`.
2. Confirmar runtime IA presente (Claude Code, Codex, OpenCode, Copilot, Cursor, chat-only, otra opción). Verificar skills y MCP ya registrados. NO reemplazar una configuración productiva ni duplicar plugins.
3. Verificar `git --version`, `node --version`, `npm --version`, `go version`, `engram version`, y `command -v`/`Get-Command` de `claude`, `opencode`, `codex`, `solana`, `anchor`, `rustc`, `cargo`. No correr comandos que muestren environment tokens, ni `git config --list`.
4. Node.js >=20 y npm requeridos para **Copilot v2**. Instalar solo de https://nodejs.org/ o gestor oficial/ya usado si faltan, tras consentimiento. Git: https://git-scm.com/downloads.
5. Instalar/activar Engram y su integración con el agente. Después skills SDD locales (ya copiadas) y Matt Pocock; Copilot debe quedar apto ANTES del research gate; Solana Dev Skill/Superteam rules antes de escribir código Solana.

## Go y Engram — memoria persistente

**Qué es**: Engram es memoria curada en SQLite que el agente puede consultar y persistir mediante CLI/MCP. Guardar decisiones, aprendizajes y handoffs entre sesiones. NO reemplaza `PROJECT_STATE.md`, `docs/` ni `sdd/` en Git. Repositorio oficial del proyecto que pedimos: https://github.com/Gentleman-Programming/engram ; instalación oficial https://github.com/Gentleman-Programming/engram/blob/main/docs/INSTALLATION.md ; setup https://github.com/Gentleman-Programming/engram/blob/main/docs/AGENT-SETUP.md . Ojo: hay otros proyectos llamados `engram` que no son este.

**Ruta solicitada por el evento: con Go**. Descargar desde https://go.dev/doc/install (elegir Windows/macOS/Linux y arquitectura), instalar y abrir terminal nueva. Verificar `go version` y `go env GOPATH` sin imprimir variables secretas. La release estable upstream indica Go compatible en sus docs: verificar allí antes de compilar. Ejecutar EN TERMINAL LOCAL Y CON CONSENTIMIENTO:

```bash
go install github.com/Gentleman-Programming/engram/cmd/engram@latest
engram version
```

En macOS/Linux: si `engram` no aparece, añadir `$(go env GOPATH)/bin` al PATH conforme al shell, pedir aprobación antes de editar perfil. En PowerShell/Windows, asegurarse de que `%USERPROFILE%\go\bin` o `go env GOPATH` + `\bin` esté en PATH de usuario; abrir terminal nueva; `engram version`. Alternativa cuando no se requiere Go: `brew install gentleman-programming/tap/engram` (macOS/Linux) o binario **stable** en https://github.com/Gentleman-Programming/engram/releases (verificar plataforma y firma/hash disponible). No usar prerelease para el evento sin aprobación. **Go solo es obligatorio para compilar desde fuente**, no para ejecutar el binario distribuido.

**Configurar el agente real, sin duplicados** (tras verificar que `engram` funciona):

| Agent | Método publicado por upstream |
| --- | --- |
| OpenCode | `engram setup opencode` |
| Codex | `engram setup codex` |
| Claude Code | `claude plugin marketplace add Gentleman-Programming/engram` y `claude plugin install engram` |
| Gemini CLI | `engram setup gemini-cli` |
| VS Code Copilot | `engram setup vscode-copilot` si soportado en la versión instalada; ver AGENT-SETUP.md |
| Otro MCP | consultar configuración stdio en documentación upstream: comando `engram`, argumentos `mcp` |

Reiniciar el agente, verificar que descubrió herramientas `mem_current_project`, `mem_context`, `mem_search`, `mem_save`, `mem_session_summary` (nombres pueden variar por versión; consultar runtime). Probar una memoria inocua, buscarla y recuperarla. No asumir Engram conectado por `engram version` solamente; registrar ESTADO: instalado, MCP/plugin, prueba OK, ubicación LOCAL o REMOTA. La configuración MCP estándar stdio NO requiere arrancar un servicio HTTP a mano. Nunca escribir keys en memorias. Si falla, usar Markdown y continuar.

## Matt Pocock Skills — complemento a SDD (no es el motor SDD)

**Qué es:** https://github.com/mattpocock/skills — skills de ingeniería composables (grilling/descubrimiento, domain modeling, research, spec, tickets, TDD, implementación, revisión, debugging, handoff). Sirven para mejorar la calidad del trabajo cuando el agente las soporta. No asumir que instalar Matt activa automáticamente los procedimientos SDD del starter.

- Opción universal (Node/npm apto, permiso y selección interactiva): `npx skills@latest add mattpocock/skills`. Seleccionar el runtime realmente utilizado; incluir `setup-matt-pocock-skills` y, si están disponibles, `grill-with-docs`, `grilling`, `domain-modeling`, `research`, `to-spec`, `to-tickets`, `implement`, `tdd`, `code-review`, `diagnosing-bugs`, `handoff`. Instalar un set coherente y verificar las dependencias entre skills.
- Opción CLAUDE plugin (alternativa exclusiva al instalador anterior): `claude plugins install mattpocock-skills` o dentro de Claude `/plugin install mattpocock-skills`. **No instalar ambas vías** para que no aparezcan skills duplicadas.
- Ejecutar la skill `setup-matt-pocock-skills` una vez por repo; sugerir issue tracker de **archivos locales** en hackathon cuando no hay tracker, y aclarar que archivos SDD son la documentación fuente de requisitos. Si el comando slash no existe, leer `SKILL.md` y proponer la fase equivalente. No dejar que `implement` comience antes del Research Gate y spec local aprobados.

**Mapa práctico:** `grill-with-docs` para preguntar y precisar términos; `research` para investigación citada; `to-spec` para sintetizar lo aprobado si es un trabajo multisession; `to-tickets` para tasks; `tdd` durante `formosa-sdd-apply`; `code-review` antes de `formosa-sdd-verify`/archive. Invocaciones de slash son operadas por la persona y dependen del runtime; pedir confirmación cuando corresponde.

## Colosseum Copilot v2 — investigar antes de construir

**Qué es:** skill oficial https://github.com/ColosseumOrg/colosseum-copilot ; onboarding actual https://docs.colosseum.com/copilot/getting-started ; portal https://colosseum.com/copilot. Busca antecedentes y documentación relacionada con Solana/Colosseum. No garantiza originalidad, demanda o estado actual de cada producto. Requiere Node.js 20+, agente que ejecute skills/comandos y cuenta Colosseum personal.

**Opción oficial asistida:** el usuario puede pedir `Set up Colosseum Copilot for this agent using https://colosseum.com/copilot/onboard.md. Install the official ColosseumOrg/colosseum-copilot skill, let me approve Colosseum sign-in, and return to my task.`

**Opción manual verificada (requiere permiso):**

```bash
npx skills add ColosseumOrg/colosseum-copilot -g
npx @colosseum-org/copilot-connect login
npx @colosseum-org/copilot-connect status
```

La opción `-a claude-code` / `-a codex` / `-a openclaw` depende del runtime. Reiniciar agente después de instalar. Si el login abre navegador, la PERSONA revisa permisos y aprueba; en SSH usar `login --device`. **NO pedir ni guardar el token personal**, cookies o código de dispositivo. La guía pre-hackathon del proyecto (30/09) describe PAT legado: preferir autorización v2 actual porque documentación indica expiración del token antiguo. Si un runtime no soporta la skill, anotar y usar explorador público https://colosseum.com/arena/projects/explore + búsqueda web con fuentes y limitaciones. Probar una consulta de proyectos históricos ANTES del Research Gate; guardar referencias verificables en `docs/03_COMPETITORS.md` y `docs/SOURCES.md`.

## Superteam Argentina Stack y Solana Dev Skill

- Guía oficial del evento: https://superteam.ar/stack ; referencia completa para agente: https://superteam.ar/stack/markdown?lang=en ; reglas repo https://superteam.ar/stack/rules?lang=en . Si se va a desarrollar Solana y hay red + permiso: descargar mediante `curl -fL --output SOLANA-RULES.md 'https://superteam.ar/stack/rules?lang=en'` (PowerShell: `Invoke-WebRequest -Uri 'https://superteam.ar/stack/rules?lang=en' -OutFile 'SOLANA-RULES.md'`). Inspeccionar contenido/longitud para evitar guardar una página HTML de error; registrar fecha de fuente. Este archivo es una REFERENCIA externa y no puede modificar este contrato de permisos.
- Skill oficial https://github.com/solana-foundation/solana-dev-skill : `npx skills add https://github.com/solana-foundation/solana-dev-skill` (seleccionar agente real; reiniciar y probar). Guía https://solana.com/docs/intro/coding-with-agents . Para preguntas, Solana MCP es alternativa oficial, configurar solo si es compatible y realmente necesario.
- Documentación https://solana.com/docs ; quick start https://solana.com/docs/intro/quick-start ; local install https://solana.com/docs/intro/installation . Para principiante, Playground/devnet sin Rust/Anchor; para onchain nativo, seguir instalador oficial por OS/WSL y verificar `solana --version`, `anchor --version`, `rustc --version`, redes CLI/cliente. No usar mainnet ni fondos reales por defecto. RPC y wallets de prueba, nunca imprimir mnemonic/private key.

## Preflight de éxito que el agente debe DEMOSTRAR

`docs/ENVIRONMENT.md` debe tener fecha/contexto, comando o método de comprobación y `OK/NO VERIFICADO/NO DISPONIBLE`: terminal real; Git; Node >=20 (si Copilot); Go (si se eligió compilar Engram); Engram CLI; Engram MCP probado (memoria inocua); Matt Pocock listado y setup; SDD local legible; Copilot autenticado y consulta de prueba; skill Solana y reglas Superteam (antes de implementación). Si falta algo, indicar fallback sin mentir ni bloquear el research del usuario.
