'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ChatMessage {
  id: string;
  role: 'matter' | 'user';
  content: string;
}

interface OnboardingChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  quickReplies?: string[];
  inputDisabled?: boolean;
}

function TypingIndicator(): JSX.Element {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="block w-2 h-2 rounded-full bg-[var(--green)]"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function OnboardingChat({
  messages,
  onSendMessage,
  isTyping,
  quickReplies,
  inputDisabled = false,
}: OnboardingChatProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll no final a cada nova mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const input = inputRef.current;
    if (!input) return;

    const text = input.value.trim();
    if (!text || inputDisabled) return;

    onSendMessage(text);
    input.value = '';
  }

  function handleQuickReply(text: string): void {
    if (inputDisabled) return;
    onSendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) form.requestSubmit();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Area de mensagens */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin"
      >
        <AnimatePresence mode="popLayout">
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={cn(
                'max-w-[85%]',
                msg.role === 'user' ? 'ml-auto' : 'mr-auto'
              )}
            >
              <div
                className={cn(
                  'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'matter'
                    ? 'bg-[rgba(29,158,117,0.06)] border-l-2 border-gradient-to-b from-[var(--green)] to-[var(--cyan)] text-[var(--text-strong)]'
                    : 'bg-white/[0.04] text-[var(--text-strong)]',
                  msg.role === 'matter'
                    ? 'border-l-2 border-l-[var(--green)]'
                    : ''
                )}
              >
                {msg.role === 'matter' && (
                  <span className="block text-[10px] font-medium text-[var(--green)] mb-1 tracking-wider uppercase">
                    Matter
                  </span>
                )}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[85%] mr-auto"
          >
            <div className="rounded-2xl bg-[rgba(29,158,117,0.06)] border-l-2 border-l-[var(--green)]">
              <span className="block text-[10px] font-medium text-[var(--green)] px-4 pt-3 tracking-wider uppercase">
                Matter
              </span>
              <TypingIndicator />
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick replies */}
      <AnimatePresence>
        {quickReplies && quickReplies.length > 0 && !inputDisabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap gap-2 px-4 pb-3"
          >
            {quickReplies.map(reply => (
              <button
                key={reply}
                type="button"
                onClick={() => handleQuickReply(reply)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-medium',
                  'bg-white/[0.04] border border-[rgba(255,255,255,0.08)]',
                  'text-[var(--text-medium)]',
                  'hover:bg-white/[0.08] hover:border-[var(--green)]/30',
                  'hover:text-[var(--green-glow)]',
                  'transition-all duration-200',
                  'backdrop-blur-sm'
                )}
              >
                {reply}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={
              inputDisabled ? 'Aguarde...' : 'Digite sua mensagem...'
            }
            disabled={inputDisabled || isTyping}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full h-12 pl-4 pr-12 rounded-2xl',
              'bg-white/[0.04] text-sm text-[var(--text-strong)]',
              'border border-[rgba(255,255,255,0.06)]',
              'placeholder:text-[var(--text-subtle)]',
              'outline-none transition-all duration-200',
              'focus:border-[var(--green)] focus:bg-white/[0.06]',
              'focus:shadow-[0_0_0_2px_rgba(29,158,117,0.15)]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'backdrop-blur-sm'
            )}
          />
          <button
            type="submit"
            disabled={inputDisabled || isTyping}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'w-8 h-8 rounded-full',
              'flex items-center justify-center',
              'bg-[var(--green)] text-black',
              'hover:bg-[var(--green-glow)] hover:shadow-[0_0_12px_rgba(29,255,168,0.3)]',
              'transition-all duration-200',
              'disabled:opacity-0 disabled:pointer-events-none'
            )}
            aria-label="Enviar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2L7 9M14 2L9.5 14L7 9M14 2L2 6.5L7 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
