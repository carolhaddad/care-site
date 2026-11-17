import { client, obterStatusConexao, registrarHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js';
import { ic } from '../core.js';

const PERGUNTAS_PADRAO = [
  ["letras em 'CASA' A) 4 B) 3", 0],
  ['10, 20, 30, ?   A)50 B)40', 1],
  ['qual e menor?   A) 3 B) 8', 0],
  ['metade de 12?   A) 6 B) 4', 0],
  ['lados quadrado? A) 3 B) 4', 1],
  ['quanto e 6 + 6? A)14 B)12', 1],
  ['se A=1 B=3 A+B? A) 4 B) 5', 0],
  ['quanto e 5 x 5? A)20 B)25', 1],
  ['3, 6, 9, 12, ?  A)14 B)15', 1],
  ['qual e impar?   A) 9 B) 8', 0],
  ['quanto e 20 / 2? A)10 B) 5', 0],
  ["vogais em 'GATO' A) 2 B) 3", 0],
  ['10,15,20,25,?   A)35 B)30', 1],
  ['10, 9, 8, 7, ?  A) 6 B) 5', 0],
  ['1 hora = ? min  A)40 B)60', 1],
  ['quanto e 18 - 9? A) 9 B) 8', 0],
  ['qual e maior?   A)12 B)15', 1],
  ['2, 4, 6, 8, ?   A)10 B) 9', 0],
  ['proximo: E F G ? A) I B) H', 1],
  ['lados triangulo A) 3 B) 4', 0],
  ['quanto e 4 x 3? A)10 B)12', 1],
  ['se A=1 B=2 C=?  A) 4 B) 3', 1],
  ['quanto e 9 + 5? A)13 B)14', 1],
  ['vogais em ESCOLA A) 2 B) 3', 1],
  ['5, 10, 15, 20, ? A)15 B)30', 0],
  ['qual e par?     A) 7 B) 6', 1],
  ['proximo: A B C ? A) D B) E', 0],
  ['quanto e 15 - 5? A)10 B) 5', 0],
  ['dias na semana? A) 7 B) 5', 0],
  ['dobro de 6?     A)10 B)12', 1],
  ['letras em MUNDO A) 4 B) 5', 1],
  ['10,15,20,25,?   A)35 B)30', 1]
];

function separarPergunta(texto, id, correta) {
  const inicioA = texto.indexOf('A)');
  const inicioB = texto.indexOf('B)', inicioA + 2);
  if (inicioA < 0 || inicioB < 0) {
    throw new Error(`Pergunta padrão ${id} não contém as duas alternativas.`);
  }
  return {
    id,
    pergunta: texto.slice(0, inicioA).trim(),
    alternativa_a: texto.slice(inicioA + 2, inicioB).trim(),
    alternativa_b: texto.slice(inicioB + 2).trim(),
    correta
  };
}

const perguntas = new Map(
  PERGUNTAS_PADRAO.map(([texto, correta], id) => [id, separarPergunta(texto, id, correta)])
);
const edicoes = new Map();
const pendentes = new Set();
let mostrarTodas = false;

function obterPergunta(id) {
  return perguntas.get(id);
}

function renderizarPerguntas() {
  const body = document.getElementById('question-config');
  if (!body) return;

  body.replaceChildren();
  const limite = mostrarTodas ? 32 : 8;
  for (let id = 0; id < limite; id++) {
    const pergunta = perguntas.get(id);
    const values = edicoes.get(id) || pergunta;
    const row = body.insertRow();
    row.insertCell().textContent = String(id).padStart(2, '0');

    ['pergunta', 'alternativa_a', 'alternativa_b'].forEach((field) => {
      const cell = row.insertCell();
      if (edicoes.has(id)) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'question-input';
        input.value = values[field];
        input.maxLength = field === 'pergunta' ? 16 : 4;
        input.required = true;
        input.setAttribute('form', `question-edit-${id}`);
        input.setAttribute('aria-label', `${field} da pergunta ${id}`);
        input.addEventListener('input', () => {
          edicoes.set(id, { ...edicoes.get(id), [field]: input.value });
        });
        cell.appendChild(input);
      } else {
        cell.textContent = values[field] || '—';
      }
    });

    const correctCell = row.insertCell();
    if (edicoes.has(id)) {
      const select = document.createElement('select');
      select.innerHTML = '<option value="0">A</option><option value="1">B</option>';
      select.value = String(values.correta);
      select.setAttribute('form', `question-edit-${id}`);
      select.setAttribute('aria-label', `Alternativa correta da pergunta ${id}`);
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
      form.id = `question-edit-${id}`;
      form.className = 'task-edit-actions';

      const save = document.createElement('button');
      save.type = 'submit';
      save.className = 'btn sm';
      save.innerHTML = `${ic('check', 15)} ${pendentes.has(id) ? 'Enviando...' : 'Salvar'}`;
      save.disabled = pendentes.has(id);
      form.appendChild(save);

      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'btn sm ghost task-cancel-button';
      cancel.textContent = '×';
      cancel.setAttribute('aria-label', `Cancelar edição da pergunta ${id}`);
      cancel.title = 'Cancelar';
      cancel.disabled = pendentes.has(id);
      cancel.addEventListener('click', () => {
        if (pendentes.has(id)) return;
        edicoes.delete(id);
        renderizarPerguntas();
      });
      form.appendChild(cancel);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        enviarPergunta(id, edicoes.get(id));
      });
      actionCell.appendChild(form);
    } else {
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'btn sm ghost';
      edit.innerHTML = `${ic('edit', 15)} Editar`;
      edit.disabled = !pergunta;
      edit.setAttribute('aria-label', `Editar pergunta ${id}`);
      edit.addEventListener('click', () => {
        if (!pergunta) return;
        edicoes.set(id, { ...pergunta });
        renderizarPerguntas();
      });
      actionCell.appendChild(edit);
    }
  }

  const toggleButton = document.getElementById('questions-toggle');
  if (toggleButton) {
    toggleButton.textContent = mostrarTodas ? 'Mostrar menos' : 'Mostrar todas as 32';
    toggleButton.onclick = () => {
      mostrarTodas = !mostrarTodas;
      renderizarPerguntas();
    };
  }
}

