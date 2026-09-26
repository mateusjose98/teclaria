import { lessons } from '../data/lessons';
import type { Licao, ProgressoUsuario, Resultado, Resumo } from '../types';
export const accuracy = (correct: number, errors: number) =>
  correct + errors > 0 ? (correct / (correct + errors)) * 100 : 100;
export const ppm = (correct: number, seconds: number) =>
  seconds > 0 ? Math.round(correct / 5 / (seconds / 60)) : 0;
export const freshProgress = (): ProgressoUsuario => ({
  nome: '',
  nivelAtual: 0,
  licoesConcluidas: [],
  xp: 0,
  maiorSequencia: 0,
  conquistas: [],
  configuracoes: { som: true },
  estatisticas: { totalCaracteres: 0, totalErros: 0, melhorPpm: 0, melhorPrecisao: 0, sessoes: 0 },
});
export const unlockedLevel = (completed: string[]) => {
  for (let n = 0; n < 5; n++)
    if (!lessons.filter((l) => l.nivel === n).every((l) => completed.includes(l.id))) return n;
  return 5;
};
export const canPlay = (l: Licao, p: ProgressoUsuario) =>
  l.nivel <= unlockedLevel(p.licoesConcluidas) &&
  (l.etapa === 1 || p.licoesConcluidas.includes(`${l.nivel}-${l.etapa - 1}`));
export const nextLesson = (p: ProgressoUsuario) =>
  lessons.find((l) => !p.licoesConcluidas.includes(l.id)) ?? lessons[14];
export const achievementInfo = [
  {
    id: 'first',
    title: 'Primeiro passo',
    description: 'Conclua sua primeira etapa.',
    icon: 'foot',
  },
  {
    id: 'perfect',
    title: 'Mira perfeita',
    description: 'Conclua uma etapa com 100% de precisão.',
    icon: 'target',
  },
  {
    id: 'streak',
    title: 'Sem parar',
    description: 'Complete 20 itens seguidos sem erro.',
    icon: 'flame',
  },
  { id: 'speed', title: 'Velocista', description: 'Alcance 40 palavras por minuto.', icon: 'zap' },
  {
    id: 'master',
    title: 'Mestre do teclado',
    description: 'Conclua os cinco níveis.',
    icon: 'crown',
  },
];
export function completeLesson(
  p: ProgressoUsuario,
  l: Licao,
  r: Resultado,
  free = false,
): { progress: ProgressoUsuario; summary: Resumo } {
  const precision = accuracy(r.corretos, r.erros),
    speed = ppm(r.corretos, r.segundos);
  const approved =
    r.sucesso &&
    r.corretos > 0 &&
    precision >= (l.objetivo?.precisaoMinima ?? 0) &&
    (free || canPlay(l, p));
  const first = approved && !free && !p.licoesConcluidas.includes(l.id);
  const completed = first ? [...p.licoesConcluidas, l.id] : [...p.licoesConcluidas],
    level = unlockedLevel(completed);
  const record =
    approved &&
    p.estatisticas.sessoes > 0 &&
    (speed > p.estatisticas.melhorPpm ||
      precision > p.estatisticas.melhorPrecisao ||
      r.sequencia > p.maiorSequencia);
  const xp = approved
    ? (first ? l.recompensaXp : 25) +
      (first && level > p.nivelAtual ? 100 : 0) +
      (precision >= 95 ? 30 : 0) +
      (record ? 20 : 0)
    : 0;
  const conditions: Record<string, boolean> = {
    first: completed.length > 0,
    perfect: approved && precision === 100,
    streak: r.sequencia >= 20,
    speed: approved && speed >= 40,
    master: level === 5,
  };
  const added = achievementInfo
    .filter((a) => conditions[a.id] && !p.conquistas.includes(a.id))
    .map((a) => a.id);
  return {
    progress: {
      ...p,
      licoesConcluidas: completed,
      nivelAtual: level,
      xp: p.xp + xp,
      maiorSequencia: Math.max(p.maiorSequencia, r.sequencia),
      conquistas: [...p.conquistas, ...added],
      estatisticas: {
        totalCaracteres: p.estatisticas.totalCaracteres + r.corretos + r.erros,
        totalErros: p.estatisticas.totalErros + r.erros,
        melhorPpm: Math.max(p.estatisticas.melhorPpm, approved ? speed : 0),
        melhorPrecisao: Math.max(p.estatisticas.melhorPrecisao, approved ? precision : 0),
        sessoes: p.estatisticas.sessoes + 1,
      },
    },
    summary: {
      ...r,
      xp,
      precisao: precision,
      ppm: speed,
      novasConquistas: added,
      recorde: record,
      aprovado: approved,
    },
  };
}
