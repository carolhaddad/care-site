import { V } from '../core.js';

V.game = function game() {
  return `
    <div class="card">
      <div class="gh">
        <h2 id="game-title">Jogo</h2>
        <span class="pl" id="game-phase">Aguardando</span>
      </div>
      <div class="gin game-message" id="game-message" aria-live="polite" aria-atomic="true"></div>
      <p class="sub" id="game-status" data-mqtt-status role="status" aria-live="polite">Conectando ao broker MQTT...</p>
    </div>
  `;
};
