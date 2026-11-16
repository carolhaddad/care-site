const $ = (s) => document.querySelector(s);
const IC = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10M9.5 20v-6h5v6"/>',
  speech: '<path d="M5 5h14v10H9l-4 4V5Z"/><path d="M8.5 9h7M8.5 12h4"/>',
  question:
    '<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 0 1 4.7.7c0 1.8-2.4 2-2.4 3.8M12 17.5h.01"/>',
  game: '<path d="M7.5 8h9c2 0 3.2 1.2 3.7 3.5l.7 4c.5 2.8-2.5 4.2-4 2.2l-1.3-1.8H8.4L7 17.7c-1.5 2-4.5.6-4-2.2l.8-4C4.2 9.2 5.5 8 7.5 8Z"/><path d="M8 11v4M6 13h4M15.5 12h.01M18 14h.01"/>',
  routine:
    '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2M15 4V2M8.5 9h7M8.5 13h4M8.5 17h6"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  book: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
  spark:
    '<path d="m12 2 1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
  shield:
    '<path d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  heart:
    '<path d="M20.8 5.7a5.2 5.2 0 0 0-7.4 0L12 7.1l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 21l8.8-7.9a5.2 5.2 0 0 0 0-7.4Z"/>',
  brain:
    '<path d="M9.5 4.5a3 3 0 0 0-5 2.3 3 3 0 0 0-1 5.5A3.5 3.5 0 0 0 7 18h2.5V4.5ZM14.5 4.5a3 3 0 0 1 5 2.3 3 3 0 0 1 1 5.5A3.5 3.5 0 0 1 17 18h-2.5V4.5Z"/><path d="M7 9.5h2.5M17 9.5h-2.5M7.5 14h2M16.5 14h-2"/>',
  arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  moon: '<path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"/>',
};
IC.download = '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14"/>';
IC.edit = '<path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>';
IC.check = '<path d="m5 12 4 4L19 6"/>';
IC.info = '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>';
const ic = (n, z = 20) =>
  `<svg width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const NAV = [
  ["home", "home", "Home"],
  ["speech", "speech", "Fala"],
  ["questions", "question", "Perguntas"],
  ["game", "game", "Jogar"],
  ["routine", "routine", "Rotina"],
  ["history", "chart", "Histórico"],
  ["stories", "book", "Histórias"],
  ["info", "info", "Informações TEA"],
  ["settings", "settings", "Configurações"],
];
const TIT = {
  home: [
    "Olá, bem-vindo ao CARE",
    "Um espaço seguro para comunicar, aprender, brincar e se desenvolver.",
  ],
  speech: [
    "Comunicação CAA",
    "Personalize as palavras dos sete botões físicos.",
  ],
  questions: ["Perguntas do quiz", "Configure as perguntas da fase 3 do jogo."],
  game: ["Jogo cooperativo", "Observe, repita e celebre cada conquista."],
  routine: ["Rotina diária", "Passos claros tornam o dia mais tranquilo."],
  history: [
    "Histórico e progresso",
    "Acompanhe o uso sem comparações ou julgamentos.",
  ],
  stories: ["Histórias", "Escolha uma aventura para criar ou ler."],
  editor: ["Criar história", "Construa o grafo de cenas e escolhas."],
  read: ["Hora da história", "Escolha o que acontece em cada cena."],
  info: [
    "Informações sobre o TEA",
    "Informações confiáveis e caminhos de apoio sobre o autismo, no seu ritmo.",
  ],
  settings: ["Acessibilidade", "Adapte o site para ficar confortável."],
};
const DECO = {
  dino: "🦖🦕🌿🥚🌋🦴",
  pirate: "🏴‍☠️⚓🦜🗺️💎🚢",
  space: "🚀⭐🪐🌙👩‍🚀🛸",
  ocean: "🐠🐙🌊🐚🐳🦀",
  minimal: "",
  dark: "",
  night: "🌙⭐✨🌟💫☁️",
  contrast: "",
};
const MODES = [
  ["Crise", "shield", "Apoio rápido para momentos difíceis.", null, "red"],
  [
    "Comunicação",
    "speech",
    "Expresse desejos e necessidades.",
    "speech",
    "blue",
  ],
  ["Arte", "spark", "Crie livremente com cores e notas.", null, "yellow"],
  ["Jogo", "game", "Aprenda brincando, sem perder.", "game", "green"],
  [
    "Rotina",
    "routine",
    "Organize o dia em pequenos passos.",
    "routine",
    "purple",
  ],
  ["História", "book", "Leia e escolha novos caminhos.", "stories", "orange"],
  ["Histórico", "chart", "Celebre avanços e descobertas.", "history", "teal"],
];
let S = {
  page: "home",
  theme: "minimal",
  font: "medium",
  cb: "Nenhum",
  calm: false,
  contrast: false,
  prevTheme: null,
  reviews: [
    {
      n: "Marina, mãe do Davi",
      r: 5,
      t: "A rotina visual reduziu muito as crises da manhã.",
    },
    { n: "Prof. Carlos", r: 5, t: "Os alunos adoram o jogo sem punição." },
    {
      n: "Ana, terapeuta ocupacional",
      r: 5,
      t: "CAA fácil de personalizar. Quero mais temas!",
    },
  ],
  stories: [],
  cur: 0,
  node: 1,
  rd: 1,
  stTab: "read",
  fromEd: false,
};
const MANUAL_URL =
  ""; /* link ou caminho do manual (ex.: "manual-care.pdf" ou link do Drive) */
const DRIVE_VIDEO_ID =
  ""; /* cole aqui o ID do vídeo do Drive (…/file/d/ID/view) */
S.vid = DRIVE_VIDEO_ID
  ? "https://drive.google.com/file/d/" + DRIVE_VIDEO_ID + "/preview"
  : "";
const FIL = {
  Protanopia: "url(#protanopia)",
  Deuteranopia: "url(#deuteranopia)",
  Tritanopia: "url(#tritanopia)",
};
function applyEnv() {
  const r = document.documentElement;
  r.dataset.theme = S.theme;
  r.dataset.contrast = S.contrast ? "on" : "off";
  r.dataset.font = S.font;
  r.style.filter = FIL[S.cb] || "none";
  document.body.classList.toggle("calm", S.calm);
  const P = [
    "right:2%;top:84px",
    "right:1.5%;top:42%",
    "right:3%;bottom:5%",
    "left:250px;bottom:3%",
    "right:18%;bottom:2%",
    "left:250px;top:84px",
  ];
  $("#fixdeco").innerHTML = em(S.theme)
    .slice(0, 6)
    .map((e, i) => `<span style="${P[i]}">${e}</span>`)
    .join("");
}
const SCN = {
  dino: `<svg viewBox="0 0 400 132" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
