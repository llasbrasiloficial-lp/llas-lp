/* cart.js — LLAS — Estado do carrinho (LocalStorage, puro, sem DOM) */

export const CHAVE_CART           = 'llas-cart';
export const FRETE_GRATIS_VALOR   = 299; // R$
const WA_NUM = '5500000000000'; // TODO: substituir pelo número real da LLAS

/* ── Leitura / escrita ──────────────────────────────────── */

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CHAVE_CART) || '[]'); }
  catch { return []; }
}

function salvar(itens) {
  localStorage.setItem(CHAVE_CART, JSON.stringify(itens));
  window.dispatchEvent(new CustomEvent('llas:cart-update', { detail: itens }));
}

/* ── CRUD ───────────────────────────────────────────────── */

/**
 * Adiciona item ou incrementa quantidade se já existir.
 * @param {{ genero, colecao, slug, cor, nomeCor, tamanho, preco, nome }} item
 */
export function addItem(item) {
  const itens = getCart();
  const idx = itens.findIndex(i =>
    i.genero  === item.genero  && i.colecao === item.colecao &&
    i.slug    === item.slug    && i.cor     === item.cor     &&
    i.tamanho === item.tamanho
  );
  if (idx >= 0) {
    itens[idx].quantidade += 1;
  } else {
    itens.push({ ...item, quantidade: 1 });
  }
  salvar(itens);
  return getCart();
}

export function removeItem(genero, colecao, slug, cor, tamanho) {
  const itens = getCart().filter(i =>
    !(i.genero === genero && i.colecao === colecao &&
      i.slug   === slug   && i.cor    === cor      && i.tamanho === tamanho)
  );
  salvar(itens);
  return itens;
}

export function updateQuantidade(genero, colecao, slug, cor, tamanho, qtd) {
  if (qtd <= 0) return removeItem(genero, colecao, slug, cor, tamanho);
  const itens = getCart();
  const item  = itens.find(i =>
    i.genero === genero && i.colecao === colecao &&
    i.slug   === slug   && i.cor    === cor      && i.tamanho === tamanho
  );
  if (item) item.quantidade = qtd;
  salvar(itens);
  return itens;
}

export function limparCart() {
  salvar([]);
}

/* ── Totais ─────────────────────────────────────────────── */

export function getTotalItens(itens = getCart()) {
  return itens.reduce((acc, i) => acc + i.quantidade, 0);
}

export function getSubtotal(itens = getCart()) {
  return itens.reduce((acc, i) => acc + (i.preco || 0) * i.quantidade, 0);
}

export function getFaltaFrete(subtotal) {
  return Math.max(0, FRETE_GRATIS_VALOR - subtotal);
}

/* ── Badge ──────────────────────────────────────────────── */

export function atualizarBadge() {
  const total = getTotalItens();
  document.querySelectorAll('#cart-badge, .cart-badge').forEach(el => {
    el.textContent = total > 0 ? String(total) : '';
    el.setAttribute('data-count', String(total));
  });
}

/* ── WhatsApp ───────────────────────────────────────────── */

export function gerarLinkWhatsApp(itens, subtotal) {
  if (!itens.length) return '';
  const linhas = itens.map(i => {
    const nome = i.nome || i.slug;
    const cor  = i.nomeCor || i.cor;
    return `• ${nome} — ${cor} · Tam. ${i.tamanho} × ${i.quantidade}`;
  });
  const totalStr = subtotal > 0
    ? `\nTotal estimado: R$ ${subtotal.toFixed(2).replace('.', ',')}`
    : '';
  const msg = `Olá! Gostaria de finalizar meu pedido LLAS:\n\n${linhas.join('\n')}${totalStr}`;
  return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
}
