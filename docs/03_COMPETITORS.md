# Competencia e histórico de Colosseum

Estado: EN PROGRESO — web research + Colosseum Copilot consultados 01/10/2026 (skill v2.0.1, evidence:read verificado).
La búsqueda sin resultados NO valida originalidad — y de hecho la búsqueda SÍ encontró competidores cercanos.

## Antecedentes Colosseum (Copilot, consulta directa)

**Hallazgo central: la idea fue intentada ~6 veces en el hackathon Frontier; NINGUNA ganó premio.**

| Proyecto | URL | Hackathon | Award | Qué construyó / lección |
|---|---|---|---|---|
| Skillmarkdown | https://colosseum.com/projects/explore/skillmarkdown | Frontier | ninguno | Registry + distribución + monetización de AI skills en Solana ("propiedad programable, pagos, acceso verificable"). Team 2. Solo pitch a cámara, SIN demo técnica. → La idea sola sin demo funcional no alcanza. |
| Skill Loops Protocol | https://colosseum.com/projects/explore/skill-loops-protocol | Frontier | ninguno | **El más cercano al modelo "uso → ownership":** comprador empieza con 0% equity y gana shares por "usage experience" validada por un AI Judge; revenue pool en SOL pro-rata. Contenido en Arweave+Lit, demo funcional con Phantom. → El modelo token/equity-por-uso ya se probó y no ganó. |
| SkillHive-Marketplace | https://colosseum.com/projects/explore/skillhive-marketplace | Frontier | ninguno | App Store de skills: 3 tiers (prompts, MCP, agentes), micropagos SOL, escrow, path x402, fee 5%. → Pagos por uso en SOL ya implementados. |
| Merrit Protocol | https://colosseum.com/projects/explore/merrit-protocol | Frontier | ninguno | **Literalmente "token por skill":** convierte skills en "Skills Tokens" con AMM pools, "demanda real de invocación como base del activo tradable", estándar agentskills.io. → La variante especulativa exacta del equipo, ya intentada, sin premio. |
| DNAcloud | https://colosseum.com/projects/explore/dnacloud | Frontier | ninguno | Marketplace de "DNA packages" para Claude Code (skills + sub-agents + MCP). |
| leverbrain | https://colosseum.com/projects/explore/leverbrain | Frontier | ninguno | Marketplace de skills/strategies/blueprints como activos estructurados. |

**Ganadores en el espacio vecino (qué SÍ premió Colosseum):**