<circle cx="70" cy="34" r="17" fill="#f3e6a0" opacity=".85"/>
<path d="M0 132V96C50 70 120 80 180 100S320 78 400 98V132Z" fill="#cfdca3"/>
<path d="M0 132V112C70 96 150 108 230 116S350 104 400 112V132Z" fill="#b5cd86"/>
<g fill="#5a8848"><rect x="188" y="104" width="13" height="22" rx="5"/><rect x="206" y="106" width="13" height="20" rx="5"/><rect x="232" y="106" width="13" height="20" rx="5"/><rect x="250" y="104" width="13" height="22" rx="5"/></g>
<path d="M258 88C282 90 300 100 316 112C292 108 274 106 256 106Z" fill="#6f9f5a"/>
<path d="M180 90C166 74 168 54 158 40L174 32C182 48 190 62 206 74Z" fill="#6f9f5a"/>
<ellipse cx="222" cy="92" rx="46" ry="22" fill="#6f9f5a"/>
<ellipse cx="160" cy="34" rx="14" ry="8" fill="#6f9f5a" transform="rotate(-15 160 34)"/>
<circle cx="156" cy="32" r="2.2" fill="#233425"/>
<g fill="#5a8848" opacity=".5"><circle cx="208" cy="86" r="5"/><circle cx="226" cy="98" r="4"/><circle cx="240" cy="84" r="6"/><circle cx="256" cy="96" r="3.5"/></g>
<g fill="#4f8a4a"><circle cx="318" cy="114" r="14"/><circle cx="338" cy="108" r="18"/><circle cx="362" cy="115" r="13"/></g>
<path d="M312 36Q326 20 340 38Q354 20 368 36Q354 32 340 46Q326 32 312 36Z" fill="#7ba46a"/>
</svg>`,
  pirate: `<svg viewBox="0 0 400 132" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
