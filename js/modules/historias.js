import { client, registrarHandler } from '../mqtt-service.js';
import { CONFIG } from '../config.js';
import { S, nav, render } from '../core.js';

const HISTORIAS_PADRAO = [
  {
    t: 'Mãos Limpas',
    e: '🧼',
    n: {
      1: {
        t: 'EU VOU COMER',
        textoCurto: 'EU VOU COMER',
        textoLongo: 'Eu vou comer',
        img: 'assets/historias/maos-limpas-01.png',
        a: 'COMER',
        aLong: 'Comer agora',
        b: 'LAVAR',
        bLong: 'Lavar as mãos',
        at: 3,
        bt: 2
      },
      2: {
        t: 'MÃOS FICAM LIMPAS',
        textoCurto: 'MÃOS LIMPAS',
        textoLongo: 'Eu lavo minhas mãos. Minhas mãos ficam limpas',
        img: 'assets/historias/maos-limpas-02.png',
        mostrarA: false,
        mostrarB: false,
        at: 0,
        bt: 0
      },
      3: {
        t: 'MÃOS SUJAS?',
        textoCurto: 'MÃOS SUJAS?',
        textoLongo: 'Minhas mãos podem estar sujas',
        img: 'assets/historias/maos-limpas-03.png',
        a: 'SEGUE',
        aLong: 'Continuar',
        b: 'LAVAR',
        bLong: 'Lavar agora',
        at: 4,
        bt: 2
      },
      4: {
        t: 'A SUJEIRA VAI PARA A COMIDA',
        textoCurto: 'COMIDA SUJA',
        textoLongo: 'A sujeira vai para a minha comida',
        img: 'assets/historias/maos-limpas-04.png',
        mostrarA: false,
        mostrarB: false,
        at: 0,
        bt: 0
      }
    }
  },
  {
    t: 'Muito Barulho',
    e: '🎧',
    n: {
      1: {
        t: 'MUITO BARULHO',
        textoCurto: 'MUITO BARULHO',
        textoLongo: 'Tem muito barulho aqui',
        img: 'assets/historias/muito-barulho-01.png',
        a: 'FONE',
        aLong: 'Colocar um fone',
        b: 'GRITA',
        bLong: 'Gritar',
        at: 3,
        bt: 2
      },
      2: {
        t: 'EU GRITO BARULHO AUMENTA',
        textoCurto: 'BARULHO AUMENTA',
        textoLongo: 'Eu grito. O barulho aumenta.',
        img: 'assets/historias/muito-barulho-02.png',
        mostrarA: false,
        mostrarB: false,
        at: 0,
        bt: 0
      },
      3: {
        t: 'EU USO UM FONE MAIS CONFORTÁVEL',
        textoCurto: 'MAIS CONFORTAVEL',
        textoLongo: 'Eu uso um fone. Fica mais confortável',
        img: 'assets/historias/muito-barulho-03.png',
        mostrarA: false,
        mostrarB: false,
        at: 0,
        bt: 0
      }
    }
  },
  {
    t: 'Uma Tarefa',
    e: '🧩',
    n: {
      1: {
        t: 'TENHO UMA TAREFA',
        textoCurto: 'TENHO UMA TAREFA',
        textoLongo: 'Eu tenho uma tarefa para fazer',
        img: 'assets/historias/uma-tarefa-01.png',
        a: 'AJUDA',
        aLong: 'Pedir ajuda',
        b: 'TENTA',
        bLong: 'Tentar sozinho',
        at: 3,
        bt: 2
      },
      2: {
        t: 'EU TENTO SOZINHO',
        textoCurto: 'EU TENTO SOZINHO',
        textoLongo: 'Eu tento sozinho',
        img: 'assets/historias/uma-tarefa-02.png',
        a: 'SIM',
        aLong: 'Continuar',
        mostrarB: false,
        at: 4,
        bt: 0
      },
      3: {
        t: 'PEÇO AJUDA',
        textoCurto: 'PEÇO AJUDA',
        textoLongo: 'Eu peço ajuda',
        img: 'assets/historias/uma-tarefa-03.png',
        a: 'SIM',
        aLong: 'Continuar',
        mostrarB: false,
        at: 4,
        bt: 0
      },
      4: {
        t: 'CONSEGUI!',
        textoCurto: 'EU CONSEGUI!',
        textoLongo: 'Eu consegui',
        img: 'assets/historias/uma-tarefa-04.png',
        mostrarA: false,
        mostrarB: false,
        at: 0,
        bt: 0
      }
    }
  },
  {
    t: 'Balanço Ocupado',
    e: '🛝',
    n: {
      1: {
        t: 'BALANÇO OCUPADO',
        textoCurto: 'BALANÇO OCUPADO',
        textoLongo: 'Eu quero ir no balanço. Tem alguém lá',
        img: 'assets/historias/balanco-ocupado-01.png',
        a: 'IR',
        aLong: 'Chegar perto',
        b: 'SAIR',
        bLong: 'Desistir',
        at: 3,
        bt: 2
      },
      2: {
        t: 'EU NÃO BRINCO',
        textoCurto: 'EU NÃO BRINCO',
        textoLongo: 'Eu desisto. Eu não brinco',
        img: 'assets/historias/balanco-ocupado-02.png',
        mostrarA: false,
        mostrarB: false,
        at: 0,
        bt: 0
      },
      3: {
        t: 'EU CHEGO PERTO',
        textoCurto: 'EU CHEGO PERTO',
        textoLongo: 'Eu chego perto',
        img: 'assets/historias/balanco-ocupado-03.png',
        a: 'PEÇO',
        aLong: 'Perguntar se posso ir depois',
        b: 'OLHO',
        bLong: 'Encarar',
        at: 5,
        bt: 4
      },
      4: {
        t: 'EU ENCARO ELE NÃO ENTENDE',
        textoCurto: 'ELE NAO ENTENDE',
        textoLongo: 'Eu encaro. A criança não sabe o que eu quero',
        img: 'assets/historias/balanco-ocupado-04.png',
        mostrarA: false,
        mostrarB: false,
        at: 0,
        bt: 0
      },
      5: {
        t: 'POSSO IR DEPOIS? E BRINCO DEPOIS',
        textoCurto: 'BRINCO DEPOIS',
        textoLongo: 'Eu pergunto: “Posso ir depois?”. E brinco depois',
        img: 'assets/historias/balanco-ocupado-05.png',
        mostrarA: false,
        mostrarB: false,
        at: 0,
        bt: 0
      }
    }
  }
];
const HISTORIAS = HISTORIAS_PADRAO.length;
const NOS_POR_HISTORIA = 8;
const TAMANHO_LINHA = 16;
const LIMITE_NOME_HISTORIA = 60;
const salvando = new Set();

