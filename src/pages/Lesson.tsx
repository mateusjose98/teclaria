import { Pause, ArrowLeft, Play, Target, Flame, Clock3, Zap } from 'lucide-react';
import { useTypingExercise } from '../hooks/useTypingExercise';
import { Keyboard } from '../components/Keyboard';
import { TypingInput } from '../components/TypingInput';
import { ProgressBar, formatTime } from '../components/ui';
import { accuracy, ppm } from '../utils/progress';
import type { Licao, Resultado } from '../types';
export function Lesson({
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
  const engine = useTypingExercise(lesson, onFinish, suspended);
  const { state, seconds, paused } = engine;
  const text = lesson.exercicios[Math.min(state.index, lesson.exercicios.length - 1)];
  return (
    <main className="exercise-shell">
      <div className="exercise-heading">
        <button className="text-button" onClick={onExit}>
          <ArrowLeft size={18} />
          Sair da etapa
        </button>
        <span>
          NÍVEL {lesson.nivel} <span className="dot">·</span> ETAPA {lesson.etapa} DE 3
        </span>
        <button className="text-button" onClick={engine.pause}>
          <Pause size={17} />
          Pausar
        </button>
      </div>
      <ProgressBar
        value={(state.index / lesson.exercicios.length) * 100}
        label="Progresso da etapa"
      />
      <div className="exercise-title">
        <h1>{lesson.titulo}</h1>
        <p>{lesson.descricao}</p>
      </div>
      <div className="exercise-stats">
        <span>
          <Target size={17} />
          <b>{accuracy(state.correct, state.errors).toFixed(0)}%</b> precisão
        </span>
        <span>
          <Flame size={17} />
          <b>{state.streak}</b> em sequência
        </span>
        {lesson.nivel >= 2 && (
          <>
            <span>
              <Clock3 size={17} />
              {formatTime(seconds)}
            </span>
            <span>
              <Zap size={17} />
              {ppm(state.correct, seconds)} PPM
            </span>
            <span>{state.errors} erros</span>
          </>
        )}
        <span>
          {Math.min(state.index + 1, lesson.exercicios.length)} / {lesson.exercicios.length}{' '}
          {lesson.nivel === 2 ? 'palavras' : 'itens'}
        </span>
      </div>
      <section
        className={`typing-card ${lesson.nivel === 0 ? 'beginner' : ''}`}
        aria-label="Exercício de digitação"
      >
        <p className="eyebrow">
          {lesson.nivel === 0 ? 'VAMOS ENCONTRAR ESTA TECLA' : 'DIGITE O CONTEÚDO ABAIXO'}
        </p>
        <div
          className={`target-text ${lesson.nivel === 0 ? 'single-character' : ''}`}
          aria-label={text}
        >
          {Array.from(text).map((c, i) => (
            <span
              key={`${state.index}-${i}`}
              className={
                i < state.position ? 'typed' : i === state.position ? 'current-character' : ''
              }
            >
              {c === ' ' && i === state.position ? '␣' : c}
            </span>
          ))}
        </div>
        <TypingInput onInput={engine.input} disabled={paused} />
        <p
          className={`feedback ${state.feedback.startsWith('Quase') ? 'gentle-error' : ''}`}
          aria-live="polite"
        >
          {state.feedback || 'No seu tempo. Cada toque é um novo passo.'}
        </p>
      </section>
      {lesson.nivel === 0 ? (
        <Keyboard character={Array.from(text)[state.position] ?? ''} />
      ) : (
        <p className="exercise-tip">
          Mantenha os ombros relaxados e os dedos próximos ao teclado. Você está indo bem!
        </p>
      )}
      {paused && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pause-title"
            onKeyDown={(e) => {
              if (e.key === 'Tab') e.preventDefault();
              if (e.key === 'Escape') engine.resume();
            }}
          >
            <span className="icon-box purple">
              <Pause />
            </span>
            <h2 id="pause-title">Uma pausa faz bem.</h2>
            <p>Seu tempo está pausado. Continue quando estiver pronto.</p>
            <button autoFocus className="primary-button" onClick={engine.resume}>
              <Play size={18} />
              Continuar exercício
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
