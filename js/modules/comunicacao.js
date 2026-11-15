import { client, obterStatusConexao, registrarHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js';
import { ic } from '../core.js';

const configBotoes = new Map();
const edicoesBotoes = new Map();
const confirmacoesPendentes = new Map();
const coresBotoes = [
  ['#f44336', '#fff'],
  ['#e5a100', '#222'],
  ['#2e7d32', '#fff'],
  ['#2196f3', '#fff'],
  ['#00bcd4', '#222'],
  ['#a78bfa', '#fff'],
  ['#fff', '#222']
];
let alertTimeout;

const alertDialog = document.getElementById('alert-dialog');
const alertCloseButton = document.getElementById('alert-close');
const alertTitle = document.getElementById('alert-title');
const alertDescription = document.getElementById('alert-description');
const alertButtonLabel = document.getElementById('alert-button-label');
const alertButtonValue = document.getElementById('alert-btn');
const alertWord = document.getElementById('alert-word');

function fecharAlerta() {
  clearTimeout(alertTimeout);
  if (alertDialog?.open) alertDialog.close();
}

function mostrarAlerta({
  titulo,
  descricao,
  prefixo,
  valor,
  sufixo,
  palavra,
  exibirRotulo = true
}) {
  if (alertTitle) alertTitle.textContent = titulo;
  if (alertDescription) alertDescription.textContent = descricao;
  if (alertButtonLabel) alertButtonLabel.hidden = !exibirRotulo;
  if (exibirRotulo && alertButtonLabel && alertButtonValue) {
    alertButtonValue.textContent = String(valor);
    alertButtonLabel.replaceChildren(
      document.createTextNode(prefixo),
      alertButtonValue,
      document.createTextNode(sufixo)
    );
  }
  if (alertWord) alertWord.textContent = palavra;

  if (alertDialog) {
    if (!alertDialog.open) alertDialog.showModal();
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(fecharAlerta, 6000);
  }
}

alertCloseButton?.addEventListener('click', fecharAlerta);
alertDialog?.addEventListener('close', () => clearTimeout(alertTimeout));

// Receptor do Alerta da FPGA
registrarHandler(CONFIG.TOPICS.ALERTA, (data) => {
  if (!data || !Number.isInteger(data.botao) || data.botao < 0 || data.botao > 6 ||
      typeof data.palavra !== 'string' || !data.palavra) {
    console.error('❌ Alerta inválido recebido:', data);
    return;
  }

  mostrarAlerta({
    titulo: 'Pedido de ajuda',
    descricao: 'Um botão de emergência foi acionado.',
    prefixo: 'Botão ',
    valor: data.botao,
    sufixo: ' acionado',
    palavra: data.palavra
  });
});

registrarHandler(CONFIG.TOPICS.CRISE, (data) => {
  if (!data || data.crise !== true) {
    console.error('❌ Alerta de crise inválido recebido:', data);
    return;
  }

  mostrarAlerta({
    titulo: 'Crise detectada',
    descricao: 'A FPGA sinalizou uma crise.',
    prefixo: '',
    valor: '',
    sufixo: '',
    palavra: 'CRISE',
    exibirRotulo: false
  });
});

function renderizarBotoes() {
  const body = document.getElementById('button-config');
  if (!body) return;

  body.replaceChildren();
  for (let btn = 0; btn < 7; btn++) {
    const config = configBotoes.get(btn);
    const row = body.insertRow();
    const numberCell = row.insertCell();
    const ball = document.createElement('span');
    ball.className = 'ball';
    ball.style.cssText = `width:34px;height:34px;margin:0;font-size:.9rem;background:${coresBotoes[btn][0]};color:${coresBotoes[btn][1]}`;
    if (btn === 6) ball.style.border = '2px solid var(--ln)';
    ball.textContent = String(btn);
    numberCell.appendChild(ball);

    const palavraCell = row.insertCell();
    const emergenciaCell = row.insertCell();
    const actionCell = row.insertCell();

    if (edicoesBotoes.has(btn)) {
      const formId = `button-edit-${btn}`;
      const edited = edicoesBotoes.get(btn);
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'task-name-input';
      input.maxLength = 16;
      input.required = true;
      input.setAttribute('form', formId);
      input.setAttribute('aria-label', `Palavra do botão ${btn}`);
      input.value = edited.palavra;
      palavraCell.appendChild(input);

      const checkboxLabel = document.createElement('label');
      checkboxLabel.className = 'checkbox-label';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = Boolean(edited.emergencia);
      checkbox.setAttribute('form', formId);
      checkbox.setAttribute('aria-label', `Emergência do botão ${btn}`);
      checkboxLabel.append(checkbox, document.createTextNode(' Marcar'));
      emergenciaCell.appendChild(checkboxLabel);

      const form = document.createElement('form');
      form.id = formId;
      form.className = 'task-edit-actions';

      const saveButton = document.createElement('button');
      saveButton.type = 'submit';
      saveButton.className = 'btn sm';
      saveButton.innerHTML = `${ic('check', 15)} ${confirmacoesPendentes.has(btn) ? 'Enviando...' : 'Salvar'}`;
      saveButton.disabled = confirmacoesPendentes.has(btn);
      form.appendChild(saveButton);
      actionCell.appendChild(form);

      input.addEventListener('input', () => {
        edicoesBotoes.set(btn, {
          ...edicoesBotoes.get(btn),
          palavra: input.value
        });
      });
      checkbox.addEventListener('change', () => {
        edicoesBotoes.set(btn, {
          ...edicoesBotoes.get(btn),
          emergencia: checkbox.checked ? 1 : 0
        });
      });

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'btn sm ghost task-cancel-button';
      cancelButton.textContent = '×';
      cancelButton.setAttribute('aria-label', `Cancelar edição do botão ${btn}`);
      cancelButton.title = 'Cancelar';
      cancelButton.disabled = confirmacoesPendentes.has(btn);
      cancelButton.addEventListener('click', () => {
        if (confirmacoesPendentes.has(btn)) return;
        edicoesBotoes.delete(btn);
        renderizarBotoes();
      });
      form.appendChild(cancelButton);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        enviarConfiguracao(btn, input.value, checkbox.checked);
      });

      continue;
    }

    palavraCell.textContent = config ? config.palavra || '—' : 'Aguardando backend...';
    emergenciaCell.textContent = config ? (config.emergencia ? 'Sim' : 'Não') : 'Aguardando backend...';
    if (config) {
      const emergencyBadge = document.createElement('span');
      emergencyBadge.className = `pill ${config.emergencia ? 'u' : ''}`;
      emergencyBadge.textContent = config.emergencia ? 'Sim' : 'Não';
      emergenciaCell.replaceChildren(emergencyBadge);
    }

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn sm ghost';
    editButton.innerHTML = `${ic('edit', 15)} Editar`;
    editButton.disabled = !config;
    editButton.setAttribute('aria-label', `Editar botão ${btn}`);
    editButton.addEventListener('click', () => {
      if (!config) return;
      edicoesBotoes.set(btn, {
        palavra: config.palavra,
        emergencia: config.emergencia
      });
      renderizarBotoes();
      body.querySelector(`input[aria-label="Palavra do botão ${btn}"]`)?.focus();
    });
    actionCell.appendChild(editButton);
  }
}

