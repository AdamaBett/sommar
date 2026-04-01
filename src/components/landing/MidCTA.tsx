'use client';

import { NeonCTA } from '@/components/ui/NeonCTA';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

export function MidCTA(): JSX.Element {
  return (
    <section className="relative z-10 px-6 py-16 text-center">
      <ScrollReveal>
        <p
          className="font-display text-[clamp(18px,3vw,26px)] font-light mb-6 max-w-md mx-auto leading-snug"
          style={{ color: 'var(--text-medium)' }}
        >
          Já sabe o suficiente para{' '}
          <span style={{ color: 'var(--text-strong)' }}>experimentar</span>.
        </p>
        <NeonCTA href="/login" size="md">
          Quero entrar
        </NeonCTA>
      </ScrollReveal>
    </section>
  );
}
