import { useRef, useState } from 'react';
import { Check, Trash2, Volume2, VolumeX } from 'lucide-react';
import type { ProgressoUsuario } from '../types';
export function Settings({
  progress,
  onUpdate,
  onReset,
}: {
  progress: ProgressoUsuario;
  onUpdate: (p: ProgressoUsuario) => void;
  onReset: () => boolean;
}) {
  const [name, setName] = useState(progress.nome);
  const [message, setMessage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <main className="page settings-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">DO SEU JEITINHO</p>
          <h1>Um cantinho para seus ajustes</h1>
          <p>Deixe tudo confortável para a sua próxima prática.</p>
        </div>
      </div>
      <section className="settings-card">
        <h2>Como podemos chamar você?</h2>
        <p>Seu nome aparece apenas neste navegador. Não existe cadastro.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              onUpdate({ ...progress, nome: name.trim() });
              setMessage('Nome atualizado!');
            }
          }}
        >
          <label htmlFor="settings-name">Seu nome</label>
          <div className="inline-form">
            <input
              id="settings-name"
              value={name}
              maxLength={30}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <button className="primary-button" type="submit">
              Salvar <Check size={18} />
            </button>
          </div>
          <span role="status">{message}</span>
        </form>
      </section>
      <section className="settings-card sound-setting">
        <div>
          <h2>Sons da jornada</h2>
          <p>Pequenos sons para celebrar seus acertos e conquistas.</p>
        </div>
        <button
          className={`sound-toggle ${progress.configuracoes.som ? 'on' : ''}`}
          role="switch"
          aria-checked={progress.configuracoes.som}
          aria-label="Som"
          onClick={() =>
            onUpdate({ ...progress, configuracoes: { som: !progress.configuracoes.som } })
          }
        >
          {progress.configuracoes.som ? <Volume2 size={20} /> : <VolumeX size={20} />}{' '}
          {progress.configuracoes.som ? 'ON' : 'OFF'}
        </button>
      </section>
      <section className="settings-card">
        <h2>Um novo começo</h2>
        <p>
          Seu progresso é salvo automaticamente neste navegador. Reiniciar apaga o nome, XP, etapas,
          conquistas e recordes deste dispositivo.
        </p>
        <button className="danger-button" onClick={() => dialog.current?.showModal()}>
          <Trash2 size={17} />
          Reiniciar progresso
        </button>
      </section>
      <dialog ref={dialog} className="modal reset-dialog">
        <h2>Começar uma nova jornada?</h2>
        <p>Todo o seu progresso será apagado. Essa ação não pode ser desfeita.</p>
        <div className="modal-actions">
          <button className="secondary-button" autoFocus onClick={() => dialog.current?.close()}>
            Manter meu progresso
          </button>
          <button
            className="danger-button"
            onClick={() => {
              if (onReset()) dialog.current?.close();
            }}
          >
            Sim, reiniciar
          </button>
        </div>
      </dialog>
    </main>
  );
}
