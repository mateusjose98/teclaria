import { ArrowRight, Check, ChevronRight, Clock3, Lightbulb, Lock, Sparkles } from 'lucide-react';
import { levels, lessons } from '../data/lessons';
import { nextLesson } from '../utils/progress';
import { Icon, PrimaryButton, ProgressBar, Stars, Stat } from '../components/ui';
import { Mascot } from '../components/Mascot';
import type { Licao, ProgressoUsuario } from '../types';
export function Home({
  progress,
  onStart,
  onLevels,
  onFree,
  onAchievements,
}: {
  progress: ProgressoUsuario;
  onStart: (l: Licao) => void;
  onLevels: () => void;
  onFree: () => void;
  onAchievements: () => void;
}) {
  const next = nextLesson(progress),
    level = levels[next.nivel],
    count = progress.licoesConcluidas.length;
  return (
    <main className="dashboard">
      <div className="page-heading">
        <div>
          <div className="eyebrow greeting">SEU PRÓXIMO PASSO COMEÇA AQUI</div>
          <h1>
            {count ? 'Bem-vindo de volta' : 'Olá'}, {progress.nome}! <span className="wave">✺</span>
          </h1>
          <p>Um toque de cada vez. Você vai mais longe do que imagina.</p>
        </div>
        <span className="little-label">
          <span />
          NO SEU RITMO
        </span>
      </div>
      <div className="home-grid">
        <section className="hero-card">
          <div className="hero-copy">
            <span className="hero-tag">
              <Sparkles size={14} />
              {count === lessons.length ? 'JORNADA COMPLETA' : 'SUA JORNADA CONTINUA'}
            </span>
            <p className="hero-level">
              {count === lessons.length ? 'O teclado é todo seu' : 'NÍVEL ' + next.nivel}
            </p>
            <h2>{count === lessons.length ? 'Olá, mestre do teclado!' : level.title}</h2>
            <p>
              {count === lessons.length
                ? 'Explore o modo livre e descubra novos recordes.'
                : level.subtitle + '. Vamos praticar?'}
            </p>
            <div className="hero-progress">
              <Stars
                count={
                  progress.licoesConcluidas.filter((id) =>
                    lessons.some((l) => l.id === id && l.nivel === next.nivel),
                  ).length
                }
              />
              <span>
                {
                  progress.licoesConcluidas.filter((id) =>
                    lessons.some((l) => l.id === id && l.nivel === next.nivel),
                  ).length
                }{' '}
                de 3 etapas concluídas
              </span>
            </div>
            <PrimaryButton onClick={() => (count === lessons.length ? onFree() : onStart(next))}>
              {count === lessons.length
                ? 'Explorar modo livre'
                : count
                  ? 'Continuar treinamento'
                  : 'Começar treinamento'}
            </PrimaryButton>
            <div className="hero-footnote">
              <Clock3 size={14} />
              Um pouquinho por dia faz a diferença.
            </div>
          </div>
          <Mascot />
        </section>
        <aside className="journey-summary">
          <div className="section-kicker">
            <span className="icon-box small orange">
              <Icon name="zap" size={18} />
            </span>
            <h2>Cada toque conta</h2>
          </div>
          <Stat
            icon="zap"
            value={progress.xp.toLocaleString('pt-BR')}
            label="XP conquistados"
            color="orange"
          />
          <Stat
            icon="flame"
            value={progress.maiorSequencia}
            label="melhor sequência"
            color="pink"
          />
          <Stat
            icon="target"
            value={`${progress.estatisticas.melhorPrecisao.toFixed(0)}%`}
            label="melhor precisão"
            color="green"
          />
          <div className="summary-bottom">
            <span>Seu progresso</span>
            <b>
              {count} / {lessons.length} etapas
            </b>
          </div>
          <ProgressBar value={(count / lessons.length) * 100} label="Progresso total" />
        </aside>
      </div>
      <div className="section-heading">
        <div>
          <h2>
            Uma jornada, muitas descobertas <span>✦</span>
          </h2>
          <p>{levels.length} níveis para ganhar confiança no teclado.</p>
        </div>
        <button className="text-button purple-text" onClick={onLevels}>
          Ver todos os níveis <ArrowRight size={17} />
        </button>
      </div>
      <div className="level-grid">
        {levels.map((l, i) => {
          const completed = progress.licoesConcluidas.filter((id) =>
              lessons.some((l) => l.id === id && l.nivel === i),
            ).length,
            locked = i > progress.nivelAtual;
          return (
            <button
              key={l.title}
              className={`level-card ${locked ? 'locked' : ''} ${i === progress.nivelAtual ? 'current-level' : ''}`}
              disabled={locked}
              onClick={() =>
                onStart(
                  lessons.find((x) => x.nivel === i && !progress.licoesConcluidas.includes(x.id)) ??
                    lessons[i * 3],
                )
              }
            >
              <div className="level-card-top">
                <span className={`icon-box ${l.color}`}>
                  <Icon name={l.icon} size={27} />
                </span>
                {locked ? (
                  <Lock size={15} />
                ) : completed === 3 ? (
                  <Check size={18} className="green-text" />
                ) : (
                  <span className="available-dot" />
                )}
              </div>
              <span className="eyebrow">NÍVEL {i}</span>
              <h3>{l.title}</h3>
              <Stars count={completed} />
              <div className="level-card-bottom">
                {locked
                  ? 'Em breve na sua jornada'
                  : completed === 3
                    ? 'Concluído'
                    : i === progress.nivelAtual
                      ? 'Você está aqui'
                      : 'Vamos começar'}
                {!locked && <ChevronRight size={16} />}
              </div>
            </button>
          );
        })}
      </div>
      <div className="home-bottom">
        <div className="tip-card">
          <span className="icon-box orange">
            <Lightbulb size={25} />
          </span>
          <div>
            <h3>O segredo? Um pouquinho todo dia.</h3>
            <p>5 minutos de prática já são um ótimo começo. A precisão vem antes da velocidade!</p>
          </div>
        </div>
        <button className="achievement-link" onClick={onAchievements}>
          <span className="icon-box purple">
            <Icon name="award" />
          </span>
          <div>
            <h3>Pequenas vitórias, grandes conquistas</h3>
            <p>
              Conheça suas medalhas <ArrowRight size={14} />
            </p>
          </div>
        </button>
      </div>
    </main>
  );
}
