'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Lobby, LobbyParticipant, LobbyState } from '@/types/event';
import type { MatchResult } from '@/types/ori';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FacetFilter = 'todos' | 'intimo' | 'criativo' | 'profissional' | 'social';

interface LobbyParticipantWithProfile extends LobbyParticipant {
  displayName: string;
  photo: string | null;
  isOnline: boolean;
}

interface UseLobbyReturn {
  lobby: Lobby | null;
  participants: LobbyParticipantWithProfile[];
  matches: MatchResult[];
  activeFilter: FacetFilter;
  setActiveFilter: (filter: FacetFilter) => void;
  isLoading: boolean;
  participantCount: number;
  onlineCount: number;
  triggerMatching: () => Promise<void>;
  checkIn: (lobbyId: string, facets: string[]) => Promise<void>;
  switchLobby: (lobbyId: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Facet filter mapping                                               */
/* ------------------------------------------------------------------ */

const FACET_FILTER_MAP: Record<FacetFilter, string | null> = {
  todos: null,
  intimo: 'intimo',
  criativo: 'criativo',
  profissional: 'profissional',
  social: 'social',
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useLobby(userId: string, initialLobbyId?: string): UseLobbyReturn {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [participants, setParticipants] = useState<LobbyParticipantWithProfile[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<FacetFilter>('todos');
  const [isLoading, setIsLoading] = useState(true);
  const activeLobbyId = useRef<string | null>(initialLobbyId ?? null);

  // Buscar dados do lobby
  const fetchLobby = useCallback(
    async (lobbyId: string) => {
      setIsLoading(true);
      try {
        // TODO: Replace with Supabase query
        // Mock lobby data for development
        const mockLobby: Lobby = {
          id: lobbyId,
          event_id: 'mock-event',
          state: 'active' as LobbyState,
          opened_at: new Date().toISOString(),
          closed_at: null,
          expires_at: null,
          created_at: new Date().toISOString(),
        };
        setLobby(mockLobby);
      } catch (error) {
        console.error('[useLobby] Erro ao buscar lobby:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Carregar lobby inicial
  useEffect(() => {
    if (activeLobbyId.current) {
      fetchLobby(activeLobbyId.current);
    } else {
      setIsLoading(false);
    }
  }, [fetchLobby]);

  // Filtrar participantes por faceta
  const filteredParticipants = useCallback((): LobbyParticipantWithProfile[] => {
    const facetKey = FACET_FILTER_MAP[activeFilter];
    if (!facetKey) return participants;

    return participants.filter((p) =>
      p.active_facets.includes(facetKey)
    );
  }, [participants, activeFilter]);

  // Trigger matching via API
  const triggerMatching = useCallback(async () => {
    if (!lobby) return;

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          lobbyId: lobby.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro no matching');
      }

      const data = await response.json();
      setMatches(data.matches ?? []);
    } catch (error) {
      console.error('[useLobby] Erro no matching:', error);
    }
  }, [userId, lobby]);

  // Check-in no lobby
  const checkIn = useCallback(
    async (lobbyId: string, facets: string[]) => {
      try {
        // TODO: Supabase insert into lobby_participants
        activeLobbyId.current = lobbyId;
        await fetchLobby(lobbyId);

        // Adicionar usuário como participante local
        const selfParticipant: LobbyParticipantWithProfile = {
          lobby_id: lobbyId,
          user_id: userId,
          active_facets: facets,
          role: 'participant',
          checked_in_at: new Date().toISOString(),
          displayName: 'Você',
          photo: null,
          isOnline: true,
        };
        setParticipants((prev) => [...prev, selfParticipant]);

        // Trigger matching após check-in
        await triggerMatching();
      } catch (error) {
        console.error('[useLobby] Erro no check-in:', error);
      }
    },
    [userId, fetchLobby, triggerMatching]
  );

  // Trocar de lobby
  const switchLobby = useCallback(
    (lobbyId: string) => {
      activeLobbyId.current = lobbyId;
      setParticipants([]);
      setMatches([]);
      setActiveFilter('todos');
      fetchLobby(lobbyId);
    },
    [fetchLobby]
  );

  return {
    lobby,
    participants: filteredParticipants(),
    matches,
    activeFilter,
    setActiveFilter,
    isLoading,
    participantCount: participants.length,
    onlineCount: participants.filter((p) => p.isOnline).length,
    triggerMatching,
    checkIn,
    switchLobby,
  };
}
