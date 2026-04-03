'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SafetyButtonProps {
  eventId?: string;
  lobbyId?: string;
  reportedUserId?: string;
  variant?: 'inline' | 'menu';
  className?: string;
}

/** Botão de pânico discreto. Requer confirmação dupla para evitar acionamento acidental. */
export function SafetyButton({
  eventId,
  lobbyId,
  reportedUserId,
  variant = 'inline',
  className,
}: SafetyButtonProps): JSX.Element {
  const [stage, setStage] = useState<'idle' | 'confirm' | 'detail' | 'sending' | 'sent'>('idle');
  const [description, setDescription] = useState('');
  const [locationNote, setLocationNote] = useState('');

  const handleFirstClick = useCallback(() => {
    setStage('confirm');
  }, []);

  const handleConfirm = useCallback(() => {
    setStage('detail');
  }, []);

  const handleCancel = useCallback(() => {
    setStage('idle');
    setDescription('');
    setLocationNote('');
  }, []);

  const handleSend = useCallback(async () => {
    setStage('sending');
    try {
      const response = await fetch('/api/safety/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          lobby_id: lobbyId,
          reported_user_id: reportedUserId,
          description: description || null,
          location_note: locationNote || null,
        }),
      });

      if (response.ok) {
        setStage('sent');
      } else {
        setStage('detail');
      }
    } catch {
      setStage('detail');
    }
  }, [eventId, lobbyId, reportedUserId, description, locationNote]);

  if (stage === 'idle') {
    return (
      <button
        type="button"
        onClick={handleFirstClick}
        className={cn(
          variant === 'inline'
            ? 'flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200'
            : 'w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200',
          className
        )}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1L2 13h12L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 6v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {variant === 'menu' ? 'Me sinto inseguro(a)' : 'Segurança'}
      </button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <div className="w-full max-w-sm rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] p-6 backdrop-blur-xl">
          {stage === 'confirm' && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L2 13h12L8 1z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 6v3M8 11h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">Alerta de segurança</h3>
              </div>
              <p className="text-sm text-white/70 mb-6">
                Você está se sentindo inseguro(a)? Ao confirmar, enviaremos um alerta para o organizador do evento.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-white/60 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 transition-all"
                >
                  Sim, enviar alerta
                </button>
              </div>
            </>
          )}

          {stage === 'detail' && (
            <>
              <h3 className="text-base font-semibold text-white mb-1">Detalhes (opcional)</h3>
              <p className="text-xs text-white/50 mb-4">Quanto mais info, melhor o organizador pode ajudar.</p>

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="O que aconteceu? (opcional)"
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 outline-none focus:border-red-500/50 resize-none mb-3"
              />

              <input
                type="text"
                value={locationNote}
                onChange={e => setLocationNote(e.target.value)}
                placeholder="Onde você está no evento? (opcional)"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 outline-none focus:border-red-500/50 mb-4"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-white/60 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 transition-all"
                >
                  Enviar alerta
                </button>
              </div>

              <p className="text-xs text-white/30 text-center mt-4">
                Se emergência, ligue 190.
              </p>
            </>
          )}

          {stage === 'sending' && (
            <div className="flex flex-col items-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full mb-4"
              />
              <p className="text-sm text-white/60">Enviando alerta...</p>
            </div>
          )}

          {stage === 'sent' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Alerta enviado</h3>
              <p className="text-sm text-white/60 text-center mb-1">
                Sua segurança é prioridade. O organizador foi notificado.
              </p>
              <p className="text-xs text-white/40 text-center mb-6">
                Se emergência, ligue 190.
              </p>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] transition-all"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
