'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

// Mock data — matches ativos
const MOCK_MATCHES = [
  {
    id: 'm1',
    name: 'Clara Mendes',
    facet: { id: 'criativo', label: 'Criativo', color: '#00D4FF' },
    colorA: '#00D4FF',
    colorB: '#A855F7',
    reason: 'Vocês compartilham uma paixão por experiências imersivas e arte digital.',
  },
  {
    id: 'm2',
    name: 'Rafael Duarte',
    facet: { id: 'profissional', label: 'Profissional', color: '#FFB840' },
    colorA: '#FFB840',
    colorB: '#1DFFA8',
    reason: 'Ele quer aprender product management. Você domina.',
  },
  {
    id: 'm3',
    name: 'Luna Aoki',
    facet: { id: 'social', label: 'Social', color: '#A855F7' },
    colorA: '#A855F7',
    colorB: '#EC4899',
    reason: 'Mesmo estilo de amizade: poucos e bons, conversas profundas.',
  },
];

// Mock data — conversas ativas
const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Tiago Reis',
    lastMessage: 'Cara, aquele set de jazz no palco 2 foi incrível! Tava lá?',
    timestamp: 'Agora',
    unread: true,
    yourTurn: true,
    colorA: '#1DFFA8',
    colorB: '#00D4FF',
  },
  {
    id: 'c2',
    name: 'Marina Vaz',
    lastMessage: 'Vou mandar o link do projeto. Acho que tu vai curtir demais.',
    timestamp: '2h',
    unread: false,
    yourTurn: false,
    colorA: '#EC4899',
    colorB: '#A855F7',
  },
  {
    id: 'c3',
    name: 'Pedro Linhares',
    lastMessage: 'Fechou! A gente se encontra no coworking quarta.',
    timestamp: '5h',
    unread: false,
    yourTurn: true,
    colorA: '#FFB840',
    colorB: '#FF6B3D',
  },
];

// Mock data — conexoes confirmadas
const MOCK_CONNECTIONS = [
  {
    id: 'x1',
    name: 'Isabela Fontana',
    event: 'Sounds in da City',
    facet: { label: 'Criativo', color: '#00D4FF' },
    colorA: '#00D4FF',
    colorB: '#EC4899',
    confirmedAt: '12 mar 2026',
  },
  {
    id: 'x2',
    name: 'Gabriel Stark',
    event: 'Hackathon Floripa',
    facet: { label: 'Profissional', color: '#FFB840' },
    colorA: '#FFB840',
    colorB: '#1DFFA8',
    confirmedAt: '28 fev 2026',
  },
];

function MiniOrb({
  colorA,
  colorB,
  size = 40,
}: {
  colorA: string;
  colorB: string;
  size?: number;
}): React.ReactElement {
  return (
    <div
      className="rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colorA} 0%, ${colorB} 100%)`,
        boxShadow: `0 0 12px ${colorA}33`,
      }}
    />
  );
}

function FacetBadge({
  label,
  color,
}: {
  label: string;
  color: string;
}): React.ReactElement {
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{
        color,
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
      }}
    >
      {label}
    </span>
  );
}

function SectionHeader({
  title,
  count,
}: {
  title: string;
  count: number;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display text-base font-medium text-[var(--text-strong)]">
        {title}
      </h2>
      <span className="text-xs text-[var(--text-subtle)]">{count}</span>
    </div>
  );
}

export default function ConnectionsPage(): React.ReactElement {
  return (
    <div className="px-5 pb-28 pt-4 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-semibold text-[var(--text-strong)] mb-6">
        Conexões
      </h1>

      {/* Matches ativos */}
      <section className="mb-8">
        <SectionHeader title="Matches ativos" count={MOCK_MATCHES.length} />
        <div className="flex flex-col gap-3">
          {MOCK_MATCHES.map((match) => (
            <GlassCard key={match.id} padding="md" hover>
              <div className="flex items-start gap-3">
                <MiniOrb colorA={match.colorA} colorB={match.colorB} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-strong)] truncate">
                      {match.name}
                    </span>
                    <FacetBadge label={match.facet.label} color={match.facet.color} />
                  </div>
                  <p className="text-xs text-[var(--text-medium)] mt-1 leading-relaxed">
                    {match.reason}
                  </p>
                  <button
                    onClick={() => {
                      // TODO: Abrir CorreioPopup com match como target
                      alert(`Correio para ${match.name} sera implementado com integração Supabase`);
                    }}
                    className={cn(
                      'mt-2.5 text-xs font-medium px-4 py-1.5 rounded-full',
                      'transition-all duration-200'
                    )}
                    style={{
                      color: '#000',
                      backgroundColor: 'var(--green-glow)',
                      boxShadow: '0 0 16px rgba(29,255,168,0.25)',
                    }}
                  >
                    Enviar Correio
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Conversas */}
      <section className="mb-8">
        <SectionHeader title="Conversas" count={MOCK_CONVERSATIONS.length} />
        <div className="flex flex-col gap-2">
          {MOCK_CONVERSATIONS.map((convo) => (
            <GlassCard key={convo.id} padding="sm" hover>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MiniOrb colorA={convo.colorA} colorB={convo.colorB} size={36} />
                  {convo.unread && (
                    <div
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                      style={{
                        backgroundColor: 'var(--green-glow)',
                        borderColor: '#000',
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-sm truncate',
                          convo.unread
                            ? 'font-semibold text-[var(--text-strong)]'
                            : 'font-medium text-[var(--text-medium)]'
                        )}
                      >
                        {convo.name}
                      </span>
                      {convo.yourTurn && (
                        <span
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                          style={{
                            color: 'var(--amber-glow)',
                            backgroundColor: 'rgba(239,159,39,0.12)',
                            border: '1px solid rgba(239,159,39,0.25)',
                          }}
                        >
                          Sua vez
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--text-subtle)] shrink-0 ml-2">
                      {convo.timestamp}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'text-xs mt-0.5 truncate',
                      convo.unread
                        ? 'text-[var(--text-medium)]'
                        : 'text-[var(--text-subtle)]'
                    )}
                  >
                    {convo.lastMessage}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Conexoes confirmadas */}
      <section>
        <SectionHeader title="Conexões confirmadas" count={MOCK_CONNECTIONS.length} />
        <div className="flex flex-col gap-2">
          {MOCK_CONNECTIONS.map((conn) => (
            <GlassCard key={conn.id} padding="sm" hover>
              <div className="flex items-center gap-3">
                <MiniOrb colorA={conn.colorA} colorB={conn.colorB} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-strong)] truncate">
                      {conn.name}
                    </span>
                    <FacetBadge label={conn.facet.label} color={conn.facet.color} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[var(--text-subtle)]">
                      {conn.event}
                    </span>
                    <span className="text-[10px] text-[var(--text-subtle)]">
                      {conn.confirmedAt}
                    </span>
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
