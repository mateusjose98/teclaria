import { expect, it } from 'vitest';
import { keyHint } from './keyboard';
it('ensina Shift, acentos sequenciais e espaço no ABNT2', () => {
  expect(keyHint(':').keys).toEqual(['Shift', ';']);
  expect(keyHint('A').keys).toEqual(['Shift', 'a']);
  expect(keyHint('ã').keys).toEqual(['~', 'a']);
  expect(keyHint('ô').keys).toEqual(['Shift', '~', 'o']);
  expect(keyHint(' ').keys).toEqual(['Espaço']);
});
