import {
  ArrowRight,
  Award,
  BookOpen,
  Circle,
  Crown,
  Flame,
  Footprints,
  Hash,
  Keyboard,
  Sparkles,
  Star,
  Target,
  Type,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
const icons = {
  keyboard: Keyboard,
  hash: Hash,
  text: Type,
  bubbles: Circle,
  crown: Crown,
  foot: Footprints,
  target: Target,
  flame: Flame,
  zap: Zap,
  award: Award,
  book: BookOpen,
  sparkles: Sparkles,
};
export function Icon({
  name,
  size = 24,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Component = icons[name as keyof typeof icons] ?? Keyboard;
  return <Component size={size} aria-hidden="true" {...props} />;
}
export function Stars({ count }: { count: number }) {
  return (
    <span className="stars" aria-label={`${count} de 3 etapas concluídas`}>
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          size={19}
          fill={n <= count ? 'currentColor' : 'none'}
          className={n <= count ? 'earned' : ''}
        />
      ))}
    </span>
  );
}
export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div style={{ width: `${value}%` }} />
    </div>
  );
}
export function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="primary-button" onClick={onClick} disabled={disabled}>
      {children}
      <ArrowRight size={18} />
    </button>
  );
}
export const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`;
export function Stat({
  icon,
  value,
  label,
  color = 'purple',
}: {
  icon: string;
  value: ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <div className="stat">
      <span className={`icon-box ${color}`}>
        <Icon name={icon} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
