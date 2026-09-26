import { describe, expect, it } from 'vitest';
import { accuracy, ppm, freshProgress, unlockedLevel, canPlay, completeLesson } from './progress';
import { lessons, levels } from '../data/lessons';
import type { Resultado } from '../types';
const result: Resultado = {
  licaoId: '0-1',
  corretos: 30,
  erros: 0,
  segundos: 60,
  sequencia: 30,
  sucesso: true,
};
describe('métricas por caractere', () => {
  it('calcula precisão a partir de todas as tentativas', () => {
    expect(accuracy(9, 1)).toBe(90);
    expect(accuracy(0, 0)).toBe(100);
    expect(accuracy(0, 3)).toBe(0);
  });
  it('usa cinco caracteres por palavra e evita divisão por zero', () => {
    expect(ppm(200, 60)).toBe(40);
    expect(ppm(100, 30)).toBe(40);
    expect(ppm(0, 0)).toBe(0);
    expect(ppm(10, 0)).toBe(0);
  });
});
describe('conteúdo e progressão', () => {
  it('contém cinco níveis com exatamente três etapas cada', () => {
    expect(lessons).toHaveLength(lessons.length);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (let n = 0; n < levels.length; n++) {
      expect(lessons.filter((l) => l.nivel === n).map((l) => l.etapa)).toEqual([1, 2, 3]);
    }
    expect(lessons.every((l) => l.exercicios.length > 0)).toBe(true);
  });
  it('libera próximo nível apenas depois das três etapas', () => {
    expect(unlockedLevel(['0-1', '0-2'])).toBe(0);
    expect(unlockedLevel(['0-1', '0-2', '0-3'])).toBe(1);
    expect(unlockedLevel(lessons.map((l) => l.id))).toBe(levels.length);
  });
  it('impede saltos e permite repetir etapas anteriores', () => {
    const p = freshProgress();
    expect(canPlay(lessons[0], p)).toBe(true);
    expect(canPlay(lessons[1], p)).toBe(false);
    expect(canPlay(lessons[3], p)).toBe(false);
    p.licoesConcluidas = ['0-1'];
    expect(canPlay(lessons[0], p)).toBe(true);
    expect(canPlay(lessons[1], p)).toBe(true);
  });
  it('conclui toda a jornada e libera o modo livre', () => {
    let p = freshProgress();
    for (const l of lessons) p = completeLesson(p, l, { ...result, licaoId: l.id }).progress;
    expect(p.licoesConcluidas).toHaveLength(lessons.length);
    expect(p.nivelAtual).toBe(levels.length);
    expect(p.conquistas).toContain('master');
  });
});
describe('XP e conclusão', () => {
  it('concede XP da etapa e bônus de precisão', () => {
    const { progress, summary } = completeLesson(freshProgress(), lessons[0], result);
    expect(summary.xp).toBe(110);
    expect(progress.xp).toBe(110);
    expect(progress.conquistas).toEqual(['first', 'perfect', 'streak']);
    expect(progress.estatisticas.totalCaracteres).toBe(30);
  });
  it('não duplica etapas e conquistas em repetições', () => {
    const p = completeLesson(freshProgress(), lessons[0], result).progress;
    const { progress, summary } = completeLesson(p, lessons[0], result);
    expect(progress.licoesConcluidas).toEqual(['0-1']);
    expect(summary.novasConquistas).toEqual([]);
    expect(summary.xp).toBe(55);
  });
  it('concede bônus de nível uma única vez', () => {
    let p = freshProgress();
    for (const l of lessons.slice(0, 2)) p = completeLesson(p, l, result).progress;
    const completed = completeLesson(p, lessons[2], result);
    expect(completed.summary.xp).toBe(230);
    expect(completed.progress.nivelAtual).toBe(1);
    expect(completeLesson(completed.progress, lessons[2], result).summary.xp).toBe(55);
  });
  it('falha não conclui etapa nem concede XP ou recorde', () => {
    const { progress, summary } = completeLesson(freshProgress(), lessons[0], {
      ...result,
      sucesso: false,
    });
    expect(summary.xp).toBe(0);
    expect(progress.licoesConcluidas).toEqual([]);
    expect(progress.estatisticas.melhorPpm).toBe(0);
  });
  it('não conclui lição bloqueada ou sem caracteres', () => {
    expect(completeLesson(freshProgress(), lessons[3], result).summary.aprovado).toBe(false);
    expect(
      completeLesson(freshProgress(), lessons[0], { ...result, corretos: 0 }).summary.aprovado,
    ).toBe(false);
  });
  it('respeita precisão mínima configurada', () => {
    const l = { ...lessons[0], objetivo: { precisaoMinima: 95 } };
    expect(completeLesson(freshProgress(), l, { ...result, erros: 10 }).summary.aprovado).toBe(
      false,
    );
  });
  it('inclui os erros nos totais e mantém recordes', () => {
    const p = completeLesson(freshProgress(), lessons[0], result).progress;
    const r = completeLesson(p, lessons[1], { ...result, corretos: 200, erros: 20, segundos: 60 });
    expect(r.summary.recorde).toBe(true);
    expect(r.progress.estatisticas.totalCaracteres).toBe(250);
    expect(r.progress.estatisticas.totalErros).toBe(20);
    expect(r.progress.estatisticas.melhorPrecisao).toBe(100);
    expect(r.progress.conquistas).toContain('speed');
  });
  it('modo livre registra resultados sem criar etapas extras', () => {
    const p = freshProgress();
    p.licoesConcluidas = lessons.map((l) => l.id);
    p.nivelAtual = levels.length;
    const r = completeLesson(p, { ...lessons[6], id: 'free' }, result, true);
    expect(r.progress.licoesConcluidas).toHaveLength(lessons.length);
    expect(r.summary.xp).toBe(55);
  });
});
