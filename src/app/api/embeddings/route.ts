import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmbedding, buildOriText } from '@/lib/ai/embeddings';

/* ------------------------------------------------------------------ */
/*  POST /api/embeddings                                               */
/*  Gerar ou atualizar embedding do Ori de um usuário                  */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId } = body as { userId?: string };

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
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

    // Buscar perfil com dados dimensionais
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('active_facets, facet_data, bio, life_goals, personality_indicators')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      );
    }

    // Buscar Ori existente
    const { data: existingOri } = await supabase
      .from('oris')
      .select('id, narrative, version')
      .eq('user_id', userId)
      .single();

    if (!existingOri) {
      return NextResponse.json(
        { error: 'Ori não encontrado. Complete o onboarding primeiro.' },
        { status: 404 }
      );
    }

    // Construir texto para embedding
    const oriText = buildOriText(
      existingOri.narrative as Record<string, string>,
      profile.facet_data as Record<string, unknown>,
      profile.active_facets ?? ['essencia']
    );

    if (!oriText.trim()) {
      return NextResponse.json(
        { error: 'Dados insuficientes para gerar embedding' },
        { status: 422 }
      );
    }

    // Gerar embedding via OpenAI
    const embedding = await generateEmbedding(oriText);

    // Atualizar Ori com novo embedding
    const { error: updateError } = await supabase
      .from('oris')
      .update({
        embedding,
        version: (existingOri.version ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingOri.id);

    if (updateError) {
      console.error('[embeddings] Erro ao atualizar Ori:', updateError);
      return NextResponse.json(
        { error: 'Erro ao salvar embedding' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      version: (existingOri.version ?? 0) + 1,
      dimensions: embedding.length,
    });
  } catch (error) {
    console.error('[embeddings] Erro na geração:', error);
    return NextResponse.json(
      { error: 'Erro interno na geração de embedding' },
      { status: 500 }
    );
  }
}
