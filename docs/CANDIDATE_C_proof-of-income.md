# Candidato C — CLARO: prueba de ingresos portable para la economía informal

> **Nombre elegido (01/10/2026):** **CLARO** — tesis: de cobrar *en negro* a cobrar *en claro*. El nombre ES el movimiento del producto.
>
> **Narrativa:** "La informalidad no es falta de trabajo — es falta de prueba. ~2 mil millones cobran plata real todos los días y son invisibles al sistema. CLARO convierte los cobros que ya recibís en evidencia que es tuya: no cambiás tu trabajo ni tus clientes, solo el riel por donde entra la plata. El pagador paga en moneda local por un link, llega USDC onchain, y cada cobro construye un historial verificable — imposible de falsificar, portable, tuyo para siempre. No prestamos plata ni somos un score: somos la prueba."
>
> **Pitch de 60s (borrador):** informal = invisible, no por mal pagador sino porque nada deja rastro → CLARO: link de cobro fiat→USDC → historial onchain → informe verificable compartible → evaluador verifica solo, sin confiar en nosotros → Destácame probó el mercado con scores opacos; MAINDOCS ganó con el mecanismo; nadie aplicó esto al ingreso informal → "somos la prueba, no el juez".
>
> **Estado:** CANDIDATO guardado para decisión de Research Gate (aún NO aprobado — pendiente validación con usuarios).
> **Fecha de compilación:** 01/10/2026 · **2da pasada de research:** 01/10/2026 · **Equipo:** 2-3 personas · **Fuentes:** docs/SOURCES.md ([S1]-[S32], [C1]-[C23])

---

## 1. La idea en una frase

Una wallet/producto donde un trabajador informal **cobra en USDC**, y su historial de cobros onchain — pagos reales de terceros — se convierte automáticamente en una **prueba de ingresos verificable y portable** que puede presentar ante inmobiliarias, prestamistas, tarjetas o cualquier evaluador.

**"Tu historial de cobros es tu historial crediticio."**

No es un sistema de reputación opinable. No hay reviews, no hay estrellas, no hay "fulano dice que es buen pibe". Hay transacciones reales con contrapartes reales, o no hay nada.

---

## 2. El problema real [HIPÓTESIS con evidencia de contexto]

- Argentina tiene una masa enorme de trabajadores informales (albañiles, empleadas domésticas, changas, monotributistas subfacturando, delivery, feriantes).
- Sin recibo de sueldo formal **no podés alquilar** (inmobiliarias piden recibo + garantía propietaria), no accedés a crédito bancario, ni tarjeta, ni casi nada del sistema formal.
- El workaround actual: fotocopia de "constancia de trabajo" firmada por un conocido, extractos de billetera fácilmente falsificables, o simplemente quedarse afuera.
- **Validación pendiente [SIN VERIFICAR]:** confirmar con 2-3 personas informales reales que este dolor les bloqueó algo concreto (alquiler, crédito, tarjeta). Esa entrevista es el paso siguiente del gate.

---

## 2bis. Distinción clave: lending ≠ informe verificable

Esta es LA diferenciación que separa a este candidato de los ~12 proyectos que murieron:

**Lending = prestar plata.** El protocolo deposita USDC, otro lo toma prestado, hay que fijar precio al riesgo y cobrar morosos. Requiere capital real, regulación financiera y gestión de defaults — indemostrable en un hackathon. Todos los antecesores apuntaron acá ("le prestamos al informal porque su score dice que es bueno") y murieron desde el diseño: ¿de dónde sale la plata? ¿quién absorbe el default?

**Informe verificable = solo evidencia.** El producto NO presta nada ni decide nada. Emite un hecho criptográficamente comprobable: *"este wallet recibió $X USDC de N pagadores distintos durante Y meses"*. Quien evalúa (inmobiliaria, prestamista, empleador) decide solo.

