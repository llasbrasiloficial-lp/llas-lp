# CLAUDE.md — LLAS Brasil

> Documento mestre do projeto. Leia este arquivo antes de qualquer tarefa neste repositório.

---

## 1. Identidade da marca

**Nome:** LLAS
**Slogan oficial:** O básico refinado.
**Domínio:** llasoficial.com.br
**Email institucional:** llasbrasil.oficial@gmail.com
**Fundadores:** Luiz Alberto de Souza e Ludmilla Saldanha (sócios/casal)
**Categoria:** Vestuário — camisetas básicas em algodão e fibras naturais
**Posicionamento:** Marca brasileira de básicos em algodão 100% e fibras naturais, com foco em qualidade material, caimento atemporal e ausência de contaminantes têxteis comuns na indústria convencional.

### Origem do nome
LLAS = **L**uiz **A**lberto + **L**udmilla **S**aldanha — iniciais dos sócios fundadores.

### Diferencial central
A grande maioria das camisetas vendidas no Brasil é de mistura algodão-poliéster (PV) ou 100% poliéster, ou recebem acabamentos químicos (anti-rugas, resistência a manchas, repelentes) que podem migrar para a pele. A LLAS se posiciona como a alternativa: peças em algodão 100% e fibras naturais, sem acabamentos químicos desnecessários, com transparência sobre composição e origem.

---

## 2. Portfólio inicial

**Lançamento:** Camisetas básicas (white tees, t-shirts).
**Materiais:** Foco em algodão 100%; podem entrar outras fibras naturais (linho, eventualmente). **Nunca poliéster, elastano sintético ou misturas com fibras sintéticas como linha principal.**
**Paleta de produto:** Mix de neutros (branco, off-white, preto, cinza, areia) com 2-3 cores sazonais por coleção.
**Curadoria:** Poucas peças, bem feitas. "O básico refinado" implica seleção restrita, não catálogo extenso.

---

## 3. Argumento central de marketing — "Ciência em terceira pessoa"

Este é o framework de comunicação obrigatório do projeto, baseado no que funcionou bem na Kodama com a ANVISA. **Toda alegação sobre qualidade material ou riscos de têxteis convencionais deve ser atribuída a um terceiro (estudo, órgão regulador, certificação) — nunca afirmada diretamente como benefício do produto.**

### Por que isso importa juridicamente
O Brasil não tem regulação tão restritiva quanto a europeia (REACH) ou o sistema Oeko-Tex para vestuário civil. O Inmetro tem normas para etiquetagem (Resolução Conmetro 02/2008) e segurança de roupas infantis, mas não fiscaliza ativamente contaminantes em vestuário adulto. Isso **não** significa que podemos fazer claims absolutos — significa que precisamos ser cuidadosos para não atribuir à LLAS poderes que ela não tem comprovação para reivindicar.

### Contaminantes documentados em têxteis convencionais (use como base para conteúdo)

**Formaldeído** — usado como acabamento "easy-care", "wrinkle-free" e "no-iron". Classificado como carcinógeno humano pela IARC (Grupo 1). Pode causar dermatite de contato. Fonte de referência: ECHA (European Chemicals Agency) e regulamento europeu REACH Anexo XVII, item 72.

**Corantes azo com aminas aromáticas** — alguns azo-corantes liberam aminas aromáticas classificadas como cancerígenas (ex: benzidina, 4-aminobifenil). Proibidos na UE desde 2003 para têxteis com contato direto com a pele. No Brasil, não há proibição específica para vestuário, embora exista para couros e calçados (Portaria Inmetro 220/2018).

**Ftalatos** — plastificantes usados em estampas plastisol (a estampa "borrachuda" comum em camisetas). DEHP, DBP, BBP são classificados como tóxicos reprodutivos (CMR categoria 1B na UE). Migram para a pele com calor e suor.

**PFAS (substâncias perfluoroalquiladas)** — usadas em tratamentos repelentes a água/manchas. Persistentes no ambiente e bioacumulativas. Restrições crescentes globalmente.

**Microplásticos de fibras sintéticas** — poliéster, acrílico e nylon liberam microfibras a cada lavagem. Estudos da University of Plymouth e Ellen MacArthur Foundation documentam contribuição têxtil para microplásticos oceânicos.

### Como traduzir isso em copy

