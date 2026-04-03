'use client';

interface LobbyHeaderProps {
  eventName: string;
  participantCount: number;
  isLive: boolean;
}

export function LobbyHeader({
  eventName,
  participantCount,
  isLive,
}: LobbyHeaderProps): JSX.Element {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 px-5 pt-3.5 pb-3"
      style={{ background: 'linear-gradient(to bottom, #000 50%, transparent)' }}
    >
      <div className="flex items-center justify-between">
        {/* Left: event name + status */}
        <div className="min-w-0 flex-1 mr-3">
          <div className="font-display text-[15px] text-[var(--text-strong)] truncate">
            {eventName}
          </div>
          <div className="flex items-center gap-[5px] mt-0.5 whitespace-nowrap">
            {isLive && (
              <>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-glow"
                  style={{
                    background: 'var(--green)',
                    boxShadow: '0 0 8px var(--green-glow)',
                  }}
                />
                <span className="text-[11px] text-[var(--green)]">ao vivo</span>
              </>
            )}
            <span className="text-[11px] text-[var(--text-medium)] ml-1">
              {'\u00B7'} {participantCount} pessoas
            </span>
          </div>
        </div>

        {/* Right: Ori active indicator (equalizer bars) */}
        <div
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-[20px] flex-shrink-0"
          style={{
            background: 'rgba(29,158,117,0.06)',
            border: '1px solid rgba(29,255,168,0.1)',
          }}
        >
          <div className="flex gap-[2px] items-end h-3">
            <EqualizerBar delay="0s" />
            <EqualizerBar delay="0.15s" />
            <EqualizerBar delay="0.3s" />
          </div>
          <span className="text-[10px] text-[var(--green)]">Ori ativo</span>
        </div>
      </div>
      {/* Subtle bottom separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />
    </div>
  );
}

function EqualizerBar({ delay }: { delay: string }): JSX.Element {
  return (
    <div
      className="w-[2px] h-3 rounded-sm"
      style={{
        background: 'var(--green)',
        animation: 'wave-bar 1.2s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: 'bottom',
      }}
    />
  );
}