| | Lending | Informe verificable |
|---|---|---|
| Qué hace | Presta plata, asume riesgo | Muestra hechos onchain |
| Capital | Necesita pool de plata | Cero |
| Quién decide | El protocolo evalúa riesgo | El evaluador decide con la evidencia |
| Si falla | Default = plata perdida | Nada — es un documento |
| Regulación | Financiera pesada | Casi nula (es un reporte, no un producto financiero) |

Analogía: es un **extracto bancario que no se puede photoshopear y le pertenece al trabajador** — no le decís al inmobiliario "prestále", le decís "mirá, cobra seguido de gente distinta hace meses; verificalo vos mismo acá".

---

## 3. Por qué Solana es esencial (prueba de extracción)

| Pregunta | Respuesta |
|---|---|
| ¿Una DB centralizada resuelve esto? | No de forma creíble. Una app puede quebrar, bannear al usuario, o el evaluador puede desconfiar del operador. El valor del historial es que **no depende de ninguna empresa**: las transacciones son del usuario, en su wallet, verificables por cualquiera sin permiso. |
| ¿Qué hace Solana concreto? | (a) **Settlement** — USDC con fee ~$0.00025, cobro viable para pagos chicos; (b) **verificabilidad** — historial público auditable por cualquiera, no falsificable como un PDF; (c) **anclaje** — hash del informe onchain vía SAS = a prueba de modificación + timestamp; (d) **portabilidad** — el historial vive en la wallet del usuario, sobrevive a cualquier app. |
| ¿Qué NO va onchain? | PII, historial crudo compartido, el reporte completo (solo su compromiso/hash). |
| Si le quitás Solana, ¿queda producto? | Queda "un Excel de tus cobros" que cualquiera puede editar. La verificabilidad IS el producto. → Solana pasa la prueba de extracción. |

**Aclaración sobre el analogía monotributo:** el informe prueba que la plata *se recibió* (es real), NO que sea ingreso declarado (es legal). Son capas distintas — el monotributo responde a AFIP, nosotros respondemos al evaluador.

---

## 4. Qué se investigó

1. **Colosseum Copilot (autenticado, API v2):** búsqueda de precedentes en todos los hackathons. Resultado: **~12 proyectos intentaron reputación/crédito para informales — CERO ganaron premio.**
2. **Web research:** adopción crypto Argentina (61.8% stablecoin adoption, más alta del mundo — [S24][S25]), estado de pagos QR, mercado cambista informal.
3. **Análisis de por qué fallaron los intentos:** patrón detectado abajo.

---

## 5. Lo que ya existe

### 5.1 En Colosseum (todos sin premio)

| Proyecto | Qué intentó | Por qué no es lo mismo |
|---|---|---|
| CredIA | Microcrédito informal LatAm, score alternativo 0-1000 | Lending = necesita capital y gestión de riesgo |
| Strand | Reputación + crédito para gig workers | Protocolo de lending, no prueba de ingresos |
| V3LA | Lending para emprendedores informales LatAm | Lending devnet, no verificador de ingresos |
| uLendMe | Microcrédito con social vouching | Vouching opinable = falsificable; lending |
| Openvouch | Attestation framework para lending | Attestations no atadas a pagos reales |
| Tribe | Identidad de confianza para comercio informal P2P | Confianza social, no historial de cobros |
| Lendra | Credit scoring por historial de wallet | Score opaco de wallet, no "prueba de ingresos" presentable |
| CreditChain, CredenceChain, CampusFi, Saathi, wren | Variantes de scoring/lending | Mismo patrón: lending o score, no comprobante |

**Patrón del fracaso colectivo:** todos apuntaron a *lending* (prestar plata onchain requiere capital, pricing de riesgo, cobro de morosos — indemostrable en una demo) o a *scores/reputación opinables* (falsificables, sin ancla en dinero real).

### 5.2 En el mercado real

