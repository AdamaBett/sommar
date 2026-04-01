'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { CorreioMessage } from '@/types/correio';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CorreioChatProps {
  recipientName: string;
  recipientAvatar?: string;
  messages: CorreioMessage[];
  currentUserId: string;
  expiresAt: string | null;
  timeRemaining: number | null;
  isExpired: boolean;
  onSend: (content: string) => void;
  onClose: () => void;
}

interface MatterInterventionProps {
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Timer Circle                                                       */
/* ------------------------------------------------------------------ */

function TimerCircle({
  timeRemaining,
}: {
  timeRemaining: number | null;
}): JSX.Element {
  const size = 52;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calcula progresso baseado em 24h (86400 segundos)
  const maxSeconds = 24 * 60 * 60;
  const remaining = timeRemaining ?? 0;
  const progress = Math.min(remaining / maxSeconds, 1);
  const dashOffset = circumference * (1 - progress);

  function formatTimer(seconds: number): string {
    if (seconds <= 0) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  }

  // Cor muda conforme tempo restante
  const isUrgent = remaining < 3600; // menos de 1h
  const strokeColor = isUrgent ? 'var(--coral-glow)' : 'var(--amber-glow)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span
        className="absolute text-xs font-medium"
        style={{ color: strokeColor, fontFamily: 'var(--font-outfit)' }}
      >
        {formatTimer(remaining)}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Matter Intervention Message                                        */
/* ------------------------------------------------------------------ */

function MatterIntervention({ content }: MatterInterventionProps): JSX.Element {
  return (
    <div className="flex justify-center my-3">
      <div
        className="rounded-xl px-4 py-2.5 max-w-[85%] text-center"
        style={{
          backgroundColor: 'rgba(29,158,117,0.1)',
          border: '1px solid rgba(29,158,117,0.15)',
        }}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--green-glow)' }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--green-glow)' }}
          >
            Matter
          </span>
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat Message Bubble                                                */
/* ------------------------------------------------------------------ */

function ChatBubble({
  message,
  isSelf,
}: {
  message: CorreioMessage;
  isSelf: boolean;
}): JSX.Element {
  return (
    <div
      className={cn(
        'flex mb-2',
        isSelf ? 'justify-end' : 'justify-start',
        'animate-fade-up'
      )}
      style={{ animationDuration: '0.3s', animationFillMode: 'forwards' }}
    >
      <div
        className={cn(
          'rounded-2xl px-4 py-2.5 max-w-[78%]',
          isSelf ? 'rounded-tr-md' : 'rounded-tl-md'
        )}
        style={{
          fontSize: '14px',
          lineHeight: '1.5',
          color: 'rgba(255,255,255,0.87)',
          ...(isSelf
            ? {
                backgroundColor: 'rgba(239,159,39,0.12)',
                borderRight: '2px solid var(--amber)',
              }
            : {
                backgroundColor: 'rgba(0,212,255,0.08)',
                borderLeft: '2px solid var(--cyan)',
              }),
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Expired Banner                                                     */
/* ------------------------------------------------------------------ */

function ExpiredBanner(): JSX.Element {
  return (
    <div
      className="text-center py-4 px-6 mx-4 rounded-xl"
      style={{
        backgroundColor: 'rgba(216,90,48,0.08)',
        border: '1px solid rgba(216,90,48,0.15)',
      }}
    >
      <p className="text-sm font-medium" style={{ color: 'var(--coral-glow)' }}>
        Conversa expirada
      </p>
      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
        O tempo desta conversa chegou ao fim
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function CorreioChat({
  recipientName,
  recipientAvatar,
  messages,
  currentUserId,
  expiresAt,
  timeRemaining,
  isExpired,
  onSend,
  onClose,
}: CorreioChatProps): JSX.Element {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isExpired) {
      inputRef.current?.focus();
    }
  }, [isExpired]);

  function handleSend(): void {
    const trimmed = input.trim();
    if (!trimmed || isExpired) return;
    onSend(trimmed);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col animate-slide-up"
      style={{
        zIndex: 400,
        backgroundColor: '#000000',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/5"
          aria-label="Fechar conversa"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            background: recipientAvatar
              ? `url(${recipientAvatar}) center/cover`
              : 'linear-gradient(135deg, var(--cyan), var(--purple))',
            color: 'white',
          }}
        >
          {!recipientAvatar && recipientName.charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {recipientName}
          </p>
          {expiresAt && !isExpired && (
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Conversa temporaria
            </p>
          )}
        </div>

        {/* Timer */}
        {!isExpired && <TimerCircle timeRemaining={timeRemaining} />}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isSelf={msg.sender_id === currentUserId}
          />
        ))}

        {/* Exemplo de Matter intervention (condicional) */}
        {messages.length === 1 && (
          <MatterIntervention
            content="Vejo que vocês têm muito em comum! Que tal perguntar sobre música?"
          />
        )}

        {isExpired && <ExpiredBanner />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isExpired ? (
        <div
          className="shrink-0 px-4 py-3"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            backgroundColor: 'rgba(0,0,0,0.95)',
          }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-2"
            style={{
              backgroundColor: 'rgba(239,159,39,0.04)',
              border: '1px solid rgba(239,159,39,0.1)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              maxLength={1000}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/25"
              style={{
                color: 'rgba(255,255,255,0.87)',
                fontFamily: 'var(--font-outfit)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                'transition-all duration-200',
                input.trim()
                  ? 'opacity-100 cursor-pointer'
                  : 'opacity-30 cursor-not-allowed'
              )}
              style={{
                background: input.trim()
                  ? 'linear-gradient(135deg, var(--amber), var(--coral-glow))'
                  : 'rgba(255,255,255,0.06)',
              }}
              aria-label="Enviar mensagem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="shrink-0 px-4 py-3 text-center">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Esta conversa esta em modo somente leitura
          </p>
        </div>
      )}
    </div>
  );
}
