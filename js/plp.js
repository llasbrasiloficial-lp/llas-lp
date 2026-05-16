/* plp.js — LLAS — Lógica das páginas PLP (coleção e gênero) */

import {
  getProdutosByGenero,
  getProdutosByColecao,
  getColecao,
  getImagemProduto,
  isPrecoDefined,
  formatarPreco,
  getUrlProduto,
} from './produto-service.js';

/* ── Parâmetros da URL ──────────────────────────────────── */
const params  = new URLSearchParams(window.location.search);
const genero  = params.get('genero');  // 'feminino' | 'masculino'
const colecao = params.get('colecao'); // 'basica' | 'copa-brasil' | null

/* ── Render: card de produto (igual ao home.js) ─────────── */
function renderCard(produto) {
  const imgPrincipal = getImagemProduto(produto, produto.cor_padrao, 0);
  const imgHover     = getImagemProduto(produto, produto.cor_padrao, 1);
  const url          = getUrlProduto(produto);
  const nomeCor      = produto.variantes_cor.find(v => v.slug === produto.cor_padrao)?.nome ?? '';

  const precoHtml = isPrecoDefined(produto)
    ? `<span class="product-card__preco">${formatarPreco(produto.preco)}</span>`
    : `<span class="product-card__preco product-card__preco--em-breve">Em breve</span>`;

  const MAX      = 5;
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
            alt="${produto.nome} — ${nomeCor}"
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

/* ── Render: grid de produtos ───────────────────────────── */
function renderGrid(gridEl, produtos, todosProdutos) {
  if (produtos.length === 0) {
    gridEl.innerHTML = `
      <div class="plp-vazio">
        <p class="plp-vazio__titulo">Nenhuma peça encontrada.</p>
        <p>Esta seção ainda não tem peças para este gênero.</p>
      </div>`;
    return;
  }

  gridEl.innerHTML = produtos.map(renderCard).join('');
  initSwatchInteracao(gridEl, todosProdutos);
}

/* ── Interação: swatches ────────────────────────────────── */
function initSwatchInteracao(container, produtos) {
  container.addEventListener('mouseover', e => {
    const swatch = e.target.closest('.swatch');
    if (!swatch) return;

    const card = swatch.closest('.product-card');
    if (!card) return;

    const { slug, genero: g, colecao: c } = card.dataset;
    const slugCor = swatch.dataset.cor;
    const produto = produtos.find(
      p => p.slug === slug && p.genero === g && p.colecao === c
    );
    if (!produto) return;

    const novaImg = getImagemProduto(produto, slugCor, 0);
    if (novaImg) {
      const imgEl = card.querySelector('.product-card__img--principal');
      if (imgEl) imgEl.src = novaImg;
    }

    const url = getUrlProduto(produto, slugCor);
    card.querySelectorAll('a').forEach(a => { a.href = url; });

    card.querySelectorAll('.swatch').forEach(s => s.classList.remove('is-ativo'));
    swatch.classList.add('is-ativo');
    card.dataset.corAtual = slugCor;
  });

  container.addEventListener('click', e => {
    const swatch = e.target.closest('.swatch');
    if (!swatch) return;
    e.preventDefault();

    const card = swatch.closest('.product-card');
    if (!card) return;

    const { slug, genero: g, colecao: c } = card.dataset;
    const produto = produtos.find(
      p => p.slug === slug && p.genero === g && p.colecao === c
    );
    if (produto) {
      window.location.href = getUrlProduto(produto, swatch.dataset.cor);
    }
  });
}

/* ── Render: breadcrumb ─────────────────────────────────── */
function renderBreadcrumb(nomeGenero, colecaoData) {
  const el = document.getElementById('breadcrumb');
  if (!el) return;

  let html = `
    <ol class="breadcrumb__list">
      <li class="breadcrumb__item">
        <a href="/" class="breadcrumb__link">Início</a>
      </li>`;

  if (colecaoData) {
    html += `
      <li class="breadcrumb__item">
        <a href="/${genero}" class="breadcrumb__link">${nomeGenero}</a>
      </li>
      <li class="breadcrumb__item">
        <span class="breadcrumb__atual">${colecaoData.nome}</span>
      </li>`;
  } else {
    html += `
      <li class="breadcrumb__item">
        <span class="breadcrumb__atual">${nomeGenero}</span>
      </li>`;
  }

  html += `</ol>`;
  el.innerHTML = html;
}

/* ── Filtros de coleção (só na PLP de gênero) ───────────── */
function initFiltrosColecao(filtrosEl, contagemEl, gridEl, todosProdutos) {
  if (!filtrosEl) return;

  /* Extrai coleções únicas na ordem em que aparecem */
  const slugsUnicos = [...new Map(
    todosProdutos.map(p => [p.colecao, p.colecao])
  ).keys()];

  const nomeColecao = {
    'basica':       'Básica',
    'copa-brasil':  'Copa Brasil',
    'brazilidades': 'Brazilidades',
  };

  filtrosEl.innerHTML = slugsUnicos.map(slug => `
    <button class="chip" data-filtro="${slug}" type="button">
      ${nomeColecao[slug] ?? slug}
    </button>
  `).join('');

  filtrosEl.addEventListener('click', e => {
    const chip = e.target.closest('.chip[data-filtro]');
    if (!chip) return;

    const jaAtivo = chip.classList.contains('is-ativo');

    filtrosEl.querySelectorAll('.chip').forEach(c => c.classList.remove('is-ativo'));

    const filtrados = jaAtivo
      ? todosProdutos
      : (() => {
          chip.classList.add('is-ativo');
          return todosProdutos.filter(p => p.colecao === chip.dataset.filtro);
        })();

    if (contagemEl) {
      contagemEl.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'peça' : 'peças'}`;
    }

    renderGrid(gridEl, filtrados, todosProdutos);
  });
}

/* ── Skeleton enquanto carrega ──────────────────────────── */
function mostrarSkeleton(gridEl, n = 4) {
  gridEl.innerHTML = Array(n).fill(`
    <div class="plp-skeleton__card">
      <div class="plp-skeleton__img"></div>
      <div class="plp-skeleton__linha"></div>
      <div class="plp-skeleton__linha plp-skeleton__linha--curta"></div>
    </div>
  `).join('');
}

/* ── Schema BreadcrumbList ──────────────────────────────── */
function injetarBreadcrumbSchema(nomeGenero, colecaoData) {
  const base  = 'https://llasoficial.com.br';
  const items = [
    { '@type': 'ListItem', 'position': 1, 'name': 'Início',    'item': `${base}/` },
    { '@type': 'ListItem', 'position': 2, 'name': nomeGenero,  'item': `${base}/${genero}` },
  ];
  if (colecaoData) {
    items.push({ '@type': 'ListItem', 'position': 3, 'name': colecaoData.nome, 'item': `${base}/${genero}/${colecao}` });
  }
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': items });
  document.head.appendChild(s);
}

/* ── Init ───────────────────────────────────────────────── */
async function init() {
  if (!genero) return;

  const nomeGenero  = genero === 'feminino' ? 'Feminino' : 'Masculino';
  const tituloEl    = document.getElementById('plp-titulo');
  const manifestoEl = document.getElementById('plp-manifesto');
  const contagemEl  = document.getElementById('plp-contagem');
  const gridEl      = document.getElementById('plp-grid');
  const filtrosEl   = document.getElementById('filtros-colecao');

  if (gridEl) mostrarSkeleton(gridEl);

  try {
    let produtos;
    let colecaoData = null;

    if (colecao) {
      [produtos, colecaoData] = await Promise.all([
        getProdutosByColecao(genero, colecao),
        getColecao(colecao),
      ]);
    } else {
      produtos = await getProdutosByGenero(genero);
    }

    /* Breadcrumb */
    renderBreadcrumb(nomeGenero, colecaoData);

    /* Hero */
    if (colecaoData) {
      if (tituloEl)    tituloEl.textContent    = colecaoData.nome;
      if (manifestoEl) manifestoEl.textContent = colecaoData.manifesto;
      document.title = `${colecaoData.nome} — ${nomeGenero} | LLAS`;

      /* Tabs para alternar gênero dentro da mesma coleção */
      const tabsFem = document.getElementById('tab-feminino');
      const tabsMasc = document.getElementById('tab-masculino');
      if (tabsFem && tabsMasc) {
        tabsFem.href  = `/feminino/${colecao}`;
        tabsMasc.href = `/masculino/${colecao}`;
        const atualTab = genero === 'feminino' ? tabsFem : tabsMasc;
        atualTab.classList.add('is-ativo');
        atualTab.removeAttribute('href');
      }
    } else {
      if (tituloEl)    tituloEl.textContent    = nomeGenero;
      if (manifestoEl) manifestoEl.textContent =
        `Toda a linha ${nomeGenero.toLowerCase()} da LLAS. Algodão 100% penteado, sem atalhos.`;
      document.title = `${nomeGenero} — LLAS`;
    }

    /* Contagem */
    if (contagemEl) {
      contagemEl.textContent = `${produtos.length} ${produtos.length === 1 ? 'peça' : 'peças'}`;
    }

    /* Filtros de coleção (só no genero.html) */
    if (!colecao) {
      initFiltrosColecao(filtrosEl, contagemEl, gridEl, produtos);
    }

    /* Grid */
    if (gridEl) renderGrid(gridEl, produtos, produtos);

    /* Schema BreadcrumbList */
    injetarBreadcrumbSchema(nomeGenero, colecaoData);

  } catch (err) {
    console.error('[LLAS] Erro ao carregar PLP:', err);
    if (gridEl) {
      gridEl.innerHTML = `
        <div class="plp-vazio">
          <p class="plp-vazio__titulo">Erro ao carregar os produtos.</p>
          <p>Tente novamente em instantes.</p>
        </div>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