- Extractos bancarios / historial de Mercado Pago: existen pero son (a) del tradicional, excluye informales, (b) PDF/截图 falsificable, (c) propiedad de la plataforma.
- Veraz/Nosis (scoring crediticio AR): cubren solo sistema formal.
- "Constancia de trabajo" informal: papel firmado por un conocido — el estándar actual, falsificable trivialmente.
- Lemon/Belo/etc.: los usuarios YA cobran y pagan en USDC en Argentina — la rampa de adopción está hecha, falta el producto que *convierte ese historial en documento verificable*.

### 5.3 Segunda pasada (01/10/2026) — Colosseum + mercado real

**Colosseum — el patrón "wallet → documento verificable" SÍ ganó una vez:**

| Proyecto | Qué hizo | Relevancia |
|---|---|---|
| **MAINDOCS** 🏆 (Renaissance, WINNER) | Convierte actividad onchain de wallets en **documentos verificables** (estados de gastos, plan de cuentas) con QR de verificación y portal de validación | Valida el mecanismo central: historial de wallet → documento que un tercero verifica sin confiar en el emisor. Diferencia: apuntó a contabilidad/empresas, NO a ingresos de informales |
| EarnID (Frontier) | Income verification para freelancers africanos — pero con **entrada manual/CSV** | Self-reporting = falsificable; C ancla en pagos reales. Sin premio |
| Seel (Frontier) | Income attestation privacy-preserving para DeFi lending | Attestation + lending, no informe para evaluadores offchain. Sin premio |
| ZK Credit Passport (Frontier) | Portabilidad de crédito cross-border vía ZK | Porta historial de crédito formal, no crea prueba de ingresos. Sin premio |
| giogio (Frontier) | Earned Wage Access para freelancers | Adelanto de sueldo, no evidencia. Sin premio |

**Mercado real — quién resuelve esto HOY y cómo:**

| Producto | Enfoque | Por qué no cubre al informal crypto |
|---|---|---|
| **Destácame** (Chile/México, 7M+ usuarios, 40+ bancos incl. BBVA) | Score alternativo desde **facturas de servicios** (luz, gas, celular) compartido con bancos — "Dicom positivo" | Prueba que el dolor es real y que evaluadores SÍ aceptan evidencia alternativa estructurada. Pero: score opaco, depende de su plataforma, y no captura a quien no tiene servicios a su nombre |
| **zkTLS / Reclaim Protocol** | Prueba ZK de datos web ("gano ≥$X en mi banco") con divulgación selectiva | Ruta técnica potente PERO requiere que exista el dato en un banco/app — el informal que cobra cash/USDC no tiene nada que probar ahí. Es infraestructura, no producto para informales |
| Esusu / rent-reporting (US) | Reporta pagos de alquiler a burós de crédito | Solo EE.UU., solo alquiler, solo si ya alquilás |
| Argyle/Pinwheel/Truv | Verificación de ingresos por APIs de nómina | Cubren empleo formal/gig con payroll digital, no informal puro |
| zkSalaria (GitHub) | Proof "gano ≥$X" onchain sin revelar monto | Mismo patrón que Seel: threshold proof para lending, no informe portable |

### 5.4 El gap que sobrevive (refinado)

[HIPÓTESIS] Nadie construyó: **historial de ingresos = pagos USDC reales recibidos de terceros**, empaquetado como **informe verificable** que un evaluador offchain chequea sin confiar en nadie — para el segmento que cobra (o podría cobrar) en stablecoins.

**Refinamiento de segmento (nuevo insight 2da pasada):** el wedge más afilado quizás no es "albañil que cobra cash" (no recibe USDC hoy) sino **freelancers/creadores/devs de mercados emergentes que YA cobran en USDC de clientes extranjeros** — su ingreso es real pero invisible para el sistema formal local (no pueden alquilar ni acceder a crédito pese a ganar en dólares). Segmento global, crypto-nativo ya, sin rampa de adopción necesaria. A contrastar en las entrevistas.

