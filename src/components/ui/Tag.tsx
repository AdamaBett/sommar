import { cn } from '@/lib/utils';

type TagColor = 'green' | 'amber' | 'cyan' | 'purple' | 'coral' | 'pink';
type TagSize = 'sm' | 'md';

interface TagProps {
  label: string;
  color?: TagColor;
  size?: TagSize;
  className?: string;
}

const colorStyles: Record<TagColor, string> = {
  green: 'border-[var(--green)] bg-[var(--green)]/10 text-[var(--green-glow)]',
  amber: 'border-[var(--amber)] bg-[var(--amber)]/10 text-[var(--amber-glow)]',
  cyan: 'border-[var(--cyan)] bg-[var(--cyan)]/10 text-[var(--cyan)]',
  purple: 'border-[var(--purple)] bg-[var(--purple)]/10 text-[var(--purple)]',
  coral: 'border-[var(--coral)] bg-[var(--coral)]/10 text-[var(--coral-glow)]',
  pink: 'border-[var(--pink)] bg-[var(--pink)]/10 text-[var(--pink)]',
};

const sizeStyles: Record<TagSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export function Tag({
  label,
  color = 'green',
  size = 'md',
  className,
}: TagProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full',
        'border font-medium tracking-wide uppercase',
        'select-none whitespace-nowrap',
        colorStyles[color],
        sizeStyles[size],
        className
      )}
    >
      {label}
    </span>
  );
}
