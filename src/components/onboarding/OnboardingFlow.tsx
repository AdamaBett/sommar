'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OnboardingChat, type ChatMessage } from './OnboardingChat';
import { AestheticPicker } from './AestheticPicker';
import { FacetSelector } from './FacetSelector';
import { OriReveal } from './OriReveal';

/* ------------------------------------------------------------------ */
/* Mock responses (substituir por API real depois)                      */
/* ------------------------------------------------------------------ */

const MOCK_RESPONSES: Record<string, {
  text: string;
  quickReplies?: string[];
}> = {
  welcome: {
    text: 'Oi! Eu sou a Matter, a inteligência do Sommar. Antes de qualquer coisa, quero te conhecer de verdade. Me conta: o que faria hoje valer a pena pra você?',
    quickReplies: [
      'Uma conversa boa',
      'Conhecer gente nova',
      'Algo inesperado',
    ],
  },
  response_1: {
    text: 'Que legal. Dá pra sentir que você valoriza conexões que têm substância, não só quantidade. Me conta uma coisa: em ambientes com muita gente, você é mais de observar primeiro ou já chega interagindo?',
    quickReplies: [
      'Observo primeiro',
      'Depende do meu humor',
      'Já chego conversando',
    ],
  },
  response_2: {
    text: 'Faz sentido. Cada pessoa tem seu ritmo e isso é parte do que te torna única. Última pergunta antes da gente seguir: que tipo de energia você busca nas pessoas? Algo que te faz querer ficar perto.',
    quickReplies: [
      'Autenticidade',
      'Humor e leveza',
      'Profundidade',
      'Criatividade',
    ],
  },
  response_3: {
    text: 'Adorei te conhecer um pouco. Já tenho uma boa ideia de quem você é. Agora quero te conhecer de um jeito diferente. Vou te mostrar 9 energias visuais. Escolhe pelo menos 3 que mais combinam com você. Vai no instinto!',
  },
  archetype_done: {
    text: 'Perfeito. Agora o último passo: escolher quais lados seus você quer ativar no Sommar. A Base é quem você é, sempre ativa. Os outros abrem portas pra tipos diferentes de conexão.',
  },
  ori_narrative: {
    text: 'Você carrega uma energia que mistura curiosidade silenciosa com calor genuíno. Pessoas se sentem seguras perto de você, e as conversas que te encontram costumam ir mais fundo do que o esperado.',
  },
};

/* ------------------------------------------------------------------ */
/* Etapas do onboarding                                                */
/* ------------------------------------------------------------------ */

type OnboardingStep = 'chat' | 'archetypes' | 'facets' | 'reveal';

const STEP_ORDER: OnboardingStep[] = [
  'chat',
  'archetypes',
  'facets',
  'reveal',
];

function getStepIndex(step: OnboardingStep): number {
  return STEP_ORDER.indexOf(step);
}

/* ------------------------------------------------------------------ */
/* Props e ID helper                                                   */
/* ------------------------------------------------------------------ */

interface OnboardingFlowProps {
  userId: string;
  savedProgress: Record<string, unknown>;
}

