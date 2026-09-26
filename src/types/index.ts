export enum TipoLicao {
  PARAGRAFOS = 'PARAGRAFOS',
  ESPECIAIS = 'ESPECIAIS',
  TECLADO = 'TECLADO',
  NUMEROS = 'NUMEROS',
  PALAVRAS = 'PALAVRAS',
  BOLHAS = 'BOLHAS',
  FRASES = 'FRASES',
}
export interface Licao {
  id: string;
  nivel: number;
  etapa: number;
  titulo: string;
  descricao: string;
  tipo: TipoLicao;
  exercicios: string[];
  objetivo?: { precisaoMinima?: number };
  recompensaXp: number;
}
export interface ProgressoUsuario {
  nome: string;
  nivelAtual: number;
  licoesConcluidas: string[];
  xp: number;
  maiorSequencia: number;
  conquistas: string[];
  configuracoes: { som: boolean };
  estatisticas: {
    totalCaracteres: number;
    totalErros: number;
    melhorPpm: number;
    melhorPrecisao: number;
    sessoes: number;
  };
}
export interface Resultado {
  licaoId: string;
  corretos: number;
  erros: number;
  segundos: number;
  sequencia: number;
  sucesso: boolean;
}
export interface Resumo extends Resultado {
  xp: number;
  precisao: number;
  ppm: number;
  novasConquistas: string[];
  recorde: boolean;
  aprovado: boolean;
}
