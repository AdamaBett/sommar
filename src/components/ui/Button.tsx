import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'coral' | 'amber';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--green)] text-black font-medium',
    'hover:bg-[var(--green-glow)] hover:shadow-[0_0_24px_rgba(29,255,168,0.3)]',
    'active:scale-[0.97]',
  ].join(' '),
  secondary: [
    'bg-transparent text-white border border-[var(--border-strong)]',
    'hover:bg-white/[0.05] hover:border-[var(--border-medium)]',
    'active:scale-[0.97]',
  ].join(' '),
  ghost: [
    'bg-transparent text-[var(--text-medium)] border-none',
    'hover:bg-white/[0.05] hover:text-[var(--text-strong)]',
    'active:scale-[0.97]',
  ].join(' '),
  coral: [
    'bg-gradient-to-r from-[var(--coral)] to-[var(--amber)] text-black font-medium',
    'hover:from-[var(--coral-glow)] hover:to-[var(--amber-glow)] hover:shadow-[0_0_24px_rgba(255,107,61,0.3)]',
    'active:scale-[0.97]',
  ].join(' '),
  amber: [
    'bg-gradient-to-r from-[var(--amber)] to-[var(--coral-glow)] text-black font-medium',
    'hover:from-[var(--amber-glow)] hover:to-[var(--coral)] hover:shadow-[0_0_24px_rgba(255,184,64,0.3)]',
    'active:scale-[0.97]',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-sm gap-1.5',
  md: 'h-10 px-6 text-sm gap-2',
  lg: 'h-12 px-8 text-base gap-2.5',
};

function Spinner({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={cn('animate-spin', className)}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2.5"
      />
      <path
        d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'rounded-full font-medium',
          'transition-all duration-200 ease-out',
          'select-none cursor-pointer',
          'font-[var(--font-outfit)]',
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          // Disabled state
          isDisabled && 'opacity-40 pointer-events-none cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading && <Spinner className="shrink-0" />}
        {children}
      </button>
    );
  }
);
