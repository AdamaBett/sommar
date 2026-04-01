'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface StatCard {
  stat: string;
  description: string;
  source: string;
  color: string;
  glowColor: string;
}

/* Potential stats — the wasted opportunity */
const POTENTIAL_STATS: StatCard[] = [
  {
    stat: '78M',
    description: 'de brasileiros foram a pelo menos um evento ao vivo em 2023',
    source: 'ABRAPE / Ministério da Cultura, 2024',
    color: 'var(--amber)',
    glowColor: 'var(--amber-glow)',
  },
  {
    stat: '~3%',
    description: 'das pessoas presentes em um evento chegam a trocar mais do que um "oi"',
    source: 'Estimativa baseada em dados de mercado',
    color: 'var(--green)',
    glowColor: 'var(--green-glow)',
  },
  {
    stat: '68%',
    description: 'das amizades e parcerias duradouras nasceram em encontros presenciais',
    source: 'Gallup Friendship Report, 2023',
    color: 'var(--purple)',
    glowColor: 'var(--purple)',
  },
];

const STATS: StatCard[] = [
  {
    stat: '79%',
    description: 'dos jovens adultos relatam esgotamento com aplicativos de encontros e conexão digital',
    source: 'Forbes Health, 2024',
    color: 'var(--coral)',
    glowColor: 'var(--coral-glow)',
  },
  {
    stat: '30%',
    description: 'dos adultos sentem solidão pelo menos uma vez por semana, mesmo cercados de telas',
    source: 'American Psychiatric Association, 2024',
    color: 'var(--amber)',
    glowColor: 'var(--amber-glow)',
  },
  {
    stat: '1.09M',
    description: 'de usuários abandonaram os maiores aplicativos de encontros em apenas um ano',
    source: 'Ofcom UK, 2024',
    color: 'var(--cyan)',
    glowColor: 'var(--cyan)',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

export function ProblemStats(): JSX.Element {
  return (
    <section id="sobre" className="relative z-10 px-6 py-24">
      <motion.div
        className="mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
      >
        {/* Section intro */}
        <motion.div className="text-center mb-12" variants={cardVariants}>
          <span
            className="text-[11px] font-medium tracking-[0.2em] uppercase"
            style={{ color: 'var(--coral-glow)' }}
          >
            O problema
          </span>
          <h2 className="font-display text-[clamp(22px,4.5vw,36px)] font-light leading-snug mt-4">
            As pessoas estão cada vez mais conectadas digitalmente.
            <br />
            E cada vez mais sozinhas.
          </h2>
        </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STATS.map((card) => (
          <motion.div key={card.stat} variants={cardVariants}>
            <GlassCard
              padding="lg"
              className="flex flex-col items-center text-center h-full"
            >
              <span
                className="font-display text-[40px] font-light leading-none"
                style={{ color: card.glowColor }}
              >
                {card.stat}
              </span>

              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: 'var(--text-medium)' }}
              >
                {card.description}
              </p>

              <span
                className="mt-auto pt-4 text-[10px] tracking-wide uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                {card.source}
              </span>
            </GlassCard>
          </motion.div>
        ))}
      </div>

        {/* Potential section */}
        <motion.div className="text-center mt-20 mb-12" variants={cardVariants}>
          <span
            className="text-[11px] font-medium tracking-[0.2em] uppercase"
            style={{ color: 'var(--amber-glow)' }}
          >
            O potencial desperdiçado
          </span>
          <h2 className="font-display text-[clamp(22px,4.5vw,36px)] font-light leading-snug mt-4">
            Milhões de pessoas vão a eventos e voltam
            <br />
            sem conhecer quem estava{' '}
            <span style={{ color: 'var(--amber-glow)' }}>ali do lado</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {POTENTIAL_STATS.map((card) => (
            <motion.div key={card.stat} variants={cardVariants}>
              <GlassCard
                padding="lg"
                className="flex flex-col items-center text-center h-full"
              >
                <span
                  className="font-display text-[40px] font-light leading-none"
                  style={{ color: card.glowColor }}
                >
                  {card.stat}
                </span>

                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: 'var(--text-medium)' }}
                >
                  {card.description}
                </p>

                <span
                  className="mt-auto pt-4 text-[10px] tracking-wide uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {card.source}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
