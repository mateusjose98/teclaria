import { Award, ChevronDown, Home, Keyboard, Map, Settings, Volume2, VolumeX } from 'lucide-react';
import type { ProgressoUsuario } from '../types';
export type Page = 'home' | 'levels' | 'achievements' | 'settings' | 'free';
const navigation = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'levels', label: 'Níveis', icon: Map },
  { id: 'achievements', label: 'Conquistas', icon: Award },
  { id: 'settings', label: 'Configurações', icon: Settings },
] as const;
export function Header({
  progress,
  page,
  showNavigation,
  exercising,
  onNavigate,
  onHome,
  onSound,
}: {
  progress: ProgressoUsuario;
  page: Page;
  showNavigation: boolean;
  exercising: boolean;
  onNavigate: (p: Page) => void;
  onHome: () => void;
  onSound: () => void;
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <button className="brand" aria-label="Teclaria, início" onClick={onHome}>
          <span className="brand-icon">
            <Keyboard size={24} />
          </span>
          <span>
            teclaria<span className="brand-dot">.</span>
          </span>
        </button>
        {showNavigation && (
          <nav aria-label="Navegação principal">
            {navigation.map((n) => (
              <button
                key={n.id}
                className={page === n.id ? 'active' : ''}
                aria-current={page === n.id ? 'page' : undefined}
                onClick={() => onNavigate(n.id)}
              >
                <n.icon size={17} />
                {n.label}
              </button>
            ))}
          </nav>
        )}
        <div className="header-actions">
          <button
            className="sound-button"
            aria-label={progress.configuracoes.som ? 'Desligar som' : 'Ligar som'}
            title={progress.configuracoes.som ? 'Desligar som' : 'Ligar som'}
            onClick={onSound}
          >
            {progress.configuracoes.som ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          {progress.nome && !exercising && (
            <button
              className="profile-button"
              aria-label={`Configurações de ${progress.nome}`}
              onClick={() => onNavigate('settings')}
            >
              <span>{progress.nome[0].toUpperCase()}</span>
              <b>{progress.nome}</b>
              <ChevronDown size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
