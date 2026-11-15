import { V } from "../core.js";
V.questions = function questions() {
  return `
    <div class="card">
      <div class="th2">
        <div>
          <h2>Banco de perguntas</h2>
          <p class="sub">Frases curtas (até 16 caracteres por linha) com duas alternativas.</p>
        </div>
        <span class="pill bdg">32 itens</span>
      </div>
      <div class="rt">
        <table class="qt">
          <thead>
            <tr><th>ID</th><th>Pergunta</th><th>A</th><th>B</th><th>Correta</th><th></th></tr>
          </thead>
          <tbody id="question-config"></tbody>
        </table>
      </div>
      <button class="btn ghost" id="questions-toggle" type="button" style="margin-top:12px">Mostrar todas as 32</button>
      <p class="sub" id="question-tx-log" data-mqtt-status role="status" aria-live="polite" style="margin-top:14px">
        Conectando ao broker MQTT...
      </p>
    </div>
  `;
};
