import { V } from '../core.js';

V.routine = function routine() {
  return `
    <div class="card">
      <h2>
        <span id="task-completed-count">—</span> de 16 tarefas concluídas
        (<span id="task-completed-percent">—</span>%)
      </h2>
      <div class="bar" role="progressbar" aria-label="Tarefas concluídas" aria-valuemin="0" aria-valuemax="16">
        <i id="task-progress-bar" style="width:0%"></i>
      </div>
    </div>
    <div class="card">
      <div class="th2">
        <div>
          <h2>Checklist do dia</h2>
          <p class="sub">Os status são atualizados automaticamente pelo dispositivo.</p>
        </div>
        <span class="pill bdg">16 tarefas</span>
      </div>
      <div class="rt">
        <table>
          <tbody id="task-check"></tbody>
        </table>
      </div>
      <p class="sub" id="task-tx-log" data-mqtt-status role="status" aria-live="polite">Conectando ao broker MQTT...</p>
    </div>
  `;
};
