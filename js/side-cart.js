/* side-cart.js — LLAS — Drawer lateral do carrinho */

import {
  getCart,
  removeItem,
  updateQuantidade,
  getSubtotal,
  getFaltaFrete,
  atualizarBadge,
  gerarLinkWhatsApp,
  FRETE_GRATIS_VALOR,
} from './cart.js';
import {
  getProduto,
  getImagemProduto,
  getVarianteCor,
  isPrecoDefined,
  formatarPreco,
} from './produto-service.js';

/* ── HTML do drawer (injetado uma vez no body) ───────────── */
const HTML = `
<aside class="side-cart" id="side-cart" aria-hidden="true">
  <div class="side-cart__backdrop" aria-hidden="true"></div>
  <div class="side-cart__painel" role="dialog" aria-modal="true" aria-label="Carrinho de compras">

    <div class="side-cart__header">
      <h2 class="side-cart__titulo">Carrinho</h2>
      <button class="side-cart__fechar" id="side-cart-fechar" aria-label="Fechar carrinho" type="button">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="side-cart__frete">
      <p class="side-cart__frete-texto" id="sc-frete-texto"></p>
      <div class="side-cart__frete-bar">
        <div class="side-cart__frete-progresso" id="sc-frete-barra" style="width:0%"></div>
      </div>
    </div>

    <div class="side-cart__lista" id="sc-lista"></div>

    <div class="side-cart__footer">
      <div class="side-cart__subtotal">
        <span class="side-cart__subtotal-label">Subtotal</span>
        <span class="side-cart__subtotal-valor" id="sc-subtotal">—</span>
      </div>
      <a href="/carrinho" class="side-cart__btn side-cart__btn--secundario">Ver carrinho completo</a>
      <a href="#" class="side-cart__btn side-cart__btn--primario" id="sc-btn-whatsapp"
         target="_blank" rel="noopener noreferrer">
        Finalizar via WhatsApp
      </a>
    </div>

  </div>
</aside>`;

/* ── Render: lista de itens ─────────────────────────────── */
async function renderLista(listaEl, itens) {
  if (!itens.length) {
    listaEl.innerHTML = `
      <div class="side-cart__vazio">
        <p class="side-cart__vazio-texto">Seu carrinho está vazio.</p>
        <a href="/feminino" class="side-cart__vazio-link">Explorar produtos →</a>
      </div>`;
    return;
  }

  const produtosData = await Promise.all(
    itens.map(i => getProduto(i.genero, i.colecao, i.slug).catch(() => null))
  );

  listaEl.innerHTML = itens.map((item, idx) => {
    const prod      = produtosData[idx];
    const nome      = item.nome || prod?.nome || item.slug;
    const nomeCor   = item.nomeCor || getVarianteCor(prod, item.cor)?.nome || item.cor;
    const img       = prod
      ? getImagemProduto(prod, item.cor, 0)
      : '';
    const temPreco  = item.preco > 0;
    const precoHtml = temPreco
      ? `<span class="side-cart__item-preco">${formatarPreco(item.preco * item.quantidade)}</span>`
      : `<span class="side-cart__item-preco side-cart__item-preco--em-breve">Em breve</span>`;

    return `
      <div class="side-cart__item"
        data-genero="${item.genero}"
        data-colecao="${item.colecao}"
        data-slug="${item.slug}"
        data-cor="${item.cor}"
        data-tamanho="${item.tamanho}"
      >
        ${img ? `<img class="side-cart__item-img" src="${img}" alt="${nome}" loading="lazy">` : '<div class="side-cart__item-img"></div>'}
        <div class="side-cart__item-info">
          <p class="side-cart__item-nome">${nome}</p>
          <p class="side-cart__item-variante">${nomeCor} · ${item.tamanho}</p>
          ${precoHtml}
        </div>
        <div class="side-cart__item-acoes">
          <div class="side-cart__qtd">
            <button class="side-cart__qtd-btn" data-action="decrement" type="button" aria-label="Diminuir">−</button>
            <span class="side-cart__qtd-valor">${item.quantidade}</span>
            <button class="side-cart__qtd-btn" data-action="increment" type="button" aria-label="Aumentar">+</button>
          </div>
          <button class="side-cart__remover" data-action="remover" type="button">Remover</button>
        </div>
      </div>`;
  }).join('');
}