---

## 6. LO QUE NO HAY QUE HACER (anti-patterns, si se elige este proyecto)

1. **NO hacer lending.** No prestamos plata, no somos pool de crédito, no evaluamos riesgo. Somos la *prueba* que otros usan para evaluar. Lending mata el MVP: capital, regulación, morosos. (Todos los antecesores murieron acá.)
2. **NO token especulativo.** Ningún token propio ni token-por-usuario. Evidencia friend.tech + Merrit Protocol: destruye la utilidad y responde mal al "¿por qué un token?".
3. **NO attestations opinables/auto-firmables.** Si yo me creo 50 wallets y me attest trabajos falsos, el sistema muere. La attestation válida es **un pago real recibido**, no una declaración. Los attest de contexto ("le pagué por albañilería") son metadata secundaria, nunca la prueba base.
4. **NO swaps propios = ingresos.** Mover plata entre mis wallets no cuenta. La regla de credibilidad: **N pagadores distintos externos × tiempo × montos consistentes**. El diseño debe excluir explícitamente self-transfers y ciclos conocidos.
   - **Corolario (discusión 01/10/2026):** convertir MI cash en USDC via ramp/OTC/cueva/P2P es AUTO-FONDEO, no ingreso — aunque la wallet emisora sea ajena. La regla no es "¿la wallet es ajena?" sino "¿me pagaron por trabajo, o moví mi propia plata?". Comprar USDC con cash propio = T3 (ahorro); nunca suma como ingreso. Camino honesto para informal-cash: que el PAGADOR mande USDC directo (T1) o attestation+depósito (T2). El informe debe CLASIFICAR fuentes: (a) pagos de terceros = ingreso; (b) depósitos desde ramps/exchanges conocidos = auto-fondeo → evidencia de capacidad de ahorro, etiquetada aparte, NUNCA sumada como ingreso; (c) self-transfers = excluidos; (d) pagadores frescos/único pago = flag sybil.

   ### Modelo de evidencia de 3 tiers (diseño acordado 01/10/2026)

   **Verdad incómoda aceptada por diseño:** el cash puro NO se puede probar onchain — la chain ve "llegó plata", no "por qué". Sin una contraparte que firme, no hay forma honesta de distinguir ingreso real en cash de auto-fondeo. El informe trabaja en 3 niveles:

   | Tier | Mecanismo | Fuerza |
   |---|---|---|
   | **T1 — Ingreso probado** | El pagador paga USDC directo a la wallet del trabajador | Fuerte: tercero real con su propia historia |
   | **T2 — Ingreso declarado** | Cobro en cash + pagador firma attestation ("pagué $X por Y el día D") + depósito self-fondeado que matchea monto | Media: attestation solo es falsificable, depósito solo es auto-fondeo — **juntos se refuerzan** (alguien firmó + la plata se materializó) |
   | **T3 — Solo ahorro** | Depósitos propios sin attestation | Débil: prueba disciplina de ahorro, no ingreso. Etiquetado aparte |

   **Mecánica de la firma T2:** pagador escanea QR/link → wallet connect en web (sin instalar) → firma attestation SAS `{receptor, monto, fecha, tipo de trabajo}` → anclada onchain. Firma mutua posible (pagador "pagué", trabajador "entregué").

   **Ataque conocido (discusión 01/10):** amigo firma + vos depositás = ingreso falso. Defensas en capas: (a) la plata debe materializarse onchain — fingir "$1M recibido" exige TENER $1M reales; (b) peso por reputación del attestor — una constructora que attest a 40 trabajadores × 12 meses es carísimo de fabricar, un conocido con wallet nueva pesa ~cero; (c) stake opcional del attestor (bond slasheable si hay disputa probada); (d) patrón temporal — attestation única grande = sospechoso, mensualidades repetidas = relación laboral creíble.

   **Límite físico honesto:** el cash puro sin rastro NO es verificable — no hay oracle para billetes. Para informales por plataforma (PedidosYa, Rappi, Uber, MP cobros QR), zkTLS sobre el historial DE LA PLATAFORMA es evidencia de tercero estructurado — mucho más fuerte que firma de conocido y más barato de obtener que attestations manuales.

   **Calidad del pagador (anti-sybil):** sin esta regla, 50 wallets frescas = 50 "pagadores" falsos por centavos. El informe pondera: antigüedad de wallet pagadora, # de counterparties propios, patrón de ingresos del pagador. Es heurística, no prueba — el informe **declara la confianza** ("3 pagadores establecidos, 2 baja confianza") en vez de esconderla.
