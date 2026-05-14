---
name: kodama-operations
description: Workflows operacionais, integrações Yampi/Tiny/n8n, rastreamento e processos internos Kodama
type: reference
---

# Kodama Operations — Workflows e Integrações

## Stack Operacional

| Sistema | Papel | Acesso |
|---|---|---|
| Yampi | Checkout, gestão de pedidos, pagamentos | seguro.kodamacogumelos.com.br |
| Tiny ERP (Olist) | ERP, NF-e, sincronização produtos, Google Shopping | app.olist.com |
| n8n | Automação de fluxos (WhatsApp, notificações, Dama) | self-hosted |
| Frenet | Cotação e contratação de frete | integrado ao Yampi |
| Loggi | Transportadora principal (maioria do Brasil) | via Frenet |
| Correios SEDEX | Goiânia, Goiás e DF | via Frenet |
| WhatsApp Business API | Canal de atendimento (Dama) | (62) 9 8177-4481 |
| Google Tag Manager | Analytics, eventos de conversão | GTM-W556LRV6 |
| Google Analytics 4 | Métricas de tráfego e conversão | integrado via GTM |
| Microsoft Clarity | Heatmaps e gravações de sessão | integrado via GTM |
| Google Merchant Center | Listagem de produtos no Google Shopping | ID: 5704869719 |

---

## Fluxo de Pedido (do checkout à entrega)

```
1. Cliente finaliza no Yampi (seguro.kodamacogumelos.com.br)
2. Yampi confirma pagamento → aciona webhook n8n
3. n8n → notifica equipe + envia confirmação ao cliente via WhatsApp (Dama)
4. Equipe separa e embala o pedido (Goiânia-GO)
5. Frenet cotação → Loggi ou Correios SEDEX selecionado
6. Postagem → código de rastreio gerado
7. n8n → envia rastreio via WhatsApp automaticamente
8. Entrega → n8n → solicita avaliação (opcional)
```

---

## Integração Google Merchant Center

**Fonte de dados:** Tiny Olist (sincronização via API Content)  
**Problema histórico:** Campo `link` apontava para checkout Yampi → reprovação  
**Correção:** URLs devem apontar para páginas de produto do site:
- Juba de Leão: `https://kodamacogumelos.com.br/produtos/juba-leao`
- Cordyceps: `https://kodamacogumelos.com.br/produtos/cordyceps`
- Kit Essencial: `https://kodamacogumelos.com.br/produtos/kit-essencial`

**SKUs no Merchant Center:**
- JUB-001 (Juba 1un)
- COR-001 (Cordyceps 1un)
- MIX-JC-01 a MIX-JC-05 (Kits 1 a 5 unidades)

**Categoria Google Shopping:** Alimentos, bebidas e tabaco > Bebidas > Chás

---

## Robots.txt — Regras de Crawl

**Permitido para todos os bots:**
- `/` — home
- `/produtos/` — páginas de produto
- `/sobre` — institucional
- `/brand_assets/` — imagens
- `/sitemap-kodama.xml`

**Bloqueado para todos:**
- `/wp-admin/`, `/wp-content/`, `/wp-includes/`, `/*.php` — WordPress legado
- `/screenshots/` — pasta de desenvolvimento
- `/obrigado/`, `/obrigado.html` — pós-compra
- `/metodo-matematico/`, `/roleta/`, `/cassino/`, etc. — spam indexado anteriormente

---

## Sitemap

**Arquivo:** `/sitemap-kodama.xml`  
**Enviado ao Google Search Console:** `https://kodamacogumelos.com.br/sitemap-kodama.xml`

URLs indexadas (5 total):
1. `https://kodamacogumelos.com.br/` — priority 1.0, weekly
2. `https://kodamacogumelos.com.br/produtos/juba-leao` — priority 0.9, weekly
3. `https://kodamacogumelos.com.br/produtos/cordyceps` — priority 0.9, weekly
4. `https://kodamacogumelos.com.br/produtos/kit-essencial` — priority 0.9, weekly
5. `https://kodamacogumelos.com.br/sobre` — priority 0.6, monthly

---

## Página /obrigado — Pós-Checkout

**Problema histórico:** Yampi `%%variables%%` não sendo substituídas → literais apareciam  
**Solução implementada:** Página genérica sem variáveis dinâmicas do Yampi

**Conteúdo atual:**
1. "Pedido confirmado! 🎉" — cabeçalho genérico
2. Box Dama — explica que informações de entrega serão enviadas via WhatsApp
3. Box cupom — exibe código `2COMPRA` com botão de copiar
4. GTM `purchase` event disparado (sem valores dinâmicos)

**Yampi JS:** `thankyou.min.js` do Yampi substitui variáveis server-side — quando falha/atrasa, literals aparecem. Solução: remover dependência de variáveis.

---

## Vercel — Deploy e Configuração

**Repositório:** `https://github.com/kodamacogumelos-blip/kodama-lp`  
**Branch:** `main` (deploy automático)  
**Domínio:** `kodamacogumelos.com.br`

**Headers de segurança configurados:**
- Content-Security-Policy (CSP completo)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- Referrer-Policy

**Regras de cache:**
- Assets estáticos (.webp, .jpg, .css, .js, .gif): `max-age=31536000, immutable`
- index.html: `max-age=0, must-revalidate`
- .mp4: `Accept-Ranges: bytes` (suporte a streaming)

**Rewrite:** `/obrigado` → `/obrigado.html` (cleanUrls não cobre páginas raiz sem pasta)

---

## Política de Frete (para configuração em sistemas)

```
Frete fixo: R$14,90 para qualquer destino no Brasil
Frete grátis: pedidos acima de R$200
Cotação: Frenet (API de multi-carrier)
Prazo de processamento: 0-1 dia útil
```

---

## Contatos Operacionais

| Papel | Contato |
|---|---|
| Atendimento cliente (Dama) | WhatsApp (62) 9 8177-4481 |
| E-mail oficial | contato@kodamacogumelos.com.br |
| Endereço operacional | Goiânia-GO |
| CNPJ | (verificar no footer do site) |