<path d="M24 30C70 6 96 70 130 52S170 36 176 80" fill="none" stroke="#b58a52" stroke-width="2.5" stroke-dasharray="2 7" stroke-linecap="round"/>
<path d="M334 40l16 16M350 40l-16 16" stroke="#b3392a" stroke-width="5" stroke-linecap="round"/>
<path d="M0 118q20-10 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0V132H0Z" fill="#d9b66f"/>
<path d="M170 92H290L270 116H190Z" fill="#7a4624"/>
<path d="M176 99H284" stroke="#5f3414" stroke-width="2"/>
<rect x="228" y="22" width="5" height="72" fill="#5f3a20"/>
<path d="M233 28Q282 50 233 82Z" fill="#fff4d9" stroke="#c9a66b" stroke-width="2"/>
<path d="M227 34Q190 52 227 76Z" fill="#fff4d9" stroke="#c9a66b" stroke-width="2"/>
<path d="M231 22L256 29L231 37Z" fill="#34230f"/>
<path d="M290 92L314 84" stroke="#5f3a20" stroke-width="3" stroke-linecap="round"/>
<path d="M0 124q20-8 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0V132H0Z" fill="#c9a05a"/>
</svg>`,
  space: `<svg viewBox="0 0 400 132" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
<g fill="#fff" opacity=".9"><circle cx="40" cy="24" r="1.6"/><circle cx="96" cy="100" r="1.4"/><circle cx="188" cy="16" r="1.8"/><circle cx="246" cy="112" r="1.5"/><circle cx="388" cy="20" r="1.6"/><circle cx="372" cy="108" r="1.4"/><circle cx="130" cy="64" r="1.3"/></g>
<g fill="#fff6c8"><path d="M70 50l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><path d="M262 26l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></g>
<path d="M120 30a14 14 0 1 0 14 18a11 11 0 1 1-14-18Z" fill="#f5f0c8"/>
<circle cx="206" cy="38" r="10" fill="#a594ff"/>
<g transform="translate(152 92) rotate(40)"><path d="M-4 14L0 28L4 14Z" fill="#ffb86b"/><path d="M0-22C10-12 10 6 6 14H-6C-10 6-10-12 0-22Z" fill="#f5f4ff"/><circle cy="-6" r="4" fill="#a594ff"/><path d="M-6 8L-14 18L-6 14ZM6 8L14 18L6 14Z" fill="#ef6f6f"/></g>
<clipPath id="sfr"><rect x="240" y="66" width="140" height="50" transform="rotate(-18 310 66)"/></clipPath>
<ellipse cx="310" cy="66" rx="52" ry="12" fill="none" stroke="#e8c9a0" stroke-width="6" transform="rotate(-18 310 66)" opacity=".9"/>
<circle cx="310" cy="66" r="28" fill="#f4a259"/>
<path d="M283 58Q310 50 337 58L338 67Q310 59 282 67Z" fill="#f7bf86" opacity=".7"/>
<ellipse cx="310" cy="66" rx="52" ry="12" fill="none" stroke="#e8c9a0" stroke-width="6" transform="rotate(-18 310 66)" clip-path="url(#sfr)"/>
</svg>`,
  ocean: `<svg viewBox="0 0 400 132" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
<g fill="none" stroke="#fff" stroke-width="2" opacity=".85"><circle cx="150" cy="42" r="5"/><circle cx="160" cy="24" r="3"/><circle cx="140" cy="60" r="3"/><circle cx="296" cy="30" r="4"/></g>
<path d="M340 132C328 112 352 100 340 80C334 68 344 60 342 52" stroke="#2e9c8c" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M366 132C358 118 374 108 366 92" stroke="#47b3a2" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M316 132C310 120 322 112 316 100" stroke="#47b3a2" stroke-width="6" fill="none" stroke-linecap="round"/>
<g transform="translate(176 50)"><path d="M0 0C14-16 40-16 54 0C40 16 14 16 0 0Z" fill="#ff9a5c"/><path d="M52 0L72-14V14Z" fill="#ff9a5c"/><circle cx="14" cy="-3" r="3" fill="#0f3a3e"/><path d="M24-9c6 5 6 13 0 18" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7"/></g>
<g transform="translate(286 96) scale(-.6 .6)"><path d="M0 0C14-16 40-16 54 0C40 16 14 16 0 0Z" fill="#087f8c"/><path d="M52 0L72-14V14Z" fill="#087f8c"/><circle cx="14" cy="-3" r="3" fill="#fff"/></g>
<path d="M0 122q20-9 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0V132H0Z" fill="#b6e1dc" opacity=".9"/>
</svg>`,
  night: `<svg viewBox="0 0 400 132" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
