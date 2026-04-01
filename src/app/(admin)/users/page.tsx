'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

// ── Dados mock de usuários ─────────────────────────────
const MOCK_USER_STATS = {
  total: 247,
  onboardingRate: 84,
  activeWeek: 163,
  avgConnections: 2.4,
};

interface MockUser {
  id: string;
  displayName: string;
  role: 'participant' | 'organizer' | 'creator';
  onboardingComplete: boolean;
  eventCount: number;
  connectionCount: number;
  lastActive: string;
  city: string;
}

const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    displayName: 'Marina S.',
    role: 'participant',
    onboardingComplete: true,
    eventCount: 3,
    connectionCount: 7,
    lastActive: '2026-03-31T14:00:00-03:00',
    city: 'Florianópolis',
  },
  {
    id: '2',
    displayName: 'Pedro L.',
    role: 'organizer',
    onboardingComplete: true,
    eventCount: 5,
    connectionCount: 12,
    lastActive: '2026-03-31T13:30:00-03:00',
    city: 'Florianópolis',
  },
  {
    id: '3',
    displayName: 'Ana C.',
    role: 'participant',
    onboardingComplete: true,
    eventCount: 1,
    connectionCount: 2,
    lastActive: '2026-03-31T10:00:00-03:00',
    city: 'Sao Jose',
  },
  {
    id: '4',
    displayName: 'Lucas M.',
    role: 'participant',
    onboardingComplete: false,
    eventCount: 0,
    connectionCount: 0,
    lastActive: '2026-03-30T22:00:00-03:00',
    city: 'Florianópolis',
  },
  {
    id: '5',
    displayName: 'Juliana R.',
    role: 'participant',
    onboardingComplete: true,
    eventCount: 2,
    connectionCount: 4,
    lastActive: '2026-03-30T18:00:00-03:00',
    city: 'Palhoca',
  },
  {
    id: '6',
    displayName: 'Rafael T.',
    role: 'organizer',
    onboardingComplete: true,
    eventCount: 4,
    connectionCount: 9,
    lastActive: '2026-03-31T12:00:00-03:00',
    city: 'Florianópolis',
  },
  {
    id: '7',
    displayName: 'Camila F.',
    role: 'participant',
    onboardingComplete: false,
    eventCount: 0,
    connectionCount: 0,
    lastActive: '2026-03-29T15:00:00-03:00',
    city: 'Biguacu',
  },
  {
    id: '8',
    displayName: 'Thiago B.',
    role: 'participant',
    onboardingComplete: true,
    eventCount: 2,
    connectionCount: 3,
    lastActive: '2026-03-31T11:00:00-03:00',
    city: 'Florianópolis',
  },
];

const roleLabels: Record<MockUser['role'], { label: string; className: string }> = {
  participant: {
    label: 'Participante',
    className: 'text-white/50 bg-white/[0.06]',
  },
  organizer: {
    label: 'Organizador',
    className: 'text-[var(--amber-glow)] bg-[var(--amber-glow)]/10',
  },
  creator: {
    label: 'Creator',
    className: 'text-[var(--purple)] bg-[var(--purple)]/10',
  },
};

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

function CheckIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ActivityIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function LinkIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function UsersPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Estatísticas de usuários */}
        <section>
          <h2 className="font-display text-xl text-white mb-4">Usuários</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total de usuários"
              value={MOCK_USER_STATS.total}
              color="green"
              icon={<UsersIcon />}
            />
            <StatCard
              label="Taxa de onboarding"
              value={`${MOCK_USER_STATS.onboardingRate}%`}
              color="cyan"
              icon={<CheckIcon />}
            />
            <StatCard
              label="Ativos nos últimos 7 dias"
              value={MOCK_USER_STATS.activeWeek}
              color="amber"
              icon={<ActivityIcon />}
            />
            <StatCard
              label="Média de conexões"
              value={MOCK_USER_STATS.avgConnections}
              color="purple"
              icon={<LinkIcon />}
            />
          </div>
        </section>

        {/* Lista de usuários (desktop: tabela, mobile: cards) */}
        <section>
          <h2 className="font-display text-xl text-white mb-4">Lista de usuários</h2>

          {/* Tabela desktop */}
          <div className="hidden md:block glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs text-white/40 font-medium px-5 py-3">Usuário</th>
                  <th className="text-left text-xs text-white/40 font-medium px-5 py-3">Perfil</th>
                  <th className="text-left text-xs text-white/40 font-medium px-5 py-3">Onboarding</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">Eventos</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">Conexões</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">Última atividade</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((user) => {
                  const role = roleLabels[user.role];
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green-glow)]/30 to-[var(--cyan)]/30 flex items-center justify-center text-white/70 text-xs font-medium">
                            {user.displayName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm text-white font-medium">{user.displayName}</p>
                            <p className="text-xs text-white/30">{user.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                            role.className
                          )}
                        >
                          {role.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {user.onboardingComplete ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--green-glow)]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Completo
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--amber-glow)]">Pendente</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm text-white/60">{user.eventCount}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm text-[var(--cyan)]">{user.connectionCount}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-xs text-white/40">
                          {formatRelativeTime(user.lastActive)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards mobile */}
          <div className="md:hidden space-y-3">
            {MOCK_USERS.map((user) => {
              const role = roleLabels[user.role];
              return (
                <div key={user.id} className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--green-glow)]/30 to-[var(--cyan)]/30 flex items-center justify-center text-white/70 text-sm font-medium">
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{user.displayName}</p>
                        <p className="text-xs text-white/30">{user.city}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                        role.className
                      )}
                    >
                      {role.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span>
                      {user.onboardingComplete ? (
                        <span className="text-[var(--green-glow)]">Ori criado</span>
                      ) : (
                        <span className="text-[var(--amber-glow)]">Onboarding pendente</span>
                      )}
                    </span>
                    <span>{user.eventCount} eventos</span>
                    <span className="text-[var(--cyan)]">{user.connectionCount} conexões</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
