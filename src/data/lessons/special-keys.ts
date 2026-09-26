import { TipoLicao, type Licao } from '../../types';

export const specialKeys: Record<
  string,
  { name: string; pronunciation: string; description: string; symbol: string }
> = {
  '\n': {
    name: 'Enter',
    pronunciation: 'Ênter',
    description: 'Começa uma nova linha ao escrever. Também pode confirmar uma ação.',
    symbol: '↵',
  },
  ' ': {
    name: 'Espaço',
    pronunciation: 'Espaço',
    description: 'A barra comprida, na parte inferior do teclado, separa as palavras.',
    symbol: '␣',
  },
  '\b': {
    name: 'Backspace',
    pronunciation: 'Bék speice',
    description: 'Apaga o caractere à esquerda do cursor. Procure a seta para a esquerda.',
    symbol: '⌫',
  },
  '\t': {
    name: 'Tab',
    pronunciation: 'Téb',
    description: 'Move o foco para o próximo campo. Em editores, também pode criar um recuo.',
    symbol: '⇥',
  },
  '\u0011': {
    name: 'Ctrl',
    pronunciation: 'Control',
    description:
      'Combine com outra tecla para usar atalhos, como Ctrl + C para copiar. Aqui, pressione apenas Ctrl.',
    symbol: 'Ctrl',
  },
};

export const specialKeyLessons: Licao[] = [
  {
    id: 'keys-1',
    nivel: 1,
    etapa: 1,
    titulo: 'Espaço para suas ideias',
    descricao: 'Veja a imagem, ouça o nome e pressione a tecla indicada.',
    tipo: TipoLicao.ESPECIAIS,
    exercicios: ['\n', ' ', '\n', ' '],
    recompensaXp: 80,
  },
  {
    id: 'keys-2',
    nivel: 1,
    etapa: 2,
    titulo: 'Corrigir e navegar',
    descricao: 'Conheça Backspace, Tab e Ctrl com calma.',
    tipo: TipoLicao.ESPECIAIS,
    exercicios: ['\b', '\t', '\u0011', '\b', '\t', '\u0011'],
    recompensaXp: 90,
  },
  {
    id: 'keys-3',
    nivel: 1,
    etapa: 3,
    titulo: 'Revisão das teclas especiais',
    descricao: 'Encontre cada tecla no seu teclado. Use Esc para sair do campo de prática.',
    tipo: TipoLicao.ESPECIAIS,
    exercicios: ['\n', ' ', '\n', '\b', '\t', '\u0011'],
    recompensaXp: 100,
  },
];
