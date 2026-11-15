import { client, obterStatusConexao, registrarHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js';
import { ic } from '../core.js';

const statusTarefas = new Map();
const edicoesTarefas = new Map();
const confirmacoesPendentes = new Map();
const classesStatus = ['s0', 's2', 's1'];

function renderizarProgresso() {
  const total = 16;
  const completo = statusTarefas.size === total;
  const concluidas = [...statusTarefas.values()].filter((tarefa) => tarefa.status === 1).length;
  const percentual = Math.round((concluidas / total) * 100);
  const countEl = document.getElementById('task-completed-count');
  const percentEl = document.getElementById('task-completed-percent');
  const barEl = document.getElementById('task-progress-bar');
  const progressEl = barEl?.parentElement;

  if (countEl) countEl.textContent = completo ? String(concluidas) : '—';
  if (percentEl) percentEl.textContent = completo ? String(percentual) : '—';
  if (barEl) barEl.style.width = `${completo ? percentual : 0}%`;
  if (progressEl) progressEl.setAttribute('aria-valuenow', String(completo ? concluidas : 0));
}

function renderizarStatusTarefas() {
  renderizarProgresso();

  const checkEl = document.getElementById('task-check');
  if (!checkEl) return;

  checkEl.replaceChildren();
  for (let taskId = 0; taskId < 16; taskId++) {
    const tarefa = statusTarefas.get(taskId);
    const row = checkEl.insertRow();
    row.insertCell().textContent = String(taskId).padStart(2, '0');

    const nomeCell = row.insertCell();
    const statusCell = row.insertCell();
    const actionCell = row.insertCell();

    if (edicoesTarefas.has(taskId)) {
      const formId = `task-edit-${taskId}`;
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'task-name-input';
      nameInput.maxLength = 16;
      nameInput.required = true;
      nameInput.setAttribute('form', formId);
      nameInput.setAttribute('aria-label', `Nome da tarefa ${taskId}`);
      nameInput.value = edicoesTarefas.get(taskId);
      nomeCell.appendChild(nameInput);

      const form = document.createElement('form');
      form.id = formId;
      form.className = 'task-edit-actions';
      const saveButton = document.createElement('button');
      saveButton.type = 'submit';
      saveButton.className = 'btn sm';
      saveButton.innerHTML = `${ic('check', 15)} ${confirmacoesPendentes.has(taskId) ? 'Enviando...' : 'Salvar'}`;
      saveButton.disabled = confirmacoesPendentes.has(taskId);
      form.appendChild(saveButton);

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'btn sm ghost task-cancel-button';
      cancelButton.textContent = '×';
      cancelButton.setAttribute('aria-label', `Cancelar edição da tarefa ${taskId}`);
      cancelButton.title = 'Cancelar';
      cancelButton.disabled = confirmacoesPendentes.has(taskId);
      cancelButton.addEventListener('click', () => {
        if (confirmacoesPendentes.has(taskId)) return;
        edicoesTarefas.delete(taskId);
        renderizarStatusTarefas();
      });
      form.appendChild(cancelButton);
      actionCell.appendChild(form);

      nameInput.addEventListener('input', () => {
        edicoesTarefas.set(taskId, nameInput.value);
      });
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        enviarTarefa(taskId, nameInput.value);
      });
    } else {
      nomeCell.textContent = tarefa ? tarefa.nome || '—' : 'Aguardando backend...';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'btn sm ghost';
      editButton.innerHTML = `${ic('edit', 15)} Editar`;
      editButton.disabled = !tarefa;
      editButton.setAttribute('aria-label', `Editar tarefa ${taskId}`);
      editButton.addEventListener('click', () => {
        if (!tarefa) return;
        edicoesTarefas.set(taskId, tarefa.nome);
        renderizarStatusTarefas();
        checkEl.querySelector(`input[aria-label="Nome da tarefa ${taskId}"]`)?.focus();
      });
      actionCell.appendChild(editButton);
    }

    if (tarefa) {
      const statusBadge = document.createElement('span');
      statusBadge.className = `ts ${classesStatus[tarefa.status]}`;
      const statusDot = document.createElement('i');
      statusBadge.append(statusDot, document.createTextNode(tarefa.status_nome));
      statusCell.appendChild(statusBadge);
    } else {
      statusCell.textContent = 'Aguardando backend...';
    }
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
        if (logEl.textContent === mensagem) logEl.textContent = obterStatusConexao();
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
      status: tarefa.status,
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

  const logEl = document.getElementById('task-tx-log');
  if (tarefaConfirmada !== null && logEl) {
    const mensagem = `Tarefa ${tarefaConfirmada} confirmada pelo backend.`;
    logEl.textContent = mensagem;
    setTimeout(() => {
      if (logEl.textContent === mensagem) logEl.textContent = obterStatusConexao();
    }, 3000);
  } else if (logEl && (!logEl.textContent || logEl.textContent === 'Aguardando dados da rotina pelo MQTT...')) {
    logEl.textContent = obterStatusConexao();
  }
});

const viewEl = document.getElementById('view');
if (viewEl) {
  new MutationObserver(() => {
    if (document.getElementById('task-check')) renderizarStatusTarefas();
  }).observe(viewEl, { childList: true });
}

export { renderizarStatusTarefas };
