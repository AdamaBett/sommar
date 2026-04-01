'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { EventCard } from '@/components/event/EventCard';

interface EventSummary {
  id: string;
  name: string;
  slug: string;
  cover_image_url: string | null;
  location_name: string;
  start_time: string;
  tags: string[];
  interested_count: number;
}

interface EventsDiscoveryProps {
  followedEvents: EventSummary[];
  upcomingEvents: EventSummary[];
}

export function EventsDiscovery({
  followedEvents,
  upcomingEvents,
}: EventsDiscoveryProps): JSX.Element {
  const [search, setSearch] = useState('');

  // Filtragem simples pelo nome
  const filterEvents = (events: EventSummary[]): EventSummary[] => {
    if (!search.trim()) return events;
    const query = search.toLowerCase();
    return events.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.location_name.toLowerCase().includes(query) ||
        e.tags.some((t) => t.toLowerCase().includes(query))
    );
  };

  const filteredFollowed = filterEvents(followedEvents);
  const filteredUpcoming = filterEvents(upcomingEvents);

  return (
    <div className="px-5 pb-28 pt-4 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-semibold text-[var(--text-strong)] mb-5">
        Eventos
      </h1>

      {/* Busca */}
      <div className="mb-6">
        <Input
          placeholder="Buscar eventos, locais, tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Seus eventos */}
      {filteredFollowed.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-base font-medium text-[var(--text-medium)] mb-3">
            Seus eventos
          </h2>
          <div className="flex flex-col gap-4">
            {filteredFollowed.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
      )}

      {/* Proximos */}
      <section>
        <h2 className="font-display text-base font-medium text-[var(--text-medium)] mb-3">
          Proximos
        </h2>
        {filteredUpcoming.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredUpcoming.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-sm text-[var(--text-subtle)]">
              {search.trim()
                ? 'Nenhum evento encontrado para essa busca'
                : 'Nenhum evento proximo no momento'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
