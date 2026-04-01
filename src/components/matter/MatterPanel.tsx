'use client';

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { MatterOrb } from '@/components/ui/MatterOrb';
import { MatterMessage, type MatterMessageData } from '@/components/matter/MatterMessage';
import { MATTER_NAME, STRINGS } from '@/lib/constants';

interface MatterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MatterPanel({ isOpen, onClose }: MatterPanelProps): React.ReactElement {
  const [messages, setMessages] = useState<MatterMessageData[]>([
    {
      id: 'greeting',
      role: 'matter',
      content: STRINGS.matterGreeting,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const text = inputValue.trim();
      if (!text || isLoading) return;

      const userMessage: MatterMessageData = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/matter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role === 'matter' ? 'assistant' : 'user',
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error('Erro na resposta da Matter');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let matterContent = '';

        const matterMessageId = `matter-${Date.now()}`;

        // Adiciona mensagem vazia da Matter para streaming
        setMessages((prev) => [
          ...prev,
          { id: matterMessageId, role: 'matter', content: '' },
        ]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            matterContent += chunk;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === matterMessageId
                  ? { ...m, content: matterContent }
                  : m
              )
            );
          }
        }
      } catch {
        // Fallback se API não está disponível
        const fallbackId = `matter-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: fallbackId,
            role: 'matter',
            content: 'Desculpa, estou com dificuldade para responder agora. Tenta de novo em um instante?',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, messages]
  );

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[299] bg-black/60"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed inset-0 z-[300] flex flex-col bg-background',
          'transition-transform duration-[450ms]',
          isOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        )}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Conversa com a Matter"
      >
        {/* Header */}
        <header
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderBottomColor: 'rgba(255,255,255,0.06)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-full',
              'transition-colors duration-150',
              'text-white-subtle hover:text-white-strong',
              'hover:bg-white/5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-glow/50'
            )}
            aria-label="Fechar conversa"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <MatterOrb size="xs" />

          <div className="flex items-center gap-2">
            <span className="font-display text-base text-white-strong font-semibold">
              {MATTER_NAME}
            </span>
            {/* Pulsing green dot: online indicator */}
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{
                  backgroundColor: '#1DFFA8',
                  animation: 'pulse-badge 2s ease-in-out infinite',
                }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: '#1D9E75' }}
              />
            </span>
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg) => (
            <MatterMessage
              key={msg.id}
              content={msg.content}
              role={msg.role}
            />
          ))}

          {isLoading && (
            <MatterMessage
              content=""
              role="matter"
              isTyping
            />
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="px-4 pb-6 pt-3 border-t"
          style={{ borderTopColor: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="flex items-center gap-2 rounded-pill px-4 py-2.5"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Fale com a Matter..."
              className={cn(
                'flex-1 bg-transparent text-white-strong text-sm',
                'placeholder:text-white-subtle',
                'focus:outline-none'
              )}
              disabled={isLoading}
              aria-label="Mensagem para a Matter"
            />

            {/* Send button: aparece quando tem texto */}
            {inputValue.trim().length > 0 && (
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-glow/50',
                  isLoading && 'opacity-50 cursor-not-allowed'
                )}
                style={{
                  background: 'linear-gradient(135deg, #1D9E75, #00D4FF)',
                }}
                aria-label="Enviar mensagem"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M14 2L7 9M14 2L9.5 14L7 9M14 2L2 6.5L7 9"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
