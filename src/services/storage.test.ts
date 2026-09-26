import { afterEach, describe, expect, it, vi } from 'vitest';
import { restore, storage, STORAGE_KEY } from './storage';
import { freshProgress } from '../utils/progress';
import { lessons } from '../data/lessons';
afterEach(() => vi.unstubAllGlobals());
describe('persistência local', () => {
  it('restaura a jornada completa incluindo parágrafos e rejeita saltos avançados', () => {
    const p = restore(JSON.stringify({ licoesConcluidas: lessons.map((l) => l.id) }));
    expect(p.licoesConcluidas).toEqual(lessons.map((l) => l.id));
    expect(restore(JSON.stringify({ licoesConcluidas: ['advanced-1'] })).licoesConcluidas).toEqual(
      [],
    );
  });
  it('preserva etapas antigas ao inserir o nível de teclas especiais', () => {
    const ids = ['0-1', '0-2', '0-3', '1-1', '1-2'];
    const restored = restore(JSON.stringify({ licoesConcluidas: ids }));
    expect(restored.licoesConcluidas).toEqual(ids);
    expect(restored.nivelAtual).toBe(1);
    expect(restore(JSON.stringify(restored))).toEqual(restored);
  });
  it('recupera dados e preferência de som', () => {
    const p = {
      ...freshProgress(),
      nome: 'José',
      xp: 150,
      licoesConcluidas: ['0-1'],
      configuracoes: { som: false },
    };
    expect(restore(JSON.stringify(p))).toEqual(p);
  });
  it('recupera com segurança JSON corrompido e estruturas inválidas', () => {
    for (const raw of ['{oops', 'null', '[]', '42']) expect(restore(raw)).toEqual(freshProgress());
  });
  it('valida números, texto, conquistas e ordem das etapas', () => {
    const p = restore(
      JSON.stringify({
        nome: 24,
        xp: -100,
        nivelAtual: 5,
        licoesConcluidas: ['0-2', 'bad'],
        conquistas: ['bad'],
        configuracoes: { som: 'yes' },
        estatisticas: { melhorPrecisao: 500 },
      }),
    );
    expect(p.nome).toBe('');
    expect(p.xp).toBe(0);
    expect(p.nivelAtual).toBe(0);
    expect(p.licoesConcluidas).toEqual([]);
    expect(p.conquistas).toEqual([]);
    expect(p.estatisticas.melhorPrecisao).toBe(100);
    expect(p.configuracoes.som).toBe(true);
  });
  it('salva, reabre e remove somente a chave da aplicação', () => {
    const values = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => values.get(k) ?? null,
        setItem: (k: string, v: string) => values.set(k, v),
        removeItem: (k: string) => values.delete(k),
      },
    });
    values.set('outro-app', 'manter');
    const p = { ...freshProgress(), nome: 'Ana' };
    expect(storage.save(p)).toBe(true);
    expect(values.has(STORAGE_KEY)).toBe(true);
    expect(storage.load().progress.nome).toBe('Ana');
    expect(storage.clear()).toBe(true);
    expect(values.get('outro-app')).toBe('manter');
    expect(storage.load().progress.nome).toBe('');
  });
  it('expõe indisponibilidade e quota excedida sem derrubar o app', () => {
    vi.stubGlobal('window', {
      get localStorage() {
        throw new Error('blocked');
      },
    });
    expect(storage.load().available).toBe(false);
    expect(storage.save(freshProgress())).toBe(false);
    expect(storage.clear()).toBe(false);
  });
});
