import { CONFIG } from './config.js';

const topicoHandlers = {};
const topicoTextoHandlers = {};
let statusConexao = 'Conectando ao broker MQTT...';

export const client = mqtt.connect(CONFIG.BROKER_URL);

function atualizarStatus(conexao, descricao, rotulo) {
  statusConexao = descricao;
  const statusEl = document.getElementById('net-status');
  if (statusEl) {
    const indicador = statusEl.closest('.conn') || statusEl;
    indicador.classList.remove('status-online', 'status-connecting', 'status-offline', 'status-error');
    indicador.classList.add(`status-${conexao}`);
    statusEl.textContent = rotulo;
    statusEl.setAttribute('aria-label', descricao);
  }

  sincronizarStatusVisiveis();
}

function sincronizarStatusVisiveis() {
  document.querySelectorAll('[data-mqtt-status]').forEach((el) => {
    const textoAtual = el.textContent.trim();
    if (/^(Conectado|Conectando|Reconectando|Desconectado|Erro na conexão|Aguardando.*MQTT)/i.test(textoAtual) &&
        textoAtual !== statusConexao) {
      el.textContent = statusConexao;
    }
  });
}

const statusObserver = new MutationObserver(sincronizarStatusVisiveis);
statusObserver.observe(document.body, { childList: true, subtree: true });

export function obterStatusConexao() {
  return statusConexao;
}

function subscreverTopico(topico) {
  if (client.connected) {
    client.subscribe(topico, (err) => {
      if (!err) console.log(`📡 [MQTT JS] Subscrito com sucesso no tópico: ${topico}`);
      else console.error(`❌ [MQTT JS] Erro ao subscrever em ${topico}:`, err);
    });
  }
}

client.on('connect', () => {
  console.log('🟢 [MQTT JS] Conectado ao Broker HiveMQ via WebSockets!');
  atualizarStatus('online', 'Conectado ao broker MQTT', 'Conectado');

  // Inscreve em todos os tópicos já registados até ao momento
  new Set([...Object.keys(topicoHandlers), ...Object.keys(topicoTextoHandlers)])
    .forEach(topico => subscreverTopico(topico));
});

client.on('reconnect', () => atualizarStatus('connecting', 'Reconectando ao broker MQTT...', 'Reconectando...'));
client.on('offline', () => atualizarStatus('offline', 'Desconectado do broker MQTT', 'Desconectado'));
client.on('close', () => atualizarStatus('offline', 'Desconectado do broker MQTT', 'Desconectado'));
client.on('error', () => atualizarStatus('error', 'Erro na conexão com o broker MQTT', 'Erro de conexão'));

export function registrarHandler(topico, handlerFn) {
  if (!topicoHandlers[topico]) {
    topicoHandlers[topico] = [];
  }
  topicoHandlers[topico].push(handlerFn);

  // Se o client já estiver conectado quando o módulo carregar, subscreve imediatamente
  subscreverTopico(topico);
}

export function registrarTextoHandler(topico, handlerFn) {
  if (!topicoTextoHandlers[topico]) {
    topicoTextoHandlers[topico] = [];
  }
  topicoTextoHandlers[topico].push(handlerFn);
  subscreverTopico(topico);
}

client.on('message', (topic, message) => {
  const payloadStr = message.toString();
  console.log(`📩 [MQTT RX Frontend] Mensagem recebida em [${topic}]:`, payloadStr);

  topicoTextoHandlers[topic]?.forEach(fn => fn(payloadStr));

  if (topicoHandlers[topic]) {
    try {
      const data = JSON.parse(payloadStr);
      topicoHandlers[topic].forEach(fn => fn(data));
    } catch (err) {
      console.error(`❌ Erro ao converter JSON no tópico [${topic}]:`, err);
    }
  }
});