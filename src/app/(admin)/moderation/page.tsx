'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// ── Dados mock de denúncias ────────────────────────────
interface MockReport {
  id: string;
  reporterName: string;
  reportedName: string;
  reason: string;
  conversationPreview: string;
  eventName: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

const MOCK_REPORTS: MockReport[] = [
  {
    id: '1',
    reporterName: 'Marina S.',
    reportedName: 'Usuário #42',
    reason: 'Linguagem inapropriada',
    conversationPreview: 'Conteúdo reportado no correio elegante',
    eventName: 'Sounds in da City',
    status: 'pending',
    createdAt: '2026-03-31T10:30:00-03:00',
  },
  {
    id: '2',
    reporterName: 'Ana C.',
    reportedName: 'Usuário #78',
    reason: 'Spam ou conteúdo repetitivo',
    conversationPreview: 'Mensagens repetidas no correio',
    eventName: 'Sounds in da City',
    status: 'pending',
    createdAt: '2026-03-30T22:15:00-03:00',
  },
  {
    id: '3',
    reporterName: 'Pedro L.',
    reportedName: 'Usuário #15',
    reason: 'Perfil falso',
    conversationPreview: 'Perfil suspeito reportado',
    eventName: 'Tech Meetup Floripa',
    status: 'reviewed',
    createdAt: '2026-03-29T14:00:00-03:00',
  },
  {
    id: '4',
    reporterName: 'Juliana R.',
    reportedName: 'Usuário #91',
    reason: 'Assédio ou comportamento inadequado',
    conversationPreview: 'Mensagens inapropriadas no correio elegante',
    eventName: 'Sunset Sessions',
    status: 'pending',
    createdAt: '2026-03-31T08:45:00-03:00',
  },
  {
    id: '5',
    reporterName: 'Thiago B.',
    reportedName: 'Usuário #33',
    reason: 'Linguagem inapropriada',
    conversationPreview: 'Conteúdo ofensivo reportado',
    eventName: 'Festa da Lagoa',
    status: 'resolved',
    createdAt: '2026-03-25T19:00:00-03:00',
  },
];

const statusConfig: Record<MockReport['status'], { label: string; className: string }> = {
  pending: {
    label: 'Pendente',
    className: 'text-[var(--coral-glow)] bg-[var(--coral-glow)]/10',
  },
  reviewed: {
    label: 'Em analise',
    className: 'text-[var(--amber-glow)] bg-[var(--amber-glow)]/10',
  },
  resolved: {
    label: 'Resolvido',
    className: 'text-[var(--green-glow)] bg-[var(--green-glow)]/10',
  },
};

function ShieldIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function ModerationPage(): JSX.Element {
  const pendingCount = MOCK_REPORTS.filter((r) => r.status === 'pending').length;
  const reviewedCount = MOCK_REPORTS.filter((r) => r.status === 'reviewed').length;
  const resolvedCount = MOCK_REPORTS.filter((r) => r.status === 'resolved').length;

  return (
    <div className="min-h-screen">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cabecalho */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--coral-glow)]/10 flex items-center justify-center text-[var(--coral-glow)]">
              <ShieldIcon />
            </div>
            <div>
              <h2 className="font-display text-xl text-white">Moderação</h2>
              <p className="text-sm text-white/40">Denúncias e segurança da plataforma</p>
            </div>
          </div>

          {/* Contadores rapidos */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-4 text-center border-l-[3px] border-l-[var(--coral-glow)]">
              <p className="font-display text-2xl text-[var(--coral-glow)]">{pendingCount}</p>
              <p className="text-xs text-white/40 mt-1">Pendentes</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center border-l-[3px] border-l-[var(--amber-glow)]">
              <p className="font-display text-2xl text-[var(--amber-glow)]">{reviewedCount}</p>
              <p className="text-xs text-white/40 mt-1">Em analise</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center border-l-[3px] border-l-[var(--green-glow)]">
              <p className="font-display text-2xl text-[var(--green-glow)]">{resolvedCount}</p>
              <p className="text-xs text-white/40 mt-1">Resolvidos</p>
            </div>
          </div>
        </section>

        {/* Lista de denúncias */}
        <section className="space-y-4">
          <h3 className="font-display text-lg text-white">Denúncias</h3>

          <div className="space-y-3">
            {MOCK_REPORTS.map((report) => {
              const status = statusConfig[report.status];
              return (
                <div
                  key={report.id}
                  className={cn(
                    'glass rounded-2xl p-5 space-y-4',
                    report.status === 'pending' && 'border border-[var(--coral-glow)]/20'
                  )}
                >
                  {/* Linha superior: status + timestamp */}
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                        status.className
                      )}
                    >
                      {status.label}
                    </span>
                    <span className="text-xs text-white/30">
                      {formatRelativeTime(report.createdAt)}
                    </span>
                  </div>

                  {/* Detalhes da denúncia */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/40">Reportado por</span>
                      <span className="text-white font-medium">{report.reporterName}</span>
                      <span className="text-white/20">|</span>
                      <span className="text-white/40">Alvo:</span>
                      <span className="text-white font-medium">{report.reportedName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/40">Motivo:</span>
                      <span className="text-[var(--coral-glow)]">{report.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/40">Evento:</span>
                      <span className="text-white/60">{report.eventName}</span>
                    </div>
                    <p className="text-sm text-white/30 bg-white/[0.02] rounded-lg px-3 py-2">
                      {report.conversationPreview}
                    </p>
                  </div>

                  {/* Ações */}
                  {report.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-1">
                      <Button variant="ghost" size="sm">
                        Dispensar
                      </Button>
                      <Button variant="secondary" size="sm">
                        Avisar usuario
                      </Button>
                      <Button
                        variant="coral"
                        size="sm"
                      >
                        Bloquear usuario
                      </Button>
                    </div>
                  )}

                  {report.status === 'reviewed' && (
                    <div className="flex items-center gap-2 pt-1">
                      <Button variant="ghost" size="sm">
                        Marcar como resolvido
                      </Button>
                      <Button
                        variant="coral"
                        size="sm"
                      >
                        Bloquear usuario
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {MOCK_REPORTS.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-white/40 text-sm">Nenhuma denúncia registrada</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
