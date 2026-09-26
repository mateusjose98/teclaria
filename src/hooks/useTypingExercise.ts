import { useEffect, useRef, useState } from 'react';
import type { Licao, Resultado } from '../types';
import { initialTyping, typeCharacter } from '../utils/typing';
import { sound } from '../services/sound';
export function useTypingExercise(
  lesson: Licao,
  onFinish: (r: Resultado) => void,
  suspended = false,
) {
  const [state, setState] = useState(initialTyping);
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = useRef(state),
    elapsed = useRef(0),
    started = useRef(false),
    last = useRef(0),
    done = useRef(false);
  const pause = () => {
    if (last.current && started.current)
      elapsed.current += (performance.now() - last.current) / 1000;
    setPaused(true);
    last.current = 0;
  };
  useEffect(() => {
    if (suspended) pause();
  }, [suspended]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) pause();
    };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, []);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      if (!started.current || done.current) return;
      const now = performance.now();
      if (last.current) elapsed.current += (now - last.current) / 1000;
      last.current = now;
      setSeconds(elapsed.current);
    }, 100);
    return () => window.clearInterval(timer);
  }, [paused]);
  const input = (text: string) => {
    if (paused || done.current) return;
    if (!started.current) {
      started.current = true;
      last.current = performance.now();
    }
    let next = current.current;
    for (const char of Array.from(text.normalize('NFC'))) {
      const before = next;
      next = typeCharacter(next, char, lesson.exercicios);
      sound.play(next.errors > before.errors ? 'error' : 'correct');
      if (next.streak > before.streak && next.streak % 5 === 0) sound.play('streak');
      if (next.done) break;
    }
    current.current = next;
    setState(next);
    if (next.done) {
      done.current = true;
      if (last.current) elapsed.current += (performance.now() - last.current) / 1000;
      onFinish({
        licaoId: lesson.id,
        corretos: next.correct,
        erros: next.errors,
        segundos: Math.max(0.1, elapsed.current),
        sequencia: next.bestStreak,
        sucesso: true,
      });
    }
  };
  return {
    state,
    seconds,
    paused,
    pause,
    resume: () => {
      last.current = performance.now();
      setPaused(false);
    },
    input,
  };
}
