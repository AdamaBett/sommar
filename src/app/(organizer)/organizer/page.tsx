'use client';

import Link from 'next/link';
import { OrganizerHeader } from '@/components/organizer/OrganizerHeader';
import { cn } from '@/lib/utils';

// Mock data para demo sem Supabase
const MOCK_EVENTS = [
  {
    id: '1',
    name: 'Festival de Verão',
    slug: 'festival-verao-2026',
    startTime: '2026-04-15T16:00:00-03:00',
    endTime: '2026-04-16T02:00:00-03:00',
    lobbyState: 'pending' as const,
    participantCount: 0,
    interestedCount: 89,
    correiosSent: 0,
    connectionRate: 0,
  },
  {
    id: '2',
    name: 'Meetup Tech',
    slug: 'meetup-tech-abril',
    startTime: '2026-04-10T19:00:00-03:00',
    endTime: '2026-04-10T22:00:00-03:00',
    lobbyState: 'historical' as const,
    participantCount: 42,
    interestedCount: 67,
    correiosSent: 31,
    connectionRate: 0.38,
  },
];

const LOBBY_STATE_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'text-[var(--amber-glow)] bg-[var(--amber-glow)]/10' },
  active: { label: 'Ao vivo', color: 'text-[var(--green-glow)] bg-[var(--green-glow)]/10' },
  historical: { label: 'Encerrado', color: 'text-white/50 bg-white/[0.06]' },
  expired: { label: 'Expirado', color: 'text-white/30 bg-white/[0.04]' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrganizerDashboard(): JSX.Element {
  return (
    <div className="min-h-screen">
      <OrganizerHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header com CTA */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-white">Meus Eventos</h2>
            <p className="text-sm text-white/50 mt-1">
              Gerencie seus eventos e veja analytics de conexão.
            </p>
          </div>
          <Link
            href="/organizer/create"
            className={cn(
              'px-5 py-2.5 rounded-xl text-sm font-medium',
              'bg-[var(--green)] text-black',
              'hover:bg-[var(--green-glow)] hover:shadow-[0_0_20px_rgba(29,255,168,0.3)]',
              'transition-all duration-200'
            )}
          >
            + Criar evento
          </Link>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-4">
          {MOCK_EVENTS.map(event => {
            const stateInfo = LOBBY_STATE_LABELS[event.lobbyState] ?? LOBBY_STATE_LABELS.pending;
            return (
              <Link
                key={event.id}
                href={`/organizer/event/${event.id}`}
                className={cn(
                  'block rounded-2xl p-6',
                  'bg-white/[0.02] border border-white/[0.06]',
                  'hover:bg-white/[0.04] hover:border-white/[0.1]',
                  'transition-all duration-200',
                  'backdrop-blur-sm'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-lg text-white">{event.name}</h3>
                    <p className="text-sm text-white/40 mt-0.5">{formatDate(event.startTime)}</p>
                  </div>
                  <span className={cn('px-3 py-1 rounded-full text-xs font-medium', stateInfo.color)}>
                    {stateInfo.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-white/40">Interessados</p>
                    <p className="text-lg font-semibold text-white">{event.interestedCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Check-ins</p>
                    <p className="text-lg font-semibold text-white">{event.participantCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Correios enviados</p>
                    <p className="text-lg font-semibold text-white">{event.correiosSent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Taxa de conexão</p>
                    <p className="text-lg font-semibold text-[var(--green-glow)]">
                      {event.connectionRate > 0 ? `${Math.round(event.connectionRate * 100)}%` : '-'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {MOCK_EVENTS.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/40 text-sm mb-4">Você ainda não criou nenhum evento.</p>
            <Link
              href="/organizer/create"
              className="inline-block px-6 py-3 rounded-xl text-sm font-medium bg-[var(--green)] text-black hover:bg-[var(--green-glow)] transition-all"
            >
              Criar meu primeiro evento
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
