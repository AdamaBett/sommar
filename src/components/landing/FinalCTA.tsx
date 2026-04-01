'use client';

import { NeonCTA } from '@/components/ui/NeonCTA';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

export function FinalCTA(): JSX.Element {
  return (
    <section className="relative z-10 px-6 py-28 md:py-36">
      {/* Glow de fundo */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(29,255,168,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-xl text-center">
        <ScrollReveal>
          <p
            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-5"
            style={{ color: 'var(--green-glow)' }}
          >
            Pronto para o próximo passo?
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="font-display text-[clamp(26px,5vw,44px)] font-light leading-tight mb-5">
            Sua próxima conexão importante{' '}
            <em className="text-gradient-green not-italic">
              não vai aparecer no feed
            </em>
            .
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.14}>
          <p
            className="text-base leading-relaxed mb-10 max-w-md mx-auto"
            style={{ color: 'var(--text-medium)' }}
          >
            Cria teu Ori em 5 minutos. Vai ao evento. Encontra quem importa.
            A IA faz o trabalho invisível — você só aparece.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-col items-center gap-5">
            <NeonCTA href="/login" size="lg">
              Criar meu Ori agora
            </NeonCTA>

            <a
              href="/login?role=organizer"
              className="text-sm transition-opacity duration-200 hover:opacity-100"
              style={{ color: 'var(--text-subtle)', opacity: 0.7 }}
            >
              Você organiza eventos?{' '}
              <span
                className="underline underline-offset-2"
                style={{ color: 'var(--purple)' }}
              >
                Crie seu primeiro evento aqui →
              </span>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.28}>
          <p
            className="mt-8 text-xs"
            style={{ color: 'var(--text-subtle)', opacity: 0.5 }}
          >
            Gratuito para participantes · Sem spam · Seus dados são seus
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
