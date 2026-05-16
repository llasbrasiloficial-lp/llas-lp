/* hero-slider.js — LLAS */

const INTERVALO = 5000;

const slider = document.getElementById('hero-slider');
if (slider) {
  const slides  = slider.querySelectorAll('.hero-slide');
  const dots    = slider.querySelectorAll('.hero-slider__dot');
  const btnPrev = slider.querySelector('.hero-slider__arrow--prev');
  const btnNext = slider.querySelector('.hero-slider__arrow--next');

  let indice = 0;
  let timer  = null;

  function irPara(i) {
    slides[indice].classList.remove('is-active');
    dots[indice]?.classList.remove('is-active');
    dots[indice]?.setAttribute('aria-selected', 'false');

    indice = (i + slides.length) % slides.length;

    slides[indice].classList.add('is-active');
    dots[indice]?.classList.add('is-active');
    dots[indice]?.setAttribute('aria-selected', 'true');
  }

  function iniciarAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => irPara(indice + 1), INTERVALO);
  }

  function pararAutoplay() {
    clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { irPara(i); iniciarAutoplay(); });
  });

  btnPrev?.addEventListener('click', () => { irPara(indice - 1); iniciarAutoplay(); });
  btnNext?.addEventListener('click', () => { irPara(indice + 1); iniciarAutoplay(); });

  slider.addEventListener('mouseenter', pararAutoplay);
  slider.addEventListener('mouseleave', iniciarAutoplay);

  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { irPara(indice - 1); iniciarAutoplay(); }
    if (e.key === 'ArrowRight') { irPara(indice + 1); iniciarAutoplay(); }
  });

  iniciarAutoplay();
}
