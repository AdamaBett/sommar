'use client';

import { useState, useCallback, useRef } from 'react';
import type { ChatMessage } from '@/components/onboarding/OnboardingChat';
import type { ExtractionResult } from '@/lib/ai/extraction';

let messageIdCounter = 0;
function nextMessageId(): string {
  messageIdCounter += 1;
  return `msg_${messageIdCounter}_${Date.now()}`;
}

interface UseMatterOptions {
  /** Contexto adicional para a Matter (ex: matter_context do evento) */
  context?: string;
  /** Usar mock ao invés de API real (quando Anthropic key não está configurada) */
  useMock?: boolean;
  /** Callback chamado quando extração completa */
  onExtraction?: (result: ExtractionResult) => void;
}

interface UseMatterReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => void;
  extractionData: Partial<ExtractionResult>;
  completenessScore: number;
}

/** Hook para chat com a Matter (streaming real ou mock) */
export function useMatter({
  context,
  useMock = false,
  onExtraction,
}: UseMatterOptions = {}): UseMatterReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [extractionData, setExtractionData] = useState<Partial<ExtractionResult>>({});
  const [completenessScore, setCompletenessScore] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      // Adicionar mensagem do usuário
      const userMsg: ChatMessage = {
        id: nextMessageId(),
        role: 'user',
        content: text,
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      if (useMock) {
        // Mock mode: simular resposta com delay
        setTimeout(() => {
          const matterMsg: ChatMessage = {
            id: nextMessageId(),
            role: 'matter',
            content: getMockResponse(),
          };
          setMessages(prev => [...prev, matterMsg]);
          setIsTyping(false);
        }, 800 + Math.random() * 1200);
        return;
      }

      // Real API call with streaming
      try {
        // Cancelar request anterior se existir
        if (abortRef.current) {
          abortRef.current.abort();
        }
        abortRef.current = new AbortController();

        // Preparar histórico para a API (converter role 'matter' → 'assistant')
        const apiMessages = [...messages, userMsg].map(m => ({
          role: m.role === 'matter' ? 'assistant' as const : 'user' as const,
          content: m.content,
        }));

        const response = await fetch('/api/matter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            context,
            stream: true,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error('Matter API error');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader');

        const decoder = new TextDecoder();
        let fullText = '';
        const matterId = nextMessageId();

        // Adicionar mensagem vazia da Matter que vai sendo preenchida
        setMessages(prev => [...prev, { id: matterId, role: 'matter', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data) as { text?: string; error?: string };
                if (parsed.text) {
                  fullText += parsed.text;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === matterId ? { ...m, content: fullText } : m
                    )
                  );
                }
              } catch {
                // Ignore malformed JSON chunks
              }
            }
          }
        }

        setIsTyping(false);

        // Disparar extração em background (não bloqueia)
        triggerExtraction(
          [...apiMessages, { role: 'assistant' as const, content: fullText }],
          extractionData,
          setExtractionData,
          setCompletenessScore,
          onExtraction
        );
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.error('[useMatter] Error:', error);

        // Fallback: mostrar mensagem de erro
        setMessages(prev => [
          ...prev,
          {
            id: nextMessageId(),
            role: 'matter',
            content: 'Desculpa, tive um problema. Pode tentar de novo?',
          },
        ]);
        setIsTyping(false);
      }
    },
    [messages, context, useMock, extractionData, onExtraction]
  );

  return {
    messages,
    isTyping,
    sendMessage,
    extractionData,
    completenessScore,
  };
}

/** Dispara extração em background via API */
async function triggerExtraction(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  existingData: Partial<ExtractionResult>,
  setExtractionData: (fn: (prev: Partial<ExtractionResult>) => Partial<ExtractionResult>) => void,
  setCompletenessScore: (score: number) => void,
  onExtraction?: (result: ExtractionResult) => void
): Promise<void> {
  try {
    const response = await fetch('/api/onboarding/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        existing_data: existingData,
      }),
    });

    if (response.ok) {
      const result = (await response.json()) as ExtractionResult;
      setExtractionData(() => result);
      setCompletenessScore(result.completeness_score);
      onExtraction?.(result);
    }
  } catch {
    // Extração falhou silenciosamente, não bloqueia a conversa
  }
}

/** Respostas mock para quando a API não está configurada */
function getMockResponse(): string {
  const responses = [
    'Que legal. Dá pra sentir que você valoriza conexões que têm substância, não só quantidade. Me conta uma coisa: em ambientes com muita gente, você é mais de observar primeiro ou já chega interagindo?',
    'Faz sentido. Cada pessoa tem seu ritmo e isso é parte do que te torna única. Que tipo de energia você busca nas pessoas? Algo que te faz querer ficar perto.',
    'Adorei te conhecer um pouco. Já tenho uma boa ideia de quem você é. Vamos pra próxima etapa?',
  ];

  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}
