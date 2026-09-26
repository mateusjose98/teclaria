import { useEffect, useRef, useState } from 'react';
import type { Licao, Resultado } from '../types';
import { sound } from '../services/sound';


export interface Bubble {
  id: number;
  text: string;
  x: number;
  y: number;
  position: number;
  error: boolean;
  popped: boolean;
}
interface GameState {
  bubbles: Bubble[];
  lives: number;
  correct: number;
  errors: number;
  streak: number;
  best: number;
  popped: number;
  spawned: number;
  active: number | null;
  seconds: number;
  feedback: string;
}
const fresh = (): GameState => ({
  bubbles: [],
  lives: 3,
  correct: 0,
  errors: 0,
  streak: 0,
  best: 0,
  popped: 0,
  spawned: 0,
  active: null,
  seconds: 0,
  feedback: 'Escolha uma bolha e digite o que está escrito.',
});
export function useBubbleGame(lesson: Licao, onFinish: (r: Resultado) => void, suspended = false) {
  const [state, setState] = useState<GameState>(fresh);
  const [status, setStatus] = useState<'ready' | 'playing' | 'paused' | 'done'>('ready');
  useEffect(() => {
    if (suspended) setStatus((s) => (s === 'playing' ? 'paused' : s));
  }, [suspended]);
  const current = useRef(state),
    finish = useRef(onFinish),
    spawnClock = useRef(0);
  finish.current = onFinish;
  const publish = (s: GameState) => {
    current.current = s;
    setState(s);
  };
  const complete = (s: GameState) => {
    setStatus('done');
    finish.current({
      licaoId: lesson.id,
      corretos: s.correct,
      erros: s.errors,
      segundos: Math.max(0.1, s.seconds),
      sequencia: s.best,
      sucesso: s.lives > 0,
    });
  };
  useEffect(() => {
    const hide = () => {
      if (document.hidden) setStatus((s) => (s === 'playing' ? 'paused' : s));
    };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, []);
  useEffect(() => {
    if (status !== 'playing') return;
    let frame = 0,
      previous = performance.now(),
      renderClock = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      spawnClock.current += dt;
      renderClock += dt;
      const s = current.current;
      const speed = 3.4 + lesson.etapa * 1.1 + s.popped * 0.28;
      let next: GameState = {
        ...s,
        seconds: s.seconds + dt,
        bubbles: s.bubbles.map((b) => ({ ...b, y: b.y + dt * speed })),
      };
      const fallen = next.bubbles.filter((b) => b.y >= 88 && !b.popped);
      next.bubbles = next.bubbles.filter((b) => b.y < 88);
      if (fallen.length) {
        next.lives = Math.max(0, next.lives - fallen.length);
        next.streak = 0;
        next.feedback = 'Uma bolha escapou. Você consegue na próxima!';
        if (fallen.some((b) => b.id === next.active)) next.active = null;
        sound.play('error');
      }
      const max = lesson.etapa === 1 ? 2 : lesson.etapa === 2 ? 3 : 4;
      const interval = lesson.etapa === 1 ? 4 : lesson.etapa === 2 ? 3.7 : 2.8;
      if (
        next.spawned < lesson.exercicios.length &&
        next.bubbles.filter((b) => !b.popped).length < max &&
        (spawnClock.current >= interval || next.bubbles.length === 0)
      ) {
        const id = next.spawned;
        next.bubbles.push({
          id,
          text: lesson.exercicios[id],
          x: 10 + ((id * 29) % 70),
          y: 2,
          position: 0,
          error: false,
          popped: false,
        });
        next.spawned++;
        spawnClock.current = 0;
      }
      current.current = next;
      if (
        next.lives === 0 ||
        (next.spawned === lesson.exercicios.length && next.bubbles.length === 0)
      ) {
        setState(next);
        complete(next);
        return;
      }
      if (renderClock >= 1 / 30) {
        setState(next);
        renderClock = 0;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status, lesson]);
  const input = (text: string) => {
    if (status !== 'playing') return;
    let s = { ...current.current, bubbles: current.current.bubbles.map((b) => ({ ...b })) };
    for (const char of Array.from(text.normalize('NFC'))) {
      let bubble = s.bubbles.find((b) => b.id === s.active && !b.popped);
      bubble ??= s.bubbles
        .filter((b) => !b.popped && b.text[0] === char)
        .sort((a, b) => b.y - a.y)[0];
      if (!bubble || Array.from(bubble.text)[bubble.position] !== char) {
        s.errors++;
        s.streak = 0;
        if (bubble) bubble.error = true;
        s.feedback = 'Quase! Olhe a próxima letra da bolha.';
        sound.play('error');
        continue;
      }
      s.active = bubble.id;
      bubble.position++;
      s.correct++;
      s.feedback = 'Boa! Continue nessa bolha.';
      if (bubble.position === Array.from(bubble.text).length) {
        bubble.popped = true;
        s.popped++;
        s.active = null;
        s.streak = bubble.error ? 0 : s.streak + 1;
        s.best = Math.max(s.best, s.streak);
        s.feedback = 'Pop! Mais uma conquista.';
        sound.play(s.streak > 0 && s.streak % 5 === 0 ? 'streak' : 'pop');
      } else sound.play('correct');
    }
    publish(s);
  };
  // Bolhas estouradas permanecem por um instante para a animação visual.
  useEffect(() => {
    if (!state.bubbles.some((b) => b.popped)) return;
    const timer = window.setTimeout(
      () =>
        publish({ ...current.current, bubbles: current.current.bubbles.filter((b) => !b.popped) }),
      220,
    );
    return () => clearTimeout(timer);
  }, [state.popped]);
  return {
    state,
    status,
    input,
    start: () => setStatus('playing'),
    pause: () => setStatus('paused'),
  };
}
