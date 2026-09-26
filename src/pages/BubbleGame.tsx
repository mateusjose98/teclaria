import { ArrowLeft, Heart, Pause, Play } from 'lucide-react';
import { useBubbleGame } from '../hooks/useBubbleGame';
import { TypingInput } from '../components/TypingInput';
import { formatTime } from '../components/ui';
import { accuracy } from '../utils/progress';
import type { Licao, Resultado } from '../types';
export function BubbleGame({
  lesson,
  onFinish,
  onExit,
  suspended = false,
}: {
  lesson: Licao;
  onFinish: (r: Resultado) => void;
  onExit: () => void;
  suspended?: boolean;
}) {
  const { state, status, input, start, pause } = useBubbleGame(lesson, onFinish, suspended);
  return (
    <main className="exercise-shell bubble-shell">
      <div className="exercise-heading">
        <button className="text-button" onClick={onExit}>
          <ArrowLeft size={18} />
          Sair da etapa
        </button>
        <span>NÍVEL 3 · ETAPA {lesson.etapa} DE 3</span>
        <button className="text-button" onClick={pause} disabled={status !== 'playing'}>
          <Pause size={17} />
          Pausar
        </button>
      </div>
      <div className="exercise-title">
        <h1>{lesson.titulo}</h1>
        <p>{lesson.descricao}</p>
      </div>
      <div className="game-stats">
        <span className="lives" aria-label={`${state.lives} vidas restantes`}>
          {[1, 2, 3].map((n) => (
            <Heart
              key={n}
              size={23}
              fill={n <= state.lives ? 'currentColor' : 'none'}
              className={n <= state.lives ? '' : 'lost'}
            />
          ))}
        </span>
        <span>
          <b>{state.popped * 10}</b> pontos
        </span>
        <span>
          {state.popped} / {lesson.exercicios.length} bolhas
        </span>
        <span>{accuracy(state.correct, state.errors).toFixed(0)}% precisão</span>
        <span>{state.streak} em sequência</span>
        <span>{formatTime(state.seconds)}</span>
      </div>
      <div className="game-area" aria-label="Área do jogo de bolhas">
        {state.bubbles.map((b) => (
          <div
            key={b.id}
            className={`bubble bubble-${b.id % 4} ${state.active === b.id ? 'active-bubble' : ''} ${b.popped ? 'popped' : ''}`}
            style={{ left: `${b.x}%`, top: `calc(${(b.y / 88) * 100}% - ${(b.y / 88) * 75}px)` }}
          >
            <span>
              {Array.from(b.text).map((c, i) => (
                <span key={i} className={i < b.position ? 'bubble-typed' : ''}>
                  {c}
                </span>
              ))}
            </span>
            {state.active === b.id && <small>digitando</small>}
          </div>
        ))}
        <div className="game-ground" />
        {status !== 'playing' && (
          <div className="game-overlay">
            <span className="game-decoration">✦</span>
            <h2>
              {status === 'ready' ? 'Vamos estourar umas bolhas?' : 'Respire. O jogo está pausado.'}
            </h2>
            <p>
              Digite a primeira letra para escolher uma bolha.
              <br />
              Complete a palavra antes que ela chegue ao chão.
            </p>
            <button className="primary-button" autoFocus onClick={start}>
              <Play size={18} />
              {status === 'ready' ? 'Começar jogo' : 'Continuar jogo'}
            </button>
          </div>
        )}
      </div>
      <TypingInput
        onInput={input}
        disabled={status !== 'playing'}
        onBlur={() => {
          if (status === 'playing') pause();
        }}
      />
      <p className="feedback" aria-live="polite">
        {state.feedback}
      </p>
    </main>
  );
}
