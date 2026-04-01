'use client';

import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  color: 'green' | 'amber' | 'coral' | 'cyan' | 'purple' | 'pink';
  icon: React.ReactNode;
}

const colorMap: Record<StatCardProps['color'], { border: string; glow: string; text: string }> = {
  green: {
    border: 'border-l-[var(--green-glow)]',
    glow: 'shadow-[0_0_24px_rgba(29,255,168,0.08)]',
    text: 'text-[var(--green-glow)]',
  },
  amber: {
    border: 'border-l-[var(--amber-glow)]',
    glow: 'shadow-[0_0_24px_rgba(255,184,64,0.08)]',
    text: 'text-[var(--amber-glow)]',
  },
  coral: {
    border: 'border-l-[var(--coral-glow)]',
    glow: 'shadow-[0_0_24px_rgba(255,107,61,0.08)]',
    text: 'text-[var(--coral-glow)]',
  },
  cyan: {
    border: 'border-l-[var(--cyan)]',
    glow: 'shadow-[0_0_24px_rgba(0,212,255,0.08)]',
    text: 'text-[var(--cyan)]',
  },
  purple: {
    border: 'border-l-[var(--purple)]',
    glow: 'shadow-[0_0_24px_rgba(168,85,247,0.08)]',
    text: 'text-[var(--purple)]',
  },
  pink: {
    border: 'border-l-[var(--pink)]',
    glow: 'shadow-[0_0_24px_rgba(236,72,153,0.08)]',
    text: 'text-[var(--pink)]',
  },
};

export function StatCard({ label, value, change, color, icon }: StatCardProps): JSX.Element {
  const styles = colorMap[color];

  return (
    <div
      className={cn(
        'glass rounded-2xl p-5 border-l-[3px]',
        styles.border,
        styles.glow,
        'transition-all duration-300 hover:scale-[1.02]'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04]', styles.text)}>
          {icon}
        </div>
        {change !== undefined && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              change >= 0
                ? 'text-[var(--green-glow)] bg-[var(--green-glow)]/10'
                : 'text-[var(--coral-glow)] bg-[var(--coral-glow)]/10'
            )}
          >
            {change >= 0 ? '+' : ''}
            {change}%
          </span>
        )}
      </div>
      <p className="font-display text-4xl font-semibold tracking-tight mb-1">{value}</p>
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
}
