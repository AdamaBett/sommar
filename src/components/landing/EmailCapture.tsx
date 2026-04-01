'use client';

import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

/* ------------------------------------------------------------------ */
/*  Constantes                                                         */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EmailCapture(): JSX.Element {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Digite seu email.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Email inválido.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // Simulação de envio (Supabase integration comes later)
    setTimeout(() => {
      setStatus('success');
    }, 800);
  }

  return (
    <section id="comecar" className="relative z-10 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-xl text-center">
        <ScrollReveal>
          <h2 className="font-display text-[clamp(24px,5vw,40px)] font-light leading-tight mb-4">
            Faça parte do{' '}
            <em className="text-gradient-green not-italic">começo</em>.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p
            className="text-base leading-relaxed mb-10 max-w-md mx-auto"
            style={{ color: 'var(--text-medium)' }}
          >
            Estamos construindo algo que acreditamos que o mundo precisa.
            Um espaço onde conexão humana é tratada com o cuidado que merece.
            Deixe seu email e seja uma das primeiras pessoas a experimentar.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          {status === 'success' ? (
            <div
              className="glass rounded-2xl p-8 text-center"
            >
              <p className="text-lg font-light text-[var(--text-strong)]">
                Pronto! Você está na lista.
              </p>
              <p className="mt-1 text-2xl">
                &#x1F49A;
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3"
            >
              <div className="flex-1 flex flex-col">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') {
                      setStatus('idle');
                      setErrorMessage('');
                    }
                  }}
                  placeholder="seu@email.com"
                  className={[
                    'w-full h-12 px-5 rounded-xl text-sm',
                    'bg-white/[0.04] text-[var(--text-strong)]',
                    'border font-[var(--font-outfit)] font-light',
                    'placeholder:text-[var(--text-subtle)]',
                    'outline-none transition-all duration-200',
                    'focus:border-[var(--green)] focus:bg-white/[0.06]',
                    'focus:shadow-[0_0_0_2px_rgba(29,158,117,0.15)]',
                    status === 'error'
                      ? 'border-[var(--coral)]'
                      : 'border-[var(--border-subtle)]',
                  ].join(' ')}
                  disabled={status === 'loading'}
                />
                {errorMessage && (
                  <span className="text-xs text-[var(--coral)] mt-1.5 text-left">
                    {errorMessage}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={status === 'loading'}
                className="shrink-0 sm:w-auto"
              >
                Quero participar
              </Button>
            </form>
          )}
        </ScrollReveal>

        {/* Social proof */}
        <ScrollReveal delay={0.3}>
          <p
            className="mt-6 text-sm"
            style={{ color: 'var(--text-subtle)' }}
          >
            <span style={{ color: 'var(--green-glow)' }}>
              Vagas limitadas
            </span>{' '}
            no acesso antecipado. Quem entra primeiro molda o futuro.
          </p>
        </ScrollReveal>

        {/* Privacy note */}
        <ScrollReveal delay={0.35}>
          <p
            className="mt-3 text-xs"
            style={{ color: 'var(--text-subtle)', opacity: 0.6 }}
          >
            Sem spam. Só conexão.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
