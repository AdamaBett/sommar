'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { CorreioMessage } from '@/types/correio';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CorreioExpiredProps {
  recipientName: string;
  messages: CorreioMessage[];
  currentUserId: string;
  onReEnableMission: () => void;
  onReEnablePayment: () => void;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Read-only Message Bubble                                           */
/* ------------------------------------------------------------------ */

function ReadOnlyBubble({
  message,
  isSelf,
}: {
  message: CorreioMessage;
  isSelf: boolean;
}): JSX.Element {
  return (
    <div
      className={cn(
        'flex mb-2',
        isSelf ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'rounded-2xl px-4 py-2.5 max-w-[78%]',
          isSelf ? 'rounded-tr-md' : 'rounded-tl-md'
        )}
        style={{
          fontSize: '14px',
          lineHeight: '1.5',
          color: 'rgba(255,255,255,0.4)',
          opacity: 0.6,
          ...(isSelf
            ? {
                backgroundColor: 'rgba(239,159,39,0.06)',
                borderRight: '2px solid rgba(239,159,39,0.2)',
              }
            : {
                backgroundColor: 'rgba(0,212,255,0.04)',
                borderLeft: '2px solid rgba(0,212,255,0.15)',
              }),
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Re-enable Option Card                                              */
/* ------------------------------------------------------------------ */

function ReEnableOption({
  icon,
  title,
  description,
  buttonLabel,
  buttonVariant,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonVariant: 'primary' | 'amber';
  onClick: () => void;
}): JSX.Element {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl shrink-0" aria-hidden="true">
          {icon}
        </span>
        <div>
          <h4
            className="text-sm font-semibold mb-0.5"
            style={{ color: 'rgba(255,255,255,0.87)' }}
          >
            {title}
          </h4>
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {description}
          </p>
        </div>
      </div>
      <Button
        variant={buttonVariant}
        size="sm"
        onClick={onClick}
        fullWidth
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function CorreioExpired({
  recipientName,
  messages,
  currentUserId,
  onReEnableMission,
  onReEnablePayment,
  onClose,
}: CorreioExpiredProps): JSX.Element {
  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        zIndex: 400,
        backgroundColor: '#000000',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(0,0,0,0.95)',
        }}
      >
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/5"
          aria-label="Fechar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {recipientName}
          </p>
        </div>

        {/* Expired badge */}
        <div
          className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: 'rgba(216,90,48,0.12)',
            color: 'var(--coral-glow)',
            border: '1px solid rgba(216,90,48,0.2)',
          }}
        >
          Expirado
        </div>
      </div>

      {/* Expired notice */}
      <div
        className="mx-4 mt-4 rounded-xl px-4 py-3 text-center"
        style={{
          backgroundColor: 'rgba(216,90,48,0.06)',
          border: '1px solid rgba(216,90,48,0.1)',
        }}
      >
        <p className="text-sm font-medium" style={{ color: 'var(--coral-glow)' }}>
          Conversa expirada
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
          O tempo desta conversa chegou ao fim, mas você pode reativá-la
        </p>
      </div>

      {/* Messages (read-only, faded) */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <ReadOnlyBubble
            key={msg.id}
            message={msg}
            isSelf={msg.sender_id === currentUserId}
          />
        ))}
      </div>

      {/* Re-enable options */}
      <div
        className="shrink-0 px-4 pb-6 pt-3 space-y-3"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(0,0,0,0.95)',
        }}
      >
        <p
          className="text-xs text-center mb-3 font-medium"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Quer continuar essa conversa?
        </p>

        <ReEnableOption
          icon={'\uD83C\uDFAF'}
          title="Completar uma missão"
          description="Escaneie um QR code no evento ou complete um desafio para desbloquear"
          buttonLabel="Ver missões disponíveis"
          buttonVariant="primary"
          onClick={onReEnableMission}
        />

        <ReEnableOption
          icon={'\u2728'}
          title="Desbloquear por R$0,99"
          description="Reative instantaneamente e continue de onde parou"
          buttonLabel="Desbloquear agora"
          buttonVariant="amber"
          onClick={onReEnablePayment}
        />
      </div>
    </div>
  );
}
