import { client, registrarHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js?v=3';

const statusTarefas = new Map();
const edicoesTarefas = new Map();
const confirmacoesPendentes = new Map();

function renderizarStatusTarefas() {
  const checkEl = document.getElementById('task-check');
  if (!checkEl) return;

  checkEl.replaceChildren();
  for (let taskId = 0; taskId < 16; taskId++) {
    const tarefa = statusTarefas.get(taskId);
    const row = checkEl.insertRow();
    row.insertCell().textContent = taskId;

    const nomeCell = row.insertCell();
    const statusCell = row.insertCell();
    const actionCell = row.insertCell();

    if (edicoesTarefas.has(taskId)) {
      const form = document.createElement('form');
      form.className = 'task-edit-form';
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'task-name-input';
      nameInput.maxLength = 16;
      nameInput.required = true;
      nameInput.setAttribute('aria-label', `Nome da tarefa ${taskId}`);
      nameInput.value = edicoesTarefas.get(taskId);
      form.appendChild(nameInput);
      nomeCell.appendChild(form);

      const saveButton = document.createElement('button');
      saveButton.type = 'submit';
      saveButton.className = 'task-action';
      saveButton.textContent = confirmacoesPendentes.has(taskId) ? 'Enviando...' : 'Salvar';
      saveButton.disabled = confirmacoesPendentes.has(taskId);
      form.appendChild(saveButton);

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'task-action task-action-secondary';
      cancelButton.textContent = 'Cancelar';
      actionCell.appendChild(cancelButton);

      nameInput.addEventListener('input', () => {
        edicoesTarefas.set(taskId, nameInput.value);
      });
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        enviarTarefa(taskId, nameInput.value);
      });
      cancelButton.addEventListener('click', () => {
        edicoesTarefas.delete(taskId);
        confirmacoesPendentes.delete(taskId);
        renderizarStatusTarefas();
      });

      statusCell.textContent = tarefa ? tarefa.status_nome : 'Aguardando backend...';
      continue;
    }

    nomeCell.textContent = tarefa ? tarefa.nome || '—' : '—';
    statusCell.textContent = tarefa ? tarefa.status_nome : 'Aguardando backend...';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'task-action';
    editButton.textContent = 'Editar';
    editButton.setAttribute('aria-label', `Editar tarefa ${taskId}`);
    editButton.addEventListener('click', () => {
      edicoesTarefas.set(taskId, tarefa ? tarefa.nome : '');
      renderizarStatusTarefas();
      const input = checkEl.querySelector(`input[aria-label="Nome da tarefa ${taskId}"]`);
      input?.focus();
    });
    actionCell.appendChild(editButton);
  }
}

function enviarTarefa(taskId, nomeOriginal) {
  const nome = nomeOriginal.trim().toUpperCase();
  const logEl = document.getElementById('task-tx-log');
  if (!nome || nome.length > 16) {
    if (logEl) logEl.textContent = 'O nome da tarefa deve ter entre 1 e 16 caracteres.';
    return;
  }
  if (confirmacoesPendentes.has(taskId)) return;

  edicoesTarefas.set(taskId, nome);
  confirmacoesPendentes.set(taskId, nome);
  renderizarStatusTarefas();

  client.publish(CONFIG.TOPICS.TAREFAS, JSON.stringify({ id: taskId, nome }), (err) => {
    if (err) {
      console.error('❌ Erro ao publicar tarefa no MQTT:', err);
      if (!confirmacoesPendentes.has(taskId)) return;
      confirmacoesPendentes.delete(taskId);
      renderizarStatusTarefas();
      if (logEl) logEl.textContent = `Erro ao enviar a tarefa ${taskId} para o MQTT.`;
      return;
    }

    if (confirmacoesPendentes.has(taskId) && logEl) {
      const mensagem = `Tarefa ${taskId} enviada; aguardando confirmação do backend.`;
      logEl.textContent = mensagem;
      setTimeout(() => {
        if (logEl.textContent === mensagem) logEl.textContent = '';
      }, 3000);
    }
  });
}

registrarHandler(CONFIG.TOPICS.CHECK, (data) => {
  if (!data || !Array.isArray(data.tarefas) || data.tarefas.length !== 16) {
    console.error('❌ Check de tarefa inválido recebido:', data);
    return;
  }

  const novasTarefas = new Map();
  for (const tarefa of data.tarefas) {
    if (!tarefa || !Number.isInteger(tarefa.task_id) || tarefa.task_id < 0 ||
        tarefa.task_id > 15 || novasTarefas.has(tarefa.task_id) ||
        typeof tarefa.nome !== 'string' ||
        !Number.isInteger(tarefa.status) || tarefa.status < 0 || tarefa.status > 2 ||
        typeof tarefa.status_nome !== 'string' || !tarefa.status_nome) {
      console.error('❌ Check de tarefa inválido recebido:', tarefa);
      return;
    }

    novasTarefas.set(tarefa.task_id, {
      nome: tarefa.nome,
      status_nome: tarefa.status_nome
    });
  }

  statusTarefas.clear();
  novasTarefas.forEach((tarefa, taskId) => statusTarefas.set(taskId, tarefa));

  let tarefaConfirmada = null;
  confirmacoesPendentes.forEach((nome, taskId) => {
    const tarefa = statusTarefas.get(taskId);
    if (tarefa && tarefa.nome === nome) {
      confirmacoesPendentes.delete(taskId);
      edicoesTarefas.delete(taskId);
      tarefaConfirmada = taskId;
    }
  });
  renderizarStatusTarefas();

  if (tarefaConfirmada !== null) {
    const logEl = document.getElementById('task-tx-log');
    if (logEl) {
      const mensagem = `Tarefa ${tarefaConfirmada} confirmada pelo backend.`;
      logEl.textContent = mensagem;
      setTimeout(() => {
        if (logEl.textContent === mensagem) logEl.textContent = '';
      }, 3000);
    }
  }
});

renderizarStatusTarefas();
