'use client';

import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface EventRow {
  id: string;
  name: string;
  slug: string;
  startTime: string;
  endTime: string | null;
  lobbyState: 'pending' | 'active' | 'historical' | 'expired';
  participantCount: number;
  connectionCount: number;
  organizerName: string;
}

interface EventsAdminProps {
  events: EventRow[];
  onCreateEvent?: () => void;
}

const stateLabels: Record<EventRow['lobbyState'], { label: string; className: string }> = {
  pending: {
    label: 'Pendente',
    className: 'text-[var(--amber-glow)] bg-[var(--amber-glow)]/10',
  },
  active: {
    label: 'Ao vivo',
    className: 'text-[var(--green-glow)] bg-[var(--green-glow)]/10',
  },
  historical: {
    label: 'Encerrado',
    className: 'text-white/50 bg-white/[0.06]',
  },
  expired: {
    label: 'Expirado',
    className: 'text-white/30 bg-white/[0.04]',
  },
};

export function EventsAdmin({ events, onCreateEvent }: EventsAdminProps): JSX.Element {
  return (
    <div className="space-y-4">
      {/* Cabecalho da secao */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-white">Eventos</h2>
        {onCreateEvent && (
          <Button variant="primary" size="sm" onClick={onCreateEvent}>
            Criar evento
          </Button>
        )}
      </div>

      {/* Tabela desktop */}
      <div className="hidden md:block glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-xs text-white/40 font-medium px-5 py-3">Evento</th>
              <th className="text-left text-xs text-white/40 font-medium px-5 py-3">Data</th>
              <th className="text-left text-xs text-white/40 font-medium px-5 py-3">Status</th>
              <th className="text-right text-xs text-white/40 font-medium px-5 py-3">Participantes</th>
              <th className="text-right text-xs text-white/40 font-medium px-5 py-3">Conexões</th>
              <th className="text-right text-xs text-white/40 font-medium px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const state = stateLabels[event.lobbyState];
              return (
                <tr
                  key={event.id}
                  className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm text-white font-medium">{event.name}</p>
                      <p className="text-xs text-white/30 mt-0.5">{event.organizerName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-white/60">{formatDate(event.startTime)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                        state.className
                      )}
                    >
                      {state.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-white/60">{event.participantCount}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-[var(--cyan)]">{event.connectionCount}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded hover:bg-white/[0.04]"
                        title="Editar"
                      >
                        Editar
                      </button>
                      <button
                        className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded hover:bg-white/[0.04]"
                        title="Ver lobby"
                      >
                        Lobby
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden space-y-3">
        {events.map((event) => {
          const state = stateLabels[event.lobbyState];
          return (
            <div key={event.id} className="glass rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{event.name}</p>
                  <p className="text-xs text-white/30 mt-0.5">{event.organizerName}</p>
                </div>
                <span
                  className={cn(
                    'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                    state.className
                  )}
                >
                  {state.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span>{formatDate(event.startTime)}</span>
                <span>{event.participantCount} participantes</span>
                <span className="text-[var(--cyan)]">{event.connectionCount} conexões</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button className="text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04]">
                  Editar
                </button>
                <button className="text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04]">
                  Ver lobby
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-white/40 text-sm">Nenhum evento cadastrado</p>
        </div>
      )}
    </div>
  );
}