let messageIdCounter = 0;
function nextMessageId(): string {
  messageIdCounter += 1;
  return `msg_${messageIdCounter}_${Date.now()}`;
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export function OnboardingFlow({
  userId,
  savedProgress,
}: OnboardingFlowProps): JSX.Element {
  const router = useRouter();

  // Estado do fluxo
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    (savedProgress.step as OnboardingStep) ?? 'chat'
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextMessageId(),
      role: 'matter',
      content: MOCK_RESPONSES.welcome.text,
    },
  ]);
  const [chatRound, setChatRound] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(
    MOCK_RESPONSES.welcome.quickReplies ?? []
  );

  // Selecoes
  const [selectedArchetypes, setSelectedArchetypes] = useState<number[]>(
    (savedProgress.archetypes as number[]) ?? []
  );
  const [activeFacets, setActiveFacets] = useState<string[]>(
    (savedProgress.facets as string[]) ?? []
  );
  const [oriNarrative] = useState<string>(MOCK_RESPONSES.ori_narrative.text);

  // Simula resposta da Matter com delay
  const simulateMatterResponse = useCallback(
    (responseKey: string) => {
      setIsTyping(true);
      setQuickReplies([]);

      const delay = 800 + Math.random() * 1200;

      setTimeout(() => {
        const response = MOCK_RESPONSES[responseKey];
        if (!response) {
          setIsTyping(false);
          return;
        }

        const matterMsg: ChatMessage = {
          id: nextMessageId(),
          role: 'matter',
          content: response.text,
        };

        setMessages(prev => [...prev, matterMsg]);
        setIsTyping(false);
        setQuickReplies(response.quickReplies ?? []);
      }, delay);
    },
    []
  );

  // Handler de mensagem do usuário no chat
  const handleSendMessage = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: nextMessageId(),
        role: 'user',
        content: text,
      };
      setMessages(prev => [...prev, userMsg]);

      const nextRound = chatRound + 1;
      setChatRound(nextRound);

      // Mapear round para response key
      if (nextRound === 1) {
        simulateMatterResponse('response_1');
      } else if (nextRound === 2) {
        simulateMatterResponse('response_2');
      } else if (nextRound >= 3) {
        // Transição para arquétipos
        setIsTyping(true);
        setQuickReplies([]);

        setTimeout(() => {
          const matterMsg: ChatMessage = {
            id: nextMessageId(),
            role: 'matter',
            content: MOCK_RESPONSES.response_3.text,
          };
          setMessages(prev => [...prev, matterMsg]);
          setIsTyping(false);

          // Aguardar um pouco antes de trocar de tela
          setTimeout(() => {
            setCurrentStep('archetypes');
          }, 1500);
        }, 1000);
      }
    },
    [chatRound, simulateMatterResponse]
  );

  // Toggle de arquétipo
  const handleArchetypeToggle = useCallback((id: number) => {
    setSelectedArchetypes(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  }, []);

  // Confirmar arquétipos, ir para facetas
  const handleArchetypeConfirm = useCallback(() => {
    setCurrentStep('facets');
  }, []);

  // Toggle de faceta
  const handleFacetToggle = useCallback((facetId: string) => {
    setActiveFacets(prev =>
      prev.includes(facetId)
        ? prev.filter(f => f !== facetId)
        : [...prev, facetId]
    );
  }, []);

  // Confirmar facetas, ir para Ori reveal
  const handleFacetConfirm = useCallback(() => {
    setCurrentStep('reveal');
  }, []);

  // Finalizar onboarding
  const handleComplete = useCallback(async () => {
    try {
      // Salvar progresso no Supabase via fetch
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          archetypes: selectedArchetypes,
          facets: activeFacets,
          narrative: oriNarrative,
        }),
      });
    } catch {
      // Se falhar, navegar mesmo assim (retry pode ser feito depois)
      console.error('Erro ao salvar onboarding');
    }

    router.push('/lobby');
  }, [userId, selectedArchetypes, activeFacets, oriNarrative, router]);

  // Indice visual do progresso
  const stepIndex = getStepIndex(currentStep);

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header com progresso */}
      <header className="flex items-center justify-center gap-3 py-4 px-6 shrink-0">
        {STEP_ORDER.map((step, i) => (
          <div
            key={step}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-all duration-500',
              i <= stepIndex
                ? 'bg-[var(--green)] shadow-[0_0_8px_rgba(29,255,168,0.4)]'
                : 'bg-white/[0.1]',
              i === stepIndex && 'w-8'
            )}
          />
        ))}
      </header>

      {/* Conteudo principal */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              <OnboardingChat
                messages={messages}
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
                quickReplies={quickReplies}
                inputDisabled={isTyping}
              />
            </motion.div>
          )}

          {currentStep === 'archetypes' && (
            <motion.div
              key="archetypes"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="h-full overflow-y-auto"
            >
              <AestheticPicker
                selected={selectedArchetypes}
                onToggle={handleArchetypeToggle}
                onConfirm={handleArchetypeConfirm}
              />
            </motion.div>
          )}

          {currentStep === 'facets' && (
            <motion.div
              key="facets"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="h-full overflow-y-auto"
            >
              <FacetSelector
                activeFacets={activeFacets}
                onToggle={handleFacetToggle}
                onConfirm={handleFacetConfirm}
              />
            </motion.div>
          )}

          {currentStep === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full overflow-y-auto"
            >
              <OriReveal
                narrative={oriNarrative}
                onContinue={handleComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
