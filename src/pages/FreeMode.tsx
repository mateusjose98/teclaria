import { lessons } from '../data/lessons';
import { Icon } from '../components/ui';
import { TipoLicao, type Licao } from '../types';
export function FreeMode({ onStart }: { onStart: (l: Licao) => void }) {
  const modes = [
    {
      title: 'Palavras',
      description: 'Uma palavra, uma descoberta. Encontre seu ritmo.',
      type: TipoLicao.PALAVRAS,
      icon: 'text',
      color: 'green',
    },
    {
      title: 'Frases',
      description: 'Dê vida a pequenas histórias com suas próprias mãos.',
      type: TipoLicao.FRASES,
      icon: 'book',
      color: 'purple',
    },
    {
      title: 'Bolhas',
      description: 'Pratique brincando e faça seus recordes flutuarem.',
      type: TipoLicao.BOLHAS,
      icon: 'bubbles',
      color: 'blue',
    },
  ];
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">SEU TECLADO, SUAS POSSIBILIDADES</p>
          <h1>Pratique no seu ritmo</h1>
          <p>Escolha um modo. Ao terminar, comece outra rodada quantas vezes quiser.</p>
        </div>
      </div>
      <div className="free-grid">
        {modes.map((m) => (
          <button
            key={m.title}
            className="free-card"
            onClick={() => {
              const source = lessons.filter((l) => l.tipo === m.type);
              const pool = source.flatMap((l) => l.exercicios);
              const shuffled = [...pool];
              for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
              }
              onStart({
                ...source[0],
                id: `free-${m.type}`,
                titulo: `Modo Livre · ${m.title}`,
                exercicios: shuffled.slice(0, m.type === TipoLicao.FRASES ? 3 : 20),
                etapa: m.type === TipoLicao.BOLHAS ? 3 : 1,
              });
            }}
          >
            <span className={`icon-box ${m.color}`}>
              <Icon name={m.icon} size={32} />
            </span>
            <h2>{m.title}</h2>
            <p>{m.description}</p>
            <span className="purple-text">Começar a praticar →</span>
          </button>
        ))}
      </div>
    </main>
  );
}