/* ── Render: UI completa do side cart ───────────────────── */
async function renderSideCart() {
  const itens    = getCart();
  const subtotal = getSubtotal(itens);
  const falta    = getFaltaFrete(subtotal);
  const progresso = Math.min(100, (subtotal / FRETE_GRATIS_VALOR) * 100);

  /* Progress bar */
  const freteTexto = document.getElementById('sc-frete-texto');
  const freteBarra = document.getElementById('sc-frete-barra');
  if (freteTexto) {
    freteTexto.innerHTML = falta > 0
      ? `Falta <strong>${formatarPreco(falta)}</strong> para frete grátis`
      : '<strong>Frete grátis</strong> no seu pedido';
  }
  if (freteBarra) freteBarra.style.width = `${progresso}%`;

  /* Lista */
  const listaEl = document.getElementById('sc-lista');
  if (listaEl) await renderLista(listaEl, itens);

  /* Subtotal */
  const subtotalEl = document.getElementById('sc-subtotal');
  if (subtotalEl) subtotalEl.textContent = subtotal > 0 ? formatarPreco(subtotal) : '—';

  /* WhatsApp */
  const waBtn = document.getElementById('sc-btn-whatsapp');
  if (waBtn) {
    const link = gerarLinkWhatsApp(itens, subtotal);
    if (link) {
      waBtn.href = link;
      waBtn.removeAttribute('disabled');
      waBtn.classList.remove('side-cart__btn--desabilitado');
    } else {
      waBtn.href = '#';
      waBtn.classList.add('side-cart__btn--desabilitado');
    }
  }
}

/* ── Abrir / fechar ─────────────────────────────────────── */
function abrir() {
  const el = document.getElementById('side-cart');
  if (!el) return;
  el.classList.add('is-open');
  el.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  document.getElementById('side-cart-fechar')?.focus();
  renderSideCart();
}

function fechar() {
  const el = document.getElementById('side-cart');
  if (!el) return;
  el.classList.remove('is-open');
  el.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
}

/* ── Init ───────────────────────────────────────────────── */
export function initSideCart() {
  /* Injeta HTML uma única vez */
  document.body.insertAdjacentHTML('beforeend', HTML);

  const el       = document.getElementById('side-cart');
  const backdrop = el?.querySelector('.side-cart__backdrop');

  document.getElementById('side-cart-fechar')?.addEventListener('click', fechar);
  backdrop?.addEventListener('click', fechar);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && el?.classList.contains('is-open')) fechar();
  });

  /* Clique no ícone de carrinho no header */
  document.addEventListener('click', e => {
    const btn = e.target.closest('button[aria-label="Carrinho"]') ||
                e.target.closest('button[aria-label*="Carrinho"]') ||
                e.target.closest('#cart-badge')?.closest('button');

    if (btn && !btn.closest('.side-cart') && !btn.closest('.carrinho-page')) {
      e.preventDefault();
      abrir();
    }
  });

  /* Ações nos itens (delegação) */
  el?.addEventListener('click', e => {
    const btn    = e.target.closest('[data-action]');
    const itemEl = btn?.closest('.side-cart__item');
    if (!btn || !itemEl) return;

    const { genero, colecao, slug, cor, tamanho } = itemEl.dataset;
    const acao = btn.dataset.action;

    if (acao === 'remover') {
      removeItem(genero, colecao, slug, cor, tamanho);
    } else {
      const item = getCart().find(i =>
        i.genero === genero && i.colecao === colecao &&
        i.slug   === slug   && i.cor    === cor      && i.tamanho === tamanho
      );
      if (!item) return;
      const novaQtd = acao === 'increment' ? item.quantidade + 1 : item.quantidade - 1;
      updateQuantidade(genero, colecao, slug, cor, tamanho, novaQtd);
    }

    atualizarBadge();
    renderSideCart();
  });

  /* Reage a mudanças do carrinho (incluindo outras abas) */
  window.addEventListener('llas:cart-update', () => {
    atualizarBadge();
    if (el?.classList.contains('is-open')) renderSideCart();
  });

  window.addEventListener('storage', e => {
    if (e.key !== 'llas-cart') return;
    atualizarBadge();
    if (el?.classList.contains('is-open')) renderSideCart();
  });

  /* Badge inicial */
  atualizarBadge();
}
