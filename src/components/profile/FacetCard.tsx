'use client';

import { cn } from '@/lib/utils';

interface FacetCardProps {
  id: string;
  label: string;
  color: string;
  active: boolean;
  onToggle: () => void;
}

export function FacetCard({
  label,
  color,
  active,
  onToggle,
}: FacetCardProps): JSX.Element {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'glass rounded-xl px-4 py-3',
        'flex items-center justify-between w-full',
        'transition-all duration-200',
        active && 'border-opacity-30',
        !active && 'opacity-50'
      )}
      style={{
        borderColor: active ? color : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Color dot */}
        <div
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300',
            active && 'shadow-[0_0_8px_var(--glow)]'
          )}
          style={{
            backgroundColor: color,
            ['--glow' as string]: `${color}80`,
            opacity: active ? 1 : 0.4,
          }}
        />
        <span
          className={cn(
            'text-sm font-medium transition-colors duration-200',
            active ? 'text-[var(--text-strong)]' : 'text-[var(--text-subtle)]'
          )}
        >
          {label}
        </span>
      </div>

      {/* Toggle switch */}
      <div
        className={cn(
          'relative w-10 h-[22px] rounded-full transition-all duration-300',
          active ? 'bg-opacity-30' : 'bg-white/[0.08]'
        )}
        style={{
          backgroundColor: active ? `${color}30` : undefined,
        }}
      >
        <div
          className={cn(
            'absolute top-[3px] w-4 h-4 rounded-full transition-all duration-300',
            active ? 'left-[22px]' : 'left-[3px]'
          )}
          style={{
            backgroundColor: active ? color : 'var(--text-subtle)',
          }}
        />
      </div>
    </button>
  );
}
