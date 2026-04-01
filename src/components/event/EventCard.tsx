'use client';

import Link from 'next/link';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/utils';

const TAG_COLORS = ['green', 'cyan', 'purple', 'amber', 'coral', 'pink'] as const;

interface EventCardProps {
  id: string;
  name: string;
  slug: string;
  cover_image_url: string | null;
  location_name: string;
  start_time: string;
  tags: string[];
  interested_count: number;
  className?: string;
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function EventCard({
  name,
  slug,
  cover_image_url,
  location_name,
  start_time,
  tags,
  interested_count,
  className,
}: EventCardProps): JSX.Element {
  const visibleTags = tags.slice(0, 3);
  const dateStr = formatShortDate(start_time);

  return (
    <Link
      href={`/e/${slug}`}
      className={cn(
        'glass glass-hover block rounded-2xl overflow-hidden transition-all duration-300',
        className
      )}
    >
      {/* Cover */}
      <div className="relative w-full h-[120px] overflow-hidden">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(135deg, rgba(29,158,117,0.35) 0%, rgba(168,85,247,0.25) 50%, rgba(236,72,153,0.2) 100%)',
            }}
          />
        )}
        {/* Badge de interessados */}
        <div className="absolute top-2.5 right-2.5 glass px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 10.5C6 10.5 1.5 7.5 1.5 4.5C1.5 2.84 2.84 1.5 4.5 1.5C5.39 1.5 6 2 6 2C6 2 6.61 1.5 7.5 1.5C9.16 1.5 10.5 2.84 10.5 4.5C10.5 7.5 6 10.5 6 10.5Z"
              fill="var(--pink)"
              fillOpacity="0.6"
              stroke="var(--pink)"
              strokeWidth="0.8"
            />
          </svg>
          <span className="text-[10px] font-medium text-[var(--text-strong)]">
            {interested_count}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-base font-medium text-[var(--text-strong)] leading-snug">
          {name}
        </h3>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-[var(--text-subtle)]">
          <span>{dateStr}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <span className="truncate">{location_name}</span>
        </div>
        {visibleTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleTags.map((tag, i) => (
              <Tag
                key={tag}
                label={tag}
                color={TAG_COLORS[i % TAG_COLORS.length]}
                size="sm"
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
