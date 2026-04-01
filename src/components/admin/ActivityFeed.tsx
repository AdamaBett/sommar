'use client';

import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

type ActivityType = 'signup' | 'event_active' | 'connection' | 'report';

interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const typeConfig: Record<ActivityType, { icon: React.ReactNode; color: string }> = {
  signup: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
    color: 'text-[var(--green-glow)]',
  },
  event_active: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    color: 'text-[var(--amber-glow)]',
  },
  connection: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    color: 'text-[var(--cyan)]',
  },
  report: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    color: 'text-[var(--coral-glow)]',
  },
};

export function ActivityFeed({ items }: ActivityFeedProps): JSX.Element {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-white">Atividade recente</h2>

      <div className="glass rounded-2xl divide-y divide-white/[0.04]">
        {items.map((item) => {
          const config = typeConfig[item.type];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] shrink-0',
                  config.color
                )}
              >
                {config.icon}
              </div>
              <p className="text-sm text-white/70 flex-1 min-w-0 truncate">
                {item.description}
              </p>
              <span className="text-xs text-white/30 shrink-0">
                {formatRelativeTime(item.timestamp)}
              </span>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-white/40">Nenhuma atividade recente</p>
          </div>
        )}
      </div>
    </div>
  );
}
