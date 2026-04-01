import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  forwardRef,
} from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const baseStyles = [
  'w-full rounded-xl',
  'bg-white/[0.04] text-[var(--text-strong)]',
  'border border-[var(--border-subtle)]',
  'placeholder:text-[var(--text-subtle)]',
  'font-[var(--font-outfit)] font-light',
  'outline-none transition-all duration-200',
  'focus:border-[var(--green)] focus:bg-white/[0.06]',
  'focus:shadow-[0_0_0_2px_rgba(29,158,117,0.15)]',
  'disabled:opacity-40 disabled:cursor-not-allowed',
].join(' ');

const errorStyles =
  'border-[var(--coral)] focus:border-[var(--coral)] focus:shadow-[0_0_0_2px_rgba(216,90,48,0.15)]';

/* ------------------------------------------------------------------ */
/*  Input                                                              */
/* ------------------------------------------------------------------ */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className, id, ...props }, ref) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--text-medium)] tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            baseStyles,
            'h-11 px-4 text-sm',
            error && errorStyles,
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--coral)] mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

/* ------------------------------------------------------------------ */
/*  Textarea                                                           */
/* ------------------------------------------------------------------ */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className, id, ...props }, ref) {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-[var(--text-medium)] tracking-wide"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            baseStyles,
            'px-4 py-3 text-sm min-h-[100px] resize-y',
            error && errorStyles,
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--coral)] mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);
