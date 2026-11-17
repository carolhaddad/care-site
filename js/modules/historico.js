import { obterStatusConexao, registrarHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js';

const MODOS = ['Crise', 'Fala', 'Arte', 'Jogo', 'Rotina', 'História', 'Histórico'];
const ICONES_MODOS = ['🛡️', '💬', '🎨', '🎮', '📋', '📖', '📊'];
const CORES = ['var(--rd)', 'var(--ye)', 'var(--gr)', 'var(--bl)', '#00bcd4', '#8a6bd1', '#fff'];
let historico = null;

function formatarTempo(minutos) {
  return `${Math.floor(minutos / 60)}h ${String(minutos % 60).padStart(2, '0')}min`;
}

function agruparPalavras(palavras) {
  const grupos = new Map();
  for (const [palavra, quantidade] of Object.entries(palavras)) {
    const nome = palavra.trim().toLocaleUpperCase('pt-BR');
    grupos.set(nome, (grupos.get(nome) || 0) + quantidade);
  }
  return [...grupos.entries()];
}

function renderizarHistorico() {
  if (!historico) return;

  const elAcessos = document.getElementById('hist-acessos');
  const elTempo = document.getElementById('hist-tempo');
  const elTempoDonut = document.getElementById('hist-tempo-donut');
  const elTempoLista = document.getElementById('hist-tempo-lista');
  const elBotoes = document.getElementById('hist-botoes');
  const elVitorias = document.getElementById('hist-vitorias');
  const elTotalUsos = document.getElementById('hist-total-usos');
  const elTotalPalavras = document.getElementById('hist-total-palavras');
  const elStatus = document.getElementById('hist-status');

  const totalMinutos = historico.tempos.reduce((total, minutos) => total + minutos, 0);
  const totalUsos = historico.acessos.reduce((total, usos) => total + usos, 0);
  const totalPalavras = historico.palavras.reduce((total, [, quantidade]) => total + quantidade, 0);

  if (elTempo) elTempo.textContent = formatarTempo(totalMinutos);
  if (elTotalUsos) elTotalUsos.textContent = String(totalUsos);
  if (elVitorias) elVitorias.textContent = String(historico.vitorias);
  if (elTotalPalavras) elTotalPalavras.textContent = String(totalPalavras);
  if (elStatus) elStatus.textContent = obterStatusConexao();

  if (elAcessos) {
    elAcessos.replaceChildren();
    const maxAcessos = Math.max(...historico.acessos, 1);
    historico.acessos.forEach((valor, indice) => {
      const row = document.createElement('div');
      row.className = 'row history-row';

      const nome = document.createElement('span');
      nome.textContent = `${ICONES_MODOS[indice]} ${MODOS[indice]}`;
      const bar = document.createElement('div');
      bar.className = 'bar';
      const fill = document.createElement('i');
      fill.style.width = `${valor / maxAcessos * 100}%`;
      fill.style.backgroundColor = CORES[indice];
      bar.appendChild(fill);

      const total = document.createElement('b');
      total.textContent = `${valor} usos`;
      row.append(nome, bar, total);
      elAcessos.appendChild(row);
    });
  }

  if (elTempoDonut) {
    if (totalMinutos === 0) {
      elTempoDonut.style.background = 'var(--sf2)';
      elTempoDonut.setAttribute('aria-label', 'Nenhum tempo de uso registrado');
    } else {
      let acumulado = 0;
      const fatias = historico.tempos.map((valor, indice) => {
        const inicio = acumulado / totalMinutos * 100;
        acumulado += valor;
        return `${CORES[indice]} ${inicio}% ${acumulado / totalMinutos * 100}%`;
      });
      elTempoDonut.style.background = `conic-gradient(${fatias.join(',')})`;
      elTempoDonut.setAttribute('aria-label', `Distribuição de ${formatarTempo(totalMinutos)} por modo`);
    }
  }

  if (elTempoLista) {
    elTempoLista.replaceChildren();
    historico.tempos.forEach((valor, indice) => {
      const item = document.createElement('span');
      const swatch = document.createElement('i');
      swatch.style.backgroundColor = CORES[indice];
      const porcentagem = totalMinutos ? Math.round(valor / totalMinutos * 100) : 0;
      const nome = document.createTextNode(`${MODOS[indice]} ${porcentagem}% · `);
      const tempo = document.createElement('b');
      tempo.textContent = formatarTempo(valor);
      item.append(swatch, nome, tempo);
      elTempoLista.appendChild(item);
    });
  }

  if (elBotoes) {
    elBotoes.replaceChildren();
    const maxPalavras = Math.max(...historico.palavras.map(([, quantidade]) => quantidade), 1);
    historico.palavras.forEach(([palavra, quantidade], indice) => {
      const item = document.createElement('div');
      const nome = document.createElement('b');
      nome.textContent = `${indice}. ${palavra}`;
      const bar = document.createElement('div');
      bar.className = 'bar';
      const fill = document.createElement('i');
      fill.style.width = `${quantidade / maxPalavras * 100}%`;
      bar.appendChild(fill);
      const total = document.createElement('small');
      total.textContent = `${quantidade} vezes`;
      item.append(nome, bar, total);
      elBotoes.appendChild(item);
    });
  }
}

registrarHandler(CONFIG.TOPICS.HISTORICO, (data) => {
  const palavrasValidas = data?.palavras && typeof data.palavras === 'object' &&
    !Array.isArray(data.palavras);
  const valoresValidos = (valores) =>
    Array.isArray(valores) && valores.length === 7 &&
    valores.every((valor) => Number.isInteger(valor) && valor >= 0);

  if (!data || !valoresValidos(data.vezes_modo) || !valoresValidos(data.tempo_modo) ||
      !palavrasValidas || !Number.isInteger(data.vitorias) || data.vitorias < 0 ||
      Object.entries(data.palavras).some(([palavra, quantidade]) =>
        !palavra.trim() || !Number.isInteger(quantidade) || quantidade < 0)) {
    console.error('❌ Telemetria de histórico inválida recebida:', data);
    return;
  }

  historico = {
    acessos: [...data.vezes_modo],
    tempos: [...data.tempo_modo],
    palavras: agruparPalavras(data.palavras),
    vitorias: data.vitorias
  };
  renderizarHistorico();
});

const viewEl = document.getElementById('view');
if (viewEl) {
  new MutationObserver(() => {
    if (document.getElementById('hist-acessos')) renderizarHistorico();
  }).observe(viewEl, { childList: true });
}

export { renderizarHistorico };
