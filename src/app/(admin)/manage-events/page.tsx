'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { EventsAdmin } from '@/components/admin/EventsAdmin';

// ── Dados mock completos ───────────────────────────────
const MOCK_EVENTS = [
  {
    id: '1',
    name: 'Sounds in da City',
    slug: 'sounds-costa-lagoa',
    startTime: '2026-04-12T18:00:00-03:00',
    endTime: '2026-04-13T02:00:00-03:00',
    lobbyState: 'active' as const,
    participantCount: 142,
    connectionCount: 38,
    organizerName: 'Coletivo Floripa',
  },
  {
    id: '2',
    name: 'Sunset Sessions',
    slug: 'sunset-sessions-abril',
    startTime: '2026-04-19T16:00:00-03:00',
    endTime: '2026-04-19T23:00:00-03:00',
    lobbyState: 'pending' as const,
    participantCount: 67,
    connectionCount: 0,
    organizerName: 'Bar do Porto',
  },
  {
    id: '3',
    name: 'Tech Meetup Floripa',
    slug: 'tech-meetup-marco',
    startTime: '2026-03-28T19:00:00-03:00',
    endTime: '2026-03-28T22:00:00-03:00',
    lobbyState: 'historical' as const,
    participantCount: 38,
    connectionCount: 51,
    organizerName: 'DevFloripa',
  },
  {
    id: '4',
    name: 'Festa da Lagoa',
    slug: 'festa-da-lagoa',
    startTime: '2026-03-15T20:00:00-03:00',
    endTime: '2026-03-16T04:00:00-03:00',
    lobbyState: 'expired' as const,
    participantCount: 210,
    connectionCount: 73,
    organizerName: 'Prefeitura Floripa',
  },
  {
    id: '5',
    name: 'Yoga no Parque',
    slug: 'yoga-no-parque-abril',
    startTime: '2026-04-05T07:00:00-03:00',
    endTime: '2026-04-05T09:00:00-03:00',
    lobbyState: 'pending' as const,
    participantCount: 23,
    connectionCount: 0,
    organizerName: 'Studio Zen',
  },
];

export default function EventsPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Resumo de eventos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-4 text-center">
            <p className="font-display text-2xl text-white">{MOCK_EVENTS.length}</p>
            <p className="text-xs text-white/40 mt-1">Total de eventos</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="font-display text-2xl text-[var(--green-glow)]">
              {MOCK_EVENTS.filter((e) => e.lobbyState === 'active').length}
            </p>
            <p className="text-xs text-white/40 mt-1">Ao vivo</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="font-display text-2xl text-[var(--amber-glow)]">
              {MOCK_EVENTS.filter((e) => e.lobbyState === 'pending').length}
            </p>
            <p className="text-xs text-white/40 mt-1">Pendentes</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="font-display text-2xl text-white/40">
              {MOCK_EVENTS.filter((e) => e.lobbyState === 'historical' || e.lobbyState === 'expired').length}
            </p>
            <p className="text-xs text-white/40 mt-1">Encerrados</p>
          </div>
        </div>

        {/* Lista completa de eventos */}
        <EventsAdmin
          events={MOCK_EVENTS}
          onCreateEvent={() => {
            // Placeholder para criação de evento
          }}
        />
      </main>
    </div>
  );
}
