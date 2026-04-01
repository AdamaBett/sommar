'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface Step {
  title: string;
  description: string;
  color: string;
  glowColor: string;
  icon: string;
}

const STEPS: Step[] = [
  {
    title: 'Conte quem você é',
    description:
      'Nada de formulários intermináveis. Uma conversa natural com nossa IA que te entende de verdade. Em poucos minutos, ela captura suas camadas: o que te move, o que você sabe fazer, o que busca, como se conecta.',
    color: 'var(--green)',
    glowColor: 'var(--green-glow)',
    icon: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z',
  },
  {
    title: 'A IA revela quem vale conhecer',
    description:
      'Não por aparência. Por essência, interesses e intenção. O Sommar cruza perfis profundos e te mostra por que duas pessoas devem se conhecer. Pode ser um amor, uma parceria, uma amizade, uma mentoria.',
    color: 'var(--amber)',
    glowColor: 'var(--amber-glow)',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
  },
  {
    title: 'Encontre no mundo real',
    description:
      'No evento, no momento certo. Envie mensagens temporárias para quem a IA sugeriu. Sem pressão, sem compromisso eterno. O encontro acontece presencialmente, olho no olho. Vocês decidem o que nasce dali.',
    color: 'var(--coral)',
    glowColor: 'var(--coral-glow)',
    icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HowItWorks(): JSX.Element {
  return (
    <section className="relative z-10 px-6 py-24">
      <motion.div
        className="mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
      >
        {/* Section label */}
        <motion.p
          className="text-center text-[11px] font-medium tracking-[0.2em] uppercase mb-10"
          style={{ color: 'var(--text-subtle)' }}
          variants={cardVariants}
        >
          Como funciona
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step) => (
            <motion.div key={step.title} variants={cardVariants}>
              <GlassCard padding="lg" className="flex flex-col h-full">
                {/* Icon */}
                <div>
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke={step.glowColor}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={step.icon}
                    />
                  </svg>
                </div>

                {/* Title */}
                <h3
                  className="font-display text-lg font-light mt-4 leading-snug"
                  style={{ color: 'var(--text-strong)' }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-medium)' }}
                >
                  {step.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
