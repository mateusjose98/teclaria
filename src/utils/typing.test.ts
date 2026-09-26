import { describe, expect, it } from 'vitest';
import { initialTyping, typeCharacter } from './typing';
describe('engine de digitação', () => {
  it('mantém posição após erro e conta cada tentativa', () => {
    let s = typeCharacter(initialTyping(), 'x', ['ab']);
    expect(s.position).toBe(0);
    expect(s.errors).toBe(1);
    s = typeCharacter(s, 'a', ['ab']);
    s = typeCharacter(s, 'b', ['ab']);
    expect(s.done).toBe(true);
    expect(s.correct).toBe(2);
    expect(s.streak).toBe(0);
    expect(typeCharacter(s, 'x', ['ab'])).toBe(s);
  });
  it('conta sequência de itens, não de caracteres', () => {
    let s = initialTyping();
    for (const c of 'casasol') s = typeCharacter(s, c, ['casa', 'sol']);
    expect(s.streak).toBe(2);
    expect(s.bestStreak).toBe(2);
    expect(s.correct).toBe(7);
  });
  it('erro interrompe sequência sem apagar o recorde', () => {
    let s = initialTyping();
    for (const c of 'abxc') s = typeCharacter(s, c, ['a', 'b', 'c']);
    expect(s.bestStreak).toBe(2);
    expect(s.streak).toBe(0);
    expect(s.done).toBe(true);
  });
  it('aceita espaços, acentos, cedilha e maiúsculas literalmente', () => {
    let s = initialTyping();
    for (const c of 'A maçã.') s = typeCharacter(s, c, ['A maçã.']);
    expect(s.done).toBe(true);
    expect(s.correct).toBe(7);
    expect(s.errors).toBe(0);
  });
});