5. **NO datos sensibles onchain.** El historial completo vive en la wallet del usuario; lo que se comparte es un *informe derivado* (elegir qué revelar: totales, conteo de pagadores, antigüedad — no destinatarios ni montos individuales si no se quiere). PII nunca onchain.
6. **NO score opaco estilo "87/100".** El informe muestra *hechos* ("recibió $X de N pagadores en Y meses"), no un número mágico que el evaluador no puede auditar.
7. **NO prometer que el sistema bancariza al informal.** El informe es evidencia, no garantía de aceptación. La adopción por evaluadores es el riesgo comercial, no algo que el código resuelva.
8. **NO contar como "pagador" a una wallet sin historia** (wallet creada ayer que paga una vez y desaparece — señal de sybil).

---

## 7. Cómo llevarlo (dirección del producto)

### Arquitectura de fuentes (ampliada 2da pasada — 01/10/2026)

El informe puede combinar **dos tipos de evidencia** con etiquetas de origen y confianza:

1. **Pagos onchain (self-custody)** — USDC recibidos en wallet propia. Evidencia máxima: tx real, verificable por cualquiera.
2. **Pruebas zkTLS de historiales existentes (Reclaim)** — Binance, MercadoPago, otras billeteras. Prueba "el sitio afirmó estos movimientos" con divulgación selectiva. Permite **reconstruir historia RETROACTIVA** (los 10 años del fundador) sin que la plata haya pasado por Solana.
   - Caveats: provider por sitio (tooling Reclaim para generarlos); profundidad limitada a lo que la web expone; prueba el dato reportado, no su naturaleza laboral; el sitio puede rediseñarse y romper el provider (costo de mantenimiento).

**Diferenciación vs Destácame:** mismo problema, arquitectura opuesta — score opaco de plataforma con convenios regulatorios vs **informe de hechos verificables, propiedad del usuario, self-serve global, sin permiso**. Su datos-alternativos son proxies de "buen pagador"; los nuestros son flujos de dinero reales recibidos.

### Modelo de acceso al historial (diseño acordado 01/10/2026)

**Nada es público por defecto.** No hay perfil público de ingresos — exponer historial completo sería doxxing + riesgo fiscal (ingresos no declarados). El historial es privado y bajo control del usuario.

**Flujos de compartición (consent-gated):**

1. **Onboarding:** cuenta por email. Fuentes: (a) addresses self-custody (data pública, pero la vinculación identidad↔wallet es lo sensible), (b) zkTLS con login LOCAL en el navegador del usuario (credenciales nunca pasan por nuestro servidor), (c) attestations opcionales.
2. **Informe ≠ historial crudo.** El reporte son HECHOS DERIVADOS: "≥$X/mes durante Y meses de N pagadores distintos" + pruebas. Divulgación selectiva por scope (totales, rangos, período — no txs/pagadores individuales salvo opt-in).
3. **Pull (user-initiated):** usuario genera link con scope + vencimiento → lo entrega en su solicitud → evaluador abre página de verificación sin cuenta ni intermediario. Revocable.
4. **Push (verifier-initiated):** verificador registrado solicita acceso por email → usuario ve quién pide, qué scope, por cuánto → aprueba/rechaza → release solo a ese verificador. Patrón OAuth/Plaid.

