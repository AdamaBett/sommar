import { EventsDiscovery } from '@/components/event/EventsDiscovery';

// Dados mock para desenvolvimento
const MOCK_FOLLOWED_EVENTS = [
  {
    id: '1',
    name: 'Sounds in da City',
    slug: 'sounds-in-da-city',
    cover_image_url: null as string | null,
    location_name: 'Costa da Lagoa, Florianópolis',
    start_time: '2026-04-15T18:00:00Z',
    tags: ['música', 'festival', 'indie'],
    interested_count: 247,
  },
];

const MOCK_UPCOMING_EVENTS = [
  {
    id: '2',
    name: 'Noite Eletrônica',
    slug: 'noite-eletronica',
    cover_image_url: null as string | null,
    location_name: 'Jurerê, Florianópolis',
    start_time: '2026-04-20T22:00:00Z',
    tags: ['eletrônica', 'noite'],
    interested_count: 89,
  },
  {
    id: '3',
    name: 'Encontro Criativo',
    slug: 'encontro-criativo',
    cover_image_url: null as string | null,
    location_name: 'Centro, Florianópolis',
    start_time: '2026-04-22T14:00:00Z',
    tags: ['criativo', 'networking', 'arte'],
    interested_count: 134,
  },
  {
    id: '4',
    name: 'Sunset Sessions',
    slug: 'sunset-sessions',
    cover_image_url: null as string | null,
    location_name: 'Barra da Lagoa, Florianópolis',
    start_time: '2026-05-01T17:00:00Z',
    tags: ['música', 'sunset', 'acústico'],
    interested_count: 56,
  },
];

export default function EventsPage(): React.ReactElement {
  return (
    <EventsDiscovery
      followedEvents={MOCK_FOLLOWED_EVENTS}
      upcomingEvents={MOCK_UPCOMING_EVENTS}
    />
  );
}
