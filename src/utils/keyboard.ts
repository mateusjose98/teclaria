export function keyHint(char: string): { keys: string[]; text: string } {
  const shifted: Record<string, string> = {
    '!': '1',
    '@': '2',
    '#': '3',
    $: '4',
    '%': '5',
    '¨': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    _: '-',
    '+': '=',
    ':': ';',
    '?': '/',
  };
  if (shifted[char])
    return { keys: ['Shift', shifted[char]], text: `Segure Shift + ${shifted[char]}` };
  const accents: Record<string, [string, string, boolean]> = {
    á: ['´', 'a', false],
    é: ['´', 'e', false],
    í: ['´', 'i', false],
    ó: ['´', 'o', false],
    ú: ['´', 'u', false],
    ã: ['~', 'a', false],
    õ: ['~', 'o', false],
    â: ['~', 'a', true],
    ê: ['~', 'e', true],
    ô: ['~', 'o', true],
    à: ['´', 'a', true],
  };
  if (accents[char]) {
    const [a, l, shift] = accents[char];
    return {
      keys: [...(shift ? ['Shift'] : []), a, l],
      text: `${shift ? 'Segure Shift +' : 'Toque em'} ${a}, solte e depois digite ${l}`,
    };
  }
  if (char === ' ') return { keys: ['Espaço'], text: 'Toque na barra de espaço' };
  if (char !== char.toLowerCase())
    return { keys: ['Shift', char.toLowerCase()], text: `Segure Shift + ${char}` };
  return { keys: [char], text: `Encontre a tecla ${char.toUpperCase()}` };
}
