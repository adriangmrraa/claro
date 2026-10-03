# Research de mercado

Estado: EN PROGRESO — primera pasada web completada (01/10/2026); pendiente Colosseum Copilot y validación con usuarios.
Metodología: búsqueda web con fuentes citadas en SOURCES.md. Etiquetas: [EVIDENCIA] / [HIPÓTESIS] / [SIN VERIFICAR].

## Preguntas falsables

1. ¿Existe ya un registry/marketplace de harnesses/configs de agentes IA con adopción real? → **Sí, varios** [EVIDENCIA]
2. ¿"Token por cada activo publicado" funcionó en algún producto comparable? → **No; el precedente directo (friend.tech) colapsó** [EVIDENCIA]
3. ¿Hay primitivas Solana actuales que resuelvan provenance/pagos/reputación mejor que un token especulativo? → **Sí: x402 + Solana Attestation Service** [EVIDENCIA]
4. ¿Alguien en Colosseum construyó un registry de configs/harnesses? → PENDIENTE Copilot [SIN VERIFICAR]
5. ¿Los usuarios pagan o esperan pagar por configs/harnesses? → [SIN VERIFICAR] — falta entrevista/validación

## Hallazgos principales [EVIDENCIA]

**El espacio "registry de configs de agentes" ya está poblado y es reciente:**
- `madebywild/agent-harness` (GitHub): se autodenomina "The Shadcn for agent harnesses" — single source `.harness/`, genera outputs para Codex/Claude/Copilot/Cursor, pull desde git registries externos. Casi la misma tesis que el repo previo del equipo. [S1]
- `AgentSpec` (agentspec.sh): registry + desktop app + CLI (`agentspec-cli`) para instalar configs/skills/rules en Claude Code, Codex, OpenCode, Cursor — con toggle install, backups, scope global/proyecto. **Es literalmente la mitad no-crypto de la idea del equipo.** [S2]
- `Sharebench`: registry de prompts/skills/agents/workflows via MCP, orientado a equipos. [S3]
- `Agent Shelf`: registry open de agent definitions (Markdown+YAML), GitHub auth, likes/comments, versiones inmutables. [S4]
- `Nuclexa/AgentHub`: marketplace estilo npm para agents/skills/MCP/rules con schema Prisma completo. [S5]
- `mcp.so`, `smithery.ai`, `MCP Registry` oficial (Anthropic/GitHub/Microsoft): registries de MCP servers; el oficial es deliberadamente "unopinionated" y espera que marketplaces downstream agreguen curación/reputación. [S6][S7]

**Precedente del modelo "token por activo":**
- friend.tech (2023): tokenizó personas con bonding curve ("keys"). Caída de ~95% en transacciones diarias en <20 días; bots monopolizaron el tramo rentable de la curva ("MEV income"); especulación desplazó la utilidad; fees+bots = salida neta de capital. BitClout/DeSo fallaron parecido. [S8][S9][S10] → Evidencia fuerte de que "uso/adopción → precio del token" no sostiene utilidad real.

**Primitivas Solana vigentes que resuelven el problema mejor:**
- **x402** (protocolo HTTP 402, soporta Solana mainnet/devnet, esquema `exact` con SPL/USDC): micropagos por recurso HTTP — "pagar para instalar" sin token propio. [S11][S12]
- **Solana Attestation Service (SAS)**: attestations onchain (identidad, hash, timestamp) — provenance de versiones y "verified use" sin inventar token. [S12][S13]
- Metaplex / NFT-based ownership ya usado en marketplaces de agentes (royalties 85/10/5). [S14]

**Precedentes Solana/Colosseum (nicho vecino: marketplaces de agentes):**
- Agent Bazaar (Colosseum Agent Hackathon Feb 2026): identidad onchain + reputación con anti-spam (1 rating/wallet) + pagos x402 USDC (97.5% al agente) + webhooks HMAC. Deployed mainnet. **Prueba que el patrón registry+reputación+pagos onchain ya fue ejecutado — pero para "contratar agentes", no para compartir configs.** [S15]
- AgentLink, THE AGENT BOOK, AgentMarket: mismo patrón (KYA, escrow SOL, reputación onchain) para hiring agent-to-agent. [S16][S17][S14]

## Gap hipotético (a falsar)

[HIPÓTESIS] Nadie combina **registry instalable de harnesses** (capa AgentSpec/agent-harness) con **provenance + reputación + pagos verificables onchain** (capa Solana). El "verified use" attestado onchain sería la señal que un registry centralizado no puede ofrecer de forma creíble.
Incertidumbre: (a) Copilot puede revelar un proyecto Colosseum ya hecho; (b) ¿a los builders les importa la provenance suficiente como para pagar/firmar?; (c) AgentSpec/agent-harness podrían agregar esto fácilmente → la ventaja no es el feature, es la red/datos.

## Usuario vs comprador vs decisor [HIPÓTESIS]

Usuario = dev que instala harnesses; "comprador" = el mismo (micropagos) o builders que quieren reputación; no hay decisor enterprise en v1.

## Pendiente

- Colosseum Copilot (requiere cuenta del usuario — pendiente).
- Entrevistas/validación con devs reales (¿reusan configs? ¿pagarían? ¿les importa autoría verificable?).
- Verificar reglas de elegibilidad Colosseum sobre proyectos preexistentes.