**Realismo de adopción:** bancos grandes = fase 3+. Primeros evaluadores realistas: inmobiliarias, fintechs de consumo, prestamistas P2P, empleadores remotos.

**Arquitectura de wallet (decisión 01/10):** wallet embebida NO-custodial al registrarse (MPC/keypair client-side, estilo Privy) — el usuario recibe address+QR sin entender keys; opción de conectar wallet externa. La plataforma solo LEE historial público y emite informes: nunca custodia fondos (evita regulación de custodio/exchange).

**Flujo del pagador (decisión 01/10) — "paga en moneda local, llega USDC":**
- Trabajador genera link de cobro con referencia única (Solana Pay `reference`)
- Pagador abre checkout web (sin cuenta necesaria para MVP) → paga en su moneda local (ARS/MP, BRL, MXN, tarjeta, wire)
- **Un ramp licenciado hace la conversión** (KYC y regulación del lado del ramp — nosotros solo software, nunca tocamos fondos ni convertimos: evita clasificación como exchange)
- USDC aterriza en wallet del trabajador **con la referencia del link onchain**
- **La referencia resuelve la ambigüedad ramp-vs-auto-fondeo:** USDC con referencia de cobro = pago de tercero (T1); USDC del ramp sin referencia = depósito propio (T3)
- Cuenta de pagador: opcional, para pagadores recurrentes (guardar método, pagos recurrentes)
- Costo honesto: spread+fees del ramp ~1-4% — se declara en el producto

**Alcance global:** el informe/historial es país-agnóstico (USDC es USDC en cualquier lado). Lo local es solo la capa fiat→USDC (ramp por país) y las fuentes zkTLS (billeteras locales). Arquitectura multi-ramp; lanzamiento secuenciado por corredor.

**Estrategia de rampa para MVP/demo:** NO integrar ramp real. Checkout simulado: pagador ingresa tarjeta fake → backend mintea USDC **devnet** a la wallet del trabajador con la referencia del link. El jurado ve el loop completo sin plata real ni regulatorio. Post-MVP: socio ramp licenciado por país.

**Riesgos residuales:** links reenviables (mitigar: vencimiento+revocación), exposición de pagadores si el verificador audita txs (v2: ZK proofs), correlación de identidad entre informes (unlinkability por defecto).

### Mecánica central

```
Trabajador informal cobra en USDC (Solana)
  → cada pago entrante queda registrado onchain (tx real, pagador distinto)
  → el producto analiza: N pagadores distintos, montos, frecuencia, antigüedad, "edad" de las wallets pagadoras
  → genera un INFORME DE INGRESOS VERIFICABLE:
      - link público/QR que cualquiera puede verificar contra la chain
      - hechos declarados: totales por período, # pagadores, continuidad
      - proof criptográfico de que el informe corresponde a esas txs reales
  → evaluador (inmobiliaria/prestamista) verifica sin confiar en nosotros
```

### Por qué el sybil queda acotado

- Falsificar requiere que terceros muevan plata REAL hacia vos, sostenido en el tiempo. Cuesta dinero de verdad.
- Peso por calidad del pagador: una wallet con antigüedad y actividad pesa más que 20 wallets frescas.
- Patrones detectables: circularidad A→B→A, montos idénticos, timing bot — un informe honesto declara sus heurísticas.
- Comparación honesta: es *al menos tan bueno* como un extracto bancario (que también se falsifica), pero más barato de verificar e infalsificable en el documento mismo.

### MVP demo-able (borrador, a refinar en spec si pasa el gate)

