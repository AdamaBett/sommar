'use client';

import { motion } from 'framer-motion';
import { CONNECTION_TYPES } from '@/lib/constants';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function NotJustDating(): JSX.Element {
  return (
    <section className="relative z-10 px-6 py-28">
      <motion.div
        className="mx-auto max-w-[640px] text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Label */}
        <motion.span
          className="text-[11px] font-medium tracking-[0.2em] uppercase"
          style={{ color: 'var(--amber-glow)' }}
          variants={textVariants}
        >
          Muito além de um aplicativo de encontros
        </motion.span>

        {/* Headline */}
        <motion.h2
          className="font-display text-[clamp(22px,4.5vw,36px)] font-light leading-snug mt-5"
          variants={textVariants}
        >
          Você não cabe em uma categoria.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="mt-5 text-base leading-relaxed"
          style={{ color: 'var(--text-medium)' }}
          variants={textVariants}
        >
          No mesmo evento, você pode encontrar um amor, uma amiga pra vida,
          um co-fundador, um mentor, uma comunidade. O Sommar não te obriga
          a escolher o que está buscando. Ele entende suas múltiplas dimensões
          e mostra por que duas pessoas devem se conhecer. O tipo de vínculo,
          vocês decidem.
        </motion.p>

        {/* Connection type pills */}
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-3"
          variants={containerVariants}
        >
          {CONNECTION_TYPES.map((type) => (
            <motion.span
              key={type.id}
              variants={pillVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium select-none"
              style={{
                background: `${type.color}10`,
                border: `1px solid ${type.color}30`,
                color: type.color,
              }}
            >
              <span className="text-base" aria-hidden="true">
                {type.emoji}
              </span>
              {type.label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
