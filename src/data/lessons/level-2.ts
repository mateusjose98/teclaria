import { TipoLicao, type Licao } from '../../types';
export const level2: Licao[] = [
  {
    id: '2-1',
    nivel: 2,
    etapa: 1,
    titulo: 'Pequenas descobertas',
    descricao: 'Encontre seu ritmo com palavras curtinhas.',
    tipo: TipoLicao.PALAVRAS,
    exercicios: ['casa', 'gato', 'bola', 'sol', 'mesa', 'livro', 'lua', 'pato'],
    recompensaXp: 100,
  },
  {
    id: '2-2',
    nivel: 2,
    etapa: 2,
    titulo: 'Palavras que crescem',
    descricao: 'Mantenha os olhos na palavra e os dedos relaxados.',
    tipo: TipoLicao.PALAVRAS,
    exercicios: ['escola', 'janela', 'telefone', 'mercado', 'cidade', 'computador'],
    recompensaXp: 120,
  },
  {
    id: '2-3',
    nivel: 2,
    etapa: 3,
    titulo: 'O charme dos acentos',
    descricao: 'Acentos e cedilha também fazem parte da aventura.',
    tipo: TipoLicao.PALAVRAS,
    exercicios: ['coração', 'informação', 'ação', 'computação', 'maçã', 'ônibus', 'atenção'],
    recompensaXp: 140,
  },
];
