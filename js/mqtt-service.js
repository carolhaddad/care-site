import { CONFIG } from './config.js?v=3';

const topicoHandlers = {};
const topicoTextoHandlers = {};

export const client = mqtt.connect(CONFIG.BROKER_URL);

function atualizarStatus(conexao, descricao) {
  const statusEl = document.getElementById('net-status');
  if (!statusEl) return;

  statusEl.className = `connection-indicator status-${conexao}`;
  statusEl.setAttribute('aria-label', descricao);
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
  atualizarStatus('online', 'Conectado ao broker');

  // Inscreve em todos os tópicos já registados até ao momento
  new Set([...Object.keys(topicoHandlers), ...Object.keys(topicoTextoHandlers)])
    .forEach(topico => subscreverTopico(topico));
});

client.on('reconnect', () => atualizarStatus('connecting', 'Reconectando ao broker'));
client.on('offline', () => atualizarStatus('offline', 'Broker desconectado'));
client.on('close', () => atualizarStatus('offline', 'Broker desconectado'));
client.on('error', () => atualizarStatus('offline', 'Erro na conexão com o broker'));

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