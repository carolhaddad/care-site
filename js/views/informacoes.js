import { V, S, ic, nav, MODES, stars, MANUAL_URL } from "../core.js";
V.info = function info() {
  const C = [
    [
      "question",
      "O que é o TEA",
      "O que é o espectro autista?",
      "O Transtorno do Espectro Autista (TEA) é uma condição do neurodesenvolvimento. Costuma envolver diferenças na comunicação, na interação social, em interesses e rotinas e na forma de sentir estímulos sensoriais. É um espectro: cada pessoa autista é única e precisa de apoios diferentes.",
      [
        ["Não é doença:", "é uma forma diferente de funcionar."],
        ["Diagnóstico:", "feito por equipe de saúde, com avaliação clínica."],
        ["Apoios:", "variam de pessoa para pessoa e ao longo da vida."],
      ],
      [],
    ],
    [
      "speech",
      "Comunicação",
      "Comunicação e CAA",
      "Algumas pessoas se comunicam por fala, outras por gestos, imagens, escrita ou tecnologia. A Comunicação Aumentativa e Alternativa (CAA) amplia as formas de se expressar, como botões com palavras ou figuras, e deve respeitar o jeito de cada pessoa.",
      [
        ["Ofereça opções:", "palavras, imagens e escolhas visuais."],
        ["Dê tempo:", "espere a resposta sem pressa."],
        ["Valide toda forma", "de comunicação como legítima."],
      ],
      [],
    ],
    [
      "spark",
      "Sensorial",
      "Sensibilidades sensoriais",
      "Sons, luzes, texturas, cheiros e multidões podem ser muito intensos, ou pouco percebidos. Sinais de sobrecarga incluem inquietação, se afastar, tapar os ouvidos ou ficar em silêncio.",
      [
        ["Reduza estímulos:", "brilho, sons e movimentos."],
        ["Crie pausas", "em um lugar calmo e previsível."],
        ["Antecipe mudanças", "com rotinas visuais."],
      ],
      [],
    ],
    [
      "shield",
      "Comece por aqui",
      "Precisa de atendimento?",
      "No SUS, a porta de entrada costuma ser a Unidade Básica de Saúde (UBS) mais próxima. A equipe pode acolher a pessoa e, quando necessário, encaminhar para serviços especializados da região.",
      [
        ["UBS:", "primeiro contato e acompanhamento."],
        ["CER:", "Centro Especializado em Reabilitação."],
        ["CAPS/CAPSi:", "cuidado em saúde mental, conforme a necessidade."],
      ],
      [["Portal do Ministério da Saúde", "https://www.gov.br/saude"]],
    ],
    [
      "book",
      "Seus direitos",
      "Você tem direitos",
      "A legislação brasileira reconhece a pessoa autista como pessoa com deficiência para todos os efeitos legais, com direito a saúde, educação, proteção social e atendimento prioritário, conforme as regras aplicáveis.",
      [
        ["Lei 12.764/2012:", "Lei Berenice Piana."],
        [
          "Lei 13.977/2020:",
          "cria a CIPTEA, Carteira de Identificação da Pessoa com TEA.",
        ],
        ["Lei 13.146/2015:", "Lei Brasileira de Inclusão."],
      ],
      [
        [
          "Leia a Lei 12.764/2012",
          "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12764.htm",
        ],
        [
          "Leia a Lei 13.146/2015",
          "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm",
        ],
      ],
    ],
    [
      "routine",
      "Identificação",
      "O que é a CIPTEA?",
      "Carteira criada para facilitar a identificação da pessoa autista e contribuir para a garantia de atenção integral e prioridade no atendimento. A emissão é feita pelos órgãos responsáveis em estados, municípios e Distrito Federal.",
      [
        [
          "Como solicitar:",
          "consulte o site do governo do seu estado ou da prefeitura para saber onde fazer o pedido e quais documentos são exigidos.",
        ],
      ],
      [
        [
          "Texto da Lei 13.977/2020",
          "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l13977.htm",
        ],
      ],
    ],
    [
      "info",
      "Aprenda mais",
      "Sites e materiais confiáveis",
      "Para conhecer diferentes perspectivas e encontrar materiais de leitura:",
      [
        [
          "Autismo e Realidade:",
          "conteúdos para pessoas autistas, famílias e educadores.",
        ],
        ["Revista Autismo:", "notícias, entrevistas e divulgação."],
        ["Ministério da Saúde:", "orientações oficiais e publicações."],
      ],
      [
        ["Autismo e Realidade", "https://autismoerealidade.org.br"],
        ["Revista Autismo", "https://www.revistaautismo.com.br"],
      ],
    ],
    [
      "heart",
      "Lembre-se",
      "Não existe um único jeito de ser autista",
      "Preferências, formas de comunicação, sensibilidades e necessidades de apoio variam de pessoa para pessoa. O que ajuda alguém pode não funcionar para outra. Respeitar a autonomia, ouvir a própria pessoa e oferecer adaptações faz diferença.",
      [],
      [],
    ],
  ];
  return ` <div class="ig">${C.map((c) => `<article class="ic2"><div class="bd">${ic(c[0], 24)}</div><span class="tag">${c[1]}</span><h3>${c[2]}</h3><p>${c[3]}</p>${c[4].length ? `<ul>${c[4].map((b) => `<li><b>${b[0]}</b> ${b[1]}</li>`).join("")}</ul>` : ""}${c[5].map((l) => `<a href="${l[1]}" target="_blank" rel="noopener">${l[0]} ↗</a>`).join("")}</article>`).join("")}</div>
 <p class="sub" style="margin-top:18px">Conteúdo informativo geral, que não substitui avaliação profissional. Confira os links oficiais para dados atualizados.</p>`;
};
