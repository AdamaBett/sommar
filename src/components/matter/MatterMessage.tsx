'use client';

import { cn } from '@/lib/utils';

export interface MatterMessageData {
  id: string;
  role: 'matter' | 'user';
  content: string;
}

interface MatterMessageProps {
  content: string;
  role: 'matter' | 'user';
  timestamp?: string;
  isTyping?: boolean;
}

function TypingIndicator(): React.ReactElement {
  return (
    <div className="flex items-center gap-1 py-1 px-1" aria-label="Matter esta pensando">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-[6px] h-[6px] rounded-full"
          style={{
            backgroundColor: 'rgba(29,255,168,0.6)',
            animation: 'typing-dot 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function MatterMessage({
  content,
  role,
  timestamp,
  isTyping = false,
}: MatterMessageProps): React.ReactElement {
  const isMatter = role === 'matter';

  return (
    <div
      className={cn(
        'flex',
        isMatter ? 'justify-start' : 'justify-end',
        'animate-fade-up'
      )}
      style={{
        animationDuration: '0.35s',
        animationFillMode: 'forwards',
      }}
    >
      <div
        className={cn(
          'rounded-2xl',
          isMatter ? 'rounded-tl-md' : 'rounded-tr-md'
        )}
        style={{
          maxWidth: '82%',
          padding: '14px 18px',
          fontSize: '14.5px',
          lineHeight: '1.55',
          ...(isMatter
            ? {
                backgroundColor: 'rgba(29,158,117,0.06)',
                borderLeft: '2px solid transparent',
                borderImage: 'linear-gradient(to bottom, #1D9E75, #00D4FF) 1',
                color: 'rgba(255,255,255,0.87)',
              }
            : {
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.87)',
              }),
        }}
      >
        {isTyping ? <TypingIndicator /> : content}

        {timestamp && (
          <time
            className="block mt-1 text-white-muted"
            style={{ fontSize: '11px' }}
            dateTime={timestamp}
          >
            {new Date(timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
        )}
      </div>
    </div>
  );
}
