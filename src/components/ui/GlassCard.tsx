import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'section' | 'article';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
} as const;

export function GlassCard({
  children,
  className,
  hover = false,
  padding = 'md',
  as: Component = 'div',
}: GlassCardProps): JSX.Element {
  return (
    <Component
      className={cn(
        'glass',
        hover && 'glass-hover transition-all duration-300',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </Component>
  );
}
