/* pdp.js — LLAS — Lógica da PDP (página de produto) */

import {
  getProduto,
  getProdutosByColecao,
  getColecao,
  getImagemProduto,
  getImagensDaCor,
  getVarianteCor,
  isDisponivel,
  isPrecoDefined,
  formatarPreco,
  getUrlProduto,
} from './produto-service.js';
import { initCarrossel } from './carousel.js';

/* ── URL params ─────────────────────────────────────────── */
const params  = new URLSearchParams(window.location.search);
const genero  = params.get('genero');
const colecao = params.get('colecao');
const slug    = params.get('slug');

/* ── Estado ─────────────────────────────────────────────── */
let produto      = null;
let corAtual     = params.get('cor') || null;
let tamanhoAtual = null;

/* ── Elementos ──────────────────────────────────────────── */
const imgPrincipalEl = document.getElementById('pdp-img-principal');
const miniaturasEl   = document.getElementById('pdp-miniaturas');
const nomeCorEl      = document.getElementById('pdp-cor-nome');
const swatchesEl     = document.getElementById('pdp-swatches');
const tamanhosEl     = document.getElementById('pdp-tamanhos');
const addCartEl      = document.getElementById('pdp-add-cart');

/* ── Galeria ────────────────────────────────────────────── */
function trocarImgPrincipal(src, alt = '') {
  if (!imgPrincipalEl) return;
  imgPrincipalEl.classList.add('is-trocando');
  setTimeout(() => {
    imgPrincipalEl.src = src;
    if (alt) imgPrincipalEl.alt = alt;
    imgPrincipalEl.classList.remove('is-trocando');
  }, 200);
}

function renderMiniaturas(urls) {
  if (!miniaturasEl) return;

  miniaturasEl.innerHTML = urls.map((url, i) => `
    <button
      class="pdp-miniatura${i === 0 ? ' is-ativa' : ''}"
      data-url="${url}"
      type="button"
      aria-label="Ver foto ${i + 1}"
    >
      <img src="${url}" alt="" loading="lazy">
    </button>
  `).join('');

  /* Remove listener antigo re-criando o elemento */
  const novo = miniaturasEl.cloneNode(true);
  miniaturasEl.replaceWith(novo);

  novo.addEventListener('click', e => {
    const btn = e.target.closest('.pdp-miniatura');
    if (!btn) return;
    novo.querySelectorAll('.pdp-miniatura').forEach(b => b.classList.remove('is-ativa'));
    btn.classList.add('is-ativa');
    trocarImgPrincipal(btn.dataset.url);
  });
}

function atualizarGaleria(slugCor) {
  const urls     = getImagensDaCor(produto, slugCor);
  const variante = getVarianteCor(produto, slugCor);
  if (!urls.length) return;

  trocarImgPrincipal(urls[0], `${produto.nome} — ${variante?.nome ?? ''}`);
  renderMiniaturas(urls);
}

/* ── Seletor de cor ─────────────────────────────────────── */
function selecionarCor(slugCor) {
  corAtual = slugCor;
  const variante = getVarianteCor(produto, slugCor);

  if (nomeCorEl) nomeCorEl.textContent = variante?.nome ?? '';

  swatchesEl?.querySelectorAll('.pdp-swatch').forEach(s => {
    s.classList.toggle('is-ativo', s.dataset.cor === slugCor);
  });

  atualizarGaleria(slugCor);
  renderTamanhos(slugCor);

  /* Atualiza ?cor= na URL sem reload */
  const nova = new URL(window.location.href);
  nova.searchParams.set('cor', slugCor);
  history.replaceState({ cor: slugCor }, '', nova.toString());
}

function renderSwatches() {
  if (!swatchesEl) return;

  swatchesEl.innerHTML = produto.variantes_cor.map(cor => `
    <button
      class="pdp-swatch${cor.slug === corAtual ? ' is-ativo' : ''}"
      data-cor="${cor.slug}"
      style="background-color: ${cor.hex};"
      aria-label="${cor.nome}"
      title="${cor.nome}"
      type="button"
    ></button>
  `).join('');

  swatchesEl.addEventListener('click', e => {
    const swatch = e.target.closest('.pdp-swatch');
    if (swatch) selecionarCor(swatch.dataset.cor);
  });
}

