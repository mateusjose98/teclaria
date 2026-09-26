import { TipoLicao, type Licao } from '../../types';
export const level4: Licao[] = [
  {
    id: '4-1',
    nivel: 4,
    etapa: 1,
    titulo: 'Sua primeira história',
    descricao: 'Digite cada frase, incluindo maiúsculas e pontuação.',
    tipo: TipoLicao.FRASES,
    exercicios: [
      'O gato dorme na janela.',
      'Um passo de cada vez.',
      'Aprender pode ser divertido!',
    ],
    recompensaXp: 140,
  },
  {
    id: '4-2',
    nivel: 4,
    etapa: 2,
    titulo: 'Ideias em movimento',
    descricao: 'A velocidade vem com a prática. Preserve a precisão.',
    tipo: TipoLicao.FRASES,
    exercicios: [
      'Hoje pela manhã fomos ao mercado comprar algumas frutas.',
      'Com calma e atenção, meus dedos encontram cada tecla.',
    ],
    recompensaXp: 160,
  },
  {
    id: '4-3',
    nivel: 4,
    etapa: 3,
    titulo: 'Mestre das histórias',
    descricao: 'Você chegou longe. Hora de dar vida a um pequeno texto!',
    tipo: TipoLicao.FRASES,
    exercicios: [
      'Maria acordou cedo e abriu a janela. O sol estava forte e o céu completamente azul.',
      'Ela preparou um café e começou a escrever. A cada palavra, uma nova ideia surgia. Aprender era uma aventura!',
    ],
    recompensaXp: 200,
  },
];
