// Draw the printed arrows as paths so their shape does not depend on installed fonts.
function Arrow({ name }: { name: string }) {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'Enter' && <path d="M 150 57 V 87 H 104 M 113 78 L 104 87 L 113 96" />}
      {name === 'Backspace' && <path d="M 125 66 H 65 M 77 54 L 65 66 L 77 78" />}
      {name === 'Tab' && (
        <>
          <path d="M 62 55 H 125 M 115 45 L 125 55 L 115 65 M 130 44 V 66" />
          <path d="M 125 82 H 62 M 72 72 L 62 82 L 72 92 M 57 71 V 93" />
        </>
      )}
    </g>
  );
}

export function KeyIllustration({ name }: { name: string }) {
  const enter = name === 'Enter';
  return (
    <figure className="physical-key">
      <svg
        viewBox={
          enter
            ? '0 0 440 146'
            : name === 'Espaço'
              ? '0 0 440 118'
              : name === 'Ctrl'
                ? '0 0 140 118'
                : '0 0 220 118'
        }
        role="img"
        aria-label={`Imagem da tecla ${name}`}
      >
        <g fill="#353942" stroke="#151820" strokeWidth="2">
          {enter ? (
            <>
              <path d="M 22 5 H 177 Q 187 5 187 15 V 129 Q 187 139 177 139 H 90 Q 80 139 80 129 V 65 H 22 Q 12 65 12 55 V 15 Q 12 5 22 5 Z" />
              <rect x="240" y="30" width="188" height="88" rx="9" />
            </>
          ) : (
            <rect
              x="8"
              y={name === 'Espaço' ? 26 : 5}
              width={name === 'Espaço' ? 424 : name === 'Ctrl' ? 124 : 204}
              height={name === 'Espaço' ? 65 : 105}
              rx="10"
            />
          )}
        </g>
        <g fill="#f5f6f8" fontFamily="Arial, sans-serif" fontSize="21" style={{ color: '#f5f6f8' }}>
          <text x={enter ? 96 : 24} y="36">
            {name === 'Espaço' ? '' : name}
          </text>
          <Arrow name={name} />
          {enter && (
            <g transform="translate(225 10)">
              <text x="30" y="34">
                Enter
              </text>
              <Arrow name="Enter" />
            </g>
          )}
        </g>
      </svg>
      <figcaption>
        {enter
          ? 'Enter pode ser alto, em formato de L, ou retangular.'
          : name === 'Espaço'
            ? 'A barra de espaço costuma ser comprida e sem inscrição.'
            : name === 'Tab'
              ? 'Tab costuma ter duas setas em sentidos opostos.'
              : name === 'Backspace'
                ? 'Backspace costuma ter uma seta para a esquerda, com ou sem o nome.'
                : 'Procure Ctrl nos cantos inferiores do teclado.'}
      </figcaption>
    </figure>
  );
}

const rows = [
  ['"', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '´', '['],
  ['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç', '~', ']'],
  ['Shift', '\\', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', ';', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Espaço', 'Alt Gr', 'Menu', 'Ctrl'],
];
export function KeyLocation({ name }: { name: string }) {
  return (
    <div
      className="key-location"
      role="img"
      aria-label={`Localização de ${name} no teclado: tecla destacada em roxo`}
    >
      <div className="physical-keyboard">
        {rows.map((row, i) => (
          <div className={`physical-row physical-row-${i}`} key={i}>
            {row.map((label, j) => (
              <span
                key={j}
                className={`physical-small-key ${label === name ? 'highlighted-key' : ''} ${label.length > 1 ? 'wide-key' : ''} ${label === 'Espaço' ? 'space-key' : ''}`}
              >
                {label === 'Espaço' ? '' : label}
              </span>
            ))}
          </div>
        ))}
        <span className={`physical-enter ${name === 'Enter' ? 'highlighted-key' : ''}`}>Enter</span>
      </div>
      <p>Encontre a tecla destacada. A posição e a aparência podem variar conforme o teclado.</p>
    </div>
  );
}