function enviarPergunta(id, values) {
  const log = document.getElementById('question-tx-log');
  if (!values) return;

  const pergunta = values.pergunta.trim().toUpperCase();
  const alternativaA = values.alternativa_a.trim().toUpperCase();
  const alternativaB = values.alternativa_b.trim().toUpperCase();
  if (!pergunta || !alternativaA || !alternativaB) {
    if (log) log.textContent = 'Preencha a pergunta e as duas alternativas.';
    return;
  }
  if (pergunta.length > 16 || alternativaA.length > 4 || alternativaB.length > 4) {
    if (log) log.textContent = 'A pergunta deve ter até 16 caracteres e cada alternativa até 4.';
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
      if (log) log.textContent = `Erro ao enviar a pergunta ${id}.`;
      return;
    }

    const novas = Array.from({ length: 32 }, (_, perguntaId) =>
      perguntaId === id ? payload : perguntas.get(perguntaId)
    );
    client.publish(
      CONFIG.TOPICS.CONFIG_PERGUNTAS,
      JSON.stringify({ perguntas: novas }),
      { retain: true },
      (syncError) => {
        if (syncError) {
          console.error('Erro ao compartilhar configuração de perguntas no MQTT:', syncError);
          pendentes.delete(id);
          renderizarPerguntas();
          if (log) log.textContent = `Pergunta ${id} enviada, mas não foi possível compartilhá-la.`;
          return;
        }

        perguntas.set(id, payload);
        pendentes.delete(id);
        edicoes.delete(id);
        renderizarPerguntas();
        if (log) {
          const mensagem = `Pergunta ${id} enviada e compartilhada pelo MQTT.`;
          log.textContent = mensagem;
          setTimeout(() => {
            if (log.textContent === mensagem) log.textContent = obterStatusConexao();
          }, 3000);
        }
      }
    );
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
        novas.has(item.id) || typeof item.pergunta !== 'string' ||
        typeof item.alternativa_a !== 'string' || typeof item.alternativa_b !== 'string' ||
        item.pergunta.length > 16 || item.alternativa_a.length > 4 ||
        item.alternativa_b.length > 4 ||
        !Number.isInteger(item.correta) || (item.correta !== 0 && item.correta !== 1)) {
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

  const log = document.getElementById('question-tx-log');
  if (perguntaConfirmada !== null && log) {
    const mensagem = `Pergunta ${perguntaConfirmada} sincronizada pelo MQTT.`;
    log.textContent = mensagem;
    setTimeout(() => {
      if (log.textContent === mensagem) log.textContent = obterStatusConexao();
    }, 3000);
  } else if (log && (!log.textContent || log.textContent === 'Aguardando configuração do dispositivo...')) {
    log.textContent = obterStatusConexao();
  }
});

renderizarPerguntas();

const viewEl = document.getElementById('view');
if (viewEl) {
  new MutationObserver(() => {
    if (document.getElementById('question-config')) renderizarPerguntas();
  }).observe(viewEl, { childList: true });
}

export { obterPergunta, renderizarPerguntas };
