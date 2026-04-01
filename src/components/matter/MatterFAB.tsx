'use client';

import { cn } from '@/lib/utils';
import { MatterOrb } from '@/components/ui/MatterOrb';

interface MatterFABProps {
  hasNotification?: boolean;
  onClick: () => void;
}

export function MatterFAB({
  hasNotification = false,
  onClick,
}: MatterFABProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'fixed z-[45] flex items-center justify-center',
        'w-[50px] h-[50px] rounded-full',
        'bg-black/80 border border-glass-border',
        'transition-transform duration-200 ease-out',
        'hover:scale-110 active:scale-[0.92]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-glow/50'
      )}
      style={{
        bottom: '90px',
        right: '18px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      aria-label="Abrir conversa com a Matter"
    >
      <MatterOrb size="sm" />

      {/* Badge de notificacao */}
      {hasNotification && (
        <span
          className="absolute flex items-center justify-center"
          style={{
            top: '-2px',
            right: '-2px',
            width: '14px',
            height: '14px',
          }}
          aria-label="Nova notificacao da Matter"
        >
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{
              backgroundColor: '#EC4899',
              animation: 'pulse-badge 1.5s ease-in-out infinite',
            }}
          />
          <span
            className="relative inline-flex rounded-full"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#EC4899',
            }}
          />
        </span>
      )}
    </button>
  );
}