function limitarTexto(texto, limite) {
  return Array.from(String(texto || '')).slice(0, limite).join('');
}

function abreviarOpcao(texto) {
  const palavras = String(texto || '').trim().split(/\s+/);
  return limitarTexto(palavras[palavras.length - 1] || 'OPCAO', 5);
}

function prepararNo(no) {
  no.textoLongo = typeof no.textoLongo === 'string' ? no.textoLongo : (no.t || '');
  no.textoCurto = typeof no.textoCurto === 'string'
    ? no.textoCurto
    : limitarTexto(no.textoLongo, TAMANHO_LINHA);
  const alternativaA = String(no.a || '').trim();
  const alternativaB = String(no.b || '').trim();
  no.aLong = typeof no.aLong === 'string'
    ? no.aLong
    : (alternativaA.length > 5 ? alternativaA : '');
  no.bLong = typeof no.bLong === 'string'
    ? no.bLong
    : (alternativaB.length > 5 ? alternativaB : '');
  no.a = alternativaA.length > 5 ? abreviarOpcao(alternativaA) : alternativaA || 'A';
  no.b = alternativaB.length > 5 ? abreviarOpcao(alternativaB) : alternativaB || 'B';
  no.at = Number.isInteger(no.at) ? no.at : 0;
  no.bt = Number.isInteger(no.bt) ? no.bt : 0;
  no.mostrarA = no.mostrarA !== false;
  no.mostrarB = no.mostrarB !== false;
  no.img = typeof no.img === 'string' ? no.img : '';
  no.t = no.textoLongo || no.textoCurto;
  return no;
}

