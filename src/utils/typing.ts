export interface TypingState {
  index: number;
  position: number;
  correct: number;
  errors: number;
  streak: number;
  bestStreak: number;
  itemError: boolean;
  feedback: string;
  done: boolean;
}
export const initialTyping = (): TypingState => ({
  index: 0,
  position: 0,
  correct: 0,
  errors: 0,
  streak: 0,
  bestStreak: 0,
  itemError: false,
  feedback: '',
  done: false,
});
export function typeCharacter(state: TypingState, char: string, items: string[]): TypingState {
  if (state.done) return state;
  const target = Array.from(items[state.index]);
  if (char !== target[state.position])
    return {
      ...state,
      errors: state.errors + 1,
      streak: 0,
      itemError: true,
      feedback: 'Quase! Tente novamente.',
    };
  const next = {
    ...state,
    correct: state.correct + 1,
    position: state.position + 1,
    feedback: 'Muito bem! Continue assim.',
  };
  if (next.position === target.length) {
    next.streak = state.itemError ? 0 : state.streak + 1;
    next.bestStreak = Math.max(state.bestStreak, next.streak);
    next.index++;
    next.position = 0;
    next.itemError = false;
    next.done = next.index === items.length;
  }
  return next;
}
