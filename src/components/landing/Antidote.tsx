'use client';

import { motion } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function Antidote(): JSX.Element {
  return (
    <section className="relative z-10 px-6 py-28">
      <motion.div
        className="mx-auto max-w-[600px] text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        {/* Gradient accent line */}
        <div
          className="mx-auto mb-8 h-px w-16"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--green-glow), transparent)',
          }}
        />

        {/* Label */}
        <span
          className="text-[11px] font-medium tracking-[0.2em] uppercase"
          style={{ color: 'var(--green-glow)' }}
        >
          A mudança
        </span>

        {/* Headline */}
        <h2 className="font-display text-[clamp(22px,4.5vw,36px)] font-light leading-snug mt-5">
          Enquanto plataformas te reduzem a perfis rasos e métricas de engajamento,{' '}
          <span className="text-gradient-green">
            nós enxergamos a pessoa inteira.
          </span>
        </h2>

        {/* Body */}
        <p
          className="mt-7 text-base leading-relaxed"
          style={{ color: 'var(--text-medium)' }}
        >
          Você é mais do que uma foto e uma bio de duas linhas. Mais do que um cargo
          no LinkedIn ou um perfil de dating. Você tem camadas, contradições, interesses
          que mudam conforme o contexto. O Sommar foi construído para respeitar essa
          complexidade e conectar você com pessoas que realmente importam.
        </p>

        <p
          className="mt-5 text-base leading-relaxed"
          style={{ color: 'var(--text-medium)' }}
        >
          Uma inteligência que te entende sem te explorar. Que facilita encontros
          sem forçar. Que funciona no mundo real, em eventos presenciais, porque
          conexão genuína acontece quando pessoas se olham nos olhos.
        </p>

        {/* Bottom accent */}
        <div
          className="mx-auto mt-10 h-px w-10"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--green-glow), transparent)',
            opacity: 0.4,
          }}
        />
      </motion.div>
    </section>
  );
}
