/* mega-menu.js — LLAS */

const CLOSE_DELAY = 150; // ms de espera antes de fechar (evita fechamento acidental)

let menuAtual = null;
let timerFechar = null;

const header       = document.getElementById('site-header');
const navItems     = document.querySelectorAll('.nav-item[data-menu]');
const megaPanels   = document.querySelectorAll('.mega-menu');
const hamburger    = document.getElementById('nav-toggle');
const drawer       = document.getElementById('mobile-drawer');
const drawerFechar = document.getElementById('drawer-fechar');
const backdrop     = document.querySelector('.mobile-drawer__backdrop');
const accordions   = document.querySelectorAll('.mobile-drawer__trigger');

/* ── Header: reduz ao rolar ─────────────────────────────── */
function atualizarHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 10);
}

window.addEventListener('scroll', atualizarHeader, { passive: true });
atualizarHeader();

/* ── Desktop: mega-menu ─────────────────────────────────── */
function abrirMenu(id) {
  if (menuAtual === id) return;
  fecharMenu(true);

  menuAtual = id;
  document.getElementById(`mega-menu-${id}`)?.classList.add('is-open');
  document.querySelector(`.nav-item[data-menu="${id}"]`)
    ?.setAttribute('aria-expanded', 'true');
}

function fecharMenu(imediato = false) {
  if (!menuAtual) return;

  document.getElementById(`mega-menu-${menuAtual}`)?.classList.remove('is-open');
  document.querySelector(`.nav-item[data-menu="${menuAtual}"]`)
    ?.setAttribute('aria-expanded', 'false');

  menuAtual = null;
}

navItems.forEach(item => {
  const id = item.dataset.menu;

  /* Hover (desktop) */
  item.addEventListener('mouseenter', () => {
    clearTimeout(timerFechar);
    abrirMenu(id);
  });

  item.addEventListener('mouseleave', () => {
    timerFechar = setTimeout(fecharMenu, CLOSE_DELAY);
  });

  /* Click (acessibilidade + toque) */
  item.addEventListener('click', () => {
    menuAtual === id ? fecharMenu() : abrirMenu(id);
  });
});

megaPanels.forEach(panel => {
  panel.addEventListener('mouseenter', () => clearTimeout(timerFechar));
  panel.addEventListener('mouseleave', () => {
    timerFechar = setTimeout(fecharMenu, CLOSE_DELAY);
  });
});

/* Click fora fecha o mega-menu */
document.addEventListener('click', e => {
  if (!e.target.closest('.site-header__nav') && !e.target.closest('.mega-menu')) {
    fecharMenu();
  }
});

/* ── Mobile: drawer ─────────────────────────────────────── */
function abrirDrawer() {
  drawer?.classList.add('is-open');
  drawer?.setAttribute('aria-hidden', 'false');
  hamburger?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('drawer-open');
  drawerFechar?.focus();
}

function fecharDrawer() {
  drawer?.classList.remove('is-open');
  drawer?.setAttribute('aria-hidden', 'true');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('drawer-open');
  hamburger?.focus();
}

hamburger?.addEventListener('click', abrirDrawer);
drawerFechar?.addEventListener('click', fecharDrawer);
backdrop?.addEventListener('click', fecharDrawer);

/* Accordion no drawer mobile */
accordions.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const expandido = trigger.getAttribute('aria-expanded') === 'true';
    const sub = trigger.nextElementSibling;

    trigger.setAttribute('aria-expanded', String(!expandido));
    if (sub) sub.hidden = expandido;
  });
});

/* ESC fecha tudo */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (menuAtual) fecharMenu();
  if (drawer?.classList.contains('is-open')) fecharDrawer();
});
