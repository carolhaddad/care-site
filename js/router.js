import './modules/historico.js?v=4';
import './modules/comunicacao.js?v=7';
import './modules/rotina.js?v=5';
function initRouter() {
  const siteHeader = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuBackdrop = document.querySelector('.nav-backdrop');
  const tabTriggers = document.querySelectorAll('[data-tab]');

  function closeMenu(returnFocus = false) {
    siteHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    if (returnFocus) menuToggle.focus();
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    if (isOpen) document.querySelector('.tab-nav .tab-btn').focus();
  });

  menuBackdrop.addEventListener('click', () => closeMenu(true));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && siteHeader.classList.contains('menu-open')) {
      closeMenu(true);
    }
  });

  tabTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = e.currentTarget.getAttribute('data-tab');

      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.removeAttribute('aria-current'));

      const abaAlvo = document.getElementById(`aba-${targetTab}`);
      if (abaAlvo) {
        abaAlvo.classList.add('active');
        document.querySelectorAll(`.tab-btn[data-tab="${targetTab}"]`).forEach(tabButton => {
          tabButton.classList.add('active');
          tabButton.setAttribute('aria-current', 'page');
        });
      }
      if (siteHeader.classList.contains('menu-open')) closeMenu();
    });
  });
}

// Executa imediatamente se o DOM já estiver pronto, ou aguarda o evento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRouter);
} else {
  initRouter();
}