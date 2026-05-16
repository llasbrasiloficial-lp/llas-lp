/* carrinho.js — LLAS — Página completa do carrinho */

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

/* ── Render: item da lista ──────────────────────────────── */
async function renderItem(item) {
  const prod    = await getProduto(item.genero, item.colecao, item.slug).catch(() => null);
  const nome    = item.nome || prod?.nome || item.slug;
  const nomeCor = item.nomeCor || getVarianteCor(prod, item.cor)?.nome || item.cor;
  const img     = prod ? getImagemProduto(prod, item.cor, 0) : '';
  const temPreco = item.preco > 0;
  const precoHtml = temPreco
    ? `<span class="carrinho-item__preco">${formatarPreco(item.preco * item.quantidade)}</span>`
    : `<span class="carrinho-item__preco carrinho-item__preco--em-breve">Em breve</span>`;

  return `
    <div class="carrinho-item"
      data-genero="${item.genero}"
      data-colecao="${item.colecao}"
      data-slug="${item.slug}"
      data-cor="${item.cor}"
      data-tamanho="${item.tamanho}"
    >
      ${img
        ? `<img class="carrinho-item__img" src="${img}" alt="${nome}" loading="lazy">`
        : `<div class="carrinho-item__img"></div>`}
      <div class="carrinho-item__info">
        <p class="carrinho-item__nome">
          <a href="/${item.genero}/${item.colecao}/${item.slug}?cor=${item.cor}">${nome}</a>
        </p>
        <p class="carrinho-item__variante">${nomeCor} · Tam. ${item.tamanho}</p>
        ${precoHtml}
        <div class="carrinho-item__acoes">
          <div class="carrinho-qtd">
            <button class="carrinho-qtd__btn" data-action="decrement" type="button" aria-label="Diminuir quantidade">−</button>
            <span class="carrinho-qtd__valor">${item.quantidade}</span>
            <button class="carrinho-qtd__btn" data-action="increment" type="button" aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="carrinho-item__remover" data-action="remover" type="button">Remover</button>
        </div>
      </div>
    </div>`;
}

/* ── Render: resumo do pedido ───────────────────────────── */
function renderResumo(itens, subtotal) {
  const resumoEl  = document.getElementById('carrinho-resumo');
  const waBtn     = document.getElementById('carrinho-btn-whatsapp');
  const subEl     = document.getElementById('carrinho-subtotal');
  const totalEl   = document.getElementById('carrinho-total');
  const freteEl   = document.getElementById('carrinho-frete-info');
  const contadEl  = document.getElementById('carrinho-contagem');

  const falta = getFaltaFrete(subtotal);

  if (subEl)   subEl.textContent  = subtotal > 0 ? formatarPreco(subtotal) : '—';
  if (totalEl) totalEl.textContent = subtotal > 0 ? formatarPreco(subtotal) : '—';

  if (freteEl) {
    freteEl.textContent = falta > 0
      ? `Falta ${formatarPreco(falta)} para frete grátis`
      : subtotal > 0 ? 'Frete grátis incluído' : '';
  }

  if (contadEl) {
    const total = itens.reduce((acc, i) => acc + i.quantidade, 0);
    contadEl.textContent = `${total} ${total === 1 ? 'item' : 'itens'}`;
  }

  /* WhatsApp */
  if (waBtn) {
    const link = gerarLinkWhatsApp(itens, subtotal);
    if (link && itens.length) {
      waBtn.href = link;
      waBtn.removeAttribute('disabled');
      waBtn.classList.remove('carrinho-resumo__btn--desabilitado');
    } else {
      waBtn.href = '#';
      waBtn.classList.add('carrinho-resumo__btn--desabilitado');
    }
  }
}

/* ── Render: página completa ────────────────────────────── */
async function renderPagina() {
  const itensEl   = document.getElementById('carrinho-itens');
  const vazioEl   = document.getElementById('carrinho-vazio');
  const gridEl    = document.getElementById('carrinho-grid');
  const resumoEl  = document.getElementById('carrinho-resumo');
  const itens     = getCart();
  const subtotal  = getSubtotal(itens);

  if (!itens.length) {
    itensEl?.style.setProperty('display', 'none');
    resumoEl?.style.setProperty('display', 'none');
    vazioEl?.style.setProperty('display', 'block');
    return;
  }

  vazioEl?.style.setProperty('display', 'none');
  itensEl?.style.removeProperty('display');
  resumoEl?.style.removeProperty('display');

  /* Render assíncrono dos itens */
  if (itensEl) {
    const htmls = await Promise.all(itens.map(renderItem));
    itensEl.innerHTML = htmls.join('');

    /* Delegação de ações */
    itensEl.addEventListener('click', e => {
      const btn    = e.target.closest('[data-action]');
      const itemEl = btn?.closest('.carrinho-item');
      if (!btn || !itemEl) return;

      const { genero, colecao, slug, cor, tamanho } = itemEl.dataset;
      const acao = btn.dataset.action;

      if (acao === 'remover') {
        removeItem(genero, colecao, slug, cor, tamanho);
      } else {
        const it = getCart().find(i =>
          i.genero === genero && i.colecao === colecao &&
          i.slug   === slug   && i.cor    === cor      && i.tamanho === tamanho
        );
        if (it) {
          const novaQtd = acao === 'increment' ? it.quantidade + 1 : it.quantidade - 1;
          updateQuantidade(genero, colecao, slug, cor, tamanho, novaQtd);
        }
      }

      atualizarBadge();
      renderPagina();
    }, { once: true });
  }

  renderResumo(itens, subtotal);
}

/* ── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  atualizarBadge();
  renderPagina();

  window.addEventListener('llas:cart-update', () => {
    atualizarBadge();
    renderPagina();
  });
});