/* ── Seletor de tamanho ─────────────────────────────────── */
function renderTamanhos(slugCor) {
  if (!tamanhosEl) return;

  tamanhosEl.innerHTML = produto.tamanhos.map(tam => {
    const disponivel = isDisponivel(produto, slugCor, tam);
    const ativo      = tam === tamanhoAtual && disponivel;
    const cls = `pdp-tamanho${ativo ? ' is-ativo' : ''}${!disponivel ? ' is-esgotado' : ''}`;

    return `
      <button
        class="${cls}"
        data-tamanho="${tam}"
        type="button"
        ${!disponivel ? 'disabled aria-disabled="true"' : ''}
        aria-label="Tamanho ${tam}${!disponivel ? ' — Esgotado' : ''}"
      >${tam}</button>
    `;
  }).join('');

  /* Re-listener via delegação */
  tamanhosEl.addEventListener('click', e => {
    const btn = e.target.closest('.pdp-tamanho:not(.is-esgotado)');
    if (!btn) return;
    tamanhoAtual = btn.dataset.tamanho;
    tamanhosEl.querySelectorAll('.pdp-tamanho').forEach(b => b.classList.remove('is-ativo'));
    btn.classList.add('is-ativo');
    atualizarBotaoCart();
  }, { once: false });
}

/* ── Botão de carrinho ──────────────────────────────────── */
function atualizarBotaoCart() {
  if (!addCartEl) return;
  if (!isPrecoDefined(produto)) {
    addCartEl.disabled = true;
    addCartEl.title = 'Em breve disponível';
    return;
  }
  addCartEl.disabled = !tamanhoAtual;
  addCartEl.textContent = tamanhoAtual ? 'Adicionar ao carrinho' : 'Selecione um tamanho';
  addCartEl.removeAttribute('title');
}

function addToCart() {
  if (!tamanhoAtual || !corAtual || !isPrecoDefined(produto)) return;

  const carrinho = JSON.parse(localStorage.getItem('llas-cart') || '[]');
  const existente = carrinho.find(i =>
    i.genero   === produto.genero   &&
    i.colecao  === produto.colecao  &&
    i.slug     === produto.slug     &&
    i.cor      === corAtual         &&
    i.tamanho  === tamanhoAtual
  );

  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({
      genero:    produto.genero,
      colecao:   produto.colecao,
      slug:      produto.slug,
      cor:       corAtual,
      tamanho:   tamanhoAtual,
      quantidade: 1,
    });
  }

  localStorage.setItem('llas-cart', JSON.stringify(carrinho));

  /* Feedback */
  const textoOriginal = addCartEl.textContent;
  addCartEl.textContent = 'Adicionado';
  addCartEl.classList.add('is-adicionado');
  setTimeout(() => {
    addCartEl.textContent = textoOriginal;
    addCartEl.classList.remove('is-adicionado');
  }, 2000);

  /* Badge do carrinho */
  const total = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = total > 0 ? String(total) : '';
    badge.setAttribute('data-count', total);
  }
}

addCartEl?.addEventListener('click', addToCart);

/* ── Detalhes técnicos ──────────────────────────────────── */
function renderDetalhes() {
  const el = document.getElementById('pdp-detalhes');
  if (!el) return;

  const itens = [
    { label: 'Composição', valor: produto.composicao },
    { label: 'Gramatura',  valor: produto.gramatura },
    { label: 'Cuidados',   valor: 'Lavar à máquina em ciclo delicado, água fria. Não usar alvejante. Secar à sombra.' },
    { label: 'Fabricação', valor: 'Goiânia, GO — Brasil' },
  ].filter(i => i.valor);

  el.innerHTML = itens.map(i => `
    <div class="pdp-detalhe">
      <span class="pdp-detalhe__label">${i.label}</span>
      <span class="pdp-detalhe__valor">${i.valor}</span>
    </div>
  `).join('');
}

/* ── Cross-sell ─────────────────────────────────────────── */
async function initCrossSell() {
  const trackEl = document.getElementById('cross-sell-track');
  if (!trackEl) return;

  const todos  = await getProdutosByColecao(produto.genero, produto.colecao);
  const outros = todos.filter(
    p => !(p.slug === produto.slug && p.genero === produto.genero)
  );

  if (!outros.length) {
    document.getElementById('pdp-cross-sell')?.style.setProperty('display', 'none');
    return;
  }

  trackEl.innerHTML = outros.map(p => {
    const img   = getImagemProduto(p, p.cor_padrao, 0);
    const url   = getUrlProduto(p);
    const preco = isPrecoDefined(p)
      ? `<span class="product-card__preco">${formatarPreco(p.preco)}</span>`
      : `<span class="product-card__preco product-card__preco--em-breve">Em breve</span>`;
    const swatches = p.variantes_cor.slice(0, 5).map(c =>
      `<button class="swatch" style="background-color:${c.hex};" aria-label="${c.nome}" title="${c.nome}" type="button"></button>`
    ).join('');

    return `
      <article class="product-card" data-slug="${p.slug}" data-genero="${p.genero}" data-colecao="${p.colecao}">
        <a href="${url}" class="product-card__media-link">
          <div class="product-card__media">
            <img src="${img}" alt="${p.nome}" class="product-card__img product-card__img--principal" loading="lazy">
          </div>
        </a>
        <div class="product-card__body">
          <a href="${url}" class="product-card__nome">${p.nome}</a>
          ${preco}
          <div class="product-card__swatches">${swatches}</div>
        </div>
      </article>
    `;
  }).join('');

  initCarrossel(
    trackEl,
    document.getElementById('cross-sell-prev'),
    document.getElementById('cross-sell-next'),
  );
}

