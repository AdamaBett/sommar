'use client';

import { useState, useCallback } from 'react';
import type { LobbyParticipant } from '@/app/(app)/lobby/page';
import { LobbyHeader } from '@/components/lobby/LobbyHeader';
import { FacetFilter } from '@/components/lobby/FacetFilter';
import { LobbyGrid } from '@/components/lobby/LobbyGrid';
import { CosmosLobby } from '@/components/lobby/CosmosLobby';
import { PersonPopup } from '@/components/lobby/PersonPopup';
import { CorreioPopup } from '@/components/correio/CorreioPopup';

type LobbyViewMode = 'cosmos' | 'grid';

export type FacetFilterType = 'all' | 'intimo' | 'academico' | 'profissional' | 'social';

interface LobbyViewProps {
  participants: LobbyParticipant[];
  eventName: string;
  participantCount: number;
  isLive: boolean;
}

export function LobbyView({
  participants,
  eventName,
  participantCount,
  isLive,
}: LobbyViewProps): JSX.Element {
  const [viewMode, setViewMode] = useState<LobbyViewMode>('cosmos');
  const [activeFilter, setActiveFilter] = useState<FacetFilterType>('all');
  const [selectedPerson, setSelectedPerson] = useState<LobbyParticipant | null>(null);
  const [correioTarget, setCorreioTarget] = useState<LobbyParticipant | null>(null);
  const [correioSent, setCorreioSent] = useState(false);

  const filteredParticipants =
    activeFilter === 'all'
      ? participants
      : participants.filter((p) => p.tipo === activeFilter);

  const handlePersonClick = useCallback((person: LobbyParticipant) => {
    setSelectedPerson(person);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedPerson(null);
  }, []);

  const handleFilterChange = useCallback((filter: FacetFilterType) => {
    setActiveFilter(filter);
  }, []);

  const handleOpenCorreio = useCallback((person: LobbyParticipant) => {
    setSelectedPerson(null);
    // Small delay so popup closes first
    setTimeout(() => setCorreioTarget(person), 200);
  }, []);

  const handleSendCorreio = useCallback((message: string) => {
    // TODO: Persist via Supabase
    console.log('Correio enviado para', correioTarget?.nome, ':', message);
    setCorreioTarget(null);
    setCorreioSent(true);
    setTimeout(() => setCorreioSent(false), 3000);
  }, [correioTarget]);

  const handleCloseCorreio = useCallback(() => {
    setCorreioTarget(null);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Header fixo no topo com filtros */}
      <LobbyHeader
        eventName={eventName}
        participantCount={participantCount}
        isLive={isLive}
      />

      {/* Filtros de faceta + view toggle */}
      <div className="relative">
        <FacetFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {/* View mode toggle */}
        <button
          onClick={() => setViewMode(viewMode === 'cosmos' ? 'grid' : 'cosmos')}
          aria-label={viewMode === 'cosmos' ? 'Mudar para grade' : 'Mudar para cosmos'}
          className="fixed top-[62px] right-4 z-50 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {viewMode === 'cosmos' ? (
            // Grid icon
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="5" height="5" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
              <rect x="10" y="1" width="5" height="5" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
              <rect x="1" y="10" width="5" height="5" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
              <rect x="10" y="10" width="5" height="5" rx="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            </svg>
          ) : (
            // Cosmos/stars icon
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="2" fill="rgba(255,255,255,0.5)" />
              <circle cx="3" cy="4" r="1.2" fill="rgba(255,255,255,0.4)" />
              <circle cx="13" cy="5" r="1" fill="rgba(255,255,255,0.35)" />
              <circle cx="4" cy="12" r="1.2" fill="rgba(255,255,255,0.35)" />
              <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.4)" />
              <line x1="3" y1="4" x2="8" y2="8" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
              <line x1="13" y1="5" x2="8" y2="8" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Lobby content: Cosmos (default) or Grid */}
      {viewMode === 'cosmos' ? (
        <CosmosLobby
          participants={filteredParticipants}
          onPersonClick={handlePersonClick}
        />
      ) : (
        <div className="pt-[108px] pb-[160px] overflow-y-auto">
          <LobbyGrid
            participants={filteredParticipants}
            onPersonClick={handlePersonClick}
          />
        </div>
      )}

      {/* Matter passive card */}
      <div
        className="fixed bottom-[100px] left-4 right-4 z-30 rounded-[20px] p-4 opacity-0 animate-[fade-up_0.8s_cubic-bezier(.16,1,.3,1)_0.8s_forwards] pointer-events-none"
        style={{
          background: 'rgba(29,158,117,0.06)',
          border: '1px solid rgba(29,255,168,0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <div
            className="w-6 h-6 rounded-full shrink-0 animate-orb-pulse"
            style={{
              background:
                'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.6), var(--green-glow) 30%, var(--cyan) 60%, transparent 85%)',
              filter: 'blur(2px)',
            }}
          />
          <span className="font-display text-[13px] text-[var(--text-strong)]">
            Matter
          </span>
        </div>
        <p className="text-[13px] font-light leading-relaxed text-[var(--text-medium)]">
          Seu Ori ta conversando com{' '}
          <strong className="text-[var(--green-glow)] font-medium">
            {filteredParticipants.length} pessoas
          </strong>
          . Relaxa e curte o som.{' '}
          <em className="text-[var(--amber-glow)] italic">Ou explora quem ta aqui.</em>
        </p>
      </div>

      {/* Person popup bottom sheet */}
      <PersonPopup
        person={selectedPerson}
        onClose={handleClosePopup}
        onCorreio={handleOpenCorreio}
      />

      {/* Correio Elegante popup */}
      <CorreioPopup
        recipientName={correioTarget?.nome ?? ''}
        isOpen={correioTarget !== null}
        onSend={handleSendCorreio}
        onClose={handleCloseCorreio}
      />

      {/* Toast de confirmacao */}
      {correioSent && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[400] px-5 py-3 rounded-xl text-sm font-medium animate-fade-up"
          style={{
            background: 'rgba(239,159,39,0.15)',
            border: '1px solid rgba(239,159,39,0.25)',
            color: 'var(--amber-glow)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {'\uD83D\uDC8C'} Correio enviado com sucesso!
        </div>
      )}
    </div>
  );
}
