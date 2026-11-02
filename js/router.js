import './modules/historico.js?v=4';
import './modules/comunicacao.js?v=7';
import './modules/rotina.js?v=5';
function initRouter() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabTriggers = document.querySelectorAll('[data-tab]');

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
    });
  });
}

// Executa imediatamente se o DOM já estiver pronto, ou aguarda o evento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRouter);
} else {
  initRouter();
}