S.stories = HISTORIAS_PADRAO;
S.stories.forEach((historia) => {
  Object.values(historia.n).forEach(prepararNo);
});

function topicoDoNo(historiaIndex, noIndex) {
  return `${CONFIG.TOPICS.HISTORIAS_NODOS}/${historiaIndex + 1}/${noIndex}`;
}

function topicoDaCapa(historiaIndex) {
  return `${CONFIG.TOPICS.HISTORIAS_CAPA}/${historiaIndex + 1}`;
}

function topicoDoNome(historiaIndex) {
  return `${CONFIG.TOPICS.HISTORIAS_NOME}/${historiaIndex + 1}`;
}

function linhaFpga(texto) {
  const ascii = String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/["\\]/g, ' ');
  return Array.from(ascii).slice(0, TAMANHO_LINHA).join('').padEnd(TAMANHO_LINHA, ' ');
}

function destinoGlobal(historiaIndex, destinoLocal) {
  const destino = Number(destinoLocal);
  if (!destino) return 0;
  return historiaIndex * NOS_POR_HISTORIA + destino - 1;
}

function configurarStatus(mensagem) {
  const status = document.getElementById('story-save-status');
  if (status) status.textContent = mensagem;
}

function configurarStatusCapa(mensagem) {
  const status = document.getElementById('story-cover-status');
  if (status) status.textContent = mensagem;
}

function configurarStatusNome(mensagem) {
  const status = document.getElementById('story-name-status');
  if (status) status.textContent = mensagem;
}

function salvarNomeHistoria() {
  const historiaIndex = S.cur;
  const historia = S.stories[historiaIndex];
  if (!historia) return;

  const nome = String(historia.t || '').trim();
  if (!nome) {
    configurarStatusNome('Informe um nome para a história.');
    return;
  }
  if (Array.from(nome).length > LIMITE_NOME_HISTORIA) {
    configurarStatusNome(`O nome deve ter até ${LIMITE_NOME_HISTORIA} caracteres.`);
    return;
  }

  historia.t = nome;
  render();
  if (!client.connected) {
    configurarStatusNome('Conecte-se ao MQTT para sincronizar o nome.');
    return;
  }

  configurarStatusNome('Salvando nome no MQTT...');
  publicarRetido(
    topicoDoNome(historiaIndex),
    JSON.stringify({ historia: historiaIndex + 1, nome })
  ).then(
    () => configurarStatusNome('Nome salvo e sincronizado com outros dispositivos.'),
    (erro) => {
      console.error('Erro ao salvar nome da história no MQTT:', erro);
      configurarStatusNome('Não foi possível salvar o nome no MQTT.');
    }
  );
}

function setCapa(input) {
  const arquivo = input.files[0];
  if (!arquivo) return;
  if (!['image/png', 'image/jpeg'].includes(arquivo.type)) {
    alert('Escolha uma imagem PNG ou JPG.');
    input.value = '';
    return;
  }
  if (arquivo.size > 5 * 1024 * 1024) {
    alert('A imagem da capa deve ter até 5 MB.');
    input.value = '';
    return;
  }

  const historiaIndex = S.cur;
  const leitor = new FileReader();
  leitor.onload = () => {
    if (typeof leitor.result !== 'string' ||
        !/^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/]*={0,2}$/i.test(leitor.result)) {
      configurarStatusCapa('Não foi possível carregar esta imagem.');
      return;
    }
    S.stories[historiaIndex].capa = leitor.result;
    render();
    configurarStatusCapa('Prévia atualizada. Salve a capa para sincronizar com outros dispositivos.');
  };
  leitor.onerror = () => {
    console.error('Erro ao carregar imagem da capa:', leitor.error);
    configurarStatusCapa('Não foi possível carregar esta imagem.');
  };
  leitor.readAsDataURL(arquivo);
}