| Proyecto | Premio | Qué hizo | Lección |
|---|---|---|---|
| MCPay (https://colosseum.com/projects/explore/mcpay) | 1st Place Stablecoins, cypherpunk | Infra x402: pay-per-call para MCP servers, proxy de verificación | Los premios fueron a RIELES (pagos/infra), no a marketplaces de activos tokenizados |
| Latinum Agentic Commerce (https://colosseum.com/projects/explore/latinum-agentic-commerce) | 1st Place AI, breakout | Middleware x402: agents pagan servicios con wallet Solana + facilitator | Ídem: ganó el plumbing de pagos agent-to-service |
| Agent Bazaar | Colosseum Agent Hackathon Feb-2026 (mainnet) | Identidad+reputación+x402 para hiring de agentes | El patrón registry+rep+pagos onchain funciona técnicamente |

**Implicancia para el gate:** la idea base (marketplace/registry de capacidades de agentes en Solana) está saturada EN Colosseum — seis intentos, cero premios. Diferenciadores posibles: (a) profundidad técnica real (install flow verificado, provenance SAS) vs. pitches sin demo; (b) enfoque en HARNESSES completos multi-runtime vs. skills individuales; (c) la base de código ya existente en platform/ es más seria que todo lo visto. El componente token-por-activo tiene el peor historial de todos.

## Competidores directos (registry de configs/harnesses de agentes)

| URL | Tipo | Usuario/problema | Fuente y fecha | Estado ACTUAL comprobado | Gap hipotético | Incertidumbre |
|---|---|---|---|---|---|---|
| https://agentspec.sh | Registry + desktop app + CLI | Devs que quieren instalar configs/skills/rules en Claude Code/Codex/OpenCode/Cursor | Web search 01/10/2026 | Activo (sitio y npm CLI en línea) | Sin capa onchain: no hay provenance, pagos ni reputación verificable | Tracción real desconocida ("0 community-curated" sugiere early) |
| https://github.com/madebywild/agent-harness | CLI/librería TS, modelo shadcn | Single source `.harness/` → outputs por proveedor; git registries externos | Web search 01/10/2026 | Repo activo | Idem: sin identidad/pagos/reputación; no es red social | Adopción no medida |
| https://sharebench.ai | Registry SaaS vía MCP | Equipos que comparten prompts/skills/agents/workflows | Web search 01/10/2026 | Activo | B2B/team, no público/social; sin onchain | Precios y tracción desconocidos |
| https://www.agentshelf.dev | Registry open (Markdown+YAML) | Publicar/descargar agent definitions multi-tool; GitHub auth, likes/comments | Web search 01/10/2026 | Activo, gratis | Sin instalación 1-click tipo desktop; sin onchain | Volumen de agentes publicados desconocido |
| https://github.com/JoshElieson/AgentHub | Marketplace estilo npm (Nuclexa) | Agents/skills/MCP/rules con versionado, reviews, permisos | Web search 01/10/2026 | Proyecto repo (madurez incierta) | Sin onchain; aparenta ser proyecto individual | Estado real del producto |

## Infra/protocolos adyacentes

| URL | Tipo | Relevancia | Estado |
|---|---|---|---|
| https://mcp.so | Directorio MCP servers | Canal de discovery alternativo | Activo |
| https://smithery.ai | Registry + deploy de MCP servers, API | Estándar de facto para MCP discovery | Activo |
| MCP Registry oficial (Anthropic/GitHub/MS) | Metadata repo central | Diseñado para que marketplaces downstream agreguen curación → nuestro producto sería un "downstream aggregator" natural | Activo |

## Precedentes Solana / Colosseum (mismo patrón, nicho vecino: hiring de agentes)

| URL | Proyecto | Qué probaron | Estado | Gap vs nuestra idea |
|---|---|---|---|---|
| https://agentbazaar.org (repo MetaPsilo/Agent-Bazaar) | Agent Bazaar — Colosseum Agent Hackathon Feb 2026 | Identidad onchain, reputación anti-spam (1 rating/wallet), x402 USDC 97.5% al agente | Mainnet+devnet | Es para *contratar agentes*, no instalar configs; pero YA usaron x402+reputación onchain |
| https://colosseum.com/agent-hackathon/forum/6880 | AgentLink | KYA + escrow + auto-hire a2a | Devnet | Idem, hiring no configs |
| https://colosseum.com/agent-hackathon/projects/the-agent-book | THE AGENT BOOK | Discovery protocol + escrow + reputación | Devnet | Idem |
| https://github.com/iamaanahmad/agentmarket | AgentMarket (ganador AWS Global Vibe 2025) | NFT ownership + escrow + reputación + royalty split | Devnet | NFT-por-agente ≈ "token por activo" pero con ownership, no especulación de uso |

## Evidencia CONTRA el token-por-harness (modelo propuesto original)

| URL | Caso | Resultado |
|---|---|---|
| https://techcrunch.com/2023/08/28/friend-tech-daily-transactions-drop/ | friend.tech — tokenizar personas con bonding curve | -95% transacciones diarias en <20 días; especulación mató utilidad |
| https://designingtokenomics.com/designing-tokenomics-blog/the-friendtech-case-study-bad-incentives-lead-to-bad-outcomes | Análisis de incentivos | Creador solo gana si hay volumen de trading → incentiva hype, no calidad |
| techflowpost.com/en-US/article/14427 | Análisis de la curva | Bots capturaron el tramo rentable (MEV); clones sin wealth effect no atraen |
| https://tokenist.com/on-chain-data-shows-friend-techs-hype-was-short-lived/ | Datos onchain | Fees -90%+; la mayoría de "subjects" sin followers no llegaron a nada |

## Pivote: investigación de opción A (pagos frontera AR-PY) — 01/10/2026

**El dolor base ya fue resuelto por actores grandes EN el corredor específico:**

| Solución existente | Qué resuelve | Fuente |
|---|---|---|
| Mercado Pago/MODO/Ualá/Naranja X ↔ Upay+Depay (desde jul-2025) | Argentino paga QR en Paraguay: débito ARS → crédito PYG instantáneo al comercio | [S21][S22] |
| SML BCRA-BCP (desde 2021) | Pagos en moneda local AR-PY incl. remesas familiares | [S23] |
| Lemon/Belo + interoperabilidad Mercado Pago | Wallet crypto paga QR fiat argentino (USDC→ARS backend) | [S24][S25] |
| Ripio wARS | Stablecoin de peso argentino (Ethereum/Base/WorldChain) | [S26] |
| PIX Brasil ↔ USDT | Millones de argentinos pagan comercios brasilero con QR | [S24] |
| Cambistas/cuevas informales | ~4.000-6.000 cuevas "compro USDT efectivo" en BA; cambistas Clorinda activos | [S24][S27] |

**Colosseum — el patrón "crypto→QR local" está saturado (12+ intentos):** LocalPay (winner, breakout, 3ro Stablecoins), Midatopay (ARS QR→USDC merchants LatAm), CacaoCash (turistas LatAm), Stableyard (QR standards↔stablecoin), cachin, QRSOL (Tailandia), Cash Node (Nigeria cash), Digitpay, NexaPay, SuzuPay, TakumiPay (Indonesia), SOLBridgeX (India UPI). Solo 1 ganó.

**Gaps que sobreviven el análisis [HIPÓTESIS]:**
- Dirección inversa: PYG/efectivo → USDC (paraguayo/formoseño con guaraníes). No hay PYG stablecoin ni rampa PYG formal.
- Comercio fronterizo cobrando crypto directo (sin pasar por MP/Upay), liquidando a PYG cash vía P2P.
- El mercado cambista informal no tiene rail digital eficiente.

## Pivote: investigación de opción C (reputación economía informal) — 01/10/2026

**Colosseum — ~12 intentos, CERO premios:** CredIA (microcrédito informal LatAm, score alternativo), Strand (reputación gig workers), V3LA (lending informal LatAm), CreditChain (estudiantes África), uLendMe (social vouching + PoW), CampusFi (Indonesia), Lendra (score onchain), Saathi Loan (Nepal), Tribe (identidad confianza comercio social), Openvouch (attestation lending), CredenceChain, wren. Patrón del fracaso: casi todos apuntaron a lending/microcrédito → requiere capital y gestión de riesgo, indemostrable en hackathon.

**Variante no intentada:** no lending sino *prueba de ingresos portable* — attestations onchain (SAS) firmadas por clientes/pagadores hacia el wallet del trabajador informal → historial verificable para alquilar/acceder a crédito. Bloqueo central: sybil de attestations (wallets falsas auto-atestándose) + bootstrapping (¿quién attesta primero?) + privacidad.

## Exploración: Salud/datos clínicos onchain (idea "dentalogic + Solana") — 01/10/2026

**Corrección técnica registrada:** datos clínicos/mensajes onchain ≠ más seguros. Blockchain da integridad+timestamp, NO confidencialidad (todo es público). Conflicto con derecho al olvido (GDPR/HIPAA/Ley 25.326+26.529 AR). Patrón legítimo = datos offchain + hash/commitment onchain (audit trail tamper-evident).

**Colosseum — health records onchain, ~10 intentos, CERO premios:** BioVault (permissioned fork+IPFS), Panarogya (India), MedVault, LuminaCare (audit trail médico — la variante correcta), ZKHealth, HealthGuard, BioMint (tokenizar datos clínicos), SocialDiverse (consent layer neurodivergencia), MedAgent, Open-S.

**Colosseum — notarización/audit trail genérico, ~10 intentos, CERO premios:** Notary-chain, APROOF, AgreeVault (hash-only correcto), Callydus Sign, Proof Chronicle, Trucer, Legal, BlinkProof (provenance media), Prova (attestations de acciones de agentes), Sealevel Health.

**Conclusión del análisis:** el patrón técnicamente correcto (hash anchoring) existe, fue intentado, y nunca ganó. Valor real existe (disputas legales, consent receipts) pero comprador B2B lento + demo poco vistosa = mal fit de hackathon. Idea evaluada: **NO recomendada como candidato** salvo validación fuerte de dolor en clínicas reales.

## Barrido global de espacios (Copilot, 01/10/2026) — lección meta

Verificados 4 espacios "calientes" adicionales; TODOS saturados y con cero premios:

| Espacio | Intentos encontrados | Premios |
|---|---|---|
| Guardrails/disputas de pagos de agentes (x402 accountability) | ~20 (Pact, Agent Dispute Protocol, Payjent, Cleared, x402guard, AgentTrust, AgentVault, REIN, Sage, Kyvern, Leviathan, Sentinel, SettleProof, Agent-Cred, SNSIP-Agent, Accural, Bottie...) | 0 |
| Payroll confidencial / pagos privados | ~12 (Stealth Payroll, Ghost Pay, CloakPay x2, VeilPay x2, CloakPayables, NovaPay, Palmwire, Hush, Onyx, Aster) | 0 |
| Escrow/checkout con protección al comprador | ~11 (HorizonPay, Solcart, Vigent, Umon, SHIELD-PAY, Trustless Work, SEP, Mileston, SettleFlow, OPINSPACE) | 0 |
| Agentes↔humanos (task marketplaces) | ~11 (Ayudantech, Task3, HumanLayer, Gigentic, FrontierX, Cogladius, DeAnno, Clustly, AI SaaS@SOL, IdollyAI, Yapper) | 0 |
| Pay-per-crawl / licencias de contenido para agentes | ~9 (TollGate, Sello, Cryptorights, CTRL+X, IPTO, Brain Drain, Veloran, AgentPay, Uwill) | 0 |

**Lección meta (evidencia, no opinión):** en Colosseum el "espacio vacío de protocolo" casi no existe — todo lo obvio se intentó 10-20 veces. Lo que históricamente ganó (LocalPay, MCPay, Latinum, Paytos SMS, Credible USD-INR, Solana ATM, Humanship ID) fue: **corredor real con usuarios concretos + riel nuevo en el momento justo + demo con plata real moviéndose.** No la novedad abstracta del concepto.

**Implicación para la búsqueda:** optimizar por "idea que no exista" es la trampa equivocada. Optimizar por: ¿qué corredor/superficie nueva puedo tocar con usuarios reales esta semana? Los espacios verdaderamente delgados quedan donde hay barreras externas (regulatorias, de plataforma) o superficies recién creadas (<12 meses).

## Pivote: investigación de opción D-bis (votación electoral onchain desde el celular) — 01/10/2026

**Veredicto: NO recomendada. Triple evidencia negativa.** Dossier completo: `docs/CANDIDATE_D_voting.md`.

**Colosseum (Copilot, 01/10/2026):** cluster "Solana-based Decentralized Voting Systems" n=**130 proyectos**; las dos consultas devuelven top-25 íntegramente sin premio (SolVote — KYC+NFT, la variante exacta —, Elec-chain, Devos, VoteChain, Votenet DAO, ZkVote, Baloteer, EnigmaVote, Terra Dourada, IDv2, Janamat, CivicYield, United Humans...). Categoría `governance` completa: 357 proyectos → 6 winners, **ninguno es votación electoral** (Quadratus quadratic-voting DAO, AlphaFC club de fútbol, LivingIP, Blonk, Echo, Superfan). Lo premiado = gobernanza de comunidades crypto-nativas con identidad ya resuelta, no elecciones.

**Mundo real:** Voatz (única app de voto móvil usada en elecciones federales EE.UU.) auditada por MIT/USENIX 2020 → vulnerabilidades que alteran/exponen el voto; WV la abandonó. Park/Specter/Narula/Rivest "Going from Bad to Worse" (2021): blockchain voting introduce problemas nuevos (recibo criptográfico = prueba vendible → compra de voto a escala) y no resuelve endpoint/coerción; internet voting sin efecto probado en participación. Estonia i-voting funciona SIN blockchain — su pilar es el e-ID nacional, no el ledger. Argentina: Ley 27.781 impone Boleta Única de Papel; art. 33 CNE excluye electrónica de la emisión del voto → sin cliente adoptable.

**Fallo estructural:** el ledger resuelve la parte fácil (tamper-evidence, que un hash-chain en DB también da) y NO resuelve identidad (padrón = autoridad central obligatoria), secreto-vs-verificabilidad, endpoint comprometido, ni coerción. Falla la prueba de extracción en ambas direcciones.

## Pivote: investigación de opción O (capa de human-verification para agentes / "DNI agéntico") — 01/10/2026

**Veredicto preliminar: CANDIDATO FUERTE (pendiente Research Gate).** Dossier completo: `docs/CANDIDATE_O_agentic-dni.md`.

**Colosseum (Copilot, 01/10/2026):** ~25 proyectos adyacentes, **0 winners** — Parakletos (agent passports, la tesis más literal), Regent Protocol (KYC→agente pero como gestión propia, demo en ERC), AgentGate (gate de pagos por políticas del dueño, no credencial pública de humano), Agent-Cred (hotkey/coldkey custodia), Mandate.md, NomadPass, Bonded Protocol, MinKYC, Krexa, Hyre Agent, Agent Keys, Agent Trust, Verun, Sentinel, Aperture, Agentic, SNSIP-Agent, CGAE. **Vacío verificado: nadie hizo credencial de humano-verificado exigible económicamente (verificable por terceros / dentro de programas).** Humanship ID (5to cypherpunk) ganó en personhood humano — vecino, no competidor.

**Mercado real:**
- **ERC-8004 "Trustless Agents"** — mainnet 29/01/2026, 22 chains, autores Google/Consensys. Registry de identidad de agente **seudónimo** (NFT); `supportedTrust` no contempla human-binding → la capa humana quedó FUERA del estándar. Ventana abierta literalmente esta semana.
- **Skyfire KYA/KYAPay** — humano-verificado→agente productizado, a16z-backed, pero cerrado: JWTs off-chain firmados/verificados por Skyfire (issuer=verifier), suscripción paga, **no consumible por programas onchain**.
- **agentid-kya-solana** — repo OSS: KYA+treasury+x402 en Solana devnet, pero sin binding a humano verificado real.
- **Regulación en movimiento** [EVIDENCIA]: Filipinas HB 11014 propone "Digital Authority Credential" verificable criptográficamente; Brasil PL 974/2026 exige agentes vinculados a CPF/CNPJ; US AI AGENT Act draft (registro FTC); IETF drafts AIP/AIRS estandarizando.
- **Rails destino**: MCPay (1ro Stablecoins), Latinum (1ro AI) — la tubería de pagos x402 ya ganó premios; la cerradura (quién puede usarla) es la capa faltante.

**Extracción:** pasa SOLO si el producto es compuerta onchain (programas que exigen attestation SAS en la misma tx) — un JWT de Skyfire no puede ser verificado dentro de un programa Solana sin oráculo. Verificador web puro = sticker.

**Condición de éxito identificada:** ≥1 x402 facilitator/merchant confirmando "gatearíamos con esto". Cold-start = el riesgo central, no la técnica.

## Conclusión parcial

1. La mitad "social + registry + install" de la idea **ya existe** (AgentSpec es el más cercano). Diferenciarse solo ahí es pelear contra productos con head start.
2. El patrón Solana de registry+reputación+pagos **ya fue ejecutado** en el nicho vecino (hiring de agentes) — eso valida la viabilidad técnica pero también significa que el diferencial tiene que ser el *dominio* (harnesses instalables), no el patrón.
3. El token-por-harness especulativo tiene evidencia histórica **negativa fuerte**. Alternativa con mejor respuesta al "por qué Solana": SAS (provenance/verified-use) + x402 (pagos directos) + opcional staking/curación.
4. PENDIENTE: Colosseum Copilot para verificar que nadie hizo exactamente esto en hackathons previos.
