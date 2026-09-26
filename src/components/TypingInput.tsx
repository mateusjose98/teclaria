import { useEffect, useRef, useState } from 'react';
export function TypingInput({
  onInput,
  disabled = false,
  label = 'Digite aqui',
  onBlur,
}: {
  onInput: (text: string) => void;
  disabled?: boolean;
  label?: string;
  onBlur?: () => void;
}) {
  const [buffer, setBuffer] = useState('');
  const composing = useRef(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);
  return (
    <input
      ref={ref}
      className="typing-input"
      aria-label={label}
      placeholder="Clique aqui e comece a digitar…"
      value={buffer}
      disabled={disabled}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      onBlur={onBlur}
      onPaste={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
      onCompositionStart={() => {
        composing.current = true;
      }}
      onCompositionEnd={(e) => {
        composing.current = false;
        onInput(e.currentTarget.value);
        setBuffer('');
      }}
      onChange={(e) => {
        if (composing.current) {
          setBuffer(e.target.value);
          return;
        }
        if (e.target.value) onInput(e.target.value);
        setBuffer('');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Tab' || e.key === 'Escape') return;
        if (e.ctrlKey || e.metaKey) {
          if (['v', 'a', 'z'].includes(e.key.toLowerCase())) e.preventDefault();
        }
      }}
    />
  );
}
