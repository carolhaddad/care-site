import { obterStatusConexao, registrarTextoHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js';
import { obterPergunta } from './perguntas.js';
import { nav } from '../core.js';

const CORES = {
  azul: ['#2196f3', '#fff'],
  amarelo: ['#e5a100', '#222'],
  verde: ['#2e7d32', '#fff'],
  vermelho: ['#f44336', '#fff'],
  ciano: ['#00bcd4', '#222'],
  lilas: ['#a78bfa', '#222'],
  branco: ['#fff', '#222']
};
let ultimoEstado = null;

function extrairConteudo(texto) {
  return texto.trim().replace(/^\{|\}$/g, '').trim().replace(/^"(.*)"$/, '$1');
}

function criarTexto(tag, texto, classe = '') {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  elemento.textContent = texto;
  return elemento;
}

function adicionarEtiqueta(display, texto) {
  display.appendChild(criarTexto('span', texto.toUpperCase(), 'e2'));
}

function adicionarValor(display, rotulo, valor) {
  const elemento = document.createElement('div');
  elemento.className = 'val';
  elemento.append(
    document.createTextNode(`${rotulo} = ${valor} `),
    criarTexto('small', 'cm')
  );
  display.appendChild(elemento);
}

function configurarCabecalho(titulo, fase) {
  const tituloEl = document.getElementById('game-title');
  const faseEl = document.getElementById('game-phase');
  if (tituloEl) tituloEl.textContent = titulo;
  if (faseEl) faseEl.textContent = fase;
}

function mostrarSequencia(display, texto) {
  adicionarEtiqueta(display, 'Memória visual');
  display.appendChild(criarTexto('h3', 'Repita a sequência'));

  const cores = extrairConteudo(texto).split(',').map((cor) => cor.trim()).filter(Boolean).slice(0, 8);
  if (cores.length === 0) {
    display.appendChild(criarTexto('p', 'Sequência de cores indisponível.', 'cap'));
    return;
  }

  const lista = document.createElement('div');
  lista.className = 'balls';
  lista.setAttribute('aria-label', `Sequência de ${cores.length} cores`);
  cores.forEach((cor) => {
    const nomeNormalizado = cor.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '');
    const [fundo, textoCor] = CORES[nomeNormalizado] || ['var(--sf3)', 'var(--tx)'];
    const nomeLegivel = `${cor.charAt(0).toUpperCase()}${cor.slice(1).toLowerCase()}`;
    const grupo = document.createElement('span');
    const bola = criarTexto('span', '', 'ball');
    bola.style.backgroundColor = fundo;
    bola.style.color = textoCor;
    if (nomeNormalizado === 'branco') bola.style.border = '2px solid var(--ln)';
    bola.setAttribute('aria-label', nomeLegivel);
    bola.title = nomeLegivel;
    const nome = criarTexto('div', nomeLegivel, 'nmx');
    grupo.append(bola, nome);
    lista.appendChild(grupo);
  });
  display.appendChild(lista);
}

function mostrarFase2Nivel1(display, texto) {
  adicionarEtiqueta(display, 'Distância');
  const valores = extrairConteudo(texto).split(',').map((valor) => valor.trim());
  if (valores.length !== 2 || valores.some((valor) => !/^\d+$/.test(valor))) {
    display.appendChild(criarTexto('p', 'Dados de distância indisponíveis.', 'cap'));
    return;
  }
  adicionarValor(display, 'Esperada', valores[0]);
  adicionarValor(display, 'Atual', valores[1]);
}

function mostrarFase2Nivel2(display, texto) {
  adicionarEtiqueta(display, 'Distância');
  display.appendChild(criarTexto('h3', 'Módulo da diferença'));
  const valor = extrairConteudo(texto);
  if (!/^\d+$/.test(valor)) {
    display.appendChild(criarTexto('p', 'Diferença indisponível.', 'cap'));
    return;
  }
  const elemento = document.createElement('div');
  elemento.className = 'val';
  elemento.append(document.createTextNode(`${valor} `), criarTexto('small', 'cm'));
  display.appendChild(elemento);
}

function mostrarProximidade(display, texto) {
  const resultado = extrairConteudo(texto);
  const quente = /^quente!?$/i.test(resultado);
  const frio = /^frio!?$/i.test(resultado);
  adicionarEtiqueta(display, 'Proximidade');
  if (!quente && !frio) {
    console.error('❌ Resultado de proximidade inválido:', texto);
    display.appendChild(criarTexto('p', 'Resultado de proximidade indisponível.', 'cap'));
    return;
  }
  display.classList.add(quente ? 'game-hot' : 'game-cold');
  display.appendChild(criarTexto('h3', quente ? 'Quente!' : 'Frio'));

  const barra = document.createElement('div');
  barra.className = 'px';
  const progresso = document.createElement('i');
  progresso.style.width = quente ? '88%' : '18%';
  progresso.style.backgroundColor = quente ? '#f4742b' : 'var(--bl)';
  barra.appendChild(progresso);
  display.append(barra, criarTexto('p', quente ? 'Você está muito perto' : 'Você está longe', 'cap'));
}

