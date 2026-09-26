import { Check, Lock, Play } from 'lucide-react';
import { lessons, levels } from '../data/lessons';
import { canPlay, isPreviewUser } from '../utils/progress';
import { Icon, Stars } from '../components/ui';
import type { Licao, ProgressoUsuario } from '../types';
export function Levels({
  progress,
  onStart,
  onFree,
}: {
  progress: ProgressoUsuario;
  onStart: (l: Licao) => void;
  onFree: () => void;
}) {
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CADA ETAPA É UMA NOVA DESCOBERTA</p>
          <h1>Sua jornada pelo teclado</h1>
          <p>Comece com calma. Complete as três etapas para liberar o próximo nível.</p>
        </div>
      </div>
      <div className="levels-list">
        {levels.map((level, i) => (
          <section
            className={`level-detail ${i > progress.nivelAtual && !isPreviewUser(progress) ? 'locked' : ''}`}
            key={level.title}
          >
            <div className="level-detail-header">
              <span className={`icon-box ${level.color}`}>
                <Icon name={level.icon} />
              </span>
              <div>
                <p className="eyebrow">NÍVEL {i}</p>
                <h2>{level.title}</h2>
              </div>
              <Stars
                count={
                  progress.licoesConcluidas.filter((id) =>
                    lessons.some((l) => l.id === id && l.nivel === i),
                  ).length
                }
              />
            </div>
            <div className="stage-grid">
              {lessons
                .filter((l) => l.nivel === i)
                .map((l) => {
                  const done = progress.licoesConcluidas.includes(l.id),
                    allowed = canPlay(l, progress);
                  return (
                    <button
                      className="stage"
                      key={l.id}
                      disabled={!allowed}
                      onClick={() => onStart(l)}
                    >
                      <span className={`stage-number ${done ? 'done' : ''}`}>
                        {done ? <Check size={18} /> : allowed ? l.etapa : <Lock size={16} />}
                      </span>
                      <span>
                        <small>ETAPA {l.etapa}</small>
                        <strong>{l.titulo}</strong>
                        <small>
                          {done
                            ? 'Concluída · Praticar novamente'
                            : allowed
                              ? `${l.recompensaXp} XP · Começar`
                              : 'Conclua a etapa anterior'}
                        </small>
                      </span>
                      {allowed && <Play size={16} />}
                    </button>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
      <button
        disabled={progress.nivelAtual < levels.length}
        className="free-banner"
        onClick={onFree}
      >
        <Icon name="sparkles" />
        <div>
          <h2>Modo Livre</h2>
          <p>
            {progress.nivelAtual < levels.length
              ? 'Conclua todos os níveis para praticar sem limites.'
              : 'Sua jornada continua. Pratique do seu jeito!'}
          </p>
        </div>
        {progress.nivelAtual < levels.length ? <Lock /> : <Play />}
      </button>
    </main>
  );
}
