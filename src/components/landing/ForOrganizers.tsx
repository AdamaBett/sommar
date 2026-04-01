'use client';

import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

/* ------------------------------------------------------------------ */
/*  Ícones inline (evita dependência externa)                          */
/* ------------------------------------------------------------------ */

function ChartIcon(): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 4 5-9" />
    </svg>
  );
}

function StarIcon(): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ZapIcon(): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Bullet points data                                                 */
/* ------------------------------------------------------------------ */

interface BulletPoint {
  icon: () => JSX.Element;
  title: string;
  description: string;
}

const BULLETS: BulletPoint[] = [
  {
    icon: ChartIcon,
    title: 'Engajamento mensurável',
    description: 'Acompanhe em tempo real quantas conexões genuínas seu evento gerou. Dados reais sobre o que aconteceu entre as pessoas, não apenas curtidas ou visualizações.',
  },
  {
    icon: StarIcon,
    title: 'Diferencial competitivo',
    description: 'Ofereça algo que nenhum outro evento oferece: uma experiência de conexão humana inteligente e personalizada para cada participante.',
  },
  {
    icon: ZapIcon,
    title: 'Integração instantânea',
    description: 'Um código QR no local e pronto. Seus participantes entram em segundos, sem cadastros longos, sem atrito. A tecnologia desaparece para a conexão aparecer.',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ForOrganizers(): JSX.Element {
  return (
    <section id="organizadores" className="relative z-10 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <GlassCard
            as="div"
            padding="lg"
            className="border-[var(--purple)]/20 relative overflow-hidden"
          >
            {/* Glow de fundo sutil em purple */}
            <div
              className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full opacity-[0.07]"
              style={{
                background: 'radial-gradient(circle, var(--purple) 0%, transparent 70%)',
              }}
            />

            {/* Label */}
            <span
              className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-5"
              style={{ color: 'var(--purple)' }}
            >
              Para organizadores
            </span>

            {/* Headline */}
            <h2 className="font-display text-[clamp(22px,4vw,36px)] font-light leading-tight mb-4">
              Transforme seu evento em{' '}
              <em className="not-italic" style={{ color: 'var(--purple)' }}>
                ponto de encontro real
              </em>
              .
            </h2>

            {/* Body */}
            <p
              className="text-base leading-relaxed mb-8 max-w-xl"
              style={{ color: 'var(--text-medium)' }}
            >
              O Sommar adiciona uma camada de conexão humana aos seus eventos.
              Seus participantes se encontram de verdade, criam laços que vão
              além do evento, e você acompanha o impacto real que está gerando.
            </p>

            {/* Bullet points */}
            <div className="flex flex-col gap-5 mb-10">
              {BULLETS.map((bullet, index) => (
                <ScrollReveal key={bullet.title} delay={0.1 * (index + 1)}>
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        color: 'var(--purple)',
                      }}
                    >
                      <bullet.icon />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-strong)] mb-0.5">
                        {bullet.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                        {bullet.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* CTA */}
            <ScrollReveal delay={0.4}>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <a href="/login?role=organizer">
                  <Button variant="secondary" size="md">
                    Criar meu primeiro evento
                  </Button>
                </a>
                <a
                  href="mailto:contato@sommar.app"
                  className="text-sm flex items-center gap-1 pt-2.5 transition-colors duration-200 hover:opacity-80"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  ou fale com a gente →
                </a>
              </div>
            </ScrollReveal>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
