---
name: kodama-clarity-insights
description: Diagnóstico e metas de CRO/Performance baseados em dados reais do Microsoft Clarity (03/abr a 22/abr 2026). Consulte antes de qualquer mudança em LP, performance, CTAs ou funil.
type: reference
priority: critical
---

# Kodama — Clarity Insights (período 03/04 a 22/04/2026)

## Métricas atuais (baseline)

| Métrica | Valor | Status |
|---|---|---|
| Sessões totais | 15.360 | — |
| Usuários únicos | 14.198 | — |
| Usuários novos | 93,17% (14.311) | — |
| Páginas por sessão | 1,18 | 🔴 baixíssimo |
| Profundidade de rolagem média | 6,93% | 🔴 crítico |
| Tempo ativo | 19s de 50s totais (38%) | 🔴 baixo engajamento |
| Conversão (pedidos / sessões) | 28 / 15.360 = **0,18%** | 🔴 5-14x abaixo do benchmark |
| Checkouts iniciados | 4 | 🔴 funil pré-checkout vaza muito |
| Dead clicks | 126 sessões (0,82%) | 🟡 investigar |
| Rage clicks (cliques contínuos) | 12 sessões (0,08%) | 🟢 ok |
| Quick backs (retornos rápidos) | 98 sessões (0,64%) | 🟡 atenção |
| LCP | 2,6s | 🟡 precisa de melhorias |
| INP | 370ms | 🟡 precisa de melhorias |
| CLS | 0,006 | 🟢 ok |
| Performance score Clarity | 80/100 | 🟡 |
| Erros JavaScript totais | 609 (2,18% das sessões) | 🟡 |

## Metas após as correções

| Métrica | Meta 30 dias | Meta 90 dias |
|---|---|---|
| LCP | < 2,2s | < 1,8s |
| INP | < 200ms | < 150ms |
| Conversão (CR) | 0,5% | 1,0% |
| Páginas/sessão | 1,5 | 2,0 |
| Profundidade rolagem | 15% | 25% |
| Tempo ativo | 30s | 45s |

## Composição do tráfego (contexto crítico)

```
FacebookApp .......... 69,75% (10.714 sessões) — in-app browser iOS/Android
InstagramApp ......... 16,04% (2.463 sessões)  — in-app browser iOS/Android
ChromeMobile ......... 10,32% (1.585 sessões)  — Chrome mobile nativo
Other ................  3,89% (598 sessões)

Total mobile in-app: 85,79%
```

**Consequência:** qualquer decisão de UX, performance ou tracking deve ser tomada
priorizando o contexto de **WebView in-app de apps sociais em mobile**, não desktop.

Características do in-app browser que impactam código:
- Não faz autoplay de vídeo com som
- Cookies de terceiros bloqueados mais agressivamente
- `window.webkit.messageHandlers` existe no WKWebView (iOS) mas nem sempre tem os handlers esperados
- Pode ter engine JS ligeiramente defasada
- Banda e CPU costumam ser piores (usuário geralmente em 4G, não WiFi)

## Origem do tráfego

```
m.facebook.com ................ 9.656 (anúncios Meta)
instagram.com ................. 1.680
kodamacogumelos.com.br ........ 1.527 (direto / compartilhamento)
m.youtube.com .................   478
google.com ....................   429 (orgânico + pago)
googleleads.g.doubleclick.net .   312 (Google Ads display)
facebook.com ..................   197
```

Insight: **97%+ do tráfego pago vem de Meta**, não de Google. Logo, otimizar pra
CTR no Meta não é prioridade — **otimizar pra landing experience em mobile in-app é**.

## Problemas identificados (priorizados por ROI)

### 🔴 P1 — Imagem LCP não otimizada (842KB WebP)
- **Arquivo:** `brand_assets/floresta-hero_v3.webp`
- **Tamanho atual:** 842 KB
- **Meta:** < 200 KB
- **Ação:** gerar versões responsivas (375w, 768w, 1280w) e servir via `<picture>` com `srcset`.
- **Impacto esperado:** LCP de 2,6s → ~1,5s em mobile.

### 🔴 P2 — Vídeo hero carrega em mobile sem ser reproduzido
- **Arquivo:** `brand_assets/hero_forest_background_v2.mp4` (1,1 MB)
- **Problema:** in-app browsers não reproduzem autoplay de vídeo; asset baixa mas nunca renderiza.
- **Ação:** servir `<video>` apenas em `min-width: 768px` via JS ou `<source media>`, ou usar `<picture>` pra fallback.
- **Impacto esperado:** economizar 1,1 MB por sessão mobile (= 85% das sessões).

