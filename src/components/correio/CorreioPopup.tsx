'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface CorreioPopupProps {
  recipientName: string;
  onSend: (message: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function CorreioPopup({
  recipientName,
  onSend,
  onClose,
  isOpen,
}: CorreioPopupProps): JSX.Element | null {
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Focus textarea after animation
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
    setIsAnimating(false);
  }, [isOpen]);

  function handleSend(): void {
    onSend(message.trim());
    setMessage('');
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{
        zIndex: 350,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Enviar correio elegante"
    >
      <div
        className={cn(
          'w-full max-w-[360px] rounded-2xl p-6',
          'transition-transform duration-300 ease-out',
          isAnimating ? 'scale-100 opacity-100' : 'scale-[0.92] opacity-0'
        )}
        style={{
          backgroundColor: '#080808',
          border: '1px solid rgba(239,159,39,0.15)',
          boxShadow: '0 0 40px rgba(239,159,39,0.06)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-3xl block mb-2" aria-hidden="true">
            {'\uD83D\uDC8C'}
          </span>
          <h2
            className="text-xl font-semibold text-white mb-1"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Correio Elegante
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Envie uma mensagem para{' '}
            <span style={{ color: 'var(--amber-glow)' }}>{recipientName}</span>
          </p>
        </div>

        {/* Textarea */}
        <div className="mb-4">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva algo especial... (opcional)"
            rows={3}
            maxLength={500}
            className={cn(
              'w-full rounded-xl px-4 py-3 text-sm resize-none',
              'outline-none transition-all duration-200',
              'placeholder:text-white/30'
            )}
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.87)',
              fontFamily: 'var(--font-outfit)',
            }}
          />
          <div
            className="text-right mt-1 text-xs"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            {message.length}/500
          </div>
        </div>

        {/* Info box */}
        <div
          className="rounded-xl px-4 py-3 mb-5 flex items-start gap-2"
          style={{
            backgroundColor: 'rgba(239,159,39,0.06)',
            border: '1px solid rgba(239,159,39,0.1)',
          }}
        >
          <span className="text-base shrink-0" aria-hidden="true">
            {'\uD83C\uDF81'}
          </span>
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            5 correios grátis no check-in. Depois, R$0,99 por correio adicional.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            fullWidth
            className="text-white/50 hover:text-white/80"
          >
            Cancelar
          </Button>
          <Button
            variant="amber"
            size="md"
            onClick={handleSend}
            fullWidth
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}
