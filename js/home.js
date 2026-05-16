/* home.js — LLAS — Orquestração da home page */

import {
  getProdutosDestaque,
  getColecoesDestaque,
  getImagemProduto,
  isPrecoDefined,
  formatarPreco,
  getUrlProduto,
} from './produto-service.js';
import { initCarrossel } from './carousel.js';

/* ── Render: card de produto ────────────────────────────── */
function renderProductCard(produto) {
  const imgPrincipal  = getImagemProduto(produto, produto.cor_padrao, 0);
  const imgHover      = getImagemProduto(produto, produto.cor_padrao, 1);
  const url           = getUrlProduto(produto);
  const nomeCorPadrao = produto.variantes_cor.find(v => v.slug === produto.cor_padrao)?.nome ?? '';

  const precoHtml = isPrecoDefined(produto)
    ? `<span class="product-card__preco">${formatarPreco(produto.preco)}</span>`
    : `<span class="product-card__preco product-card__preco--em-breve">Em breve</span>`;

  const MAX = 5;
  const visiveis = produto.variantes_cor.slice(0, MAX);
  const extras   = produto.variantes_cor.length - MAX;

  const swatchesHtml = visiveis.map(cor => `
    <button
      class="swatch${cor.slug === produto.cor_padrao ? ' is-ativo' : ''}"
      data-cor="${cor.slug}"
      style="background-color: ${cor.hex};"
      aria-label="${cor.nome}"
      title="${cor.nome}"
      type="button"
    ></button>
  `).join('');

  const imgHoverHtml = imgHover
    ? `<img src="${imgHover}" alt="" class="product-card__img product-card__img--hover" loading="lazy" aria-hidden="true">`
    : '';

  return `
    <article
      class="product-card"
      data-slug="${produto.slug}"
      data-genero="${produto.genero}"
      data-colecao="${produto.colecao}"
      data-cor-atual="${produto.cor_padrao}"
    >
      <a href="${url}" class="product-card__media-link">
        <div class="product-card__media">
          <img
            src="${imgPrincipal}"
            alt="${produto.nome} — ${nomeCorPadrao}"
            class="product-card__img product-card__img--principal"
            loading="lazy"
          >
          ${imgHoverHtml}
        </div>
      </a>
      <div class="product-card__body">
        <a href="${url}" class="product-card__nome">${produto.nome}</a>
        ${precoHtml}
        <div class="product-card__swatches" role="group" aria-label="Cores disponíveis">
          ${swatchesHtml}
          ${extras > 0 ? `<span class="product-card__mais-cores">+${extras}</span>` : ''}
        </div>
      </div>
    </article>
  `;
}

/* ── Render: card de coleção ────────────────────────────── */
function renderColecaoCard(colecao, imgFallback) {
  const badge = colecao.tipo === 'tematica'
    ? `<span class="colecao-card__badge">Sazonal</span>`
    : '';

  return `
    <a href="/colecoes/${colecao.slug}" class="colecao-card">
      <div class="colecao-card__media">
        <img
          src="${imgFallback}"
          alt="${colecao.nome}"
          class="colecao-card__img"
          loading="lazy"
        >
      </div>
      <div class="colecao-card__body">
        <h3 class="colecao-card__nome">${colecao.nome}${badge}</h3>
        <p class="colecao-card__manifesto">${colecao.manifesto}</p>
        <span class="colecao-card__link">Ver coleção →</span>
      </div>
    </a>
  `;
}

/* ── Interação: hover de swatch troca foto no card ──────── */
function initSwatchInteracao(container, produtos) {
  container.addEventListener('mouseover', e => {
    const swatch = e.target.closest('.swatch');
    if (!swatch) return;

    const card = swatch.closest('.product-card');
    if (!card) return;

    const { slug, genero, colecao } = card.dataset;
    const slugCor = swatch.dataset.cor;

    const produto = produtos.find(
      p => p.slug === slug && p.genero === genero && p.colecao === colecao
    );
    if (!produto) return;

    const novaImg = getImagemProduto(produto, slugCor, 0);
    if (!novaImg) return;

    const imgEl = card.querySelector('.product-card__img--principal');
    if (imgEl) imgEl.src = novaImg;

    const url = getUrlProduto(produto, slugCor);
    card.querySelectorAll('a').forEach(a => { a.href = url; });

    card.querySelectorAll('.swatch').forEach(s => s.classList.remove('is-ativo'));
    swatch.classList.add('is-ativo');
    card.dataset.corAtual = slugCor;
  });

  /* Click no swatch → navega direto para PDP com a cor */
  container.addEventListener('click', e => {
    const swatch = e.target.closest('.swatch');
    if (!swatch) return;
    e.preventDefault();

    const card = swatch.closest('.product-card');
    if (!card) return;

    const { slug, genero, colecao } = card.dataset;
    const produto = produtos.find(
      p => p.slug === slug && p.genero === genero && p.colecao === colecao
    );
    if (!produto) return;

    window.location.href = getUrlProduto(produto, swatch.dataset.cor);
  });
}

/* ── FAQ accordion ──────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-item__pergunta').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const aberto = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-item__pergunta')
          ?.setAttribute('aria-expanded', 'false');
      });

      if (!aberto) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── Init ───────────────────────────────────────────────── */
async function init() {
  try {
    const [produtos, colecoes] = await Promise.all([
      getProdutosDestaque(),
      getColecoesDestaque(),
    ]);

    /* Coleções grid */
    const gridEl = document.getElementById('colecoes-cards');
    if (gridEl) {
      gridEl.innerHTML = colecoes.map(colecao => {
        const produtoRef = produtos.find(p => p.colecao === colecao.slug);
        const imgFallback = produtoRef
          ? getImagemProduto(produtoRef, produtoRef.cor_padrao, 0)
          : '/assets/img/colecoes/placeholder.webp';
        return renderColecaoCard(colecao, imgFallback);
      }).join('');
    }

    /* Produtos carrossel */
    const trackEl = document.getElementById('produtos-track');
    if (trackEl) {
      trackEl.innerHTML = produtos.map(renderProductCard).join('');
      initSwatchInteracao(trackEl, produtos);
      initCarrossel(
        trackEl,
        document.getElementById('produtos-prev'),
        document.getElementById('produtos-next'),
      );
    }
  } catch (err) {
    console.error('[LLAS] Erro ao carregar dados da home:', err);
  }

  initFaq();
}

document.addEventListener('DOMContentLoaded', init);
