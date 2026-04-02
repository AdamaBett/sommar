'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NeonCTAProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: 'md' | 'lg';
  onClick?: () => void;
}

/**
 * Botão CTA com borda neon fluindo ao redor (todas as 6 cores do Sommar).
 * Usa @property + conic-gradient para animação real de borda arredondada.
 */
export function NeonCTA({
  href,
  children,
  className,
  size = 'lg',
  onClick,
}: NeonCTAProps): JSX.Element {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('neon-border', className)}
    >
      <span
        className={cn(
          'flex items-center justify-center gap-2',
          'rounded-full font-medium tracking-wide text-white',
          'transition-colors duration-300 hover:text-white/90',
          size === 'lg'
            ? 'h-14 px-10 text-base'
            : 'h-11 px-7 text-sm'
        )}
      >
        {children}
      </span>
    </Link>
  );
}