1. Wallet/identidad del trabajador (privKey en cliente, nunca servidor).
2. Demo: 2-3 wallets "empleadores" pagan USDC devnet a lo largo de sesiones → historial se acumula.
3. Generar informe: totales, #pagadores, antigüedad → página pública de verificación que recorre las txs onchain y confirma los hechos.
4. (Stretch) Attestation SAS anclando el informe + "share link" con subset de datos elegidos por el usuario.

### Por qué puede ganar donde otros perdieron

- **Es un producto usable hoy**, no un protocolo que necesita liquidez prestada.
- La demo es verificable en vivo ante el jurado (clickeás el link, ves las txs).
- Responde "¿por qué Solana?" sin tokenomics: portabilidad + verificabilidad + micropagos baratos.
- Narrativa potente para jurado argentino/LatAm: informalidad + inclusión real, no especulación.

---

## 8. Riesgos abiertos, grises y fugas detectadas (consolidado 01/10/2026)

### Riesgos de adopción / mercado
| Riesgo | Estado |
|---|---|
| ¿Los informales/freelancers cobrarían en USDC? | [SIN VERIFICAR] — E-001 (fundador) confirma dolor propio; falta más muestra |
| ¿Evaluadores (inmobiliaria/prestamista) aceptarían el informe? | [SIN VERIFICAR] — entrevista pendiente (compromiso: mañana) |
| Fricción del lado del pagador (tiene que pagar en USDC o usar el link) | Mitigado por diseño: checkout fiat→USDC sin que el pagador toque crypto. Bootstrapping sigue abierto: alguien tiene que usar el link primero |
| Regulación: "constancia de ingresos" como documento | El informe se presenta como evidencia verificable, no documento oficial. No somos custodio ni exchange (ramp licenciado hace conversión) |

### Grises y fugas (honestidad técnica)
| Gris | Manejo |
|---|---|
| **Cash puro no es verificable** — la chain ve "llegó plata", no "por qué" | Aceptado: T2/T3 honestos, nunca fingir T1 |
| **Depósitos propios ≠ ingresos** aunque el remitente sea ajena (ramp/OTC/P2P) | Clasificación de fuentes + referencia de cobro para distinguir pago-de-checkout vs depósito |
| **Attestation coludida** (amigo firma + deposito) | Capas: plata materializada + reputación del attestor + patrón temporal + stake opcional. Residual declarado al evaluador |
| **Wallets frescas como falsos pagadores** | Ponderación por calidad del pagador; confianza declarada |
| **Ciclos depósito/retiro** para inflar "ingresos" | Heurística de circularidad; solo cuentan T1/T2 |
| **Links reenviables** | Vencimiento + revocación |
| **Exposición de pagadores** al auditar txs | Informe = hechos derivados; txs opt-in; v2 ZK |
| **Correlación de identidad** entre informes | Unlinkability por defecto |
| **zkTLS frágil** (provider por sitio, rediseños rompen) | Fuentes etiquetadas por origen; mantenimiento continuo |
| **Pérdida de keys** (wallet embebida) | MPC/social recovery, nunca custodia nuestra |
| **Riesgo fiscal** del usuario (historial exhibe ingresos no declarados) | Nada público por defecto; usuario controla disclosure |
| **Bootstrapping**: sin pagadores que paguen USDC no hay T1 | El link de cobro es la puerta de entrada; T2/T3 + zkTLS sirven mientras |

## 8bis. UX/UI y decisiones de experiencia (diseño acordado 01/10/2026)

### Principios de diseño

