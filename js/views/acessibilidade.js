import { V, S, ic, nav, MODES, stars, MANUAL_URL } from "../core.js";
V.settings = function settings() {
  const TC = {
    minimal: ["#f5f7f4", "#176b52", "#dff3eb"],
    dark: ["#121826", "#7fb6ff", "#233c5b"],
    night: ["#0e1630", "#ffd479", "#2f3355"],
    dino: ["#e9efd2", "#3f7a3f", "#d4e6b9"],
    pirate: ["#e9d7ac", "#8a3b1f", "#f1d9a6"],
    space: ["#0f1126", "#a594ff", "#312e60"],
    ocean: ["#dff5f2", "#087f8c", "#c3ece6"],
  };
  const T = [
    ["minimal", "Minimalista", "🌤️"],
    ["dark", "Escuro", "🌙"],
    ["night", "Noite", "🌙"],
    ["dino", "Dinossauros", "🦖"],
    ["pirate", "Piratas", "🏴‍☠️"],
    ["space", "Espaço", "🚀"],
    ["ocean", "Oceano", "🐠"],
  ];
  return `<div class="card">
    <h2>Texto e visualização</h2>
    <p class="sub">Tamanho da fonte</p>
    <div class="seg">
      ${[
        ["small", "Pequena"],
        ["medium", "Média"],
        ["large", "Grande"],
        ["xlarge", "Extra grande"],
      ]
        .map(
          (f) => `
            <button class="${S.font == f[0] ? "on" : ""}" onclick="S.font='${f[0]}';render()">
              ${f[1]}
            </button>
          `,
        )
        .join("")}
    </div>
    <p class="sub" style="margin-top:18px">Modo para daltonismo (filtro aplicado em toda a tela)</p>
    <div class="seg">
      ${["Nenhum", "Protanopia", "Deuteranopia", "Tritanopia"]
        .map(
          (c) => `
            <button class="${S.cb == c ? "on" : ""}" onclick="S.cb='${c}';render()">
              ${c}
            </button>
          `,
        )
        .join("")}
    </div>
    <label class="sw">
      <input type="checkbox" ${S.contrast ? "checked" : ""} onchange="S.contrast=this.checked;render()">
      Alto contraste
    </label>
    <label class="sw">
      <input type="checkbox" ${S.calm ? "checked" : ""} onchange="S.calm=this.checked;render()">
      Reduzir animações
    </label>
  </div>
  <div class="card">
    <h2>Escolha seu tema</h2>
    <div class="themes">
      ${T.map(
        (t) => `
          <button class="${S.theme == t[0] ? "on" : ""}" onclick="S.theme='${t[0]}';render()">
            <span class="sw3" style="background:${TC[t[0]][0]}">
              <i style="background:${TC[t[0]][1]}"></i>
              <i style="background:${TC[t[0]][2]}"></i>
            </span>
            <b>${t[1]}</b>
          </button>
        `,
      ).join("")}
    </div>
  </div>`;
};
