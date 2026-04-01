'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatRelativeTime } from '@/lib/utils';

interface Connection {
  id: string;
  name: string;
  emoji: string;
  bio_snippet: string;
  tags: string[];
  online: boolean;
  event_name: string;
  connected_at: string;
}

interface ConnectionsListProps {
  connections: Connection[];
}

// Dados mock para visualização
export const MOCK_CONNECTIONS: Connection[] = [
  {
    id: 'c1',
    name: 'Rafael S.',
    emoji: '⚡',
    bio_snippet: 'Músico e dev. Conectando sons e código.',
    tags: ['música', 'tech'],
    online: true,
    event_name: 'Sounds in da City',
    connected_at: '2026-03-30T18:00:00Z',
  },
  {
    id: 'c2',
    name: 'Julia F.',
    emoji: '🌿',
    bio_snippet: 'Fotógrafa apaixonada por trilhas e nascer do sol.',
    tags: ['fotografia', 'natureza'],
    online: true,
    event_name: 'Sounds in da City',
    connected_at: '2026-03-30T19:30:00Z',
  },
  {
    id: 'c3',
    name: 'Tiago L.',
    emoji: '🌙',
    bio_snippet: 'Designer gráfico, foco em branding cultural.',
    tags: ['design', 'cultura'],
    online: false,
    event_name: 'Sounds in da City',
    connected_at: '2026-03-30T20:15:00Z',
  },
  {
    id: 'c4',
    name: 'Camila N.',
    emoji: '🔥',
    bio_snippet: 'Dança, yoga e festivais. Energia pura.',
    tags: ['dança', 'yoga'],
    online: false,
    event_name: 'Noite Eletrônica',
    connected_at: '2026-03-15T23:00:00Z',
  },
];

// Agrupar conexões por evento
function groupByEvent(
  connections: Connection[]
): { event: string; items: Connection[] }[] {
  const grouped = new Map<string, Connection[]>();
  for (const conn of connections) {
    const existing = grouped.get(conn.event_name) ?? [];
    existing.push(conn);
    grouped.set(conn.event_name, existing);
  }
  return Array.from(grouped.entries()).map(([event, items]) => ({
    event,
    items,
  }));
}

function ConnectionCard({ connection }: { connection: Connection }): JSX.Element {
  return (
    <GlassCard hover padding="sm" className="flex items-center gap-3">
      {/* Avatar orb */}
      <div className="relative shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{
            background:
              'linear-gradient(135deg, rgba(29,158,117,0.2) 0%, rgba(168,85,247,0.15) 100%)',
          }}
        >
          {connection.emoji}
        </div>
        {/* Online indicator */}
        {connection.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-[var(--green)] shadow-[0_0_6px_var(--green-glow)]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display text-[15px] font-medium text-[var(--text-strong)]">
            {connection.name}
          </span>
          {connection.online && (
            <span className="text-[10px] text-[var(--green-glow)]">
              online
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--text-subtle)] truncate mt-0.5">
          {connection.bio_snippet}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          {connection.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-[var(--text-subtle)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tempo */}
      <span className="text-[10px] text-[var(--text-muted)] shrink-0">
        {formatRelativeTime(connection.connected_at)}
      </span>
    </GlassCard>
  );
}

export function ConnectionsList({
  connections,
}: ConnectionsListProps): JSX.Element {
  const [search, setSearch] = useState('');

  const filtered = connections.filter((c) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.bio_snippet.toLowerCase().includes(query) ||
      c.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  const groups = groupByEvent(filtered);

  return (
    <div className="px-5 pb-28 pt-4 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-semibold text-[var(--text-strong)] mb-5">
        Conexões
      </h1>

      {/* Busca */}
      <div className="mb-6">
        <Input
          placeholder="Buscar conexões..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grupos por evento */}
      {groups.length > 0 ? (
        <div className="flex flex-col gap-6">
          {groups.map(({ event, items }) => (
            <section key={event}>
              <h2 className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-3">
                {event}
              </h2>
              <div className="flex flex-col gap-2">
                {items.map((conn) => (
                  <ConnectionCard key={conn.id} connection={conn} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <GlassCard padding="lg" className="text-center">
          <p className="text-sm text-[var(--text-subtle)]">
            {search.trim()
              ? 'Nenhuma conexão encontrada'
              : 'Nenhuma conexão ainda. Participe de um evento!'}
          </p>
        </GlassCard>
      )}
    </div>
  );
}
