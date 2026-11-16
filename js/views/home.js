import { V, S, ic, nav, MODES, stars, MANUAL_URL } from "../core.js";
V.home = function home() {
  const avg = (
    S.reviews.reduce((a, r) => a + r.r, 0) / S.reviews.length
  ).toFixed(1);
  const IM = [
    [
      "speech",
      "Expressão com autonomia",
      "Mais caminhos para mostrar desejos, sentimentos e necessidades.",
    ],
    [
      "shield",
      "Regulação e segurança",
      "Recursos previsíveis para acolher momentos de sobrecarga.",
    ],
    [
      "heart",
      "Confiança no dia a dia",
      "Rotinas visuais que apoiam escolhas e independência.",
    ],
    [
      "brain",
      "Aprender sem medo de errar",
      "Práticas de Errorless Learning com reforço gentil e positivo.",
    ],
  ];
  return `<div class="card">
    <span class="eb">7 em 1</span>
    <h2>Um recurso para cada momento</h2>
    <p class="sub">Tudo em um só lugar.</p>
    <div class="grid g4">
      ${MODES.map(
        (m) => `
          <button
            class="mode a-${m[4]}"
            onclick="${m[3] ? `nav('${m[3]}')` : "alert('Modo disponível apenas no dispositivo físico.')"}"
          >
            <i>${ic(m[1], 24)}</i>
            <span><b>${m[0]}</b><small>${m[2]}</small></span>
          </button>
        `,
      ).join("")}
    </div>
  </div>
  <div class="card">
    <span class="eb">Passo a passo</span>
    <h2>Como funciona</h2>
    <p class="sub">Integração entre o dispositivo físico e o painel web.</p>
    <div class="how">
      <div>
        ${[
          [
            "Ligue o dispositivo",
            "Conecte a placa à energia. O dispositivo fica ativo e conectado ao painel.",
          ],
          [
            "Personalize",
            "Ajuste as 7 palavras da CAA, as 16 tarefas da rotina, as 32 perguntas do quiz e crie histórias.",
          ],
          [
            "Acompanhe",
            "Veja o tempo e a quantidade de uso de cada modo e as palavras mais acionadas no histórico.",
          ],
        ]
          .map(
            (x, i) => `
              <div class="stp">
                <b>${i + 1}</b>
                <div><h3>${x[0]}</h3><p>${x[1]}</p></div>
              </div>
            `,
          )
          .join("")}
      </div>
      <div>
        <div class="vid ${S.vid ? "has" : ""}">
          ${
            S.vid
              ? `<iframe src="${S.vid}" allow="autoplay" allowfullscreen title="Vídeo do CARE"></iframe>`
              : `<div><div style="color:var(--pr)">${ic("game", 40)}</div><b>Vídeo em breve</b></div>`
          }
        </div>
        <div style="margin-top:14px">
          <a
            class="btn dl"
            href="${MANUAL_URL || "#"}"
            ${MANUAL_URL ? 'download target="_blank" rel="noopener"' : "onclick=\"alert('Defina MANUAL_URL no início do script com o link do manual.');return false\""}
          >${ic("download")} Baixar manual do CARE</a>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <span class="eb">Impactos</span>
    <h2>Pequenos passos, grandes conquistas</h2>
    <p class="sub">Impactos do CARE no dia a dia.</p>
    <div class="grid g4">
      ${IM.map(
        (i) => `
          <article class="bn">
            <span>${ic(i[0])}</span>
            <h3>${i[1]}</h3>
            <p>${i[2]}</p>
          </article>
        `,
      ).join("")}
    </div>
  </div>
  <div class="card">
    <span class="eb">Comunidade</span>
    <h2>Avaliação de pessoas</h2>
    <p class="sub"><span class="stars">${stars(Math.round(avg))}</span> ${avg} de 5 · ${S.reviews.length} avaliações</p>
    <div class="grid g3">
      ${S.reviews.map(
        (r) => `
          <div class="card" style="margin:0;background:var(--sf2)">
            <span class="stars">${stars(r.r)}</span>
            <p style="margin:8px 0">“${r.t}”</p>
            <small style="color:var(--mu)">${r.n}</small>
          </div>
        `,
      ).join("")}
    </div>
  </div>
  <div class="card">
    <span class="eb">Para quem cuida</span>
    <h2>Guia rápido para cuidadores</h2>
    <div class="grid g3">
      <p>🌬️ <b>Respirem juntos:</b> inspire 4s, segure 4s, solte em 4s e segure mais 4s.</p>
      <p>💬 <b>Personalize a CAA</b> com palavras familiares.</p>
      <p>🔅 <b>Respeite o sensorial:</b> remova brilho e sons ao notar cansaço.</p>
    </div>
  </div>`;
};
