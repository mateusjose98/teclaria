import { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { completeLesson, freshProgress } from '../utils/progress';
import type { Licao, ProgressoUsuario, Resultado } from '../types';
export function useProgress() {
  const [initial] = useState(() => storage.load());
  const [progress, setProgress] = useState(initial.progress);
  const [saved, setSaved] = useState(initial.available);
  useEffect(() => sound.setEnabled(progress.configuracoes.som), [progress.configuracoes.som]);
  const update = (p: ProgressoUsuario) => {
    setProgress(p);
    setSaved(storage.save(p));
  };
  const finish = (l: Licao, r: Resultado, free: boolean) => {
    const result = completeLesson(progress, l, r, free);
    update(result.progress);
    sound.play(
      !result.summary.aprovado
        ? 'error'
        : result.summary.novasConquistas.length
          ? 'achievement'
          : result.summary.recorde
            ? 'record'
            : 'complete',
    );
    return result.summary;
  };
  const reset = () => {
    if (!storage.clear()) {
      setSaved(false);
      return false;
    }
    setProgress(freshProgress());
    setSaved(true);
    return true;
  };
  return { progress, saved, update, finish, reset };
}
