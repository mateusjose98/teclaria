import { useState } from 'react';
import { ArrowRight, Award, Check, Heart, Keyboard, ShieldCheck } from 'lucide-react';
import { Mascot } from '../components/Mascot';
export function Welcome({
  name,
  greet,
  onName,
  onStart,
}: {
  name: string;
  greet: boolean;
  onName: (name: string) => void;
  onStart: () => void;
}) {
  const [value, setValue] = useState('');
  return (
    <main className="welcome-page">
      <section className="welcome-copy">
        <span className="welcome-tag">APRENDER PODE SER LEVE</span>
        <h1>{greet ? `Prazer, ${name}!` : 'Grandes descobertas começam com um toque.'}</h1>
        <p>
          {greet
            ? 'Vamos começar a treinar sua digitação? Uma pequena etapa por vez, sem pressa.'
            : 'Conheça o teclado, ganhe confiança e descubra o prazer de digitar. No seu tempo, do seu jeito.'}
        </p>
        {greet ? (
          <button className="primary-button" onClick={onStart}>
            Vamos começar <ArrowRight size={18} />
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (value.trim()) onName(value.trim());
            }}
          >
            <label htmlFor="welcome-name">Olá! Como podemos chamar você?</label>
            <input
              autoFocus
              id="welcome-name"
              placeholder="Seu nome"
              maxLength={30}
              value={value}
              required
              onChange={(e) => setValue(e.target.value)}
            />
            <button className="primary-button" type="submit">
              Começar minha jornada <ArrowRight size={18} />
            </button>
            <span className="privacy-note">
              <ShieldCheck size={15} />
              Sem cadastro. Seu progresso fica só neste navegador.
            </span>
          </form>
        )}
      </section>
      <div className="welcome-visual">
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
        <Mascot />
        <span className="welcome-sticker">
          <Check size={18} />
          Um toque de cada vez!
        </span>
      </div>
      <div className="welcome-benefits">
        <span>
          <Keyboard size={20} />
          Do primeiro toque à primeira frase
        </span>
        <span>
          <Award size={20} />
          Pequenas vitórias todos os dias
        </span>
        <span>
          <Heart size={20} />
          Feito para aprender sem pressa
        </span>
      </div>
    </main>
  );
}