### 🔴 P3 — `window.webkit.messageHandlers` sem guard defensivo
- **Origem:** 12,81% dos erros JS do Clarity (dado validado).
- **Contexto:** WKWebView do iOS expõe `window.webkit` mas `messageHandlers` pode estar undefined.
- **Ação:** adicionar guard `if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.xxx)` em qualquer código que acesse essa API.
- **Ressalva:** pode vir de tag de terceiro (Meta Pixel, GTM, Clarity). Diagnosticar antes de alterar.

### 🟡 P4 — iframe YouTube dispara muitos requests de tracking
- **Contexto:** no hero existe embed YouTube (`UzchgflFo-8`). Iframe padrão carrega ~550KB de JS e dispara `log_event`, `ptracking`, `generate_204`.
- **Ação:** substituir por `lite-youtube-embed` (paul-irish). Carrega thumbnail estático, player só no clique.
- **Impacto esperado:** -500KB no hero, menos erros no console de usuários com adblock.

### 🟡 P5 — Dead clicks (126 sessões)
- **Suspeitos a investigar:**
  - Cards "Kodama é para você que…" (🌫️ 🧠 🔬 🌿) — parecem clicáveis mas podem não ser.
  - Linhas da tabela comparativa "Juba x Cordyceps x Kit" — só os botões no rodapé da coluna são clicáveis.
  - Timer `--:--` quando não inicializa (se virar texto estático, usuário tenta clicar).
  - Fotos dos depoimentos (parecem link pra perfil Google).
- **Ação:** tornar elementos esperadamente-clicáveis realmente clicáveis (âncora para #produtos), ou remover affordance visual de clicabilidade.

### 🟡 P6 — Home muito longa pra mobile in-app
- **Contexto:** 6,93% de profundidade média = usuário não chega na metade da página.
- **Fluxo atual:** Hero → Vídeo "Da Terra ao Frasco" → Produtos → Brinde → FAQ → Stats → Tabela → Cards Problema → Juba seção longa → Cordyceps seção longa → 3 passos → Ciência → Ultrassom → Garantia → Última chamada → Newsletter
- **Ação proposta:** em mobile, reordenar pra: Hero → **Produtos (escolher cogumelo)** → Prova social curta → Como funciona (3 passos) → FAQ → Última chamada. O resto vira acordeão ou sai.
- **Risco:** mexer em conteúdo afeta SEO. Fazer com cuidado e preservar IDs de âncora.

## Decisões de escopo (NÃO FAZER)

- ❌ **Não mexer no checkout Yampi** (`seguro.kodamacogumelos.com.br`) — fora do repo, risco regulatório.
- ❌ **Não adicionar novas seções** à home — o problema é excesso, não falta.
- ❌ **Não trocar o domínio do vídeo YouTube** — manter vídeo atual, só trocar o método de embed.
- ❌ **Não alterar copy existente** sem consultar `copy.md` e `compliance.md`.
- ❌ **Não remover disclaimer ANVISA** do footer.
- ❌ **Não alterar canonical URLs** (regra `cleanUrls: true` do Vercel).
- ❌ **Não adicionar novas tags de terceiros** — já temos GTM, Clarity, Meta Pixel, YouTube. Mais tags = mais LCP = mais JS errors.

## Constraints técnicos de referência

- Site estático puro, deploy via push `main` no Vercel.
- CSS: Tailwind (resolver contradição CDN vs build documentada em `frontend.md`).
- Fontes: Google Fonts (Playfair Display + Inter).
- Domínio produção: `kodamacogumelos.com.br` (sem `www` no canonical, cleanUrls ativo).
- GTM: `GTM-W556LRV6` — não duplicar snippet, não remover.
- Clarity: tag `w2cxwoofsm` — não remover.

## Processo padrão para cada mudança

1. Ler esta skill + skill relevante (`frontend`, `optimization`, `brand`, `compliance`).
2. Rodar servidor local: `npx serve .`
3. Screenshot ANTES em 375px e 1280px.
4. Aplicar mudança.
5. Screenshot DEPOIS em 375px e 1280px.
6. Comparar visualmente.
7. Rodar Lighthouse local (Chrome DevTools) antes e depois — anotar LCP, INP, CLS.
8. Commit atômico no formato `tipo(escopo): descrição` (ex: `perf(hero): servir imagem LCP responsiva`).
9. Push → validar em produção Vercel → validar no Clarity 24h depois.

## Evidência de validação (o que olhar no Clarity após deploy)

Após cada deploy, checar em até 48h no Clarity:
- Erros JS: diminuíram? (baseline: 609 totais, 2,18% das sessões)
- LCP: diminuiu? (baseline: 2,6s)
- Profundidade de rolagem: aumentou? (baseline: 6,93%)
- Dead clicks: diminuíram? (baseline: 126 sessões)
- Conversão Yampi: aumentou? (baseline: 28 pedidos em 15.360 sessões)