<path d="M300 24a30 30 0 1 0 30 40a24 24 0 1 1-30-40Z" fill="#dbe6f7" opacity=".9"/>
<g fill="#a7cdff"><circle cx="230" cy="40" r="1.8"/><circle cx="360" cy="30" r="1.6"/><circle cx="250" cy="98" r="1.5"/><circle cx="352" cy="104" r="1.8"/><path d="M200 70l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></g>
</svg>`,
};
const em = (t) =>
  [...new Intl.Segmenter().segment(DECO[t] || "")].map((x) => x.segment);
function nav(p) {
  S.page = p;
  $("#side").classList.remove("open");
  render();
  scrollTo(0, 0);
}
function render() {
  $("#side").innerHTML =
    `<div class="sn">${NAV.map(([id, i, l]) => `<button class="${S.page == id || ((S.page == "editor" || S.page == "read") && id == "stories") ? "on" : ""}" onclick="nav('${id}')">${ic(i)} ${l}</button>`).join("")}</div>`;
  const T = TIT[S.page];
  $("#strip").innerHTML = SCN[S.theme] || "";
  $("#bc").innerHTML =
    "CARE <i>/</i> " +
    NAV.find(
      (n) =>
        n[0] == S.page ||
        (["editor", "read"].includes(S.page) && n[0] == "stories"),
    )[2].toUpperCase();
  $("#t1").textContent = T[0];
  $("#t2").textContent = T[1];
  $("#view").innerHTML = V[S.page]();
  applyEnv();
  tbl();
}
$("#ov").onclick = () => $("#side").classList.remove("open");
$("#logo").onclick = () => nav("home");
$("#mb").onclick = () => $("#side").classList.toggle("open");
$("#dk").innerHTML = ic("moon");
$("#mb").innerHTML = ic("menu");
$("#dk").onclick = () => {
  if (S.theme == "dark" || S.theme == "night") {
    S.theme =
      S.prevTheme && S.prevTheme != "dark" && S.prevTheme != "night"
        ? S.prevTheme
        : "minimal";
  } else {
    S.prevTheme = S.theme;
    S.theme = "dark";
  }
  render();
};
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
const escapeHtml = (value) =>
  String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
const V = {};

const st = () => S.stories[S.cur];
function addNode() {
  const s = st();
  const id = Array.from({ length: 7 }, (_, index) => index + 2)
    .find((nodeId) => !s.n[nodeId]);
  if (id == null) {
    alert("Cada história pode ter até 8 nós.");
    return;
  }
  s.n[id] = {
    t: "",
    textoCurto: "",
    textoLongo: "",
    a: "Opção A",
    b: "Opção B",
    at: 0,
    bt: 0,
  };
  S.node = id;
  render();
}
function tbl() {
  document.querySelectorAll(".rt table").forEach((t) => {
    const h = [...t.querySelectorAll("th")].map((x) => x.textContent);
    t.querySelectorAll("tr").forEach((r) => {
      if (r.querySelector("th")) r.classList.add("hd");
      [...r.children].forEach((c, i) => {
        if (c.tagName == "TD") c.dataset.l = h[i] || "";
      });
    });
  });
}
const nameOf = (id) => {
  const n = st().n[id];
  return n.textoCurto || `Nó ${Number(id) - 1}`;
};
function setImg(i) {
  const f = i.files[0];
  if (!f) return;
  if (!["image/png", "image/jpeg"].includes(f.type)) {
    alert("Escolha uma imagem PNG ou JPG.");
    i.value = "";
    return;
  }
  if (f.size > 5 * 1024 * 1024) {
    alert("A imagem deve ter até 5 MB.");
    i.value = "";
    return;
  }
  const r = new FileReader();
  r.onload = () => {
    st().n[S.node].img = r.result;
    render();
  };
  r.onerror = () => alert("Não foi possível carregar a imagem.");
  r.readAsDataURL(f);
}
function drawG() {
  const s = st(),
    ids = Object.keys(s.n).map(Number),
    dep = { 1: 0 },
    par = {},
    q = [1];
  while (q.length) {
    const c = q.shift();
    [
      ["at", "a"],
      ["bt", "b"],
    ].forEach(([k, l]) => {
      const t = s.n[c][k];
      if (t && s.n[t]) {
        if (!par[t]) par[t] = s.n[c][l];
        if (dep[t] == null) {
          dep[t] = dep[c] + 1;
          q.push(t);
        }
      }
    });
  }
  ids.forEach((i) => {
    if (dep[i] == null) dep[i] = Math.max(0, ...Object.values(dep)) + 1;
  });
  const lv = {};
  ids.forEach((i) => (lv[dep[i]] = lv[dep[i]] || []).push(i));
  const NW = 150,
    NH = 52,
    GX = 22,
    GY = 70,
    L = Object.keys(lv).length,
    mx = Math.max(...Object.values(lv).map((a) => a.length)),
    W = Math.max(mx * (NW + GX) - GX + 8, NW + 8),
    H = L * (NH + GY) - GY + 12,
    pos = {};
  Object.entries(lv).forEach(([d, a]) => {
    const tw = a.length * (NW + GX) - GX;
    a.forEach(
      (i, k) => (pos[i] = [(W - tw) / 2 + k * (NW + GX), 6 + d * (NH + GY)]),
    );
  });
  let p = "",
    b = "",
    fin = 0;
  ids.forEach((i) =>
    [
      ["at", "a", "A"],
      ["bt", "b", "B"],
    ].forEach(([k, l, L2]) => {
      const t = s.n[i][k];
      if (!t) {
        fin++;
        return;
      }
      if (!pos[t] || dep[t] <= dep[i]) return;
      const x1 = pos[i][0] + NW / 2,
        y1 = pos[i][1] + NH,
        x2 = pos[t][0] + NW / 2,
        y2 = pos[t][1],
        ym = y1 + (y2 - y1) / 2;
      p += `<path d="M${x1} ${y1}V${ym}H${x2}V${y2}" fill="none" stroke="var(--ln)" stroke-width="2"/><circle cx="${x2}" cy="${y2 - 20}" r="10" fill="var(--sf)" stroke="var(--ln)"/><text x="${x2}" y="${y2 - 16}" text-anchor="middle" font-size="10" font-weight="800" fill="var(--tx)">${L2}</text>`;
    }),
  );
  ids.forEach((i) => {
    const [x, y] = pos[i],
      on = i == S.node;
    b += `<g onclick="S.node=${i};render()" style="cursor:pointer">${on ? `<rect x="${x - 4}" y="${y - 4}" width="${NW + 8}" height="${NH + 8}" rx="15" fill="var(--prl)"/>` : ""}<rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="12" fill="var(--sf)" stroke="${on ? "var(--pr)" : "var(--ln)"}" stroke-width="${on ? 2.5 : 1.5}"/><rect x="${x + 10}" y="${y + 13}" width="26" height="26" rx="8" fill="var(--sf2)"/><text x="${x + 23}" y="${y + 30}" text-anchor="middle" font-size="10" font-weight="800" fill="var(--mu)">${String(Number(i) - 1).padStart(2, "0")}</text><text x="${x + 46}" y="${y + 23}" font-size="12" font-weight="800" fill="var(--tx)">${escapeHtml(nameOf(i).slice(0, 14))}</text><text x="${x + 46}" y="${y + 39}" font-size="10" fill="var(--mu)">${i == 1 ? "Nó inicial" : escapeHtml((par[i] || "").slice(0, 16))}</text></g>`;
  });
  const g = $("#gb");
  if (g)
    g.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;min-width:${Math.min(W, Math.max(280, Math.round(W * 0.72)))}px;display:block;margin:0 auto;font-family:inherit">${p}${b}</svg><div class="endp">${ic("spark", 16)} ${fin} ${fin == 1 ? "final possível" : "finais possíveis"}</div>`;
}
function initializeApp() {
  render();
  document.addEventListener(
    "click",
    (e) => {
      if (S.page === "editor") drawG();
    },
    true,
  );
  new MutationObserver(() => {
    if (S.page === "editor") drawG();
  }).observe($("#view"), { childList: true });
}
Object.assign(window, {
  $,
  escapeHtml,
  IC,
  NAV,
  TIT,
  DECO,
  MODES,
  S,
  MANUAL_URL,
  DRIVE_VIDEO_ID,
  FIL,
  SCN,
  em,
  applyEnv,
  stars,
  V,
  ic,
  nav,
  render,
  st,
  addNode,
  tbl,
  nameOf,
  setImg,
  drawG,
});
export { S, V, ic, nav, render, initializeApp, MODES, stars, MANUAL_URL, escapeHtml };
