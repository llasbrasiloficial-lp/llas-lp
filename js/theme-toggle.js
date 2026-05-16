/* theme-toggle.js — LLAS */

const STORAGE_KEY = 'llas-theme';
const DARK = 'dark';
const LIGHT = 'light';

function getTemaPreferido() {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo) return salvo;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  localStorage.setItem(STORAGE_KEY, tema);

  const botoes = document.querySelectorAll('[data-theme-toggle]');
  botoes.forEach(btn => {
    btn.setAttribute('aria-label', tema === DARK ? 'Ativar modo claro' : 'Ativar modo escuro');
    btn.setAttribute('aria-pressed', tema === DARK ? 'true' : 'false');
  });
}

function alternarTema() {
  const atual = document.documentElement.getAttribute('data-theme');
  aplicarTema(atual === DARK ? LIGHT : DARK);
}

function iniciarTema() {
  /* Bloqueia a transição na carga inicial para evitar flash */
  document.documentElement.style.setProperty('--transition-tema', '0ms');
  aplicarTema(getTemaPreferido());

  /* Reativa a transição após a primeira renderização */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.style.removeProperty('--transition-tema');
    });
  });

  /* Responde a mudanças do sistema operacional (só se o usuário não tiver salvo preferência) */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      aplicarTema(e.matches ? DARK : LIGHT);
    }
  });

  /* Conecta botões de toggle presentes no DOM */
  document.addEventListener('click', e => {
    if (e.target.closest('[data-theme-toggle]')) {
      alternarTema();
    }
  });
}

iniciarTema();

export { aplicarTema, alternarTema };
