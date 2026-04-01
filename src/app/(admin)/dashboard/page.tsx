'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { EventsAdmin } from '@/components/admin/EventsAdmin';
import { ActivityFeed } from '@/components/admin/ActivityFeed';

// ── Dados mock para o MSP ──────────────────────────────
const MOCK_STATS = {
  totalUsers: 247,
  usersChange: 18,
  activeEvents: 3,
  eventsChange: 50,
  liveLobbies: 1,
  lobbiesChange: 0,
  connections: 89,
  connectionsChange: 12,
};

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
];

const MOCK_ACTIVITY = [
  {
    id: '1',
    type: 'signup' as const,
    description: 'Novo usuário completou onboarding',
    timestamp: '2026-03-31T14:22:00-03:00',
  },
  {
    id: '2',
    type: 'connection' as const,
    description: 'Nova conexão formada no Sounds in da City',
    timestamp: '2026-03-31T13:45:00-03:00',
  },
  {
    id: '3',
    type: 'event_active' as const,
    description: 'Lobby do Sounds in da City ativado',
    timestamp: '2026-03-31T12:00:00-03:00',
  },
  {
    id: '4',
    type: 'signup' as const,
    description: 'Novo usuário completou onboarding',
    timestamp: '2026-03-31T11:30:00-03:00',
  },
  {
    id: '5',
    type: 'connection' as const,
    description: 'Nova conexão formada no Sounds in da City',
    timestamp: '2026-03-31T10:15:00-03:00',
  },
  {
    id: '6',
    type: 'report' as const,
    description: 'Denúncia recebida: linguagem inapropriada',
    timestamp: '2026-03-30T22:00:00-03:00',
  },
  {
    id: '7',
    type: 'signup' as const,
    description: 'Novo usuário completou onboarding',
    timestamp: '2026-03-30T20:00:00-03:00',
  },
  {
    id: '8',
    type: 'connection' as const,
    description: 'Nova conexão formada no Tech Meetup Floripa',
    timestamp: '2026-03-30T19:30:00-03:00',
  },
];

// ── Ícones inline (SVGs leves) ─────────────────────────
function UsersIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function RadioIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
      <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
    </svg>
  );
}

function HeartIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function DashboardPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Grid de estatísticas */}
        <section>
          <h2 className="font-display text-xl text-white mb-4">Visão geral</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total de usuários"
              value={MOCK_STATS.totalUsers}
              change={MOCK_STATS.usersChange}
              color="green"
              icon={<UsersIcon />}
            />
            <StatCard
              label="Eventos ativos"
              value={MOCK_STATS.activeEvents}
              change={MOCK_STATS.eventsChange}
              color="amber"
              icon={<CalendarIcon />}
            />
            <StatCard
              label="Lobbies ao vivo"
              value={MOCK_STATS.liveLobbies}
              change={MOCK_STATS.lobbiesChange}
              color="coral"
              icon={<RadioIcon />}
            />
            <StatCard
              label="Conexões realizadas"
              value={MOCK_STATS.connections}
              change={MOCK_STATS.connectionsChange}
              color="cyan"
              icon={<HeartIcon />}
            />
          </div>
        </section>

        {/* Eventos ativos */}
        <section>
          <EventsAdmin events={MOCK_EVENTS} />
        </section>

        {/* Atividade recente */}
        <section>
          <ActivityFeed items={MOCK_ACTIVITY} />
        </section>
      </main>
    </div>
  );
}