function enviarConfiguracao(btn, palavraOriginal, emergenciaChecked) {
  const palavra = palavraOriginal.trim().toUpperCase();
  const logEl = document.getElementById('tx-log');
  if (!palavra || palavra.length > 16) {
    if (logEl) logEl.textContent = 'A palavra deve ter entre 1 e 16 caracteres.';
    return;
  }
  if (confirmacoesPendentes.has(btn)) return;

  const emergencia = emergenciaChecked ? 1 : 0;
  edicoesBotoes.set(btn, { palavra, emergencia });
  confirmacoesPendentes.set(btn, { palavra, emergencia });
  renderizarBotoes();

  client.publish(CONFIG.TOPICS.PALAVRAS, JSON.stringify({ btn, palavra, emergencia }), (err) => {
    if (err) {
      console.error('❌ Erro ao publicar configuração do botão no MQTT:', err);
      confirmacoesPendentes.delete(btn);
      renderizarBotoes();
      if (logEl) logEl.textContent = `Erro ao enviar a configuração do botão ${btn}.`;
      return;
    }

    if (confirmacoesPendentes.has(btn) && logEl) {
      logEl.textContent = `Configuração do botão ${btn} enviada; aguardando confirmação do backend.`;
    }
  });
}

registrarHandler(CONFIG.TOPICS.CONFIG_PALAVRAS, (data) => {
  if (!data || !Array.isArray(data.botoes) || data.botoes.length !== 7) {
    console.error('❌ Configuração de botões inválida recebida:', data);
    return;
  }

  const novasConfiguracoes = new Map();
  for (const config of data.botoes) {
    if (!config || !Number.isInteger(config.btn) || config.btn < 0 || config.btn > 6 ||
        novasConfiguracoes.has(config.btn) || typeof config.palavra !== 'string' ||
        !Number.isInteger(config.emergencia) || config.emergencia < 0 || config.emergencia > 1) {
      console.error('❌ Configuração de botão inválida recebida:', config);
      return;
    }
    novasConfiguracoes.set(config.btn, {
      palavra: config.palavra,
      emergencia: config.emergencia
    });
  }

  configBotoes.clear();
  novasConfiguracoes.forEach((config, btn) => configBotoes.set(btn, config));
  let botaoConfirmado = null;
  confirmacoesPendentes.forEach((esperado, btn) => {
    const atual = configBotoes.get(btn);
    if (atual && atual.palavra === esperado.palavra && atual.emergencia === esperado.emergencia) {
      confirmacoesPendentes.delete(btn);
      edicoesBotoes.delete(btn);
      botaoConfirmado = btn;
    }
  });
  renderizarBotoes();

  if (botaoConfirmado !== null) {
    const logEl = document.getElementById('tx-log');
    if (logEl) {
      const mensagem = `Configuração do botão ${botaoConfirmado} confirmada pelo backend.`;
      logEl.textContent = mensagem;
      setTimeout(() => {
        if (logEl.textContent === mensagem) logEl.textContent = obterStatusConexao();
      }, 3000);
    }
  } else {
    const logEl = document.getElementById('tx-log');
    if (logEl && (!logEl.textContent || logEl.textContent === 'Aguardando configuração do dispositivo...')) {
      logEl.textContent = obterStatusConexao();
    }
  }
});

renderizarBotoes();

const viewEl = document.getElementById('view');
if (viewEl) {
  new MutationObserver(() => {
    if (document.getElementById('button-config')) renderizarBotoes();
  }).observe(viewEl, { childList: true });
}

export { renderizarBotoes };