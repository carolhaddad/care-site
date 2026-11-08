export const CONFIG = {
  BROKER_URL: 'wss://broker.hivemq.com:8884/mqtt',
  TOPICS: {
    PALAVRAS: 'CARE/comunicacao/palavras',
    CONFIG_PALAVRAS: 'CARE/comunicacao/config',
    ALERTA: 'CARE/comunicacao/alerta',
    HISTORICO: 'CARE/historico',
    TAREFAS: 'CARE/rotina/tarefas',
    CHECK: 'CARE/rotina/check',
    CONFIG_PERGUNTAS: 'CARE/jogo/perguntas/config',
    PERGUNTAS: 'CARE/jogo/perguntas',
    FASE1: 'CARE/jogo/fase1',
    FASE2_N1: 'CARE/jogo/fase2/nivel1',
    FASE2_N2: 'CARE/jogo/fase2/nivel2',
    FASE2_N3: 'CARE/jogo/fase2/nivel3',
    FASE3: 'CARE/jogo/fase3',
    VITORIA: 'CARE/jogo/vitoria'
  }
};

export const NOMES_MODOS = [
  'Crise', 'Comunicação', 'Arte', 'Jogo', 'Rotina', 'História', 'Histórico'
];