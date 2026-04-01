import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findMatches, type MatchCandidate } from '@/lib/ai/matching';
import { MATCH_THRESHOLD } from '@/lib/constants';

/* ------------------------------------------------------------------ */
/*  POST /api/match                                                    */
/*  Trigger matching para um usuário em um lobby específico            */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, lobbyId } = body as {
      userId?: string;
      lobbyId?: string;
    };

    if (!userId || !lobbyId) {
      return NextResponse.json(
        { error: 'userId e lobbyId são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar autenticação
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar Ori do usuário
    const { data: userOri, error: oriError } = await supabase
      .from('oris')
      .select('embedding, narrative')
      .eq('user_id', userId)
      .single();

    if (oriError || !userOri?.embedding) {
      return NextResponse.json(
        { error: 'Ori não encontrado ou sem embedding' },
        { status: 404 }
      );
    }

    // Buscar participantes do lobby (excluindo o usuário atual)
    const { data: participants, error: participantsError } = await supabase
      .from('lobby_participants')
      .select('user_id, active_facets')
      .eq('lobby_id', lobbyId)
      .neq('user_id', userId);

    if (participantsError || !participants?.length) {
      return NextResponse.json({ matches: [] });
    }

    // Buscar facetas ativas do usuário no lobby
    const { data: userParticipant } = await supabase
      .from('lobby_participants')
      .select('active_facets')
      .eq('lobby_id', lobbyId)
      .eq('user_id', userId)
      .single();

    const userActiveFacets = userParticipant?.active_facets ?? ['essencia'];

    // Buscar bloqueios do usuário
    const { data: blocks } = await supabase
      .from('blocks')
      .select('blocked_id')
      .eq('blocker_id', userId);

    const blockedIds = new Set(blocks?.map((b) => b.blocked_id) ?? []);

    // Buscar bloqueios reversos (quem bloqueou o usuário)
    const { data: reverseBlocks } = await supabase
      .from('blocks')
      .select('blocker_id')
      .eq('blocked_id', userId);

    const reverseBlockedIds = new Set(
      reverseBlocks?.map((b) => b.blocker_id) ?? []
    );

    // Filtrar participantes bloqueados
    const eligibleParticipantIds = participants
      .map((p) => p.user_id)
      .filter((id) => !blockedIds.has(id) && !reverseBlockedIds.has(id));

    if (eligibleParticipantIds.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    // Buscar Oris dos candidatos
    const { data: candidateOris, error: candidateError } = await supabase
      .from('oris')
      .select('user_id, embedding')
      .in('user_id', eligibleParticipantIds)
      .not('embedding', 'is', null);

    if (candidateError || !candidateOris?.length) {
      return NextResponse.json({ matches: [] });
    }

    // Montar candidatos com facetas
    const participantFacetMap = new Map<string, string[]>();
    for (const p of participants) {
      participantFacetMap.set(p.user_id, p.active_facets ?? ['essencia']);
    }

    const candidates: MatchCandidate[] = candidateOris.map((ori) => ({
      userId: ori.user_id,
      embedding: ori.embedding as number[],
      facets: participantFacetMap.get(ori.user_id) ?? ['essencia'],
    }));

    // Executar matching
    const matches = findMatches(
      userOri.embedding as number[],
      candidates,
      userActiveFacets,
      MATCH_THRESHOLD
    );

    // Buscar nomes dos matches para resposta
    const matchUserIds = matches.map((m) => m.userId);
    const { data: matchProfiles } = await supabase
      .from('profiles')
      .select('id, display_name, photos')
      .in('id', matchUserIds);

    const profileMap = new Map(
      matchProfiles?.map((p) => [p.id, p]) ?? []
    );

    const enrichedMatches = matches.map((match) => {
      const profile = profileMap.get(match.userId);
      return {
        userId: match.userId,
        displayName: profile?.display_name ?? 'Anônimo',
        photo: profile?.photos?.[0] ?? null,
        similarity: Math.round(match.similarity * 100),
        matchingFacets: match.matchingFacets,
      };
    });

    return NextResponse.json({ matches: enrichedMatches });
  } catch (error) {
    console.error('[match] Erro no matching:', error);
    return NextResponse.json(
      { error: 'Erro interno no matching' },
      { status: 500 }
    );
  }
}