function salvarCapa() {
  const historiaIndex = S.cur;
  const historia = S.stories[historiaIndex];
  if (!historia || typeof historia.capa !== 'string' ||
      !/^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/]*={0,2}$/i.test(historia.capa)) {
    configurarStatusCapa('Escolha uma imagem PNG ou JPG para a capa.');
    return;
  }
  if (!client.connected) {
    configurarStatusCapa('Conecte-se ao MQTT para sincronizar a capa.');
    return;
  }

  configurarStatusCapa('Salvando capa no MQTT...');
  publicarRetido(
    topicoDaCapa(historiaIndex),
    JSON.stringify({ historia: historiaIndex + 1, imagem: historia.capa })
  ).then(
    () => configurarStatusCapa('Capa salva e sincronizada com outros dispositivos.'),
    (erro) => {
      console.error('Erro ao salvar capa da história no MQTT:', erro);
      configurarStatusCapa('Não foi possível salvar a capa no MQTT.');
    }
  );
}

function definirAlternativa(botao, visivel) {
  const historia = S.stories[S.cur];
  const no = historia && historia.n[S.node];
  if (!no || (botao !== 'a' && botao !== 'b')) return;

  const propriedadeVisibilidade = `mostrar${botao.toUpperCase()}`;
  no[propriedadeVisibilidade] = Boolean(visivel);
  if (!visivel) {
    no[botao] = '';
    no[`${botao}Long`] = '';
    no[`${botao}t`] = 0;
  }
  render();
}

function dadosDoNo(historiaIndex, noIndex, no) {
  const mostrarA = no.mostrarA !== false;
  const mostrarB = no.mostrarB !== false;
  return {
    historia: historiaIndex + 1,
    no: noIndex,
    texto_curto: no.textoCurto,
    texto_longo: no.textoLongo,
    alternativa_a: mostrarA ? no.a : '',
    alternativa_b: mostrarB ? no.b : '',
    alternativa_a_longa: mostrarA ? no.aLong : '',
    alternativa_b_longa: mostrarB ? no.bLong : '',
    destino_a: mostrarA ? destinoGlobal(historiaIndex, no.at) : 0,
    destino_b: mostrarB ? destinoGlobal(historiaIndex, no.bt) : 0,
    mostrar_a: mostrarA,
    mostrar_b: mostrarB,
    imagem: no.img
  };
}

function comandoFpga(historiaIndex, noIndex, dados) {
  const linhaAlternativas = `A)${dados.alternativa_a} B)${dados.alternativa_b}`;
  return {
    no: historiaIndex * NOS_POR_HISTORIA + noIndex,
    destino_a: dados.destino_a,
    destino_b: dados.destino_b,
    texto32: linhaFpga(dados.texto_curto) + linhaFpga(linhaAlternativas)
  };
}

function publicarRetido(topico, payload) {
  return new Promise((resolve, reject) => {
    client.publish(topico, payload, { retain: true }, (erro) => {
      if (erro) reject(erro);
      else resolve();
    });
  });
}

function publicarComandoFpga(comando) {
  return new Promise((resolve, reject) => {
    client.publish(CONFIG.TOPICS.HISTORIAS_CONFIGURAR, JSON.stringify(comando), (erro) => {
      if (erro) reject({ etapa: 'fpga', erro });
      else resolve();
    });
  });
}

function publicarNoCompleto(historiaIndex, noIndex, dados) {
  const topico = topicoDoNo(historiaIndex, noIndex);
  const comando = comandoFpga(historiaIndex, noIndex, dados);
  return new Promise((resolve, reject) => {
    client.publish(topico, JSON.stringify(dados), { retain: true }, (erroDados) => {
      if (erroDados) {
        reject({ etapa: 'mqtt', erro: erroDados });
        return;
      }
      client.publish(
        CONFIG.TOPICS.HISTORIAS_CONFIGURAR,
        JSON.stringify(comando),
        (erroFpga) => {
          if (erroFpga) reject({ etapa: 'fpga', erro: erroFpga });
          else resolve();
        }
      );
    });
  });
}

function publicarConfiguracao(historiaIndex, noIndex, dados) {
  const chave = `${historiaIndex}:${noIndex}`;

  salvando.add(chave);
  configurarStatus('Salvando no MQTT...');

  publicarNoCompleto(historiaIndex, noIndex, dados).then(
    () => {
      salvando.delete(chave);
      configurarStatus(`Cena salva no MQTT; nó ${comandoFpga(historiaIndex, noIndex, dados).no} publicado.`);
    },
    (falha) => {
      salvando.delete(chave);
      if (falha.etapa === 'mqtt') {
        console.error('Erro ao salvar nó da história no MQTT:', falha.erro);
        configurarStatus('Não foi possível salvar esta cena no MQTT.');
        return;
      }
      console.error('Erro ao publicar configuração do nó para a ESP:', falha.erro);
      configurarStatus('Cena salva no MQTT, mas a configuração não foi enviada à ESP.');
    }
  );
}