1. **Cero jerga crypto en la UI del trabajador.** No "wallet", "USDC", "seed phrase", "onchain". Se dice: "tu cuenta", "dólares digitales", "tu historial", "tu comprobante". La tecnología es invisible — el usuario ve plata y evidencia.
2. **Cero jerga crypto del lado del pagador.** El checkout se ve como Mercado Pago: pagar con tarjeta/MP en moneda local, fin. Jamás "comprá USDC y mandalo a esta address".
3. **El verificador no necesita cuenta ni confianza.** Abre un link, ve hechos + botón "verificar onchain" que le muestra las txs reales. La verificación ES el show.
4. **Honestidad visible = diferenciador.** Los tiers de evidencia y la confianza se MUESTRAN ("ingreso probado" / "ingreso declarado" / "ahorro"), no se esconden. Nadie más hace esto.
5. **Mobile-first.** El trabajador informal vive en el celu. Desktop es secundario.
6. **Nada público por defecto.** Compartir es acción explícita con scope (qué se ve, por cuánto, revocable).
7. **Español por defecto** (i18n preparado: inglés para expansión global).

### Páginas del MVP

| # | Página | Público | Qué hace |
|---|---|---|---|
| 1 | Landing | Sí | Explica el producto: "cobrá en claro" — CTA registro |
| 2 | Signup/onboarding | — | Email → wallet embebida creada (invisible al usuario) → address+QR disponible |
| 3 | Dashboard trabajador | No | Historial de cobros clasificado por tier, totales, fuentes conectadas, botón "generar link de cobro" |
| 4 | Link de cobro | No | Crear payment request (monto opcional, descripción) → genera link/QR para enviar al pagador |
| 5 | Checkout del pagador | Sí (link público) | Web estilo MP: ingresa tarjeta/datos fiat → paga → USDC devnet llega con referencia |
| 6 | Generador de informe | No | Elegir scope (período, totales vs detalle, qué revelar) → genera informe + link de verificación + hash anclado |
| 7 | Verificación pública | Sí | El verificador abre el link → hechos derivados + tiers + "verificar onchain" → pruebas clickeables |
| 8 | Solicitudes de acceso | No | Lista de verificadores que pidieron acceso → aprobar/rechazar con scope |
| 9 | Settings/fuentes | No | Conectar wallet externa, fuentes zkTLS (v2), privacidad, recuperación de cuenta |

### Recomendaciones de construcción UI

- Stack sugerido: Next.js + Tailwind + shadcn (alineado con lo que el equipo ya usa en otros proyectos).
- Diseño: limpio, tipo fintech seria — el informe debe verse como documento confiable, no app crypto.
- Componente estrella: la **página de verificación** — es lo que el jurado evalúa. Que sea impecable: hechos grandes, tiers con badges de color (verde=probado, amarillo=declarado, gris=ahorro), botón de verificación onchain visible.
- Copy: cero tecnicismos; "recibió", "le pagaron", "verificable" — nunca "tx", "address", "mainnet".
- Estados vacíos con guía: "todavía no tenés cobros — generá tu primer link" con CTA.

### Recomendaciones para la demo

- **Pre-sembrar historial devnet:** antes de la demo, generar 2-3 meses de cobros fake reales en devnet (varios pagadores, montos variados, referencias) para que el informe muestre historia creíble, no una tx sola.
- **Arco en vivo:** dos pantallas — trabajador genera link → "empleador" paga con tarjeta fake → USDC llega en vivo → historial se actualiza → generar informe → verificador abre link y verifica onchain clickeando.
- **Momento wow:** el botón "verificar en la blockchain" que muestra las txs reales — eso es lo que ningún PDF ni Destácame puede hacer.
- **Mostrar honestidad:** incluir en el demo un depósito T3 etiquetado como "ahorro, no ingreso" — demostrar que el sistema NO miente es lo que lo hace creíble.
- **Pitch:** narrativa "de negro a claro" + founder-as-user ("yo llevo 10 años cobrando en negro y soy invisible").

## 9. Próximos pasos si se elige

1. Completar entrevistas de validación (sección 8) → docs/08_VALIDATION.md.
2. Completar Research Gate (docs/04_RESEARCH_GATE.md) campos 1-3, 5-11 → **decisión humana**.
3. Si CONSTRUIR: crear `sdd/changes/proof-of-income/` (proposal → spec → design → tasks) y recién ahí arquitectura/código.
