'use client';

import { motion } from 'framer-motion';
import { MatterOrb } from '@/components/ui/MatterOrb';
import { Button } from '@/components/ui/Button';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function Hero(): JSX.Element {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center z-10">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        <MatterOrb size="xl" />
      </motion.div>

      <motion.h1
        className="font-display text-[clamp(28px,6vw,52px)] font-light leading-tight mt-10 max-w-[640px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        A pessoa certa está{' '}
        <em className="text-gradient-green not-italic">ali do lado</em>.
        <br />
        <span
          className="text-[0.7em]"
          style={{ color: 'var(--text-medium)' }}
        >
          Vocês só não se encontraram{' '}
          <span style={{ color: 'var(--coral-glow)' }}>ainda</span>.
        </span>
      </motion.h1>

      <motion.p
        className="mt-6 text-base max-w-[480px] leading-relaxed"
        style={{ color: 'var(--text-medium)' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        Seu futuro parceiro, sua melhor amiga, seu co-fundador, seu mentor.
        Eles existem e frequentam os mesmos lugares que você. O Sommar usa
        inteligência artificial para revelar quem vale conhecer em eventos
        presenciais. Sem perfis rasos. Sem swipes. Sem algoritmos que te viciam.
      </motion.p>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            document.getElementById('comecar')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Descubra
        </Button>
      </motion.div>

      <motion.p
        className="mt-5 text-xs max-w-[400px] leading-relaxed"
        style={{ color: 'var(--text-subtle)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Gratuito para participantes. IA que te entende sem te reduzir.
      </motion.p>
    </section>
  );
}