function salvarCena() {
  const historiaIndex = S.cur;
  const noIndex = Number(S.node) - 1;
  const historia = S.stories[historiaIndex];
  const no = historia && historia.n[noIndex + 1];
  const chave = `${historiaIndex}:${noIndex}`;
  if (!no || noIndex < 0 || noIndex >= NOS_POR_HISTORIA || salvando.has(chave)) return;

  prepararNo(no);
  no.mostrarA = no.mostrarA !== false;
  no.mostrarB = no.mostrarB !== false;
  no.textoCurto = String(no.textoCurto || '').trim();
  no.textoLongo = String(no.textoLongo || '').trim();
  no.a = no.mostrarA ? String(no.a || '').trim().toUpperCase() : '';
  no.b = no.mostrarB ? String(no.b || '').trim().toUpperCase() : '';
  no.aLong = no.mostrarA ? String(no.aLong || '').trim() : '';
  no.bLong = no.mostrarB ? String(no.bLong || '').trim() : '';
  if (!no.mostrarA) no.at = 0;
  if (!no.mostrarB) no.bt = 0;

  if (!no.textoCurto || Array.from(no.textoCurto).length > TAMANHO_LINHA) {
    configurarStatus('Informe um texto curto de até 16 caracteres para a FPGA.');
    return;
  }
  if ((no.mostrarA && (!no.a || no.a.length > 5)) ||
      (no.mostrarB && (!no.b || no.b.length > 5))) {
    configurarStatus('Preencha cada alternativa ativa com até 5 caracteres.');
    return;
  }
  if (Array.from(no.textoLongo).length > 180) {
    configurarStatus('O texto complementar deve ter até 180 caracteres.');
    return;
  }
  if ((no.mostrarA && Array.from(no.aLong).length > 180) ||
      (no.mostrarB && Array.from(no.bLong).length > 180)) {
    configurarStatus('Os textos maiores dos botões devem ter até 180 caracteres.');
    return;
  }
  if ((no.mostrarA && no.at !== 0 && !historia.n[no.at]) ||
      (no.mostrarB && no.bt !== 0 && !historia.n[no.bt])) {
    configurarStatus('Escolha destinos existentes para os botões A e B.');
    return;
  }

  no.t = no.textoLongo || no.textoCurto;
  const dados = dadosDoNo(historiaIndex, noIndex, no);
  publicarConfiguracao(historiaIndex, noIndex, dados);
}

function aplicarNoRemovido(historiaIndex, noIndex) {
  const historia = S.stories[historiaIndex];
  const nodeId = noIndex + 1;
  if (!historia || nodeId === 1) return;

  delete historia.n[nodeId];
  Object.values(historia.n).forEach((no) => {
    if (no.at === nodeId) no.at = 0;
    if (no.bt === nodeId) no.bt = 0;
  });

  if (S.cur === historiaIndex) {
    if (!historia.n[S.node]) {
      S.node = Math.min(...Object.keys(historia.n).map(Number));
    }
    if (S.rd === nodeId) S.rd = 0;
    if (S.page === 'editor' || S.page === 'read' || S.page === 'stories') render();
  }
}

