import { freshProgress, unlockedLevel, achievementInfo } from '../utils/progress';
import { lessons } from '../data/lessons';
import type { ProgressoUsuario } from '../types';
export const STORAGE_KEY = 'teclaria.progress.v1';
const finite = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : 0);
export function restore(raw: string | null): ProgressoUsuario {
  const p = freshProgress();
  if (!raw) return p;
  try {
    const d = JSON.parse(raw);
    if (!d || typeof d !== 'object') return p;
    p.nome = typeof d.nome === 'string' ? d.nome.trim().slice(0, 30) : '';
    const ids = Array.isArray(d.licoesConcluidas) ? d.licoesConcluidas : [];
    for (const l of lessons) {
      if (ids.includes(l.id)) p.licoesConcluidas.push(l.id);
      else break;
    }
    p.nivelAtual = unlockedLevel(p.licoesConcluidas);
    p.xp = finite(d.xp);
    p.maiorSequencia = finite(d.maiorSequencia);
    p.conquistas = achievementInfo
      .filter((a) => Array.isArray(d.conquistas) && d.conquistas.includes(a.id))
      .map((a) => a.id);
    p.configuracoes.som = typeof d.configuracoes?.som === 'boolean' ? d.configuracoes.som : true;
    for (const k of Object.keys(p.estatisticas) as (keyof typeof p.estatisticas)[])
      p.estatisticas[k] = finite(d.estatisticas?.[k]);
    p.estatisticas.melhorPrecisao = Math.min(100, p.estatisticas.melhorPrecisao);
    return p;
  } catch {
    return p;
  }
}
export const storage = {
  load(): { progress: ProgressoUsuario; available: boolean } {
    try {
      return { progress: restore(window.localStorage.getItem(STORAGE_KEY)), available: true };
    } catch {
      return { progress: freshProgress(), available: false };
    }
  },
  save(p: ProgressoUsuario): boolean {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      return true;
    } catch {
      return false;
    }
  },
  clear(): boolean {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  },
};
