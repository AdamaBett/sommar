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
 * Botão CTA com borda neon animada (todas as 6 cores do Sommar fluindo).
 * Usar para CTAs primários de alta conversão na landing e onboarding.
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
      className={cn('neon-border rounded-full', className)}
    >
      <span
        className={cn(
          'relative z-10 flex items-center justify-center gap-2',
          'rounded-full font-medium tracking-wide',
          'bg-black text-white',
          'transition-all duration-300',
          'hover:bg-[rgba(0,0,0,0.7)]',
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
