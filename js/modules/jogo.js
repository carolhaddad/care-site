import { registrarTextoHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js?v=4';

const topicosJogo = [
  CONFIG.TOPICS.FASE1,
  CONFIG.TOPICS.FASE2_N1,
  CONFIG.TOPICS.FASE2_N2,
  CONFIG.TOPICS.FASE2_N3,
  CONFIG.TOPICS.FASE3,
  CONFIG.TOPICS.VITORIA
];

function limparMensagem(display) {
  display.replaceChildren();
}

function extrairConteudo(texto) {
  return texto.trim().replace(/^\{|\}$/g, '').trim();
}

function criarTexto(texto, classe = '') {
  const elemento = document.createElement('span');
  elemento.className = classe;
  elemento.textContent = texto;
  return elemento;
}

function mostrarCores(display, texto) {
  const cores = extrairConteudo(texto)
    .split(',')
    .map(cor => cor.trim())
    .filter(Boolean);

  const lista = document.createElement('div');
  lista.className = 'game-colors';
  lista.setAttribute('aria-label', `Sequência de ${cores.length} cores`);

  cores.forEach((cor, indice) => {
    const nomeNormalizado = cor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-');
    const bola = document.createElement('span');
    bola.className = `game-color game-color-${nomeNormalizado}`;
    bola.setAttribute('aria-label', cor);
    bola.title = cor;
    bola.textContent = String(indice + 1);
    lista.appendChild(bola);
  });

  display.appendChild(lista);
}

function mostrarFase3(display, texto) {
  const conteudo = extrairConteudo(texto);
  const resultado = conteudo.match(
    /^pergunta\s*:\s*(.*?)\s*,\s*acerto\s*:\s*([^,}]+)\s*$/i
  );

  if (!resultado) {
    display.textContent = texto;
    return;
  }

  const pergunta = resultado[1].trim();
  const perguntaElement = document.createElement('div');
  perguntaElement.className = 'game-question';
  perguntaElement.append(
    criarTexto(pergunta.slice(0, 16)),
    criarTexto(pergunta.slice(16, 32))
  );

  const acertos = criarTexto(`Acertos: ${resultado[2].trim()}/3`, 'game-score');
  display.append(perguntaElement, acertos);
}

function mostrarMensagem(topico, texto) {
  const display = document.getElementById('game-message');
  if (!display) return;

  limparMensagem(display);

  if (topico === CONFIG.TOPICS.FASE1) {
    mostrarCores(display, texto);
  } else if (topico === CONFIG.TOPICS.FASE2_N1) {
    const valores = extrairConteudo(texto).split(',').map(valor => valor.trim());
    display.append(
      criarTexto(`Esperada: ${valores[0] || ''}`),
      criarTexto(`Atual: ${valores[1] || ''}`)
    );
  } else if (topico === CONFIG.TOPICS.FASE2_N2) {
    display.append(criarTexto(`Módulo da diferença: ${extrairConteudo(texto)}`));
  } else if (topico === CONFIG.TOPICS.FASE2_N3 || topico === CONFIG.TOPICS.VITORIA) {
    display.append(criarTexto(extrairConteudo(texto)));
  } else if (topico === CONFIG.TOPICS.FASE3) {
    mostrarFase3(display, texto);
  } else {
    display.textContent = texto;
  }
}

topicosJogo.forEach((topico) => registrarTextoHandler(topico, texto => mostrarMensagem(topico, texto)));
