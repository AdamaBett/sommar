'use client';

import Link from 'next/link';
import { OrganizerHeader } from '@/components/organizer/OrganizerHeader';
import { cn } from '@/lib/utils';

// Mock analytics data
const MOCK_EVENT = {
  id: '1',
  name: 'Meetup Tech',
  slug: 'meetup-tech-abril',
  startTime: '2026-04-10T19:00:00-03:00',
  endTime: '2026-04-10T22:00:00-03:00',
  lobbyState: 'historical' as const,
  matterContext: 'Meetup de tecnologia em Florianópolis. Desenvolvimento web, mobile, IA. 50-100 pessoas. Foco em networking profissional e troca de experiências.',
  stats: {
    totalParticipants: 42,
    totalInterested: 67,
    correiosSent: 31,
    connectionRate: 0.38,
    confirmedConnections: 12,
    facetDistribution: {
      essencia: 42,
      profissional: 38,
      social: 29,
      criativo: 15,
      intimo: 8,
    },
    topFacetCombos: [
      { combo: 'Profissional + Social', count: 14 },
      { combo: 'Profissional + Criativo', count: 8 },
      { combo: 'Social + Criativo', count: 6 },
    ],
    correiosByHour: [
      { hour: '19h', count: 5 },
      { hour: '20h', count: 12 },
      { hour: '21h', count: 10 },
      { hour: '22h', count: 4 },
    ],
  },
  safetyAlerts: 0,
};

const FACET_COLORS: Record<string, string> = {
  essencia: 'bg-[var(--green-glow)]',
  intimo: 'bg-[var(--pink)]',
  criativo: 'bg-[var(--cyan)]',
  profissional: 'bg-[var(--amber-glow)]',
  social: 'bg-[var(--purple)]',
};

const FACET_LABELS: Record<string, string> = {
  essencia: 'Essência',
  intimo: 'Íntimo',
  criativo: 'Criativo',
  profissional: 'Profissional',
  social: 'Social',
};

export default function EventAnalyticsPage(): JSX.Element {
  const event = MOCK_EVENT; // TODO: fetch from Supabase using params.id

  const maxFacetCount = Math.max(...Object.values(event.stats.facetDistribution));

  return (
    <div className="min-h-screen">
      <OrganizerHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href="/organizer" className="text-xs text-white/40 hover:text-white/60 transition-colors mb-2 inline-block">
              &larr; Voltar aos eventos
            </Link>
            <h2 className="font-display text-2xl text-white">{event.name}</h2>
            <p className="text-sm text-white/40 mt-1">
              {new Date(event.startTime).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/e/${event.slug}`}
              target="_blank"
              className="px-4 py-2 rounded-xl text-xs text-white/50 border border-white/[0.06] hover:bg-white/[0.04] transition-all"
            >
              Ver página pública
            </Link>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs text-white/50 border border-white/[0.06] hover:bg-white/[0.04] transition-all"
              onClick={() => {
                // TODO: gerar QR code real
                alert('QR Code de check-in (implementar com biblioteca de QR)');
              }}
            >
              Gerar QR Check-in
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Interessados" value={event.stats.totalInterested} color="amber" />
          <StatCard label="Check-ins" value={event.stats.totalParticipants} color="green" />
          <StatCard label="Correios enviados" value={event.stats.correiosSent} color="cyan" />
          <StatCard label="Taxa de conexão" value={`${Math.round(event.stats.connectionRate * 100)}%`} color="green" />
          <StatCard label="Conexões confirmadas" value={event.stats.confirmedConnections} color="purple" />
        </div>

        {/* Distribuição de facetas */}
        <section className={cn('rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm')}>
          <h3 className="font-display text-lg text-white mb-4">Distribuição de facetas ativas</h3>
          <p className="text-xs text-white/40 mb-6">
            Quais facetas os participantes ativaram neste evento.
          </p>
          <div className="space-y-3">
            {Object.entries(event.stats.facetDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([facet, count]) => (
                <div key={facet} className="flex items-center gap-3">
                  <span className="text-sm text-white/60 w-24">{FACET_LABELS[facet] ?? facet}</span>
                  <div className="flex-1 h-6 bg-white/[0.03] rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', FACET_COLORS[facet])}
                      style={{ width: `${(count / maxFacetCount) * 100}%`, opacity: 0.7 }}
                    />
                  </div>
                  <span className="text-sm text-white/80 w-8 text-right">{count}</span>
                </div>
              ))}
          </div>
        </section>

        {/* Top combos + Correios por hora */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top combos de facetas */}
          <section className={cn('rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm')}>
            <h3 className="font-display text-lg text-white mb-4">Top combos de facetas</h3>
            <div className="space-y-3">
              {event.stats.topFacetCombos.map((combo, i) => (
                <div key={combo.combo} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30 w-5">#{i + 1}</span>
                    <span className="text-sm text-white/70">{combo.combo}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{combo.count} matches</span>
                </div>
              ))}
            </div>
          </section>

          {/* Correios por hora */}
          <section className={cn('rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm')}>
            <h3 className="font-display text-lg text-white mb-4">Engajamento por hora</h3>
            <div className="flex items-end gap-3 h-32">
              {event.stats.correiosByHour.map(item => {
                const maxCount = Math.max(...event.stats.correiosByHour.map(h => h.count));
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={item.hour} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-white/60">{item.count}</span>
                    <div
                      className="w-full rounded-t-lg bg-[var(--green-glow)]/40 transition-all duration-500"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    />
                    <span className="text-xs text-white/30">{item.hour}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Segurança */}
        <section className={cn('rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-white">Segurança</h3>
            {event.safetyAlerts > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium text-red-400 bg-red-500/10">
                {event.safetyAlerts} alerta(s) pendente(s)
              </span>
            )}
          </div>
          {event.safetyAlerts === 0 ? (
            <p className="text-sm text-white/40">Nenhum alerta de segurança neste evento.</p>
          ) : (
            <p className="text-sm text-white/60">
              Verifique a aba de Segurança para detalhes dos alertas.
            </p>
          )}
        </section>

        {/* Contexto da Matter */}
        <section className={cn('rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm')}>
          <h3 className="font-display text-lg text-white mb-2">Contexto da Matter</h3>
          <p className="text-xs text-white/40 mb-3">
            Este texto contextualiza a IA para o seu evento.
          </p>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-sm text-white/60 leading-relaxed">
            {event.matterContext}
          </div>
        </section>
      </main>
    </div>
  );
}

// ── Componente auxiliar ─────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  color: 'green' | 'amber' | 'cyan' | 'purple' | 'coral';
}

const COLOR_MAP: Record<string, string> = {
  green: 'text-[var(--green-glow)]',
  amber: 'text-[var(--amber-glow)]',
  cyan: 'text-[var(--cyan)]',
  purple: 'text-[var(--purple)]',
  coral: 'text-[var(--coral)]',
};

function StatCard({ label, value, color }: StatCardProps): JSX.Element {
  return (
    <div className={cn('rounded-2xl p-4 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm')}>
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className={cn('text-2xl font-semibold', COLOR_MAP[color])}>{value}</p>
    </div>
  );
}
