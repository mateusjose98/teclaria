import { useEffect } from 'react';
import { specialKeys } from '../data/lessons/special-keys';
import { sound } from '../services/sound';

export function SpecialKey({ character, paused }: { character: string; paused: boolean }) {
  const key = specialKeys[character];
  useEffect(() => {
    if (!paused) sound.speak(key.pronunciation);
    return () => sound.stopSpeaking();
  }, [character, paused, key]);
  return (
    <div className="special-key-guide">
      <svg viewBox="0 0 320 120" role="img" aria-label={`Imagem da tecla ${key.name}`}>
        <rect x="10" y="12" width="300" height="100" rx="18" fill="#d9c9ee" />
        <rect
          x="10"
          y="4"
          width="300"
          height="100"
          rx="18"
          fill="#f5efff"
          stroke="#9270d1"
          strokeWidth="3"
        />
        <text x="160" y="51" textAnchor="middle" fontSize="32" fill="#63469e">
          {key.symbol}
        </text>
        <text x="160" y="83" textAnchor="middle" fontSize="20" fill="#63469e">
          {key.name}
        </text>
      </svg>
      <h2>{key.name}</h2>
      <p>{key.description}</p>
      <button
        type="button"
        className="secondary-button"
        disabled={paused}
        onClick={() => sound.speak(key.pronunciation)}
      >
        Ouvir pronúncia de {key.name}
      </button>
      {!sound.canSpeak() && <p>Este navegador não oferece pronúncia por voz.</p>}
      <p>
        Pressione {key.name} no campo abaixo. Esc libera o foco; depois, Tab navega pela página.
      </p>
    </div>
  );
}
