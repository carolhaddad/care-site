import { V } from '../core.js';

V.history = function history() {
  return `
    <div class="kpis">
      <div class="kpi"><small>⏱️ Tempo total de uso</small><b id="hist-tempo">—</b></div>
      <div class="kpi"><small>👆 Total de usos</small><b id="hist-total-usos">—</b></div>
      <div class="kpi"><small>🎮 Vitórias no jogo</small><b id="hist-vitorias">—</b></div>
      <div class="kpi"><small>💬 Palavras acionadas</small><b id="hist-total-palavras">—</b></div>
    </div>
    <div class="hg">
      <div class="card hc">
        <div>
          <h2>Usos por modo</h2>
          <p class="sub">Quantidade de usos nos 7 modos</p>
        </div>
        <div class="rows" id="hist-acessos"></div>
      </div>
      <div class="card">
        <h2>Tempo de uso por modo</h2>
        <div class="donut" id="hist-tempo-donut" style="background:var(--sf2)" aria-label="Distribuição do tempo por modo"></div>
        <div class="leg" id="hist-tempo-lista"></div>
      </div>
    </div>
    <div class="card">
      <h2>As 7 palavras da CAA</h2>
      <p class="sub">Vezes acionadas</p>
      <div class="wg" id="hist-botoes"></div>
      <p class="sub" id="hist-status" data-mqtt-status role="status" aria-live="polite">Conectando ao broker MQTT...</p>
    </div>
  `;
};