function mostrarQuiz(display, texto) {
  adicionarEtiqueta(display, 'Pergunta');
  let resultado;
  try {
    resultado = JSON.parse(texto);
  } catch (error) {
    console.error('Mensagem de quiz inválida recebida:', error);
    display.appendChild(criarTexto('p', 'Dados da pergunta indisponíveis.', 'cap'));
    return;
  }

  if (!resultado || !Number.isInteger(resultado.id) || resultado.id < 0 ||
      resultado.id > 31 || !Number.isInteger(resultado.acerto) ||
      resultado.acerto < 0 || resultado.acerto > 3) {
    console.error('Dados de quiz inválidos recebidos:', resultado);
    display.appendChild(criarTexto('p', 'Dados da pergunta indisponíveis.', 'cap'));
    return;
  }

  const pergunta = obterPergunta(resultado.id);
  if (!pergunta) {
    console.error(`Pergunta ${resultado.id} não encontrada na tabela local.`);
    display.appendChild(criarTexto('p', 'Pergunta indisponível.', 'cap'));
    return;
  }

  const linhas = [
    pergunta.pergunta.toUpperCase(),
    `A) ${pergunta.alternativa_a} B) ${pergunta.alternativa_b}`
  ];
  const titulo = criarTexto('h3', linhas.join('\n'), 'game-question');
  display.append(titulo, criarTexto('p', `Acertos: ${resultado.acerto}/3`, 'cap'));
}

function mostrarVitoria(display) {
  display.classList.add('game-victory');
  adicionarEtiqueta(display, 'Conquista');
  const trofeu = document.createElement('div');
  trofeu.className = 'game-trophy';
  trofeu.innerHTML = `<svg width="130" height="130" viewBox="0 0 120 120" role="img" aria-label="Troféu"><path d="M38 14h44v30c0 18-10 30-22 30S38 62 38 44V14Z" fill="#f5b829"/><path d="M38 24H22c0 18 6 28 20 32M82 24h16c0 18-6 28-20 32" fill="none" stroke="#e09b0f" stroke-width="7" stroke-linecap="round"/><path d="M46 20v24c0 8 3 14 7 18" stroke="#fff" opacity=".55" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M60 74v16" stroke="#e09b0f" stroke-width="8"/><rect x="42" y="90" width="36" height="9" rx="3" fill="#e09b0f"/><rect x="34" y="99" width="52" height="11" rx="4" fill="#176b52"/></svg>`;
  display.append(
    criarTexto('h3', 'Parabéns! Você completou o jogo!'),
    trofeu,
    criarTexto('p', 'Cada tentativa fez parte da brincadeira.', 'cap')
  );
}

function renderizarJogo() {
  const display = document.getElementById('game-message');
  if (!display) return;

  display.replaceChildren();
  display.className = 'gin game-message';
  const status = document.getElementById('game-status');
  if (!ultimoEstado) {
    configurarCabecalho('Jogo', 'Aguardando');
    adicionarEtiqueta(display, 'Jogo');
    display.appendChild(criarTexto('h3', 'Aguardando dados do dispositivo...'));
    if (status) status.textContent = obterStatusConexao();
    return;
  }

  if (status) status.textContent = obterStatusConexao();
  const { topico, texto } = ultimoEstado;

  if (topico === CONFIG.TOPICS.FASE1) {
    configurarCabecalho('Fase 1: Sequência de Cores (Genius)', 'Fase 1');
    display.classList.add('game-sequence');
    mostrarSequencia(display, texto);
  } else if (topico === CONFIG.TOPICS.FASE2_N1) {
    configurarCabecalho('Fase 2: Sensor Ultrassônico', 'Nível 1');
    display.classList.add('game-distance');
    mostrarFase2Nivel1(display, texto);
  } else if (topico === CONFIG.TOPICS.FASE2_N2) {
    configurarCabecalho('Fase 2: Sensor Ultrassônico', 'Nível 2');
    display.classList.add('game-distance');
    mostrarFase2Nivel2(display, texto);
  } else if (topico === CONFIG.TOPICS.FASE2_N3) {
    configurarCabecalho('Fase 2: Sensor Ultrassônico', 'Nível 3');
    mostrarProximidade(display, texto);
  } else if (topico === CONFIG.TOPICS.FASE3) {
    configurarCabecalho('Fase 3: Quiz', 'Fase 3');
    display.classList.add('game-quiz');
    mostrarQuiz(display, texto);
  } else if (topico === CONFIG.TOPICS.VITORIA) {
    configurarCabecalho('Vitória', 'Conquista');
    mostrarVitoria(display);
  }
}

const topicosJogo = [
  CONFIG.TOPICS.FASE1,
  CONFIG.TOPICS.FASE2_N1,
  CONFIG.TOPICS.FASE2_N2,
  CONFIG.TOPICS.FASE2_N3,
  CONFIG.TOPICS.FASE3,
  CONFIG.TOPICS.VITORIA
];

topicosJogo.forEach((topico) => registrarTextoHandler(topico, (texto) => {
  ultimoEstado = { topico, texto };
  nav('game');
  renderizarJogo();
}));

const viewEl = document.getElementById('view');
if (viewEl) {
  new MutationObserver(() => {
    if (document.getElementById('game-message')) renderizarJogo();
  }).observe(viewEl, { childList: true });
}

export { renderizarJogo };
