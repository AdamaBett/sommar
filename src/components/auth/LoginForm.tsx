'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MatterOrb } from '@/components/ui/MatterOrb';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { APP_NAME, STRINGS } from '@/lib/constants';

function GoogleIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginForm(): JSX.Element {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/lobby';
  const authError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(
    authError === 'auth' ? 'Falha na autenticação. Tente novamente.' : null
  );

  const supabase = createClient();

  async function handleGoogleLogin(): Promise<void> {
    setError(null);
    setGoogleLoading(true);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (oauthError) {
        setError('Falha ao conectar com Google. Tente novamente.');
        setGoogleLoading(false);
      }
      // Se não houve erro, o redirect acontece automaticamente
    } catch {
      setError('Erro inesperado. Tente novamente.');
      setGoogleLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Informe seu email.');
      return;
    }

    setEmailLoading(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (otpError) {
        setError('Falha ao enviar link. Verifique o email e tente novamente.');
      } else {
        setEmailSent(true);
      }
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] flex flex-col items-center gap-8">
      {/* Matter Orb */}
      <MatterOrb size="md" />

      {/* Headline */}
      <div className="text-center space-y-2">
        <h1 className="font-[var(--font-fraunces)] text-2xl font-light text-[var(--text-strong)]">
          Bem-vindo ao {APP_NAME}
        </h1>
        <p className="text-sm text-[var(--text-medium)]">
          Entre para descobrir conexões que fazem sentido.
        </p>
      </div>

      <GlassCard className="w-full" padding="lg">
        <div className="flex flex-col gap-5">
          {/* Erro global */}
          {error && (
            <div className="rounded-xl bg-[var(--coral)]/10 border border-[var(--coral)]/20 px-4 py-3">
              <p className="text-xs text-[var(--coral)]">{error}</p>
            </div>
          )}

          {emailSent ? (
            /* Estado de email enviado */
            <div className="text-center space-y-3 py-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-[var(--green)]/10 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                    stroke="var(--green-glow)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="font-[var(--font-fraunces)] text-lg font-light text-[var(--text-strong)]">
                Verifique seu email
              </h2>
              <p className="text-sm text-[var(--text-medium)]">
                Enviamos um link de acesso para{' '}
                <span className="text-[var(--text-strong)] font-medium">{email}</span>.
                Clique no link para entrar.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="text-xs text-[var(--text-subtle)] hover:text-[var(--text-medium)] transition-colors mt-2"
              >
                Usar outro email
              </button>
            </div>
          ) : (
            <>
              {/* Botao Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className={[
                  'w-full h-12 px-6 rounded-full',
                  'bg-white text-[#1f1f1f] font-medium text-sm',
                  'inline-flex items-center justify-center gap-3',
                  'transition-all duration-200 ease-out',
                  'hover:bg-gray-100 hover:shadow-[0_1px_3px_rgba(0,0,0,0.3)]',
                  'active:scale-[0.97]',
                  'disabled:opacity-40 disabled:pointer-events-none',
                  'cursor-pointer select-none',
                ].join(' ')}
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continuar com Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-xs text-[var(--text-subtle)]">ou</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Email form */}
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={emailLoading}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  loading={emailLoading}
                >
                  Continuar com email
                </Button>
              </form>
            </>
          )}
        </div>
      </GlassCard>

      {/* Termos e privacidade */}
      <p className="text-[11px] text-[var(--text-subtle)] text-center leading-relaxed max-w-[320px]">
        Ao continuar, você concorda com nossos{' '}
        <Link href="/termos" className="underline hover:text-[var(--text-medium)] transition-colors">
          Termos de Uso
        </Link>{' '}
        e{' '}
        <Link href="/privacidade" className="underline hover:text-[var(--text-medium)] transition-colors">
          Política de Privacidade
        </Link>
        .
      </p>

      {/* Voltar */}
      <Link
        href="/"
        className="text-xs text-[var(--text-subtle)] hover:text-[var(--text-medium)] transition-colors"
      >
        {STRINGS.back}
      </Link>
    </div>
  );
}
