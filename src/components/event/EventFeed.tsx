'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatRelativeTime } from '@/lib/utils';

interface FeedReaction {
  emoji: string;
  count: number;
}

interface FeedPost {
  id: string;
  author: { name: string; emoji: string };
  content: string;
  created_at: string;
  reactions: FeedReaction[];
  replies: number;
}

interface EventFeedProps {
  posts: FeedPost[];
  isAuthenticated: boolean;
}

function AuthBanner(): JSX.Element {
  return (
    <GlassCard padding="md" className="text-center">
      <p className="text-sm text-[var(--text-medium)]">
        Faca login para participar do feed
      </p>
      <Link href="/login" className="mt-2 inline-block text-sm font-medium text-[var(--green-glow)]">
        Entrar
      </Link>
    </GlassCard>
  );
}

function FeedPostCard({
  post,
  isAuthenticated,
}: {
  post: FeedPost;
  isAuthenticated: boolean;
}): JSX.Element {
  return (
    <GlassCard padding="md" className="animate-fade-up">
      {/* Header do post */}
      <div className="flex items-center gap-3">
        {/* Avatar com emoji */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-white/[0.06] shrink-0">
          {post.author.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-display text-sm font-medium text-[var(--text-strong)]">
            {post.author.name}
          </span>
          <span className="ml-2 text-xs text-[var(--text-subtle)]">
            {formatRelativeTime(post.created_at)}
          </span>
        </div>
      </div>

      {/* Conteudo */}
      <p className="mt-3 text-sm text-[var(--text-medium)] leading-relaxed">
        {post.content}
      </p>

      {/* Reactions + replies */}
      <div className="mt-3 flex items-center gap-3">
        {/* Reactions */}
        <div className="flex items-center gap-1.5">
          {post.reactions.map((reaction) => (
            <button
              key={reaction.emoji}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-xs"
              disabled={!isAuthenticated}
            >
              <span>{reaction.emoji}</span>
              <span className="text-[var(--text-subtle)]">{reaction.count}</span>
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="flex-1" />

        {/* Replies */}
        {post.replies > 0 && (
          <button className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)] hover:text-[var(--text-medium)] transition-colors">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.75 9.25V3.5C1.75 2.81 2.31 2.25 3 2.25H11C11.69 2.25 12.25 2.81 12.25 3.5V8C12.25 8.69 11.69 9.25 11 9.25H4.5L1.75 11.75V9.25Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              {post.replies} {post.replies === 1 ? 'resposta' : 'respostas'}
            </span>
          </button>
        )}
      </div>
    </GlassCard>
  );
}

export function EventFeed({
  posts,
  isAuthenticated,
}: EventFeedProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      {!isAuthenticated && <AuthBanner />}
      {posts.map((post) => (
        <FeedPostCard
          key={post.id}
          post={post}
          isAuthenticated={isAuthenticated}
        />
      ))}
      {posts.length === 0 && (
        <GlassCard padding="lg" className="text-center">
          <p className="text-sm text-[var(--text-subtle)]">
            Nenhuma postagem ainda. Seja o primeiro!
          </p>
        </GlassCard>
      )}
    </div>
  );
}
