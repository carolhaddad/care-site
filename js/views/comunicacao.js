import { V } from "../core.js";
V.speech = function speech() {
  return `
    <div class="card">
      <div class="th2">
        <div>
          <h2>Configuração dos botões</h2>
          <p class="sub">As alterações ficam salvas no dispositivo.</p>
        </div>
        <span class="pill bdg">7 botões</span>
      </div>
      <div class="rt">
        <table>
          <thead>
            <tr><th>Botão</th><th>Palavra</th><th>Emergência</th><th></th></tr>
          </thead>
          <tbody id="button-config"></tbody>
        </table>
      </div>
      <p class="sub" id="tx-log" data-mqtt-status role="status" aria-live="polite">Conectando ao broker MQTT...</p>
    </div>
  `;
};
