'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MatterOrb } from '@/components/ui/MatterOrb';
import { NeonCTA } from '@/components/ui/NeonCTA';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function Hero(): JSX.Element {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center z-10"
    >
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        <MatterOrb size="xl" />
      </motion.div>

      {/* H1 */}
      <motion.h1
        className="font-display text-[clamp(26px,5.5vw,52px)] font-light leading-tight mt-10 max-w-[680px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        O mundo está{' '}
        <em
          style={{
            color: 'var(--coral-glow)',
            fontStyle: 'italic',
            textShadow:
              '0 0 10px rgba(255,107,61,0.55), 0 0 28px rgba(255,107,61,0.25)',
          }}
        >
          desconectado
        </em>
        .
      </motion.h1>

      {/* Sub-heading */}
      <motion.p
        className="mt-5 text-[clamp(16px,2.5vw,22px)] font-light max-w-[480px] leading-relaxed"
        style={{ color: 'var(--text-medium)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        A gente{' '}
        <span className="vai-mudar">vai mudar</span>{' '}
        isso.
      </motion.p>

      {/* Body copy */}
      <motion.p
        className="mt-6 text-sm max-w-[420px] leading-relaxed"
        style={{ color: 'var(--text-subtle)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        Apps de namoro te esgotam. LinkedIn é performance. Redes sociais são barulho.{' '}
        <span style={{ color: 'var(--text-medium)' }}>
          Enquanto isso, as conexões que mudam vidas continuam não acontecendo.
        </span>{' '}
        Até agora...
      </motion.p>

      {/* CTA */}
      <motion.div
        className="mt-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        <NeonCTA href="/login" size="lg">
          Quero ser um dos primeiros
        </NeonCTA>

        <p
          className="text-xs"
          style={{ color: 'var(--text-subtle)' }}
        >
          Alpha test em andamento, seja a revolução que busca.
        </p>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
      >
        <Link
          href="#sobre"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById('sobre')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs transition-colors duration-200"
          style={{ color: 'var(--text-subtle)' }}
        >
          ou descubra como funciona
        </Link>
      </motion.div>
    </section>
  );
}