async function deletarNo() {
  const historiaIndex = S.cur;
  const nodeId = Number(S.node);
  const noIndex = nodeId - 1;
  const historia = S.stories[historiaIndex];
  if (!historia || !historia.n[nodeId] || noIndex < 0 || noIndex >= NOS_POR_HISTORIA) return;
  if (nodeId === 1) {
    configurarStatus('O nó inicial não pode ser excluído.');
    return;
  }
  if (!window.confirm(`Excluir o nó #${noIndex}? As escolhas que levam a ele passarão para Fim.`)) {
    return;
  }
  if (!client.connected) {
    configurarStatus('Conecte-se ao MQTT para excluir um nó.');
    return;
  }

  const referencias = Object.entries(historia.n).filter(([id, no]) =>
    Number(id) !== nodeId && (no.at === nodeId || no.bt === nodeId)
  );
  const chaves = [
    `${historiaIndex}:${noIndex}`,
    ...referencias.map(([id]) => `${historiaIndex}:${Number(id) - 1}`)
  ];
  if (chaves.some((chave) => salvando.has(chave))) {
    configurarStatus('Aguarde o salvamento das cenas antes de excluir este nó.');
    return;
  }
  chaves.forEach((chave) => salvando.add(chave));
  configurarStatus('Atualizando ligações e excluindo o nó...');

  try {
    for (const [id, no] of referencias) {
      const sourceIndex = Number(id) - 1;
      const atualizado = {
        ...no,
        at: no.at === nodeId ? 0 : no.at,
        bt: no.bt === nodeId ? 0 : no.bt
      };
      if (!String(atualizado.textoCurto || '').trim()) {
        no.at = atualizado.at;
        no.bt = atualizado.bt;
        continue;
      }

      try {
        await publicarNoCompleto(
          historiaIndex,
          sourceIndex,
          dadosDoNo(historiaIndex, sourceIndex, atualizado)
        );
      } catch (falha) {
        if (falha.etapa === 'fpga') {
          no.at = atualizado.at;
          no.bt = atualizado.bt;
        }
        throw falha;
      }
      no.at = atualizado.at;
      no.bt = atualizado.bt;
    }

    await publicarComandoFpga({
      no: historiaIndex * NOS_POR_HISTORIA + noIndex,
      destino_a: 0,
      destino_b: 0,
      texto32: ' '.repeat(32)
    });
    await publicarRetido(
      topicoDoNo(historiaIndex, noIndex),
      JSON.stringify({ historia: historiaIndex + 1, no: noIndex, removido: true })
    );
    aplicarNoRemovido(historiaIndex, noIndex);
    configurarStatus('Nó excluído do front e do MQTT.');
  } catch (falha) {
    console.error('Erro ao excluir nó da história:', falha.erro || falha);
    if (falha.etapa === 'fpga') {
      configurarStatus('A exclusão ficou incompleta porque a publicação para a FPGA falhou. Tente novamente.');
    } else {
      configurarStatus('Não foi possível concluir a exclusão. Verifique a conexão MQTT e tente novamente.');
    }
  } finally {
    chaves.forEach((chave) => salvando.delete(chave));
  }
}

function validarNoRecebido(dados, historiaIndex, noIndex) {
  const inicioHistoria = historiaIndex * NOS_POR_HISTORIA;
  const destinoValido = (destino) =>
    destino === 0 || (destino >= inicioHistoria && destino < inicioHistoria + NOS_POR_HISTORIA);
  const imagemValida = (imagem) =>
    !imagem ||
    /^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/]*={0,2}$/i.test(imagem) ||
    /^assets\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:png|jpe?g)$/i.test(imagem);
  return dados &&
    dados.historia === historiaIndex + 1 &&
    dados.no === noIndex &&
    typeof dados.texto_curto === 'string' &&
    Array.from(dados.texto_curto).length <= TAMANHO_LINHA &&
    typeof dados.texto_longo === 'string' &&
    Array.from(dados.texto_longo).length <= 180 &&
    (dados.mostrar_a === undefined || typeof dados.mostrar_a === 'boolean') &&
    (dados.mostrar_b === undefined || typeof dados.mostrar_b === 'boolean') &&
    typeof dados.alternativa_a === 'string' &&
    dados.alternativa_a.length <= 5 &&
    (dados.mostrar_a === false || dados.alternativa_a.length > 0) &&
    typeof dados.alternativa_b === 'string' &&
    dados.alternativa_b.length <= 5 &&
    (dados.mostrar_b === false || dados.alternativa_b.length > 0) &&
    (dados.alternativa_a_longa === undefined ||
      (typeof dados.alternativa_a_longa === 'string' &&
       Array.from(dados.alternativa_a_longa).length <= 180)) &&
    (dados.alternativa_b_longa === undefined ||
      (typeof dados.alternativa_b_longa === 'string' &&
       Array.from(dados.alternativa_b_longa).length <= 180)) &&
    Number.isInteger(dados.destino_a) && destinoValido(dados.destino_a) &&
    Number.isInteger(dados.destino_b) && destinoValido(dados.destino_b) &&
    typeof dados.imagem === 'string' &&
    imagemValida(dados.imagem);
}

