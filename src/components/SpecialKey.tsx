import { useEffect } from 'react';
import { specialKeys } from '../data/lessons/special-keys';
import { sound } from '../services/sound';
import { KeyIllustration, KeyLocation } from './KeyIllustration';

export function SpecialKey({ character, paused }: { character: string; paused: boolean }) {
  const key = specialKeys[character];
  useEffect(() => {
    if (!paused) sound.speak(key.pronunciation);
    return () => sound.stopSpeaking();
  }, [character, paused, key]);
  return (
    <div className="special-key-guide">
      <KeyIllustration name={key.name} />
      <h2>{key.name}</h2>
      <p>{key.description}</p>
      <KeyLocation name={key.name} />
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
