(() => {
  const elements = [...document.querySelectorAll('[data-en]')];
  for (const element of elements) element.dataset.zh = element.hasAttribute('data-html') ? element.innerHTML : element.textContent;
  const imageElements = [...document.querySelectorAll('[data-en-alt]')];
  for (const element of imageElements) element.dataset.zhAlt = element.alt;
  const labelledElements = [...document.querySelectorAll('[data-en-label]')];
  for (const element of labelledElements) element.dataset.zhLabel = element.getAttribute('aria-label');

  const button = document.querySelector('[data-language-toggle]');
  let saved;
  try { saved = localStorage.getItem('az-site-language'); } catch (_) { saved = null; }
  let language = saved === 'en' ? 'en' : 'zh-HK';
  let updateGalleryPause = () => {};

  function render() {
    const english = language === 'en';
    document.documentElement.lang = language;
    document.title = english
      ? (document.body.dataset.page === 'case' ? 'Pui Ching Sports Exchange | AZ Productions' : 'AZ Productions | Sports Exchange Tours')
      : (document.body.dataset.page === 'case' ? '培正小學廣州體育交流團｜AZ Productions' : 'AZ Productions｜運動交流旅程');
    for (const element of elements) {
      const value = english ? element.dataset.en : element.dataset.zh;
      if (element.hasAttribute('data-html')) element.innerHTML = value;
      else element.textContent = value;
    }
    for (const element of imageElements) element.alt = english ? element.dataset.enAlt : element.dataset.zhAlt;
    for (const element of labelledElements) element.setAttribute('aria-label', english ? element.dataset.enLabel : element.dataset.zhLabel);
    button.textContent = english ? '繁中' : 'EN';
    button.setAttribute('aria-label', english ? 'Switch to Traditional Chinese' : 'Switch to English');
    updateGalleryPause();
  }

  button.addEventListener('click', () => {
    language = language === 'en' ? 'zh-HK' : 'en';
    try { localStorage.setItem('az-site-language', language); } catch (_) { /* The language switch still works when storage is disabled. */ }
    render();
  });
  render();

  const gallery = document.querySelector('.hero-gallery');
  if (gallery) {
    const slides = [...gallery.querySelectorAll('.hero-slide')];
    const pauseButton = gallery.querySelector('[data-gallery-pause]');
    let current = 0;
    let timer;
    let cleanup;
    let inView = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;

    updateGalleryPause = () => {
      pauseButton.textContent = paused ? '▶' : 'Ⅱ';
      pauseButton.setAttribute('aria-pressed', String(paused));
      pauseButton.setAttribute('aria-label', language === 'en'
        ? (paused ? 'Play slideshow' : 'Pause slideshow')
        : (paused ? '播放相片' : '暫停自動播放'));
    };
    updateGalleryPause();

    function showNext() {
      if (cleanup) clearTimeout(cleanup);
      const previous = slides[current];
      current = (current + 1) % slides.length;
      const next = slides[current];
      for (const slide of slides) {
        slide.classList.remove('is-active', 'is-exiting');
        slide.setAttribute('aria-hidden', 'true');
      }
      previous.classList.add('is-exiting');
      next.classList.add('is-active');
      next.removeAttribute('aria-hidden');
      cleanup = setTimeout(() => previous.classList.remove('is-exiting'), reducedMotion.matches ? 0 : 700);
    }

    function stop() { clearInterval(timer); }
    function start() {
      stop();
      if (!paused && !reducedMotion.matches && inView && !document.hidden) {
        timer = setInterval(showNext, 4500);
      }
    }

    pauseButton.addEventListener('click', () => { paused = !paused; updateGalleryPause(); start(); });
    document.addEventListener('visibilitychange', start);
    const onMotionChange = () => { if (reducedMotion.matches) paused = true; updateGalleryPause(); start(); };
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
    else if (reducedMotion.addListener) reducedMotion.addListener(onMotionChange);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; start(); }, { threshold: 0.2 }).observe(gallery);
    }
    start();
  }
})();
