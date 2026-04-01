'use client';

import Link from 'next/link';
import { MatterOrb } from '@/components/ui/MatterOrb';
import { GlassCard } from '@/components/ui/GlassCard';
import { FacetCard } from '@/components/profile/FacetCard';
import { FACETS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ProfileData {
  id: string;
  display_name: string;
  bio: string;
  active_facets: string[];
  facet_data: Record<string, Record<string, unknown>>;
  aesthetic_archetypes: number[];
  ori_narrative: Record<string, string>;
  stats: {
    events_count: number;
    matches_count: number;
    connections_count: number;
  };
}

interface ProfileViewProps {
  profile: ProfileData;
}

function StatCard({
  value,
  label,
}: {
  value: number;
  label: string;
}): JSX.Element {
  return (
    <GlassCard padding="sm" className="flex-1 text-center">
      <p className="font-display text-xl font-semibold text-[var(--green-glow)]">
        {value}
      </p>
      <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">{label}</p>
    </GlassCard>
  );
}

function AvatarCircle({
  name,
  size = 64,
}: {
  name: string;
  size?: number;
}): JSX.Element {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className="rounded-full flex items-center justify-center font-display font-semibold"
      style={{
        width: size,
        height: size,
        background:
          'linear-gradient(135deg, var(--green) 0%, var(--cyan) 50%, var(--purple) 100%)',
        fontSize: size * 0.4,
        color: '#000',
      }}
    >
      {initial}
    </div>
  );
}

export function ProfileView({ profile }: ProfileViewProps): JSX.Element {
  // Bullet points do que o Ori sabe
  const oriBullets = Object.entries(profile.ori_narrative).map(
    ([facetId, narrative]) => ({
      facetId,
      narrative,
      color:
        FACETS.find((f) => f.id === facetId)?.color ?? 'var(--text-medium)',
      label: FACETS.find((f) => f.id === facetId)?.label ?? facetId,
    })
  );

  return (
    <div className="px-5 pb-28 pt-4 max-w-lg mx-auto">
      {/* Orb + avatar + nome + bio */}
      <div className="flex flex-col items-center">
        <MatterOrb size="md" className="mb-4" />
        <AvatarCircle name={profile.display_name} />
        <h1 className="mt-3 font-display text-2xl font-semibold text-[var(--text-strong)]">
          {profile.display_name}
        </h1>
        <p className="mt-2 text-[13px] text-[var(--text-medium)] text-center max-w-[280px] leading-relaxed">
          {profile.bio}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 flex gap-3">
        <StatCard value={profile.stats.events_count} label="Eventos" />
        <StatCard value={profile.stats.matches_count} label="Matches" />
        <StatCard value={profile.stats.connections_count} label="Conexões" />
      </div>

      {/* Facetas */}
      <div className="mt-6">
        <h2 className="font-display text-base font-medium text-[var(--text-strong)] mb-3">
          Facetas ativas
        </h2>
        <div className="flex flex-col gap-2">
          {FACETS.map((facet) => (
            <FacetCard
              key={facet.id}
              id={facet.id}
              label={facet.label}
              color={facet.color}
              active={profile.active_facets.includes(facet.id)}
              onToggle={() => {
                // Toggle será integrado com estado real
              }}
            />
          ))}
        </div>
      </div>

      {/* O que seu Ori sabe */}
      <div className="mt-6">
        <h2 className="font-display text-base font-medium text-[var(--text-strong)] mb-3">
          O que seu Ori sabe
        </h2>
        <GlassCard padding="md">
          <div className="flex flex-col gap-3">
            {oriBullets.map(({ facetId, narrative, color, label }) => (
              <div key={facetId} className="flex gap-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <span className="text-xs font-medium" style={{ color }}>
                    {label}
                  </span>
                  <p className="text-sm text-[var(--text-medium)] leading-relaxed mt-0.5">
                    {narrative}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Links de navegação */}
      <div className="mt-6 flex flex-col gap-2">
        <NavLink label="Conexões" href="/connections" />
        <NavLink label="Histórico de eventos" href="/events" />
        <NavLink label="Configurações e privacidade" href="/settings" />
      </div>
    </div>
  );
}

function NavLink({
  label,
  href,
}: {
  label: string;
  href: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      className={cn(
        'glass glass-hover rounded-xl px-4 py-3',
        'flex items-center justify-between text-sm text-[var(--text-medium)]',
        'transition-all duration-200'
      )}
    >
      <span>{label}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 4L10 8L6 12"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
