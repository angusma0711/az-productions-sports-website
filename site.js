(() => {
  const elements = [...document.querySelectorAll('[data-en]')];
  for (const element of elements) element.dataset.zh = element.hasAttribute('data-html') ? element.innerHTML : element.textContent;
  const imageElements = [...document.querySelectorAll('[data-en-alt]')];
  for (const element of imageElements) element.dataset.zhAlt = element.alt;

  const button = document.querySelector('[data-language-toggle]');
  const saved = localStorage.getItem('az-site-language');
  let language = saved === 'en' ? 'en' : 'zh-HK';

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
    button.textContent = english ? '繁中' : 'EN';
    button.setAttribute('aria-label', english ? 'Switch to Traditional Chinese' : 'Switch to English');
  }

  button.addEventListener('click', () => {
    language = language === 'en' ? 'zh-HK' : 'en';
    localStorage.setItem('az-site-language', language);
    render();
  });
  render();
})();
