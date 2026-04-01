'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { GlassCard } from '@/components/ui/GlassCard';
import { SocialProof } from '@/components/event/SocialProof';
import { EventFeed } from '@/components/event/EventFeed';
import { cn } from '@/lib/utils';

// Cores ciclicas para tags
const TAG_COLORS = ['green', 'cyan', 'purple', 'amber', 'coral', 'pink'] as const;

interface EventData {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  location_name: string;
  start_time: string;
  end_time: string;
  tags: string[];
  expected_capacity: number;
  ticket_url: string | null;
  interested_count: number;
  views_count: number;
}

interface FeedPost {
  id: string;
  author: { name: string; emoji: string };
  content: string;
  created_at: string;
  reactions: { emoji: string; count: number }[];
  replies: number;
}

interface EventPageViewProps {
  event: EventData;
  feed: FeedPost[];
  slug: string;
}

function formatEventDate(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
  });
  const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  });
  const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const startDay = dayFormatter.format(startDate);
  const endDay = dayFormatter.format(endDate);
  const month = monthFormatter.format(startDate);
  const startTime = timeFormatter.format(startDate);
  const endTime = timeFormatter.format(endDate);

  return `${startDay} a ${endDay} de ${month} · ${startTime} as ${endTime}`;
}

export function EventPageView({
  event,
  feed,
}: EventPageViewProps): JSX.Element {
  const router = useRouter();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const dateString = formatEventDate(event.start_time, event.end_time);

  return (
    <div className="min-h-screen bg-background">
      {/* Cover area */}
      <div className="relative w-full h-[240px] overflow-hidden">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(135deg, rgba(29,158,117,0.4) 0%, rgba(0,212,255,0.2) 40%, rgba(168,85,247,0.3) 70%, rgba(236,72,153,0.2) 100%)',
            }}
          />
        )}
        {/* Gradiente inferior para suavizar transição */}
        <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-background to-transparent" />

        {/* Botao voltar */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 rounded-full glass flex items-center justify-center text-[var(--text-strong)]"
          aria-label="Voltar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Conteudo principal */}
      <div className="relative -mt-12 px-5 pb-32 max-w-lg mx-auto">
        {/* Nome + local + data */}
        <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--text-strong)]">
          {event.name}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--text-medium)]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M8 1.5C5.1 1.5 2.75 3.85 2.75 6.75C2.75 10.69 8 14.5 8 14.5C8 14.5 13.25 10.69 13.25 6.75C13.25 3.85 10.9 1.5 8 1.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="8"
              cy="6.75"
              r="1.75"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          <span>{event.location_name}</span>
        </div>

        <div className="mt-1.5 flex items-center gap-2 text-sm text-[var(--text-medium)]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <rect
              x="2"
              y="3"
              width="12"
              height="11"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M5.5 1.5V3.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M10.5 1.5V3.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span>{dateString}</span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag, i) => (
            <Tag
              key={tag}
              label={tag}
              color={TAG_COLORS[i % TAG_COLORS.length]}
              size="sm"
            />
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-5">
          <SocialProof
            viewsCount={event.views_count}
            interestedCount={event.interested_count}
            isFollowing={isFollowing}
            onToggleFollow={() => setIsFollowing(!isFollowing)}
          />
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-3">
          <Link href={`/login?redirect=${encodeURIComponent(`/e/${event.slug}`)}`}>
            <Button variant="primary" size="lg" fullWidth>
              Participar
            </Button>
          </Link>
          {event.ticket_url && (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => window.open(event.ticket_url ?? '', '_blank')}
            >
              Comprar ingresso
            </Button>
          )}
        </div>

        {/* Descricao colapsavel */}
        <GlassCard className="mt-6" padding="md">
          <h2 className="font-display text-base font-medium text-[var(--text-strong)] mb-2">
            Sobre o evento
          </h2>
          <p
            className={cn(
              'text-sm text-[var(--text-medium)] leading-relaxed transition-all duration-300',
              !descriptionExpanded && 'line-clamp-3'
            )}
          >
            {event.description}
          </p>
          {event.description.length > 120 && (
            <button
              className="mt-2 text-xs text-[var(--green-glow)] font-medium"
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
            >
              {descriptionExpanded ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
          {event.expected_capacity > 0 && (
            <p className="mt-3 text-xs text-[var(--text-subtle)]">
              Capacidade estimada: {event.expected_capacity} pessoas
            </p>
          )}
        </GlassCard>

        {/* Feed */}
        <div className="mt-6">
          <h2 className="font-display text-lg font-medium text-[var(--text-strong)] mb-4">
            Feed
          </h2>
          <EventFeed posts={feed} isAuthenticated={false} />
        </div>
      </div>
    </div>
  );
}
