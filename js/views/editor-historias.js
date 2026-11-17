import { V, S, ic, nav, MODES, stars, MANUAL_URL, escapeHtml } from "../core.js";
V.editor = function editor() {
  const st = S.stories[S.cur],
    n = st.n[S.node],
    ids = Object.keys(st.n).filter((id) =>
      Number(id) <= 8 && (S.cur !== 0 || Number(id) !== 1)
    );
  const opt = (v) =>
    `<option value="0" ${v == 0 ? "selected" : ""}>Fim</option>` +
    ids
      .map(
        (i) => `
          <option value="${i}" ${v == i ? "selected" : ""}>Nó ${Number(i) - 1}</option>
        `,
      )
      .join("");
  const ch = (k, l, c) =>
    `<div class="ce ${c}">
      <div class="cet"><span>${l}</span><b>Escolha do botão ${l}</b></div>
      <label>
        Texto curto do botão
        <input value="${escapeHtml(n[k])}" maxlength="5" oninput="st().n[S.node].${k}=this.value;drawG()">
      </label>
      <label>
        Leva para o nó
        <select onchange="st().n[S.node].${k}t=+this.value;drawG()">${opt(n[k + "t"])}</select>
      </label>
      <label class="ce-long">
        Texto maior no front
        <small>Opcional · até 180 caracteres</small>
        <input value="${escapeHtml(n[`${k}Long`] || "")}" maxlength="180" oninput="st().n[S.node].${k}Long=this.value">
      </label>
    </div>`;
  const escolha = (botao) => {
    const chave = botao.toLowerCase();
    const visivel = n[`mostrar${botao}`] !== false;
    return `<label class="choice-toggle">
      <input type="checkbox" ${visivel ? "checked" : ""} onchange="definirAlternativa('${chave}',this.checked)">
      Usar alternativa ${botao}
    </label>
    ${visivel ? ch(chave, botao, botao === "A" ? "ca" : "cb") : ""}`;
  };
  return `<div class="ed2">
    <section class="card">
      <span class="eb">Nó #${S.node - 1}</span>
      <h2>Cena atual</h2>
      <p class="sub">Edite o texto e defina para onde cada escolha leva.</p>
      <div class="fl">
        <span>Nome da história <small>Até 60 caracteres</small></span>
        <input aria-label="Nome da história" value="${escapeHtml(st.t)}" maxlength="60" oninput="st().t=this.value">
        <button class="btn ghost full" onclick="salvarNomeHistoria()">Salvar nome</button>
        <p id="story-name-status" class="sub" role="status" aria-live="polite">Salve o nome para sincronizar com outros dispositivos.</p>
      </div>
      <div class="fl story-cover-editor">
        <span>Capa da história <small>PNG ou JPG · até 5 MB</small></span>
        <div class="story-cover-preview">
          ${st.capa
            ? `<img src="${escapeHtml(st.capa)}" alt="Capa de ${escapeHtml(st.t)}">`
            : `<span aria-hidden="true">${escapeHtml(st.e)}</span>`}
        </div>
        <label class="up">
          ${ic("edit")}
          <div>
            <b>${st.capa ? "Trocar capa" : "Adicionar capa"}</b>
            <small>A capa aparece na lista de histórias</small>
          </div>
          <span class="btn ghost sm">Escolher</span>
          <input type="file" accept="image/png,image/jpeg" hidden onchange="setCapa(this)">
        </label>
        <button class="btn ghost full" onclick="salvarCapa()">Salvar capa</button>
        <p id="story-cover-status" class="sub" role="status" aria-live="polite">Salve a capa para sincronizar com outros dispositivos.</p>
      </div>
      <label class="fl">
        <span>Texto curto da FPGA <small>Obrigatório · até 16 caracteres</small></span>
        <input value="${escapeHtml(n.textoCurto)}" maxlength="16" oninput="st().n[S.node].textoCurto=this.value;drawG()">
      </label>
      <label class="fl">
        <span>Texto complementar <small>Aparece ao ler · até 180 caracteres</small></span>
        <textarea maxlength="180" oninput="st().n[S.node].textoLongo=this.value">${escapeHtml(n.textoLongo)}</textarea>
      </label>
      <div class="fl">
        <span>Imagem da cena <small>PNG ou JPG</small></span>
        <label class="up">
          ${ic("edit")}
          <div>
            <b>${n.img ? "Imagem adicionada" : "Adicionar uma imagem"}</b>
            <small>PNG ou JPG, até 5 MB</small>
          </div>
          <span class="btn ghost sm">Escolher</span>
          <input type="file" accept="image/png,image/jpeg" hidden onchange="setImg(this)">
        </label>
      </div>
      ${escolha("A")}
      ${escolha("B")}
      <button class="btn full" onclick="salvarCena()">Salvar esta cena</button>
      <p id="story-save-status" class="sub" role="status" aria-live="polite">Salve a cena para sincronizar os dados.</p>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button class="btn ghost" onclick="S.rd=1;S.fromEd=true;nav('read')">📖 Testar história</button>
        <button class="btn ghost" onclick="S.stTab='edit';nav('stories')">← Histórias</button>
      </div>
    </section>
    <aside class="smap">
      <div class="mh">
        <div><span class="eb">Mapa da história</span><h2>${escapeHtml(st.t)}</h2></div>
        <div class="mh-actions">
          <button class="rb danger" onclick="deletarNo()" aria-label="Excluir nó" ${S.node === 1 ? 'disabled title="O nó inicial não pode ser excluído"' : ""}>🗑</button>
          <button class="rb" onclick="addNode()" aria-label="Adicionar novo nó">+</button>
        </div>
      </div>
      <div id="gb"></div>
      <div class="mtip">
        ${ic("question", 20)}
        <p><b>Como funciona?</b>Cada escolha conecta uma cena à próxima. Selecione um nó para editar.</p>
      </div>
    </aside>
  </div>`;
};
