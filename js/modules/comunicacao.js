import { client, registrarHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js?v=3';

const configBotoes = new Map();
const edicoesBotoes = new Map();
const confirmacoesPendentes = new Map();
let alertTimeout;

const alertDialog = document.getElementById('alert-dialog');
const alertCloseButton = document.getElementById('alert-close');

function fecharAlerta() {
  clearTimeout(alertTimeout);
  if (alertDialog?.open) alertDialog.close();
}

alertCloseButton?.addEventListener('click', fecharAlerta);
alertDialog?.addEventListener('close', () => clearTimeout(alertTimeout));

// Receptor do Alerta da FPGA
registrarHandler(CONFIG.TOPICS.ALERTA, (data) => {
  const btnEl = document.getElementById('alert-btn');
  const wordEl = document.getElementById('alert-word');

  if (btnEl) btnEl.textContent = data.botao;
  if (wordEl) wordEl.textContent = data.palavra;

  if (alertDialog) {
    if (!alertDialog.open) alertDialog.showModal();
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(fecharAlerta, 6000);
  }
});

function renderizarBotoes() {
  const body = document.getElementById('button-config');
  if (!body) return;

  body.replaceChildren();
  for (let btn = 0; btn < 7; btn++) {
    const config = configBotoes.get(btn);
    const row = body.insertRow();
    row.insertCell().textContent = btn;
    const palavraCell = row.insertCell();
    const emergenciaCell = row.insertCell();
    const actionCell = row.insertCell();

    if (edicoesBotoes.has(btn)) {
      const form = document.createElement('form');
      form.className = 'task-edit-form';
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'task-name-input';
      input.maxLength = 16;
      input.required = true;
      input.setAttribute('aria-label', `Palavra do botão ${btn}`);
      input.value = edicoesBotoes.get(btn).palavra;
      form.appendChild(input);

      const checkboxLabel = document.createElement('label');
      checkboxLabel.className = 'checkbox-label';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = Boolean(edicoesBotoes.get(btn).emergencia);
      checkbox.setAttribute('aria-label', `Emergência do botão ${btn}`);
      checkboxLabel.append(checkbox, document.createTextNode(' Emergência'));
      form.appendChild(checkboxLabel);

      const saveButton = document.createElement('button');
      saveButton.type = 'submit';
      saveButton.className = 'task-action';
      saveButton.textContent = confirmacoesPendentes.has(btn) ? 'Enviando...' : 'Salvar';
      saveButton.disabled = confirmacoesPendentes.has(btn);
      form.appendChild(saveButton);
      palavraCell.appendChild(form);

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
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        enviarConfiguracao(btn, input.value, checkbox.checked);
      });

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'task-action task-action-secondary';
      cancelButton.textContent = 'Cancelar';
      cancelButton.disabled = confirmacoesPendentes.has(btn);
      cancelButton.addEventListener('click', () => {
        if (confirmacoesPendentes.has(btn)) return;
        edicoesBotoes.delete(btn);
        renderizarBotoes();
      });
      actionCell.appendChild(cancelButton);
      if (confirmacoesPendentes.has(btn)) {
        emergenciaCell.textContent = 'Aguardando confirmação...';
      } else {
        emergenciaCell.textContent = config ? (config.emergencia ? 'Sim' : 'Não') : 'Aguardando backend...';
      }
      continue;
    }

    palavraCell.textContent = config ? config.palavra || '—' : 'Aguardando backend...';
    emergenciaCell.textContent = config ? (config.emergencia ? 'Sim' : 'Não') : 'Aguardando backend...';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'task-action';
    editButton.textContent = 'Editar';
    editButton.setAttribute('aria-label', `Editar botão ${btn}`);
    editButton.addEventListener('click', () => {
      edicoesBotoes.set(btn, {
        palavra: config ? config.palavra : '',
        emergencia: config ? config.emergencia : 0
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
        if (logEl.textContent === mensagem) logEl.textContent = '';
      }, 3000);
    }
  }
});

renderizarBotoes();