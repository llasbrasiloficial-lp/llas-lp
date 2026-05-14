---
name: kodama-frontend
description: Design system, regras de LP, estrutura de seções, componentes e padrões técnicos para o site Kodama
type: reference
---

# Kodama Frontend — Design System e Regras de LP

## Stack Técnica

| Item | Tecnologia |
|---|---|
| HTML | Semântico, single-file por página |
| CSS | Tailwind CSS via CDN + `<style>` inline |
| Fonts | Google Fonts (Playfair Display + Inter) |
| Imagens | WebP/JPG otimizados em `brand_assets/` |
| Deploy | Vercel (static) |
| Analytics | Google Tag Manager (GTM-W556LRV6) |
| Checkout | Yampi (externo: seguro.kodamacogumelos.com.br) |
| Domínio | kodamacogumelos.com.br |

---

## Estrutura de Arquivos

```
kodama-lp/
├── index.html              # Home / LP principal
├── sobre.html              # Página sobre
├── privacidade.html        # Política de privacidade (noindex)
├── termos.html             # Termos de uso (noindex)
├── obrigado.html           # Pós-checkout (noindex)
├── 404.html                # Página de erro (noindex)
├── produtos/
│   ├── juba-leao.html
│   ├── cordyceps.html
│   └── kit-essencial.html
├── brand_assets/           # Todos os assets visuais
├── css/
│   └── styles.css          # Build Tailwind (não CDN em prod)
├── sitemap-kodama.xml
├── robots.txt
└── vercel.json
```

---

## Vercel Config (padrões críticos)

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

- `cleanUrls: true` → `/sobre.html` serve como `/sobre` (301 automático)
- `trailingSlash: false` → `/sobre/` redireciona para `/sobre`
- **NUNCA** usar `"routes"` junto com `"rewrites"`, `"redirects"` ou `"headers"` (conflito Vercel v2)

---

## Estrutura de Página Padrão (LP alta conversão)

```
1. Promo Bar (sticky, padrão-kodama_v2.webp overlay)
2. Header (logo + nav + CTA)
3. Hero (headline emocional + produto + CTA primário)
4. Prova Social (avaliações, logos mídia)
5. Problema / Solução
6. Como Funciona (3 passos)
7. Benefícios (cards, copy em 3ª pessoa)
8. Depoimentos (mínimo 3)
9. Produto + Preço + CTA
10. FAQ (mínimo 5 perguntas)
11. CTA Final (urgência leve)
12. Footer (logo, CNPJ, disclaimer ANVISA, redes)
```

---

## Componentes Padrão

### Botão Primário
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #2D4A10;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover { background: #3D6B1A; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }
```

### Eyebrow (rótulo de seção)
```css
.section-eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7A5700; /* derivado do dourado */
}
```

### Header (sticky)
```css
#site-header {
  background: #F9F6F0;
  border-bottom: 1px solid rgba(45,74,16,0.10);
  position: sticky;
  top: 0;
  z-index: 100;
}
```

### Nav Dropdown (hover com bridge)
```css
.nav-dropdown { position: relative; }
.nav-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e8e0d0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(45,74,16,0.12);
  min-width: 190px;
  z-index: 100;
  overflow: hidden;
  padding-top: 8px;
}
/* Bridge invisível evita dead zone entre trigger e menu */
.nav-dropdown-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 8px;
}
.nav-dropdown:hover .nav-dropdown-menu { display: block; }
```

---

## SEO por Página

| Página | robots | canonical | sitemap |
|---|---|---|---|
| / | index, follow | `https://kodamacogumelos.com.br/` | ✅ priority 1.0 |
| /produtos/juba-leao | index, follow | `https://kodamacogumelos.com.br/produtos/juba-leao` | ✅ priority 0.9 |
| /produtos/cordyceps | index, follow | `https://kodamacogumelos.com.br/produtos/cordyceps` | ✅ priority 0.9 |
| /produtos/kit-essencial | index, follow | `https://kodamacogumelos.com.br/produtos/kit-essencial` | ✅ priority 0.9 |
| /sobre | index, follow | `https://kodamacogumelos.com.br/sobre` | ✅ priority 0.6 |
| /privacidade | **noindex**, follow | — | ❌ |
| /termos | **noindex**, follow | — | ❌ |
| /obrigado | **noindex**, follow | — | ❌ |
| /404.html | **noindex**, nofollow | — | ❌ |

---

## Schema.org JSON-LD (padrão por página de produto)

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "[Nome do produto]",
  "description": "[Descrição sem claims terapêuticos]",
  "image": ["[URL imagem 1]", "[URL imagem 2]"],
  "brand": {"@type": "Brand", "name": "Kodama Cogumelos"},
  "sku": "[SKU]",
  "mpn": "[MPN]",
  "offers": {
    "@type": "Offer",
    "url": "[URL da página]",
    "priceCurrency": "BRL",
    "price": "[preço]",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {"@type": "Organization", "name": "Kodama Cogumelos"},
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {"@type": "MonetaryAmount", "value": "14.90", "currency": "BRL"},
      "shippingDestination": {"@type": "DefinedRegion", "addressCountry": "BR"},
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {"@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY"},
        "transitTime": {"@type": "QuantitativeValue", "minValue": 1, "maxValue": 15, "unitCode": "DAY"}
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "BR",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 7,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/ReturnShippingFees",
      "refundType": "https://schema.org/FullRefund"
    }
  },
  "aggregateRating": {"@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "17"}
}
```

---

## Anti-Generic Guardrails

- **Cores:** Nunca usar paleta Tailwind padrão (indigo-500, blue-600). Sempre hex Kodama.
- **Tipografia:** Nunca mesma fonte para heading e body.
- **Sombras:** Nunca `shadow-md` flat. Sempre tint verde: `rgba(45,74,16,0.10)`.
- **Gradientes:** Múltiplos radiais em camadas. Grain via SVG noise filter quando possível.
- **Animações:** Apenas `transform` e `opacity`. **Nunca** `transition-all`.
- **Estados interativos:** Todo elemento clicável precisa de hover, focus-visible e active.
- **Imagens de fundo:** Sempre com overlay gradiente verde.
- **Profundidade:** Base (#F9F6F0) → Elevado (#fff + sombra suave) → Flutuante (sombra intensa).

---

## Hard Rules

- Não adicionar seções/features não pedidas
- Não "melhorar" um design de referência — reproduzir fielmente
- Não parar após um único screenshot
- Não usar `transition-all`
- Não usar azul/índigo do Tailwind como cor primária
- Não incluir claims terapêuticos (ver compliance.md)
- Não inventar avaliações
- Sempre incluir disclaimer ANVISA no footer
- Sempre testar em 375px (mobile) e 1280px (desktop)

---

## Servidor Local

```bash
npx serve .           # porta 3000 padrão
# ou
python -m http.server 3000
```

Screenshots: `http://localhost:3000` → salvar em `./screenshots/screenshot-N.png`
