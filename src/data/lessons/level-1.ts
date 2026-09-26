import { TipoLicao, type Licao } from '../../types';
export const level1: Licao[] = [
  {
    id: '1-1',
    nivel: 1,
    etapa: 1,
    titulo: 'Um número de cada vez',
    descricao: 'Observe cada número e digite com calma.',
    tipo: TipoLicao.NUMEROS,
    exercicios: ['3', '7', '12', '95', '284', '1024', '508', '00123'],
    recompensaXp: 90,
  },
  {
    id: '1-2',
    nivel: 1,
    etapa: 2,
    titulo: 'Contas na ponta dos dedos',
    descricao: 'Digite a operação, incluindo os espaços. Não precisa resolver!',
    tipo: TipoLicao.NUMEROS,
    exercicios: ['2 + 3', '10 - 7', '5 * 4', '20 / 5', '100 + 250'],
    recompensaXp: 100,
  },
  {
    id: '1-3',
    nivel: 1,
    etapa: 3,
    titulo: 'Números da vida real',
    descricao: 'Datas, horários e valores que fazem parte do dia a dia.',
    tipo: TipoLicao.NUMEROS,
    exercicios: ['26/09/2026', '14:30', 'R$ 150,00', '10%', '123456', '00123'],
    recompensaXp: 120,
  },
];
