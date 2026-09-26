import { RotateCcw, Sparkles } from 'lucide-react';
import { achievementInfo } from '../utils/progress';
import { Icon, PrimaryButton, Stat, formatTime } from '../components/ui';
import type { Resumo } from '../types';
export function Results({
  result,
  onNext,
  onRepeat,
  onHome,
  free,
}: {
  result: Resumo;
  onNext: () => void;
  onRepeat: () => void;
  onHome: () => void;
  free: boolean;
}) {
  return (
    <main className="results-page">
      <div className={`result-medal ${result.aprovado ? '' : 'try-again'}`}>
        <Icon name={result.aprovado ? 'award' : 'sparkles'} size={55} />
      </div>
      <p className="eyebrow">
        {result.aprovado ? 'UM NOVO PASSO NA SUA JORNADA' : 'CADA TENTATIVA ENSINA'}
      </p>
      <h1>{result.aprovado ? 'Você mandou muito bem!' : 'Vamos tentar mais uma vez?'}</h1>
      <p>
        {result.aprovado
          ? 'Seu esforço está virando confiança. Continue assim!'
          : 'Sua prática já valeu. Respire, encontre seu ritmo e tente novamente.'}
      </p>
      {result.recorde && (
        <span className="record-badge">
          <Sparkles size={16} />
          Novo recorde pessoal!
        </span>
      )}
      <div className="result-stats">
        <Stat icon="zap" value={result.ppm} label="palavras por minuto" color="orange" />
        <Stat
          icon="target"
          value={`${result.precisao.toFixed(1)}%`}
          label="precisão"
          color="green"
        />
        <Stat icon="flame" value={result.sequencia} label="melhor sequência" color="pink" />
      </div>
      <div className="result-details">
        <span>{result.erros} erros</span>
        <span>{result.corretos} caracteres corretos</span>
        <span>{formatTime(result.segundos)} de prática</span>
        <strong>+{result.xp} XP</strong>
      </div>
      {result.novasConquistas.length > 0 && (
        <div className="new-achievements">
          <h2>Olha só o que você conquistou!</h2>
          {result.novasConquistas.map((id) => {
            const a = achievementInfo.find((a) => a.id === id)!;
            return (
              <span key={id}>
                <Icon name={a.icon} size={19} />
                {a.title}
              </span>
            );
          })}
        </div>
      )}
      <div className="result-actions">
        <button className="secondary-button" onClick={onRepeat}>
          <RotateCcw size={17} />
          Praticar novamente
        </button>
        <PrimaryButton onClick={result.aprovado ? onNext : onRepeat}>
          {result.aprovado ? (free ? 'Mais uma rodada' : 'Continuar jornada') : 'Tentar novamente'}
        </PrimaryButton>
      </div>
      <button className="text-button" onClick={onHome}>
        Voltar ao início
      </button>
    </main>
  );
}