❌ **Não dizer:** "Nossas camisetas não dão alergia."
✅ **Dizer:** "Optamos por algodão 100% sem acabamentos químicos. Substâncias como formaldeído, usado para deixar tecidos sintéticos resistentes a rugas, são classificadas como sensibilizantes de pele pela ECHA."

❌ **Não dizer:** "Camisetas LLAS protegem sua saúde."
✅ **Dizer:** "O algodão é uma fibra natural respirável. Diferente de tecidos sintéticos, não libera microfibras plásticas a cada lavagem — questão crescente na literatura ambiental (Plymouth, 2016)."

❌ **Não dizer:** "100% livre de tóxicos."
✅ **Dizer:** "Trabalhamos com algodão sem tingimento azo restrito na União Europeia e sem acabamentos químicos de easy-care."

### Disclaimer obrigatório em qualquer página com conteúdo técnico
> "Nossas peças são vestuário, não produtos de saúde. As informações sobre fibras e processos têxteis citadas neste site têm caráter educativo e remetem a normativas e estudos públicos (REACH/ECHA, Inmetro, IARC). Para condições dermatológicas específicas, consulte um profissional de saúde."

---

## 4. Tom de voz

**Princípio:** "O básico refinado" implica confiança quieta. A marca não grita. Não usa exclamações. Não usa marketing de urgência ("compre já", "últimas unidades"). Não promete transformação. Vende qualidade material.

**Características:**
- Português brasileiro elegante, frases curtas
- Vocabulário sóbrio, sem gírias e sem jargão técnico desnecessário
- Quando explica algo técnico, faz com clareza e sem condescendência
- Evita superlativos vazios ("incrível", "perfeito", "revolucionário")
- Usa especificidade no lugar de adjetivos: "fio penteado 30/1" comunica mais qualidade do que "ótima qualidade"
- Primeira pessoa do plural ("nós") para institucional; segunda pessoa singular ("você") para CTA

**Referências de tom (para inspirar, não copiar):**
- Everlane (transparência radical)
- COS (minimalismo descritivo)
- Osklen (português refinado)
- Misci (curadoria e materialidade)

---

## 5. Identidade visual

### Logo

A LLAS tem **uma única logo tipográfica**, em duas versões de uso (light/dark). A versão de produção no site é **um SVG com texto puro e `fill="currentColor"`** — a mesma logo serve para ambos os modos, herdando a cor do tema atual via CSS. Não usar PNG/JPEG da logo no site, exceto como og:image e favicon.

**Composição:**
- Wordmark: `LLAS` em sans-serif geométrica peso black (900), letter-spacing levemente negativo
- Tagline: `O BÁSICO REFINADO.` (sempre maiúsculas, com ponto final, peso regular, letter-spacing aberto)
- Arquivo mestre: `/brand_assets/llas-logo.svg`

**Regras de uso:**
- Margem mínima ao redor da logo: equivalente à altura da letra "L"
- Tamanho mínimo: 80px de largura na tela
- Cor: sempre 100% preto sobre claro, ou 100% branco sobre escuro. **Nunca** colorida, **nunca** com sombra, **nunca** rotacionada.
- A logo nunca aparece sobre fotografia sem máscara/overlay garantindo contraste

### Modo claro / Modo escuro (decisão de design)

O site **terá suporte nativo a modo claro e modo escuro**, com toggle manual no header e detecção automática via `prefers-color-scheme`. A logo acompanha o tema (mesmo SVG, cor via `currentColor`).

**Por que isso faz sentido para a LLAS:**
- A logo já existe oficialmente nas duas versões — não é capricho, é coerência com a identidade
- Reforça a essência "preto e branco, sem rodeios" que a marca já comunica visualmente
- Diferencial técnico que poucas marcas brasileiras de moda implementam

**Implementação:**
- CSS variables redefinidas por `[data-theme="dark"]` no `<html>`
- Persistência da escolha em `localStorage` (key: `llas-theme`)
- Detecção inicial: `prefers-color-scheme` se nada salvo, depois respeita a escolha do usuário
- Transição suave entre temas (não brusca)

### Paleta de cores

