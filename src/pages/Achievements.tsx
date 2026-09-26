import { Lock, Check } from 'lucide-react';
import { achievementInfo } from '../utils/progress';
import { Icon, Stat } from '../components/ui';
import type { ProgressoUsuario } from '../types';
export function Achievements({ progress }: { progress: ProgressoUsuario }) {
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">SEU ESFORÇO MERECE BRILHAR</p>
          <h1>Uma coleção de pequenas vitórias</h1>
          <p>
            {progress.conquistas.length} de {achievementInfo.length} conquistas desbloqueadas. Cada
            uma conta uma parte da sua história.
          </p>
        </div>
      </div>
      <div className="achievement-grid">
        {achievementInfo.map((a, i) => {
          const won = progress.conquistas.includes(a.id);
          return (
            <article key={a.id} className={`achievement-card ${won ? 'won' : ''}`}>
              <div className={`medal ${['purple', 'green', 'orange', 'blue', 'pink'][i]}`}>
                <Icon name={a.icon} size={42} />
              </div>
              <h2>{a.title}</h2>
              <p>{a.description}</p>
              <span className="achievement-status">
                {won ? (
                  <>
                    <Check size={15} />
                    Conquistada!
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Ainda vamos chegar lá
                  </>
                )}
              </span>
            </article>
          );
        })}
      </div>
      <h2 className="records-title">Seus recordes pessoais</h2>
      <div className="record-grid">
        <Stat
          icon="zap"
          value={progress.estatisticas.melhorPpm}
          label="palavras por minuto"
          color="orange"
        />
        <Stat
          icon="target"
          value={`${progress.estatisticas.melhorPrecisao.toFixed(1)}%`}
          label="melhor precisão"
          color="green"
        />
        <Stat icon="flame" value={progress.maiorSequencia} label="itens sem erro" color="pink" />
      </div>
    </main>
  );
}
