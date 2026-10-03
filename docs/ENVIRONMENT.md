# Diagnóstico de entorno (sin secretos)

Fecha y zona horaria: 2026-10-01 (hora local del usuario)
EXECUTION_CONTEXT: LOCAL_USER
Evidencia del contexto / limitación: shell Git Bash (MINGW64) corriendo en Windows 10; lectura/escritura real sobre la carpeta del proyecto verificada.
Directorio del proyecto y permisos: `C:\Users\Asus\Documents\Hackaton Solana` — lectura/escritura verificadas.
SO y arquitectura [solo del entorno realmente inspeccionado]: Windows 10 x86_64 (MINGW64_NT-10.0-19044)
Modo habitual del participante: editor/agente por confirmar con el usuario.
Agente(s) disponibles: Devin CLI (agente actual, con acceso shell + fs + MCP).
Acceso a herramientas: shell | fs lectura | fs escritura | web | Git | skill/MCP [parcial]
Binarios/versiones relevantes: Git 2.51.0; Node v22.17.0; npm 10.8.2; pnpm PRESENTE; yarn PRESENTE; Python PRESENTE; Rust 1.98.1; Cargo 1.98.1; Go 1.26.1; VS Code (`code`) PRESENTE. AUSENTES: Solana CLI, Anchor, Surfpool, Docker, gh, bun.
Skills/MCP por nombre y resultado de una prueba inocua:
- 10 skills locales `formosa-sdd-*` en `.agents/skills/` — archivos presentes y legibles.
- Engram MCP: servidor configurado pero `list_tools` falla — NO OPERATIVO (pendiente diagnóstico).
- Otros MCP configurados: context7, notion, codebase-memory-mcp, pencil (sin probar).
- Matt Pocock skills: NO DETECTADAS en `.agents/skills/`.
Colosseum Copilot: NO REVISADO
Reutilizable sin instalar: Git, Node/npm/pnpm, Python, Rust/Cargo, Go, VS Code, skills SDD locales.
Ausente pero necesario ahora: ninguno estrictamente para la fase de investigación (init/explore no requiere toolchain Solana).
Opcional más adelante: Solana CLI + Anchor/Surfpool (solo si el Research Gate decide onchain), gh CLI, Engram MCP funcional, Matt Pocock skills, Colosseum Copilot.
No aplicable a este proyecto: por determinar tras conocer la idea.
Permisos concedidos y pendientes (nunca secretos): diagnóstico de solo lectura ejecutado; ninguna instalación autorizada aún.
Bloqueo principal + fallback viable: Engram MCP caído → fallback 100% Markdown en `docs/` y `sdd/` según regla de persistencia.

## Update 01/10/2026 — toolchain build instalado

- **Solana CLI (Agave) v4.3.0**: INSTALADO — tarball oficial windows-msvc extraído a `~/.local/share/solana/install/active_release/bin`, persistido en `~/.bashrc`. `solana`, `solana-keygen`, `solana-test-validator`, `cargo-build-sbf`, `cargo-test-sbf` OK. Config: devnet.
- **Anchor/avm**: NO instalado — host Rust es `windows-gnu` sin dlltool funcional; compilar crates host falla. No hay winget/scoop/choco ni VS Build Tools (sin `cl`/`link` MSVC).
- **cargo build-sbf**: instalado pero BLOQUEADO — platform-tools v1.57 asume host MSVC y linkea con `link.exe` de Git → build scripts fallan. Requiere VS Build Tools o WSL.
- **Skills**: instaladas en `.agents/skills/` del proyecto: `solana-dev` (solana-foundation oficial), `solana-hackathon`, `winning-pitch-deck` (STCA).
- **BLOQUEO ÚNICO que requiere acción manual del usuario (admin):** una de estas dos:
  1. `wsl --install` en PowerShell **como administrador** (luego dentro de Ubuntu: instalar solana+anchor vía script oficial), o
  2. Instalar Visual Studio Build Tools 2022 con workload "Desktop development with C++".
- **Mientras tanto**: el stack TS funciona completo (Node 22, npm/pnpm) — todo el trabajo client-side (SAS vía `sas-lib`, x402, dashboard) NO está bloqueado. Solo compilar/desplegar el programa propio requiere el paso admin.

## Update 01/10/2026 (bis) — toolchain COMPLETO vía WSL

WSL instalado (Ubuntu, WSL1 — suficiente para builds; WSL2 opcional). Toda la toolchain vive DENTRO de WSL bajo usuario `adriangmrra`. Ejecutar desde Git Bash: `wsl -d Ubuntu -- bash -lc "<cmd>"`.

- **rustc 1.99.0** + cargo (rustup)
- **solana-cli 4.3.0** (Agave, config devnet)
- **anchor-cli 1.2.0** (binario precompilado otter-sec/anchor — avm instalado pero su DNS falla bajo WSL1; no necesario)
- **node v22.23.3 + npm 10.9.9** (NodeSource)
- PATH persistido en `~/.bashrc` de WSL (solana active_release + cargo bin)

**Todo desbloqueado**: programa Anchor propio compila (`anchor build` → build-sbf linux), `anchor test` con test-validator, deploy a devnet, y stack TS client-side. El bloqueo admin quedó resuelto por el usuario (DISM features + wsl --install -d Ubuntu).