**Modo claro (padrão):**
- `--cor-bg: #FAFAF7` — Fundo principal (off-white algodão cru, não branco puro)
- `--cor-bg-alt: #F2F0EA` — Seções alternadas (areia muito clara)
- `--cor-texto: #0D0D0D` — Texto principal (preto profundo)
- `--cor-texto-soft: #2C2C2C` — Texto secundário, captions
- `--cor-borda: #E8E5DE` — Bordas e divisores
- `--cor-acento: #7A6E5D` — Marrom seco (links, hover sutil)

**Modo escuro:**
- `--cor-bg: #0D0D0D` — Fundo principal (preto profundo)
- `--cor-bg-alt: #161616` — Seções alternadas
- `--cor-texto: #FAFAF7` — Texto principal
- `--cor-texto-soft: #C9C7C0` — Texto secundário, captions
- `--cor-borda: #2A2A2A` — Bordas e divisores
- `--cor-acento: #C9B79C` — Areia (links, hover sutil)

> **Nota:** A paleta visual do site é INTENCIONALMENTE preto-e-branca com toques terrosos sutis. As fotos das peças trazem a cor; a interface fica neutra para destacá-las.

### Tipografia

A logo da LLAS usa uma sans-serif geométrica em peso black. Para coerência, o site usa **Inter** como família principal — combina visualmente com a logo, é gratuita, leve e tem amplo suporte de pesos.

**Família principal (toda a interface):** *Inter* (Google Fonts)
- Pesos a carregar: 300 (light), 400 (regular), 500 (medium), 700 (bold), 900 (black)
- Fallback stack: `'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif`

**Família secundária (opcional, para títulos editoriais):** *Cormorant Garamond* (Google Fonts)
- Use apenas em momentos editoriais (manifesto, "quem somos") como contraponto à logo geométrica
- Pesos: 400, 500
- Fallback stack: `'Cormorant Garamond', Georgia, 'Times New Roman', serif`

**Escala tipográfica (modular, base 16px):**
- `--fs-xs: 0.75rem` — captions, legendas
- `--fs-sm: 0.875rem` — secundário
- `--fs-base: 1rem` — corpo
- `--fs-md: 1.25rem` — lead, intro
- `--fs-lg: 2rem` — subtítulos
- `--fs-xl: 3.5rem` — títulos de seção
- `--fs-hero: clamp(3rem, 8vw, 6rem)` — hero responsivo

### Fotografia
- Luz natural, ambiente claro
- Foco em textura do tecido, caimento, costura
- Modelos com postura natural, sem expressões exageradas
- Backgrounds neutros (parede branca, linho cru, madeira clara)
- Evitar look "campanha de moda fast fashion": closes em sorrisos, poses dramáticas, edição saturada

### Layout
- Muito respiro (whitespace generoso)
- Grids amplos, sem aglomeração
- Tipografia grande nos títulos
- Imagens em proporção respeitada (não cortar peças no quadro)

---

## 6. Stack técnico

**Frontend:** HTML5 + CSS3 + JavaScript vanilla. **Sem framework** (Next/React/Vue). Mesma filosofia da Kodama: leve, rápido, fácil de manter.
**Hospedagem:** Vercel (deploy automático via push para `main`).
**Domínio:** llasoficial.com.br (Registro.br — em registro durante setup inicial).
**Repositório:** github.com/llasbrasiloficial-lp/llas-lp
**Checkout futuro:** Yampi (subdomínio a definir: provavelmente `seguro.llasoficial.com.br`, padrão Kodama).
**Analytics:** Google Tag Manager + Microsoft Clarity (configurar quando site estiver no ar).
**Performance target:** PageSpeed Insights > 90 em mobile e desktop.

### Estrutura de pastas planejada
```
llas-lp/
├── CLAUDE.md                  (este arquivo)
├── README.md
├── .gitignore
├── index.html
├── /css
│   ├── reset.css
│   ├── variables.css          (cores, fontes, espaçamentos como CSS vars + temas)
│   ├── themes.css             (definições de modo claro/escuro)
│   └── style.css
├── /js
│   ├── main.js
│   └── theme-toggle.js        (lógica de troca claro/escuro com persistência)
├── /assets
│   ├── /img                   (fotos de produto, hero, marca)
│   ├── /icons                 (SVGs inline ou sprite — ex: ícones sol/lua para toggle)
│   └── /fonts                 (se hospedar fontes localmente em vez de Google Fonts)
├── /produtos                  (páginas individuais quando catálogo crescer)
├── /brand_assets              (logos, identidade visual master)
│   ├── llas-logo.svg          (logo principal — usa currentColor)
│   ├── llas-logo-original.pdf (mestre do designer)
│   └── llas-logo-light-bg.jpeg (PNG de referência, fundo claro)
└── /skills                    (skills locais para Claude Code)
```

