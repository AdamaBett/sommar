'use client';

import { OrganizerHeader } from '@/components/organizer/OrganizerHeader';
import { cn } from '@/lib/utils';

// Mock safety alerts
const MOCK_ALERTS = [
  {
    id: '1',
    status: 'pending' as const,
    description: 'Pessoa incomodando perto do bar principal',
    locationNote: 'Próximo ao bar, área externa',
    eventName: 'Festival de Verão',
    createdAt: '2026-04-15T22:30:00-03:00',
    reporterInitial: 'A',
    reportedUserInitial: null,
  },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'text-red-400 bg-red-500/10' },
  organizer_notified: { label: 'Notificado', color: 'text-[var(--amber-glow)] bg-[var(--amber-glow)]/10' },
  resolved: { label: 'Resolvido', color: 'text-[var(--green-glow)] bg-[var(--green-glow)]/10' },
};

export default function SafetyAlertsPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <OrganizerHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h2 className="font-display text-2xl text-white">Alertas de Segurança</h2>
          <p className="text-sm text-white/50 mt-1">
            Alertas recebidos de participantes dos seus eventos.
          </p>
        </div>

        {MOCK_ALERTS.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--green-glow)]/10 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#1DFFA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-white/40 text-sm">Nenhum alerta de segurança. Tudo tranquilo.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_ALERTS.map(alert => {
              const statusInfo = STATUS_LABELS[alert.status] ?? STATUS_LABELS.pending;
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'rounded-2xl p-6',
                    'bg-white/[0.02] border border-white/[0.06]',
                    alert.status === 'pending' && 'border-red-500/20',
                    'backdrop-blur-sm'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1L2 13h12L8 1z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8 6v3M8 11h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{alert.eventName}</p>
                        <p className="text-xs text-white/40">
                          {new Date(alert.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusInfo.color)}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {alert.description && (
                    <p className="text-sm text-white/70 mb-2">{alert.description}</p>
                  )}

                  {alert.locationNote && (
                    <p className="text-xs text-white/40 mb-4">
                      Local: {alert.locationNote}
                    </p>
                  )}

                  {alert.status === 'pending' && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-[var(--green)]/80 hover:bg-[var(--green)] transition-all"
                        onClick={() => {
                          // TODO: marcar como resolvido via Supabase
                          window.alert('Marcar como resolvido (implementar)');
                        }}
                      >
                        Marcar como resolvido
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-xs text-white/50 border border-white/[0.06] hover:bg-white/[0.04] transition-all"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Emergência */}
        <div className={cn('rounded-2xl p-6 bg-red-500/5 border border-red-500/10')}>
          <h3 className="text-sm font-medium text-red-400 mb-2">Em caso de emergência</h3>
          <p className="text-xs text-white/50">
            Se algum participante reportar uma situação que exija ação imediata, entre em contato com a segurança do local e, se necessário, ligue 190 (Polícia) ou 192 (SAMU).
          </p>
        </div>
      </main>
    </div>
  );
}
