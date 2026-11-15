import { V, S, ic, nav, MODES, stars, MANUAL_URL } from "../core.js";
S.stTab = "edit";

V.stories = function stories() {
  const rd = S.stTab == "read";
  return `<div class="seg" style="margin-bottom:16px">
    <button class="${rd ? "" : "on"}" onclick="S.stTab='edit';render()">✏️ Criar/Editar</button>
    <button class="${rd ? "on" : ""}" onclick="S.stTab='read';render()">📖 Ler história</button>
  </div>
  <div class="card">
    <h2>${rd ? "Escolha uma história para ler" : "Escolha uma história para criar ou editar"}</h2>
    <div class="stories">
      ${S.stories.map((x, i) => `
        <button class="scard" onclick="S.cur=${i};S.node=1;S.rd=1;S.fromEd=false;nav('${rd ? "read" : "editor"}')">
          <i>${x.e}</i>
          <h3>${x.t}</h3>
          <small>${Object.keys(x.n).length} cenas</small>
        </button>
      `).join("")}
    </div>
  </div>`;
};
