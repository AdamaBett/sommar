'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

// Mock data do usuario
const MOCK_USER = {
  name: 'Matheus Betinelli',
  email: 'matheus@sommar.app',
};

function SectionHeader({ title }: { title: string }): React.ReactElement {
  return (
    <h2 className="font-display text-base font-medium text-[var(--text-strong)] mb-3">
      {title}
    </h2>
  );
}

function Toggle({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}): React.ReactElement {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-3"
      type="button"
    >
      <span className="text-sm text-[var(--text-medium)]">{label}</span>
      <div
        className={cn(
          'w-10 h-[22px] rounded-full relative transition-colors duration-200',
          enabled ? 'bg-[var(--green)]' : 'bg-[rgba(255,255,255,0.1)]'
        )}
      >
        <div
          className={cn(
            'w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-transform duration-200',
            enabled ? 'translate-x-[20px]' : 'translate-x-[2px]'
          )}
        />
      </div>
    </button>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-[var(--text-subtle)]">{label}</span>
      <span className="text-sm text-[var(--text-medium)]">{value}</span>
    </div>
  );
}

function Divider(): React.ReactElement {
  return <div className="h-px bg-[rgba(255,255,255,0.06)]" />;
}

export default function SettingsPage(): React.ReactElement {
  const router = useRouter();
  const [genderVisible, setGenderVisible] = useState(true);
  const [orientationVisible, setOrientationVisible] = useState(false);
  const [relationshipVisible, setRelationshipVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleExportData = useCallback((): void => {
    alert('Seus dados estão sendo preparados para exportação. Você receberá um arquivo JSON em breve.');
  }, []);

  const handleDeleteAccount = useCallback((): void => {
    const confirmed = confirm(
      'Tem certeza que deseja deletar sua conta? Todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.'
    );
    if (confirmed) {
      alert('Conta marcada para exclusão. Você receberá um email de confirmação.');
    }
  }, []);

  const handleLogout = useCallback(async (): Promise<void> => {
    setLoggingOut(true);
    try {
      if (isSupabaseConfigured) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
      router.push('/');
    } catch {
      // Em caso de erro, redireciona mesmo assim
      router.push('/');
    }
  }, [router]);

  return (
    <div className="px-5 pb-28 pt-4 max-w-lg mx-auto">
      {/* Header com voltar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-[var(--text-subtle)] hover:text-[var(--text-medium)] transition-colors"
          type="button"
          aria-label="Voltar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L6 10L12 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-strong)]">
          Configurações
        </h1>
      </div>

      {/* Conta */}
      <section className="mb-6">
        <SectionHeader title="Conta" />
        <GlassCard padding="md">
          <InfoRow label="Nome" value={MOCK_USER.name} />
          <Divider />
          <InfoRow label="Email" value={MOCK_USER.email} />
        </GlassCard>
      </section>

      {/* Privacidade */}
      <section className="mb-6">
        <SectionHeader title="Privacidade" />
        <GlassCard padding="md">
          <Toggle
            label="Gênero visível no perfil"
            enabled={genderVisible}
            onToggle={() => setGenderVisible(!genderVisible)}
          />
          <Divider />
          <Toggle
            label="Orientação sexual visível"
            enabled={orientationVisible}
            onToggle={() => setOrientationVisible(!orientationVisible)}
          />
          <Divider />
          <Toggle
            label="Modelo relacional visível"
            enabled={relationshipVisible}
            onToggle={() => setRelationshipVisible(!relationshipVisible)}
          />
        </GlassCard>
      </section>

      {/* Dados */}
      <section className="mb-6">
        <SectionHeader title="Dados" />
        <GlassCard padding="md">
          <button
            onClick={handleExportData}
            className="flex items-center justify-between w-full py-3"
            type="button"
          >
            <div>
              <p className="text-sm text-[var(--text-medium)] text-left">
                Exportar meus dados
              </p>
              <p className="text-[11px] text-[var(--text-subtle)] mt-0.5 text-left">
                Baixar todos os dados em formato JSON (LGPD Art. 18)
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 ml-3"
            >
              <path
                d="M8 3V11M8 11L5 8M8 11L11 8"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 13H13"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Divider />
          <button
            onClick={handleDeleteAccount}
            className="flex items-center justify-between w-full py-3"
            type="button"
          >
            <div>
              <p className="text-sm text-[#FF4444] text-left">
                Deletar minha conta
              </p>
              <p className="text-[11px] text-[var(--text-subtle)] mt-0.5 text-left">
                Remove permanentemente todos os seus dados
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 ml-3"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="#FF4444"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </GlassCard>
      </section>

      {/* Sessao */}
      <section className="mb-6">
        <SectionHeader title="Sessão" />
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            'w-full py-3.5 rounded-xl text-sm font-medium',
            'transition-all duration-200',
            loggingOut
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:brightness-110 active:scale-[0.98]'
          )}
          style={{
            backgroundColor: 'rgba(255,68,68,0.12)',
            color: '#FF4444',
            border: '1px solid rgba(255,68,68,0.2)',
          }}
          type="button"
        >
          {loggingOut ? 'Saindo...' : 'Sair da conta'}
        </button>
      </section>
    </div>
  );
}