/* ── Modal: tabela de medidas ───────────────────────────── */
function initTabelaModal() {
  const modal     = document.getElementById('tabela-modal');
  const btnAbrir  = document.getElementById('pdp-tabela-link');
  const btnFechar = document.getElementById('tabela-fechar');
  const backdrop  = modal?.querySelector('.tabela-modal__backdrop');

  function abrir() {
    modal?.classList.add('is-open');
    modal?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    btnFechar?.focus();
  }

  function fechar() {
    modal?.classList.remove('is-open');
    modal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    btnAbrir?.focus();
  }

  btnAbrir?.addEventListener('click', abrir);
  btnFechar?.addEventListener('click', fechar);
  backdrop?.addEventListener('click', fechar);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) fechar();
  });
}

/* ── Breadcrumb ─────────────────────────────────────────── */
function renderBreadcrumb(colecaoData) {
  const el = document.getElementById('breadcrumb');
  if (!el) return;

  const nomeGenero = genero === 'feminino' ? 'Feminino' : 'Masculino';
  el.innerHTML = `
    <ol class="breadcrumb__list">
      <li class="breadcrumb__item"><a href="/" class="breadcrumb__link">Início</a></li>
      <li class="breadcrumb__item"><a href="/${genero}" class="breadcrumb__link">${nomeGenero}</a></li>
      <li class="breadcrumb__item"><a href="/${genero}/${colecao}" class="breadcrumb__link">${colecaoData?.nome ?? colecao}</a></li>
      <li class="breadcrumb__item"><span class="breadcrumb__atual">${produto.nome}</span></li>
    </ol>`;
}

/* ── Init ───────────────────────────────────────────────── */
async function init() {
  if (!genero || !colecao || !slug) return;

  try {
    const [p, colecaoData] = await Promise.all([
      getProduto(genero, colecao, slug),
      getColecao(colecao),
    ]);

    if (!p) {
      const nomeEl = document.getElementById('pdp-nome');
      if (nomeEl) nomeEl.textContent = 'Produto não encontrado.';
      return;
    }

    produto  = p;
    corAtual = (() => {
      const c = params.get('cor');
      return (c && getVarianteCor(p, c)) ? c : p.cor_padrao;
    })();

    /* SEO */
    const nomeGenero = genero === 'feminino' ? 'Feminino' : 'Masculino';
    document.title = `${p.nome} — ${nomeGenero} | LLAS`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && p.descricao_curta) metaDesc.content = p.descricao_curta;

    /* Breadcrumb */
    renderBreadcrumb(colecaoData);

    /* Cabeçalho */
    const nomeEl    = document.getElementById('pdp-nome');
    const colecaoEl = document.getElementById('pdp-colecao');
    const descEl    = document.getElementById('pdp-descricao');
    if (nomeEl)    nomeEl.textContent    = p.nome;
    if (colecaoEl) colecaoEl.textContent = colecaoData?.nome ?? '';
    if (descEl)    descEl.textContent    = p.descricao_curta ?? '';

    /* Preço ou "Em breve" */
    const precoEl   = document.getElementById('pdp-preco');
    const emBreveEl = document.getElementById('pdp-em-breve');
    const formEl    = document.getElementById('pdp-form');

    if (isPrecoDefined(p)) {
      if (precoEl) precoEl.textContent = formatarPreco(p.preco);
      emBreveEl?.style.setProperty('display', 'none');
    } else {
      precoEl?.style.setProperty('display', 'none');
    }

    /* Galeria */
    atualizarGaleria(corAtual);

    /* Nome da cor */
    if (nomeCorEl) nomeCorEl.textContent = getVarianteCor(p, corAtual)?.nome ?? '';

    /* Swatches */
    renderSwatches();

    /* Tamanhos */
    renderTamanhos(corAtual);

    /* Botão cart */
    atualizarBotaoCart();

    /* Detalhes */
    renderDetalhes();

    /* Modal tabela */
    initTabelaModal();

    /* Cross-sell */
    initCrossSell();

  } catch (err) {
    console.error('[LLAS] Erro ao carregar PDP:', err);
  }
}

document.addEventListener('DOMContentLoaded', init);
