'use client';

import { cn } from '@/lib/utils';
import type { LobbyParticipant } from '@/app/(app)/lobby/page';

interface ProfileCircleProps {
  person: LobbyParticipant;
  animationDelay: number;
  onClick: () => void;
}

/** Color mapping for match badge by facet */
const BADGE_COLORS: Record<string, string> = {
  intimo: 'var(--pink)',
  academico: 'var(--cyan)',
  profissional: 'var(--amber-glow)',
  social: 'var(--purple)',
};

export function ProfileCircle({
  person,
  animationDelay,
  onClick,
}: ProfileCircleProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-[78px] shrink-0 flex flex-col items-center',
        'cursor-pointer select-none',
        'opacity-0 animate-hex-pop'
      )}
      style={{
        animationDelay: `${animationDelay}s`,
        animationFillMode: 'both',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Avatar container */}
      <div className="w-[70px] h-[70px] rounded-full relative transition-transform duration-200 active:scale-[0.92]">
        {/* Gradient ring */}
        <div
          className="absolute -inset-[2px] rounded-full opacity-50"
          style={{
            background: `linear-gradient(135deg, ${person.colorA}, ${person.colorB})`,
            padding: '1.5px',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Hover glow */}
        <div
          className="absolute -inset-1 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-60"
          style={{
            background: `${person.colorA}50`,
            filter: 'blur(10px)',
          }}
        />

        {/* Inner avatar with gradient + initial */}
        <div
          className="absolute inset-[3px] rounded-full"
          style={{ background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.5), ${person.colorA} 30%, ${person.colorB} 65%, transparent)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-[22px] text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {person.nome[0]}
          </div>
        </div>

        {/* Online indicator - bottom left */}
        {person.online && (
          <div
            className="absolute bottom-[2px] left-[2px] w-3 h-3 rounded-full border-2 border-black"
            style={{
              background: 'var(--green)',
              boxShadow: '0 0 6px var(--green-glow)',
            }}
          />
        )}

        {/* Match badge - bottom right */}
        {person.match && (
          <div
            className="absolute -bottom-[2px] -right-[2px] w-[18px] h-[18px] rounded-full border-2 border-black flex items-center justify-center text-[9px]"
            style={{
              background: BADGE_COLORS[person.tipo] || 'var(--green)',
            }}
          >
            {'\u2726'}
          </div>
        )}
      </div>

      {/* Name */}
      <span
        className={cn(
          'text-[10px] font-normal mt-[5px] text-center tracking-[0.3px]',
          'max-w-[74px] overflow-hidden text-ellipsis whitespace-nowrap',
          person.online
            ? 'text-white/70'
            : 'text-[var(--text-medium)]'
        )}
      >
        {person.nome}
      </span>
    </button>
  );
}
