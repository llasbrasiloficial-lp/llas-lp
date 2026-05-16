/* carousel.js — LLAS — Componente de carrossel horizontal reutilizável */

export function initCarrossel(trackEl, btnPrev, btnNext) {
  if (!trackEl) return;

  function getScrollStep() {
    const primeiroItem = trackEl.firstElementChild;
    if (!primeiroItem) return 280;
    const gap = parseInt(getComputedStyle(trackEl).columnGap) || 0;
    return primeiroItem.getBoundingClientRect().width + gap;
  }

  function atualizarBotoes() {
    if (!btnPrev || !btnNext) return;
    btnPrev.disabled = trackEl.scrollLeft < 1;
    btnNext.disabled =
      trackEl.scrollLeft >= trackEl.scrollWidth - trackEl.clientWidth - 1;
  }

  btnPrev?.addEventListener('click', () => {
    trackEl.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  });

  btnNext?.addEventListener('click', () => {
    trackEl.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
  });

  trackEl.addEventListener('scroll', atualizarBotoes, { passive: true });

  /* Estado inicial e após carregamento de imagens */
  atualizarBotoes();
  window.addEventListener('load', atualizarBotoes);
}
