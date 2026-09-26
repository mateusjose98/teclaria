export type SoundName =
  'correct' | 'error' | 'complete' | 'achievement' | 'record' | 'pop' | 'streak';
const tones: Record<SoundName, number[]> = {
  correct: [620],
  error: [220, 180],
  complete: [523, 659, 784],
  achievement: [659, 784, 1046],
  record: [784, 988, 1175],
  pop: [850, 420],
  streak: [660, 880],
};
let context: AudioContext | undefined;
let enabled = true;
export const sound = {
  setEnabled(value: boolean) {
    enabled = value;
    if (!value) sound.stopSpeaking();
  },
  canSpeak() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },
  stopSpeaking() {
    if (sound.canSpeak()) window.speechSynthesis.cancel();
  },
  speak(text: string) {
    if (!enabled || !sound.canSpeak()) return;
    sound.stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang === 'pt-BR');
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  },
  play(name: SoundName) {
    if (!enabled) return;
    try {
      context ??= new AudioContext();
      const ctx = context;
      void ctx.resume().catch(() => undefined);
      tones[name].forEach((frequency, i) => {
        const oscillator = ctx.createOscillator(),
          gain = ctx.createGain(),
          start = ctx.currentTime + i * 0.085;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.035, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.1);
        oscillator.onended = () => {
          oscillator.disconnect();
          gain.disconnect();
        };
      });
    } catch {
      /* Áudio é opcional. */
    }
  },
};
