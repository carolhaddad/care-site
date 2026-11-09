import { registrarHandler } from '../mqtt-service.js';
import { CONFIG, NOMES_MODOS } from '../config.js?v=3';

const listaModos = NOMES_MODOS;

registrarHandler(CONFIG.TOPICS.HISTORICO, (data) => {
  console.log('📊 Telemetria do Histórico recebida:', data);
  if (!data) return;

  const elAcessos = document.getElementById('hist-acessos');
  const elTempo   = document.getElementById('hist-tempo');
  const elBotoes  = document.getElementById('hist-botoes');
  const elVitorias = document.getElementById('hist-vitorias');

  // 1. Usos por Modo
  if (elAcessos && Array.isArray(data.vezes_modo)) {
    elAcessos.innerHTML = data.vezes_modo
      .map((v, i) => `<b>${listaModos[i] || 'Modo ' + i}:</b> ${v}x`)
      .join('<br>');
  }

  // 2. Minutos por Modo
  if (elTempo && Array.isArray(data.tempo_modo)) {
    elTempo.innerHTML = data.tempo_modo
      .map((t, i) => `<b>${listaModos[i] || 'Modo ' + i}:</b> ${t} min`)
      .join('<br>');
  }

  // 3. Usos por Palavra
  if (elBotoes && data.palavras && typeof data.palavras === 'object') {
    elBotoes.innerHTML = Object.entries(data.palavras)
      .map(([palavra, qtd]) => `<b>${palavra.toUpperCase()}:</b> ${qtd}x`)
      .join('<br>');
  }

  // 4. Vitórias
  if (elVitorias && Number.isFinite(data.vitorias)) {
    elVitorias.textContent = `${data.vitorias}`;
  }
});