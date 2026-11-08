import { client, registrarHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js?v=4';

const perguntas = new Map();
const edicoes = new Map();
const pendentes = new Set();

function renderizarPerguntas() {
  const body = document.getElementById('question-config');
  if (!body) return;

  body.replaceChildren();
  for (let id = 0; id < 32; id++) {
    const pergunta = perguntas.get(id) || { pergunta: '', alternativa_a: '', alternativa_b: '', correta: 0 };
    const row = body.insertRow();
    row.insertCell().textContent = id;
    const values = edicoes.get(id) || pergunta;

    ['pergunta', 'alternativa_a', 'alternativa_b'].forEach((field) => {
      const cell = row.insertCell();
      if (edicoes.has(id)) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'question-input';
        input.value = values[field];
        input.maxLength = field === 'pergunta' ? 16 : 4;
        input.required = true;
        input.setAttribute('aria-label', `${field} da pergunta ${id}`);
        input.addEventListener('input', () => {
          edicoes.set(id, { ...edicoes.get(id), [field]: input.value });
        });
        cell.appendChild(input);
      } else {
        cell.textContent = values[field] || 'Aguardando backend...';
      }
    });

    const correctCell = row.insertCell();
    if (edicoes.has(id)) {
      const select = document.createElement('select');
      select.innerHTML = '<option value="0">A</option><option value="1">B</option>';
      select.value = String(values.correta);
      select.addEventListener('change', () => {
        edicoes.set(id, { ...edicoes.get(id), correta: Number(select.value) });
      });
      correctCell.appendChild(select);
    } else {
      correctCell.textContent = values.correta === 1 ? 'B' : 'A';
    }

    const actionCell = row.insertCell();
    if (edicoes.has(id)) {
      const form = document.createElement('form');
      form.className = 'task-edit-form';
      const save = document.createElement('button');
      save.type = 'submit';
      save.className = 'task-action';
      save.textContent = pendentes.has(id) ? 'Enviando...' : 'Salvar';
      save.disabled = pendentes.has(id);
      form.appendChild(save);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        enviarPergunta(id, edicoes.get(id));
      });
      actionCell.appendChild(form);

      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'task-action task-action-secondary';
      cancel.textContent = 'Cancelar';
      cancel.disabled = pendentes.has(id);
      cancel.addEventListener('click', () => {
        edicoes.delete(id);
        renderizarPerguntas();
      });
      actionCell.appendChild(cancel);
    } else {
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'task-action';
      edit.textContent = 'Editar';
      edit.addEventListener('click', () => {
        edicoes.set(id, { ...pergunta });
        renderizarPerguntas();
      });
      actionCell.appendChild(edit);
    }
  }
}

function enviarPergunta(id, values) {
  const log = document.getElementById('question-tx-log');
  const pergunta = values.pergunta.trim().toUpperCase();
  const alternativaA = values.alternativa_a.trim().toUpperCase();
  const alternativaB = values.alternativa_b.trim().toUpperCase();
  if (!pergunta || !alternativaA || !alternativaB) {
    log.textContent = 'Preencha a pergunta e as duas alternativas.';
    return;
  }
  if (pergunta.length > 16 || alternativaA.length > 4 || alternativaB.length > 4) {
    log.textContent = 'A pergunta deve ter até 16 caracteres e cada alternativa até 4.';
    return;
  }
  if (pendentes.has(id)) return;

  const payload = {
    id,
    pergunta,
    alternativa_a: alternativaA,
    alternativa_b: alternativaB,
    correta: values.correta
  };
  edicoes.set(id, payload);
  pendentes.add(id);
  renderizarPerguntas();
  client.publish(CONFIG.TOPICS.PERGUNTAS, JSON.stringify(payload), (err) => {
    if (err) {
      console.error('Erro ao publicar pergunta no MQTT:', err);
      pendentes.delete(id);
      renderizarPerguntas();
      log.textContent = `Erro ao enviar a pergunta ${id}.`;
      return;
    }
    const mensagem = `Pergunta ${id} enviada; aguardando confirmação do backend.`;
    log.textContent = mensagem;
    setTimeout(() => {
      if (log.textContent === mensagem) log.textContent = '';
    }, 3000);
  });
}

registrarHandler(CONFIG.TOPICS.CONFIG_PERGUNTAS, (data) => {
  if (!data || !Array.isArray(data.perguntas) || data.perguntas.length !== 32) {
    console.error('Configuração de perguntas inválida recebida:', data);
    return;
  }

  const novas = new Map();
  for (const item of data.perguntas) {
    if (!item || !Number.isInteger(item.id) || item.id < 0 || item.id > 31 ||
        typeof item.pergunta !== 'string' || typeof item.alternativa_a !== 'string' ||
        typeof item.alternativa_b !== 'string' || !Number.isInteger(item.correta) ||
        (item.correta !== 0 && item.correta !== 1)) {
      console.error('Pergunta inválida recebida:', item);
      return;
    }
    novas.set(item.id, item);
  }
  perguntas.clear();
  novas.forEach((item, id) => perguntas.set(id, item));
  let perguntaConfirmada = null;
  pendentes.forEach((id) => {
    const atual = perguntas.get(id);
    const enviada = edicoes.get(id);
    if (atual && enviada && atual.pergunta === enviada.pergunta &&
        atual.alternativa_a === enviada.alternativa_a &&
        atual.alternativa_b === enviada.alternativa_b &&
        atual.correta === enviada.correta) {
      pendentes.delete(id);
      edicoes.delete(id);
      perguntaConfirmada = id;
    }
  });
  renderizarPerguntas();

  if (perguntaConfirmada !== null) {
    const log = document.getElementById('question-tx-log');
    if (log) {
      const mensagem = `Pergunta ${perguntaConfirmada} confirmada pelo backend.`;
      log.textContent = mensagem;
      setTimeout(() => {
        if (log.textContent === mensagem) log.textContent = '';
      }, 3000);
    }
  }
});

renderizarPerguntas();
