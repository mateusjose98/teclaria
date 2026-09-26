import { level0 } from './level-0';
import { level1 } from './level-1';
import { level2 } from './level-2';
import { level3 } from './level-3';
import { level4 } from './level-4';
export const lessons = [...level0, ...level1, ...level2, ...level3, ...level4];
export const levels = [
  {
    title: 'Explorador do teclado',
    subtitle: 'Conheça cada cantinho do teclado',
    color: 'purple',
    icon: 'keyboard',
  },
  {
    title: 'Mestre dos números',
    subtitle: 'Números que fazem parte da vida',
    color: 'orange',
    icon: 'hash',
  },
  {
    title: 'Caçador de palavras',
    subtitle: 'Encontre seu ritmo, palavra por palavra',
    color: 'green',
    icon: 'text',
  },
  {
    title: 'Estoura-bolhas',
    subtitle: 'Uma chuva de diversão e aprendizado',
    color: 'blue',
    icon: 'bubbles',
  },
  {
    title: 'Mestre da digitação',
    subtitle: 'Transforme toques em histórias',
    color: 'pink',
    icon: 'crown',
  },
];
