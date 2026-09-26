import { levels } from './data/lessons';
import { useRef, useState } from 'react';
import { Keyboard, ShieldCheck } from 'lucide-react';
import { Header, type Page } from './components/Header';
import { Welcome } from './pages/Welcome';
import { useProgress } from './hooks/useProgress';
import { Home } from './pages/Home';
import { Levels } from './pages/Levels';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { FreeMode } from './pages/FreeMode';
import { Lesson } from './pages/Lesson';
import { BubbleGame } from './pages/BubbleGame';
import { Results } from './pages/Results';
import { canPlay, nextLesson } from './utils/progress';
import { TipoLicao, type Licao, type Resumo, type Resultado } from './types';
export default function App() {
  const { progress, saved, update, finish, reset } = useProgress();
  const [page, setPage] = useState<Page>('home');
  const [active, setActive] = useState<Licao | null>(null);
  const [result, setResult] = useState<Resumo | null>(null);
  const [free, setFree] = useState(false);
  const [session, setSession] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [greet, setGreet] = useState(false);
  const exitDialog = useRef<HTMLDialogElement>(null);
  const finished = useRef(false);
  const navigate = (p: Page) => {
    setPage(p);
    setActive(null);
    setResult(null);
    window.scrollTo(0, 0);
  };
  const start = (l: Licao, isFree = false) => {
    if (isFree ? progress.nivelAtual < levels.length : !canPlay(l, progress)) return;
    finished.current = false;
    setActive(l);
    setFree(isFree);
    setResult(null);
    setSession((s) => s + 1);
    window.scrollTo(0, 0);
  };
  const complete = (r: Resultado) => {
    if (!active || finished.current) return;
    finished.current = true;
    setResult(finish(active, r, free));
  };
  const next = () => {
    if (free) {
      navigate('free');
      return;
    }
    if (progress.nivelAtual === levels.length) {
      navigate('free');
      return;
    }
    start(nextLesson(progress));
  };
  const exercising = Boolean(active && !result);
  const requestExit = () => {
    setExitOpen(true);
    exitDialog.current?.showModal();
  };
  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header
        progress={progress}
        page={page}
        exercising={exercising}
        showNavigation={Boolean(progress.nome && !greet && !exercising)}
        onNavigate={navigate}
        onHome={() => (exercising ? requestExit() : navigate('home'))}
        onSound={() => update({ ...progress, configuracoes: { som: !progress.configuracoes.som } })}
      />

      {!saved && (
        <div className="storage-warning" role="alert">
          Não foi possível salvar neste navegador. Seu treino continua, mas o progresso pode ser
          perdido ao fechar. Verifique as permissões de armazenamento.
        </div>
      )}
      <div id="main-content" tabIndex={-1}>
        {!progress.nome || greet ? (
          <Welcome
            name={progress.nome}
            greet={greet}
            onName={(name) => {
              update({ ...progress, nome: name });
              setGreet(true);
            }}
            onStart={() => {
              setGreet(false);
              start(nextLesson(progress));
            }}
          />
        ) : result ? (
          <Results
            result={result}
            free={free}
            onNext={next}
            onRepeat={() => active && start(active, free)}
            onHome={() => navigate('home')}
          />
        ) : active ? (
          active.tipo === TipoLicao.BOLHAS ? (
            <BubbleGame
              key={session}
              lesson={active}
              onFinish={complete}
              onExit={requestExit}
              suspended={exitOpen}
            />
          ) : (
            <Lesson
              key={session}
              lesson={active}
              onFinish={complete}
              onExit={requestExit}
              suspended={exitOpen}
            />
          )
        ) : page === 'levels' ? (
          <Levels progress={progress} onStart={start} onFree={() => navigate('free')} />
        ) : page === 'achievements' ? (
          <Achievements progress={progress} />
        ) : page === 'settings' ? (
          <Settings
            progress={progress}
            onUpdate={update}
            onReset={() => {
              const ok = reset();
              if (ok) {
                navigate('home');
              }
              return ok;
            }}
          />
        ) : page === 'free' && progress.nivelAtual === levels.length ? (
          <FreeMode onStart={(l) => start(l, true)} />
        ) : (
          <Home
            progress={progress}
            onStart={start}
            onLevels={() => navigate('levels')}
            onFree={() => navigate('free')}
            onAchievements={() => navigate('achievements')}
          />
        )}
      </div>
      {!exercising && (
        <footer className="app-footer">
          <span>
            <Keyboard size={14} /> Feito para aprender. Um toque de cada vez.
          </span>
          <span>
            Seu progresso fica salvo neste navegador <ShieldCheck size={14} />
          </span>
        </footer>
      )}
      <dialog
        ref={exitDialog}
        className="modal"
        onClose={() => setExitOpen(false)}
        aria-labelledby="exit-title"
      >
        <h2 id="exit-title">Fazer uma pausa na jornada?</h2>
        <p>
          Os resultados desta etapa ainda não foram salvos. As etapas já concluídas continuam
          guardadas.
        </p>
        <div className="modal-actions">
          <button
            className="secondary-button"
            autoFocus
            onClick={() => exitDialog.current?.close()}
          >
            Continuar treinando
          </button>
          <button
            className="primary-button"
            onClick={() => {
              exitDialog.current?.close();
              navigate('home');
            }}
          >
            Sair da etapa
          </button>
        </div>
      </dialog>
    </div>
  );
}
