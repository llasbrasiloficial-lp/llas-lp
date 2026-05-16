/* produto-service.js — LLAS
   Camada de acesso aos dados de produtos e coleções.
   Todos os dados vêm de data/products.json e data/colecoes.json.
   Cache em memória por sessão de página. */

let _produtos = null;
let _colecoes = null;

/* ── Loaders com cache ──────────────────────────────────── */

async function carregarProdutos() {
  if (_produtos) return _produtos;
  const res = await fetch('/data/products.json');
  if (!res.ok) throw new Error(`Falha ao carregar products.json: ${res.status}`);
  const data = await res.json();
  _produtos = data.produtos;
  return _produtos;
}

async function carregarColecoes() {
  if (_colecoes) return _colecoes;
  const res = await fetch('/data/colecoes.json');
  if (!res.ok) throw new Error(`Falha ao carregar colecoes.json: ${res.status}`);
  const data = await res.json();
  _colecoes = data.colecoes;
  return _colecoes;
}

/* ── Produtos ───────────────────────────────────────────── */

export async function getProdutos() {
  return carregarProdutos();
}

/** Busca produto pela tripla única genero + colecao + slug */
export async function getProduto(genero, colecao, slug) {
  const produtos = await carregarProdutos();
  return produtos.find(
    p => p.genero === genero && p.colecao === colecao && p.slug === slug
  ) ?? null;
}

export async function getProdutosByGenero(genero) {
  const produtos = await carregarProdutos();
  return produtos.filter(p => p.genero === genero);
}

export async function getProdutosByColecao(genero, colecao) {
  const produtos = await carregarProdutos();
  return produtos.filter(p => p.genero === genero && p.colecao === colecao);
}

export async function getProdutosDestaque() {
  const produtos = await carregarProdutos();
  return produtos.filter(p => p.destaque === true);
}

/* ── Coleções ───────────────────────────────────────────── */

export async function getColecoes() {
  return carregarColecoes();
}

export async function getColecao(slug) {
  const colecoes = await carregarColecoes();
  return colecoes.find(c => c.slug === slug) ?? null;
}

export async function getColecoesDestaque() {
  const colecoes = await carregarColecoes();
  return colecoes
    .filter(c => c.destaque_home)
    .sort((a, b) => a.ordem - b.ordem);
}

/* ── Helpers de imagem ──────────────────────────────────── */

/** Retorna a URL completa de uma imagem de produto */
export function getImagemProduto(produto, slugCor, indice = 0) {
  const variante = produto.variantes_cor.find(v => v.slug === slugCor);
  if (!variante || !variante.imagens.length) return null;
  const arquivo = variante.imagens[indice] ?? variante.imagens[0];
  return `/assets/img/produtos/${produto.genero}/${produto.colecao}/${produto.slug}/${arquivo}`;
}

/** Retorna todas as URLs de imagens de uma cor */
export function getImagensDaCor(produto, slugCor) {
  const variante = produto.variantes_cor.find(v => v.slug === slugCor);
  if (!variante) return [];
  return variante.imagens.map(
    arquivo => `/assets/img/produtos/${produto.genero}/${produto.colecao}/${produto.slug}/${arquivo}`
  );
}

export function getVarianteCor(produto, slugCor) {
  return produto.variantes_cor.find(v => v.slug === slugCor) ?? null;
}

/* ── Estoque ────────────────────────────────────────────── */

/**
 * Verifica disponibilidade de uma combinação cor × tamanho.
 * Regras:
 *   - Campo estoque ausente → disponível (produto sem controle de estoque)
 *   - Chave ausente no objeto estoque → disponível
 *   - Chave presente com valor 0 → esgotado
 *   - Chave presente com valor > 0 → disponível
 */
export function isDisponivel(produto, slugCor, tamanho) {
  if (!produto.estoque || Object.keys(produto.estoque).length === 0) return true;
  const chave = `${slugCor}-${tamanho}`;
  if (!(chave in produto.estoque)) return true;
  return produto.estoque[chave] > 0;
}

/** Retorna tamanhos disponíveis para uma cor */
export function getTamanhosDisponiveis(produto, slugCor) {
  return produto.tamanhos.filter(t => isDisponivel(produto, slugCor, t));
}

/* ── Preço ──────────────────────────────────────────────── */

/** Retorna true quando o produto tem preço real definido (> 0) */
export function isPrecoDefined(produto) {
  return typeof produto.preco === 'number' && produto.preco > 0;
}

export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* ── URL ────────────────────────────────────────────────── */

export function getUrlProduto(produto, slugCor = null) {
  const base = `/${produto.genero}/${produto.colecao}/${produto.slug}`;
  return slugCor && slugCor !== produto.cor_padrao
    ? `${base}?cor=${slugCor}`
    : base;
}

export function getUrlColecao(genero, slugColecao) {
  return `/${genero}/${slugColecao}`;
}
