import type { Metadata } from 'next';
import { EventPageView } from '@/components/event/EventPageView';

// Dados mock para desenvolvimento
const MOCK_EVENT = {
  id: '1',
  name: 'Sounds in da City',
  slug: 'sounds-in-da-city',
  description:
    'O maior festival de música independente de Florianópolis. Três dias de sons, conexões e experiências únicas na Costa da Lagoa.',
  cover_image_url: null as string | null,
  location_name: 'Costa da Lagoa, Florianópolis',
  start_time: '2026-04-15T18:00:00Z',
  end_time: '2026-04-17T23:00:00Z',
  tags: ['música', 'festival', 'indie', 'Florianópolis'],
  expected_capacity: 500,
  ticket_url: 'https://example.com/tickets',
  interested_count: 247,
  views_count: 1832,
};

const MOCK_FEED = [
  {
    id: 'p1',
    author: { name: 'Lucas M.', emoji: '🌊' },
    content: 'Alguém mais vai no dia 2? Quero trocar ideia sobre o line-up!',
    created_at: '2026-03-30T14:00:00Z',
    reactions: [
      { emoji: '🔥', count: 4 },
      { emoji: '🙌', count: 2 },
    ],
    replies: 3,
  },
  {
    id: 'p2',
    author: { name: 'Mariana R.', emoji: '🌙' },
    content: 'Primeira vez na Costa da Lagoa. Vai ser incrível!',
    created_at: '2026-03-29T20:30:00Z',
    reactions: [
      { emoji: '💚', count: 7 },
      { emoji: '✨', count: 3 },
    ],
    replies: 1,
  },
  {
    id: 'p3',
    author: { name: 'Pedro K.', emoji: '⚡' },
    content:
      'Fiz meu Ori ontem e já apareceram 3 matches pro festival. Essa plataforma é real.',
    created_at: '2026-03-28T11:15:00Z',
    reactions: [
      { emoji: '🚀', count: 12 },
      { emoji: '💚', count: 5 },
    ],
    replies: 6,
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Em produção, buscar evento pelo slug
  void slug;

  return {
    title: `${MOCK_EVENT.name} | Sommar`,
    description: MOCK_EVENT.description,
    openGraph: {
      title: `${MOCK_EVENT.name} | Sommar`,
      description: MOCK_EVENT.description ?? '',
      type: 'website',
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.ReactElement> {
  const { slug } = await params;

  return <EventPageView event={MOCK_EVENT} feed={MOCK_FEED} slug={slug} />;
}
