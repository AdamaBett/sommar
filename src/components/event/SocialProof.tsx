'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SocialProofProps {
  viewsCount: number;
  interestedCount: number;
  isFollowing: boolean;
  onToggleFollow: () => void;
  className?: string;
}

function formatCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1).replace('.0', '')}k`;
  }
  return n.toLocaleString('pt-BR');
}

export function SocialProof({
  viewsCount,
  interestedCount,
  isFollowing,
  onToggleFollow,
  className,
}: SocialProofProps): JSX.Element {
  const [displayCount, setDisplayCount] = useState(interestedCount);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isFollowing && displayCount === interestedCount) {
      setAnimating(true);
      setDisplayCount(interestedCount + 1);
      const timer = setTimeout(() => setAnimating(false), 400);
      return () => clearTimeout(timer);
    }
    if (!isFollowing && displayCount === interestedCount + 1) {
      setDisplayCount(interestedCount);
    }
  }, [isFollowing, interestedCount, displayCount]);

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Views */}
      <div className="flex items-center gap-1.5 text-sm text-[var(--text-subtle)]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="8"
            cy="8"
            r="2"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        <span>{formatCount(viewsCount)}</span>
      </div>

      {/* Interessados */}
      <div className="flex items-center gap-1.5 text-sm text-[var(--text-subtle)]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 14C8 14 2 10.5 2 6.25C2 4.18 3.68 2.5 5.75 2.5C6.87 2.5 7.62 3.1 8 3.5C8.38 3.1 9.13 2.5 10.25 2.5C12.32 2.5 14 4.18 14 6.25C14 10.5 8 14 8 14Z"
            fill={isFollowing ? 'var(--pink)' : 'transparent'}
            stroke={isFollowing ? 'var(--pink)' : 'currentColor'}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className={cn(
            'transition-all duration-300',
            animating && 'text-[var(--pink)] scale-110'
          )}
        >
          {formatCount(displayCount)} interessados
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Seguir toggle */}
      <button
        onClick={onToggleFollow}
        className={cn(
          'px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300',
          isFollowing
            ? 'bg-[var(--green)]/20 text-[var(--green-glow)] border border-[var(--green)]/40'
            : 'bg-white/[0.05] text-[var(--text-medium)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
        )}
      >
        {isFollowing ? 'Seguindo' : 'Seguir'}
      </button>
    </div>
  );
}
