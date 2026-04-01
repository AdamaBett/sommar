'use client';

import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { LobbyParticipant } from '@/app/(app)/lobby/page';

interface PersonPopupProps {
  person: LobbyParticipant | null;
  onClose: () => void;
  onCorreio?: (person: LobbyParticipant) => void;
}

/** Label and color mapping for facets */
const TIPO_CONFIG: Record<string, { label: string; color: string }> = {
  intimo: { label: '\uD83D\uDD25 intimo', color: 'var(--pink)' },
  criativo: { label: '\uD83C\uDFA8 criativo', color: 'var(--cyan)' },
  profissional: { label: '\uD83D\uDCBC profissional', color: 'var(--amber-glow)' },
  social: { label: '\uD83C\uDF1F social', color: 'var(--purple)' },
};

export function PersonPopup({ person, onClose, onCorreio }: PersonPopupProps): JSX.Element {
  const isOpen = person !== null;
  const cardRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);

  // Close on backdrop click (not on card itself)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Swipe down to close
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (startYRef.current === null) return;
      const deltaY = e.changedTouches[0].clientY - startYRef.current;
      if (deltaY > 80) {
        onClose();
      }
      startYRef.current = null;
    },
    [onClose]
  );

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const tipoConfig = person ? TIPO_CONFIG[person.tipo] : null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[250] flex items-end',
        'transition-opacity duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
      style={{
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className={cn(
          'w-full rounded-t-[24px] px-5 pt-6 pb-10',
          'transition-transform duration-[450ms]',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{
          background: '#050505',
          border: '1px solid var(--border-subtle)',
          borderBottom: 'none',
          transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {person && (
          <>
            {/* Drag handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-white/10" />
            </div>

            {/* Avatar + info */}
            <div className="flex items-center gap-4 mb-5">
              {/* Large avatar */}
              <div className="w-[72px] h-[72px] rounded-full relative shrink-0">
                {/* Ring */}
                <div
                  className="absolute -inset-[2px] rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${person.colorA}, ${person.colorB})`,
                    padding: '1.5px',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
                {/* Inner */}
                <div
                  className="absolute inset-[3px] rounded-full flex items-center justify-center text-[28px] text-white font-semibold"
                  style={{ background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.5), ${person.colorA} 30%, ${person.colorB} 65%, transparent)` }}
                >
                  {person.nome[0]}
                </div>
                {/* Online dot */}
                {person.online && (
                  <div
                    className="absolute bottom-[2px] right-[2px] w-3.5 h-3.5 rounded-full"
                    style={{
                      background: 'var(--green)',
                      border: '2px solid #050505',
                      boxShadow: '0 0 8px var(--green-glow)',
                    }}
                  />
                )}
              </div>

              {/* Name + type + bio */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-[20px] text-[var(--text-strong)]">
                    {person.nome}
                  </span>
                  {tipoConfig && (
                    <span
                      className="text-[10px] py-[3px] px-[9px] rounded-[10px] border opacity-70"
                      style={{
                        borderColor: tipoConfig.color,
                        color: tipoConfig.color,
                      }}
                    >
                      {tipoConfig.label}
                    </span>
                  )}
                </div>
                <div className="text-[13px] font-light text-[var(--text-medium)]">
                  {person.bio}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {person.tags.map((tag) => (
                <span
                  key={tag}
                  className="py-1 px-3 rounded-xl text-[11px] text-[var(--text-medium)]"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Match indicator (if match) */}
            {person.match && (
              <div
                className="py-3 px-3.5 rounded-xl mb-4 text-[12.5px] font-light text-[var(--text-medium)]"
                style={{
                  background: 'rgba(29,158,117,0.05)',
                  border: '1px solid rgba(29,255,168,0.1)',
                }}
              >
                <span className="text-[var(--green-glow)] font-medium">
                  {'\u2726'} Match do Sommar.
                </span>{' '}
                Seu Ori identificou compatibilidade real com {person.nome}.
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-[14px] text-sm text-[var(--text-medium)] transition-colors duration-200 hover:bg-white/[0.03]"
                style={{
                  border: '1px solid var(--border-subtle)',
                  background: 'transparent',
                }}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => person && onCorreio?.(person)}
                className="flex-1 py-3.5 rounded-[14px] text-sm font-medium transition-all duration-200 hover:brightness-110"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(239,159,39,0.2), rgba(216,90,48,0.15))',
                  border: '1px solid rgba(239,159,39,0.2)',
                  color: 'var(--amber-glow)',
                }}
              >
                {'\uD83D\uDC8C'} Correio Elegante
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
