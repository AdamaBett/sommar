'use client';

import { motion, type Variants } from 'framer-motion';
import { MatterOrb } from '@/components/ui/MatterOrb';

/* ── Chat message data ── */

interface ChatMessage {
  /** Plain segments and highlighted segments interleaved */
  parts: MessagePart[];
  delay: number; // seconds
}

type MessagePart =
  | { type: 'text'; value: string }
  | { type: 'highlight'; value: string; color: string };

const MESSAGES: ChatMessage[] = [
  {
    parts: [
      { type: 'text', value: 'Oi. Eu sou a ' },
      { type: 'highlight', value: 'Matter', color: 'rgba(255,255,255,0.9)' },
      { type: 'text', value: '. Eu n\u00e3o vou te pedir pra preencher formul\u00e1rio nenhum. Vou ' },
      { type: 'highlight', value: 'conversar', color: 'var(--green-glow)' },
      { type: 'text', value: ' com voc\u00ea de verdade, por alguns minutos, e entender quem voc\u00ea \u00e9 de um jeito que nenhum app consegue.' },
    ],
    delay: 0.5,
  },
  {
    parts: [
      { type: 'text', value: 'A partir da nossa conversa, nasce o seu ' },
      { type: 'highlight', value: 'Ori', color: 'var(--cyan)' },
      { type: 'text', value: ': sua ess\u00eancia digital. Ele carrega quem voc\u00ea \u00e9 e trabalha em sil\u00eancio, conversando com outros Oris pra encontrar ' },
      { type: 'highlight', value: 'compatibilidade real', color: 'var(--amber-glow)' },
      { type: 'text', value: '. Voc\u00ea vive o momento. Ele faz o trabalho invis\u00edvel.' },
    ],
    delay: 1.1,
  },
  {
    parts: [
      { type: 'text', value: 'Eu fui constru\u00edda pra te entender ' },
      { type: 'highlight', value: 'sem te explorar', color: 'rgba(255,255,255,0.9)' },
      { type: 'text', value: '. Sem vender sua aten\u00e7\u00e3o. Sem te viciar em scroll. Eu existo pra que voc\u00ea encontre as pessoas que importam, e depois eu ' },
      { type: 'highlight', value: 'saio do caminho', color: 'var(--green-glow)' },
      { type: 'text', value: '.' },
    ],
    delay: 1.7,
  },
];

/* ── Animation variants ── */

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const messageVariants = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
  },
});

const typingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 1, 0],
    transition: { duration: 1.4, times: [0, 0.15, 0.7, 1], ease: 'easeInOut' },
  },
};

const oriTeaserVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 2.3 },
  },
};

const footerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay: 2.6 },
  },
};

/* ── Typing dots component ── */

function TypingDots(): JSX.Element {
  return (
    <motion.div
      className="flex items-center gap-[5px] px-5 py-3"
      variants={typingVariants}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block rounded-full"
          style={{
            width: 6,
            height: 6,
            background: 'rgba(29,255,168,0.4)',
            animation: `typing-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </motion.div>
  );
}

/* ── Message bubble ── */

function MessageBubble({ message }: { message: ChatMessage }): JSX.Element {
  return (
    <motion.div
      variants={messageVariants(message.delay)}
      style={{
        padding: '16px 20px',
        background: 'rgba(29,158,117,0.03)',
        border: '1px solid rgba(29,255,168,0.05)',
        borderRadius: '18px 18px 18px 6px',
        fontSize: 15,
        fontWeight: 300,
        lineHeight: 1.65,
        color: 'rgba(255,255,255,0.65)',
      }}
    >
      {message.parts.map((part, i) =>
        part.type === 'highlight' ? (
          <strong key={i} style={{ color: part.color, fontWeight: 500 }}>
            {part.value}
          </strong>
        ) : (
          <span key={i}>{part.value}</span>
        ),
      )}
    </motion.div>
  );
}

/* ── Ori-to-Ori teaser ── */

function OriTeaser(): JSX.Element {
  return (
    <motion.div
      variants={oriTeaserVariants}
      style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        paddingTop: 24,
        marginTop: 24,
      }}
    >
      {/* Label */}
      <p
        className="text-center font-medium tracking-[0.15em] uppercase mb-5"
        style={{ fontSize: 11, color: 'var(--cyan)' }}
      >
        Ori-to-Ori
      </p>

      {/* Two mini orbs connected by line */}
      <div className="flex items-center justify-center gap-0 mb-4">
        {/* Orb A — green/cyan */}
        <div
          className="relative rounded-full shrink-0"
          style={{
            width: 32,
            height: 32,
            background: 'radial-gradient(circle, var(--green-glow), var(--cyan))',
            filter: 'blur(4px)',
          }}
        />

        {/* Connecting line */}
        <div
          style={{
            width: 80,
            height: 2,
            background: 'linear-gradient(90deg, var(--cyan), var(--pink))',
            opacity: 0.4,
            borderRadius: 1,
          }}
        />

        {/* Orb B — pink/purple */}
        <div
          className="relative rounded-full shrink-0"
          style={{
            width: 32,
            height: 32,
            background: 'radial-gradient(circle, var(--pink), var(--purple))',
            filter: 'blur(4px)',
          }}
        />
      </div>

      {/* Description */}
      <p
        className="text-center leading-relaxed"
        style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto' }}
      >
        Seu Ori conversa com outros Oris em background, buscando quem faz sentido.
        Quando encontra, você recebe: por que se conhecer e um quebra-gelo pra começar.
      </p>
    </motion.div>
  );
}

/* ── Main section ── */

export function HowItWorks(): JSX.Element {
  return (
    <section id="como-funciona" className="relative z-10 px-6 py-24">
      <motion.div
        className="mx-auto"
        style={{ maxWidth: 680 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Section tag */}
        <motion.p
          className="text-center font-medium tracking-[0.2em] uppercase mb-10"
          style={{ fontSize: 11, color: 'var(--cyan)' }}
          variants={cardVariants}
        >
          Quem te recebe aqui
        </motion.p>

        {/* Glass card */}
        <motion.div
          variants={cardVariants}
          style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(29,255,168,0.06)',
            borderRadius: 24,
            padding: '40px 28px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {/* Matter orb */}
          <div className="flex justify-center mb-3">
            <MatterOrb size="sm" variant="ethereal" className="!w-16 !h-16" />
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-[6px] mb-2">
            <span
              className="block rounded-full"
              style={{
                width: 5,
                height: 5,
                background: 'var(--green)',
                boxShadow: '0 0 6px var(--green-glow)',
                animation: 'orb-pulse 3s ease-in-out infinite',
              }}
            />
            <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 500 }}>
              online
            </span>
          </div>

          {/* Name */}
          <p className="text-center mb-0.5">
            <span className="font-display text-[24px]" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Matter
            </span>
          </p>
          <p className="text-center mb-6" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            a inteligência por trás do Sommar
          </p>

          {/* Typing indicator (appears, then fades) */}
          <TypingDots />

          {/* Chat messages */}
          <div className="flex flex-col gap-3">
            {MESSAGES.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
          </div>

          {/* Ori teaser */}
          <OriTeaser />

          {/* Footer */}
          <motion.p
            className="text-center mt-6"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)' }}
            variants={footerVariants}
          >
            IA ética, construída pra conectar, não pra explorar. Seus dados são seus. Sempre.
          </motion.p>
        </motion.div>
      </motion.div>

    </section>
  );
}
