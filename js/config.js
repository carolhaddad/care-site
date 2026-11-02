export const CONFIG = {
  BROKER_URL: 'wss://broker.hivemq.com:8884/mqtt',
  TOPICS: {
    PALAVRAS: 'CARE/comunicacao/palavras',
    CONFIG_PALAVRAS: 'CARE/comunicacao/config',
    ALERTA: 'CARE/comunicacao/alerta',
    HISTORICO: 'CARE/historico',
    TAREFAS: 'CARE/rotina/tarefas',
    CHECK: 'CARE/rotina/check'
  }
};

export const NOMES_MODOS = [
  'Crise', 'Comunicação', 'Arte', 'Jogo', 'Rotina', 'História', 'Histórico'
];