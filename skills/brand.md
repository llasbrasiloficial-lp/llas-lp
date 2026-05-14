---
name: kodama-brand
description: Identidade visual completa da Kodama Cogumelos — cores, tipografia, logo, padrões e assets
type: reference
---

# Kodama Brand Identity

## Essência da Marca
Kodama Cogumelos é uma marca de extratos líquidos hidroalcoólicos de cogumelos funcionais, com produção 100% própria em Goiânia-GO. Posicionamento: **premium, científico, natural e artesanal**. Não é wellness genérico — é precisão botânica com raiz brasileira.

---

## Paleta de Cores

| Papel | Hex | Uso |
|---|---|---|
| Verde Escuro (Primary) | `#2D4A10` | Header, botões primários, títulos principais |
| Verde Médio (Secondary) | `#3D6B1A` | Hover states, gradientes, destaques verdes |
| Dourado/Creme (Accent) | `#C8A96E` | Subtítulos, eyebrows, ornamentos, destaques premium |
| Off-white (Background) | `#F9F6F0` | Fundo padrão de todas as páginas |
| Branco puro | `#FFFFFF` | Cards elevados, modais |
| Texto corpo | `#1A1A1A` | Parágrafos e textos corridos |
| Texto secundário | `#666666` | Captions, metadados |
| Verde claro badge | `#f0fdf4` | Badges de benefícios/confiança |

### Gradiente Padrão (Promo Bar / CTA backgrounds)
```css
background: linear-gradient(90deg, #2D4A10 0%, #3D6B1A 50%, #2D4A10 100%);
```

---

## Tipografia

| Papel | Família | Pesos | CDN |
|---|---|---|---|
| Headings | Playfair Display | 400, 700, 900 | Google Fonts |
| Body | Inter | 400, 500, 600, 700 | Google Fonts |

**Regra absoluta:** Nunca usar a mesma fonte para heading e body. Nunca usar Arial, Roboto, ou fontes genéricas de sistema como primárias.

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Logo e Assets

**Localização:** `brand_assets/` no projeto `C:\Projetos\kodama-lp\`

| Asset | Arquivo | Uso |
|---|---|---|
| Logo principal | `kodama-logo_v3.webp` | Header, emails |
| Favicon | `favicon_v2.png` | Tab do browser |
| Padrão de textura | `padrao-kodama_v2.webp` | Promo bar overlay (opacity 0.18), backgrounds decorativos |
| Hero floresta desktop | `floresta-hero_v3.webp` | Hero da home |
| Hero floresta mobile | `floresta-hero-mobile_v1.webp` | Hero mobile da home e kit |

**Regra:** Sempre usar o logo real. Nunca usar placeholder de logo.

---

## Padrões de Sombra

```css
/* Elevação padrão (cards) */
box-shadow: 0 8px 40px rgba(45,74,16,0.10);

/* Elevação alta (modais, dropdowns) */
box-shadow: 0 8px 24px rgba(45,74,16,0.12);

/* Botão primário hover */
box-shadow: 0 4px 20px rgba(45,74,16,0.35);
```

Nunca usar `shadow-md` flat do Tailwind. Sempre usar sombras com tint verde (`rgba(45,74,16,...)`).

---

## Promo Bar (componente padrão)

```html
<div id="promo-bar" class="py-2 px-4 text-center">
  <!-- Desktop -->
  <p class="hidden sm:block text-white text-sm font-medium relative" style="z-index:1;">
    <span class="inline-block mr-3">🚚 Frete GRÁTIS acima de R$200</span>
    <span class="opacity-40">|</span>
    <span class="inline-block mx-3">💳 Parcele em até 3x sem juros</span>
    <span class="opacity-40">|</span>
    <span class="inline-block ml-3">🔒 Pagamento 100% Seguro</span>
  </p>
  <!-- Mobile carousel -->
  <div class="sm:hidden" style="position:relative;height:1.4rem;overflow:hidden;">
    <span class="promo-slide text-white text-sm font-medium" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:1;transition:opacity 0.4s;">🚚 Frete GRÁTIS acima de R$200</span>
    <span class="promo-slide text-white text-sm font-medium" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.4s;">💳 Parcele em até 3x sem juros</span>
    <span class="promo-slide text-white text-sm font-medium" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.4s;">🔒 Pagamento 100% Seguro</span>
  </div>
</div>
```

```css
#promo-bar {
  background: linear-gradient(90deg, #2D4A10 0%, #3D6B1A 50%, #2D4A10 100%);
  position: relative;
  overflow: hidden;
}
#promo-bar::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/brand_assets/padrao-kodama_v2.webp');
  background-size: auto 100%;
  background-repeat: repeat-x;
  opacity: 0.18;
  pointer-events: none;
}
```

---

## Tom Visual Geral

- **Atmosfera:** Floresta úmida, misticismo japonês (kodama = espírito da floresta), ciência botânica
- **Texturas:** Usar `padrao-kodama_v2.webp` como overlay decorativo (opacity 0.10–0.20)
- **Imagens:** Sempre com overlay gradiente verde escuro quando servem de fundo
- **Animações:** Apenas `transform` e `opacity`. Nunca `transition-all`.
- **Layering:** Superfícies em camadas — base (#F9F6F0) → elevado (#fff) → flutuante (sombra intensa)
