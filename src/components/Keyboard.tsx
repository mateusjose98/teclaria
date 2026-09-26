import { keyHint } from '../utils/keyboard';
const rows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '´', '['],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç', '~', ']'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', ';', '/', 'Shift'],
  ['Espaço'],
];
export function Keyboard({ character }: { character: string }) {
  const hint = keyHint(character);
  return (
    <div className="keyboard-wrap">
      <p className="key-instruction">
        <span className="hint-dot" />
        {hint.text}
      </p>
      <div className="keyboard" role="img" aria-label={`Teclado brasileiro ABNT2. ${hint.text}`}>
        {rows.map((row, i) => (
          <div className="key-row" key={i}>
            {row.map((key, j) => (
              <span
                key={`${key}-${j}`}
                className={`key ${hint.keys.includes(key) ? 'key-active' : ''} ${key === 'Espaço' ? 'space' : key === 'Shift' ? 'shift' : ''}`}
              >
                {key}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="keyboard-note">
        Referência: português brasileiro (ABNT2). As combinações podem variar em outros teclados.
      </p>
    </div>
  );
}
