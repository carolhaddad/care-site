import { V, S, ic, nav, MODES, stars, MANUAL_URL, escapeHtml } from "../core.js";
V.read = function read() {
  const st = S.stories[S.cur],
    n = st.n[S.rd];
  if (S.rd === 0)
    return `<div class="card" style="text-align:center">
      <div class="scene">🎉</div>
      <h2>Fim da história!</h2>
      <p class="sub">Não existe escolha errada.</p>
      <button class="btn" onclick="S.rd=1;render()">Ler de novo</button>
      <button class="btn ghost" onclick="S.fromEd?nav('editor'):nav('stories')">${S.fromEd ? "Voltar ao editor" : "Outras histórias"}</button>
    </div>`;
  if (!n)
    return `<div class="card" style="text-align:center">
      <div class="scene">${st.e}</div>
      <h2>Cena ainda não configurada</h2>
      <p class="sub">Este nó ainda não tem conteúdo para exibir.</p>
      <button class="btn ghost" onclick="nav('stories')">Outras histórias</button>
    </div>`;
  const texto = n.textoLongo || n.t || n.textoCurto || "";
  const cena = Number(S.rd) - 1;
  const mostrarA = n.mostrarA !== false;
  const mostrarB = n.mostrarB !== false;
  const botoes = [
    mostrarA
      ? `<button onclick="S.rd=${n.at || 0};render()"><span class="pill">A</span> ${escapeHtml(n.aLong || n.a)}</button>`
      : "",
    mostrarB
      ? `<button onclick="S.rd=${n.bt || 0};render()"><span class="pill">B</span> ${escapeHtml(n.bLong || n.b)}</button>`
      : ""
  ].filter(Boolean).join("");
  const escolhas = botoes
    ? `<div class="ch${mostrarA && mostrarB ? "" : " single-choice"}">${botoes}</div>`
    : `<button class="btn" onclick="S.rd=0;render()">Finalizar história</button>`;
  return `<div class="card">
    <p class="sub">${escapeHtml(st.t)} · Cena ${cena}</p>
    <div class="scene${n.img ? " scene-with-image" : ""}">${n.img
      ? `<img class="scene-image" src="${escapeHtml(n.img)}" alt="">`
      : st.e}</div>
    <p class="narr">${escapeHtml(texto)}</p>
    ${escolhas}
    <button class="btn ghost sm" style="margin-top:14px" onclick="S.fromEd?nav('editor'):nav('stories')">← Voltar</button>
  </div>`;
};