for (let historiaIndex = 0; historiaIndex < HISTORIAS; historiaIndex++) {
  registrarHandler(topicoDoNome(historiaIndex), (dados) => {
    const nome = typeof dados?.nome === 'string' ? dados.nome.trim() : '';
    if (!dados || dados.historia !== historiaIndex + 1 || !nome ||
        Array.from(nome).length > LIMITE_NOME_HISTORIA) {
      console.error('Dados inválidos de nome de história recebidos:', dados);
      return;
    }
    S.stories[historiaIndex].t = nome;
    if (S.page === 'stories' || S.page === 'editor' || S.page === 'read') render();
  });

  registrarHandler(topicoDaCapa(historiaIndex), (dados) => {
    const imagemValida = typeof dados?.imagem === 'string' &&
      (!dados.imagem ||
       /^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/]*={0,2}$/i.test(dados.imagem));
    if (!dados || dados.historia !== historiaIndex + 1 || !imagemValida) {
      console.error('Dados inválidos de capa de história recebidos:', dados);
      return;
    }
    S.stories[historiaIndex].capa = dados.imagem;
    if (S.page === 'stories' || S.page === 'editor') render();
  });

  for (let noIndex = 0; noIndex < NOS_POR_HISTORIA; noIndex++) {
    registrarHandler(topicoDoNo(historiaIndex, noIndex), (dados) => {
      if (dados && dados.removido === true) {
        if (dados.historia !== historiaIndex + 1 || dados.no !== noIndex || noIndex === 0) {
          console.error('Marcador de remoção de nó inválido recebido:', dados);
          return;
        }
        aplicarNoRemovido(historiaIndex, noIndex);
        return;
      }
      if (!validarNoRecebido(dados, historiaIndex, noIndex)) {
        console.error('Dados inválidos de nó de história recebidos:', dados);
        return;
      }

      const historia = S.stories[historiaIndex];
      const chaveNo = noIndex + 1;
      const no = prepararNo(historia.n[chaveNo] || {});
      no.textoCurto = dados.texto_curto;
      no.textoLongo = dados.texto_longo;
      no.t = dados.texto_longo || dados.texto_curto;
      no.a = dados.alternativa_a;
      no.b = dados.alternativa_b;
      no.mostrarA = dados.mostrar_a !== false;
      no.mostrarB = dados.mostrar_b !== false;
      no.aLong = dados.alternativa_a_longa || '';
      no.bLong = dados.alternativa_b_longa || '';
      const inicioHistoria = historiaIndex * NOS_POR_HISTORIA;
      no.at = dados.destino_a === 0 ? 0 : dados.destino_a - inicioHistoria + 1;
      no.bt = dados.destino_b === 0 ? 0 : dados.destino_b - inicioHistoria + 1;
      no.img = dados.imagem;
      historia.n[chaveNo] = no;

      if (S.page === 'read' || S.page === 'stories') render();
    });
  }
}

registrarHandler(CONFIG.TOPICS.HISTORIA_NO_ATUAL, (dados) => {
  if (!dados || !Number.isInteger(dados.no) || dados.no < 0 ||
      dados.no >= HISTORIAS * NOS_POR_HISTORIA) {
    console.error('ID de nó atual inválido recebido:', dados);
    return;
  }

  S.cur = Math.floor(dados.no / NOS_POR_HISTORIA);
  const nodeId = dados.no % NOS_POR_HISTORIA + 1;
  S.rd = S.stories[S.cur].n[nodeId] ? nodeId : 0;
  S.fromEd = false;
  nav('read');
});

Object.assign(window, {
  salvarCena,
  deletarNo,
  definirAlternativa,
  setCapa,
  salvarCapa,
  salvarNomeHistoria
});

export { salvarCena, deletarNo, definirAlternativa, setCapa, salvarCapa, salvarNomeHistoria };