### Padrões de código
- Indentação: 2 espaços
- Aspas: simples (`'`) em JS, duplas (`"`) em HTML/atributos
- Nomes de classes CSS: kebab-case (`.hero-title`, não `.heroTitle`)
- CSS variables para tudo que se repete (cores, espaçamentos, tipos)
- Imagens: sempre WebP com fallback JPEG; sempre com `loading="lazy"` exceto hero
- Mobile-first em todo CSS
- Semântica HTML5 correta (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Acessibilidade: alt em toda imagem, contraste AA mínimo, foco visível

### Padrões de commit (Conventional Commits adaptado)
- `feat:` nova funcionalidade ou seção
- `fix:` correção
- `style:` ajuste visual sem mudar lógica
- `content:` mudança de texto/copy
- `refactor:` mudança de código sem mudar comportamento
- `docs:` alteração de documentação
- `chore:` build, dependências, config

Exemplo: `feat: hero section com manifesto da marca`

---

## 7. Estrutura inicial do site (landing page de lançamento)

Como ainda não há checkout Yampi pronto, o objetivo da V1 é:
1. Estabelecer presença da marca
2. Capturar interesse (lista de espera ou contato via WhatsApp/Instagram)
3. Educar sobre o diferencial material

### Seções propostas (ordem)

**1. Hero**
- Título: "O básico refinado." (ou variação como "Algodão. Caimento. Verdade.")
- Subtítulo: 1 frase que comunique o diferencial
- CTA principal: "Entre na lista" ou "Conheça as peças"
- Imagem ou vídeo curto de uma peça em close (textura > rosto)

**2. Manifesto**
- 2-3 parágrafos sobre por que a LLAS existe
- Sem foto de fundador aqui — chega depois
- Tom: confiança, propósito, sem dramatismo

**3. As peças (lookbook)**
- Grid de 4-6 camisetas da coleção inicial
- Cada uma com: foto, nome, composição (ex: "Algodão 100% penteado 30/1"), gramatura
- Quando Yampi estiver no ar, vira CTA "Comprar"; agora pode ser "Saiba mais" → WhatsApp ou modal

**4. Por que algodão importa**
- Seção educativa
- Pode usar abas, accordion ou cards: "Respirabilidade", "Sem microplásticos", "Sem acabamentos químicos"
- Cada bloco com 2-3 frases + atribuição em terceira pessoa (ver seção 3)
- Disclaimer ao final da seção

**5. Quem somos**
- Foto e história curta de Luiz Alberto e Ludmilla
- Origem do nome LLAS
- Onde a marca é feita (Goiânia? cidade do confeccionista? validar)

**6. Lista de espera / Contato**
- Formulário simples: nome + email
- OU CTA para WhatsApp/Instagram enquanto não tem backend
- Botão flutuante de WhatsApp no canto

**7. Footer**
- Logo
- Links: Instagram, WhatsApp, Email
- CNPJ e razão social (assim que constituída)
- Endereço (se aplicável)
- Política de privacidade e termos (placeholder por ora)

---

## 8. SEO

### Termos-alvo primários
- "camiseta 100% algodão"
- "camiseta básica algodão brasil"
- "white tee algodão"
- "marca de camiseta algodão natural"
- "camiseta sem poliéster"

### Termos-alvo secundários (long tail / educativo)
- "diferença algodão e poliéster pele"
- "camiseta sem formaldeído"
- "tecido natural roupa"
- "marca de roupa minimalista brasileira"

### Meta tags obrigatórias em toda página
```html
<title>LLAS — O básico refinado | Camisetas 100% algodão</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://llasoficial.com.br/assets/img/og-default.jpg">
<meta property="og:url" content="https://llasoficial.com.br/...">
<meta property="og:type" content="website">
<link rel="canonical" href="https://llasoficial.com.br/...">
```

### Schema markup
Implementar `Organization` no `index.html` e `Product` em páginas de produto futuras.

---

## 9. Instruções para o Claude Code

Quando trabalhar neste repositório, siga estas regras:

1. **Leia este CLAUDE.md inteiro antes de fazer qualquer alteração.** Se algo não estiver claro, pergunte antes de assumir.
2. **Respeite o tom de voz.** Não invente claims sobre saúde, nem use marketing agressivo. Quando em dúvida sobre uma afirmação técnica, atribua em terceira pessoa ou pergunte.
3. **Use as CSS variables.** Não hardcode cores ou tamanhos no meio do CSS — sempre via `var(--cor-preto-profundo)` etc.
4. **Mobile-first sempre.** Comece o CSS pelo mobile, use media queries para crescer.
5. **Otimize imagens antes de commitar.** WebP com fallback. Lazy load exceto hero. Dimensões adequadas (não servir 3000px de largura para um thumbnail).
6. **Não adicione dependências externas sem necessidade.** Nada de jQuery, nada de framework. Só JS vanilla.
7. **Commit com mensagens descritivas em português.** Seguir o padrão da seção 6.
8. **Antes de criar uma seção/página nova, valide a estrutura comigo.** Não improvisar arquitetura.
9. **Use semântica HTML5 correta.** Acessibilidade não é opcional.
10. **Não publique `/brand_assets/`.** Adicionar ao `.gitignore` se contiver logos vetoriais ou materiais mestres que não devem ir para produção. (Ou mantê-lo no repo se forem só assets já otimizados — decidir caso a caso.)

### Quando o Claude Code deve PERGUNTAR antes de fazer
- Mudanças de copy que afetam tom/posicionamento
- Adição de seção que não está na estrutura da seção 7
- Mudança de paleta ou tipografia
- Integração com serviço externo (analytics, formulário, CRM)
- Qualquer claim sobre saúde, segurança ou contaminantes que não esteja já atribuído em terceira pessoa

### Quando o Claude Code pode AGIR sem perguntar
- Correções de typo, erro de HTML, bug visual
- Otimização de imagem (compressão, conversão para WebP)
- Refatoração interna sem mudar saída visual
- Ajuste de espaçamentos dentro do sistema definido
- Adição de comentários no código

---

## 10. Compliance e marcas registradas

- **INPI:** registro de marca "LLAS" a ser providenciado (Classe Nice 25 — vestuário). Anotar status quando submetido.
- **CNPJ:** a constituir. Não publicar endereço fiscal sem confirmar com sócios.
- **LGPD:** se houver formulário de captura de email, criar política de privacidade básica antes de publicar.
- **Etiquetagem:** seguir Resolução Conmetro 02/2008 — composição, tamanho, país de origem, símbolos de conservação, CNPJ do fabricante/importador. **Antes de produzir etiqueta física, validar com a Ludmilla/Luiz Alberto e confeccionista.**
- **Inmetro:** roupas adultas civis não exigem certificação compulsória; **roupas infantis sim** — se a marca lançar linha kids no futuro, revisar Portaria Inmetro 301/2021.

---

## 11. Status do projeto

**Fase atual:** Setup inicial — repositório criado, estrutura sendo montada.

**Próximos marcos:**
1. Concluir primeiro push para GitHub ✅ (em andamento)
2. Conectar Vercel ao repositório
3. Aguardar propagação do domínio `llasoficial.com.br` no Registro.br
4. Apontar nameservers do Registro.br para a Vercel
5. Construir V1 da landing page (seções 1-7 da estrutura)
6. Sessão fotográfica das primeiras peças
7. Definir conta Yampi e integrar checkout
8. Lançamento

**Histórico de decisões importantes:**
- 14/05/2026: Decidido domínio `llasoficial.com.br` (após `llas.com.br` indisponível). Repositório nomeado `llas-lp`. Conta GitHub: `llasbrasiloficial-lp`.
- 14/05/2026: Logo recebida do designer em PDF vetorial. Convertida para SVG com `currentColor` para uso no site.
- 14/05/2026: Decidido suporte nativo a modo claro/escuro como design principal — aproveita o fato da logo já existir nas duas versões oficiais.
- 14/05/2026: Tipografia definida: Inter (geométrica, combina com a logo) + Cormorant Garamond (editorial, opcional).

---

*Última atualização: 14/05/2026 — Setup inicial do projeto.*
