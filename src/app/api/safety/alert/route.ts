import { NextRequest, NextResponse } from 'next/server';

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface SafetyAlertRequest {
  event_id?: string;
  lobby_id?: string;
  reported_user_id?: string;
  description?: string;
  location_note?: string;
}

/** POST /api/safety/alert
 * Cria alerta de segurança e notifica organizador do evento.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as SafetyAlertRequest;

    if (!isSupabaseConfigured) {
      // Modo demo: simula sucesso
      return NextResponse.json({ success: true, demo: true });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Criar alerta
    const { data: alert, error: alertError } = await supabase
      .from('safety_alerts')
      .insert({
        reporter_id: user.id,
        reported_user_id: body.reported_user_id ?? null,
        event_id: body.event_id ?? null,
        lobby_id: body.lobby_id ?? null,
        description: body.description ?? null,
        location_note: body.location_note ?? null,
        status: 'pending',
      })
      .select()
      .single();

    if (alertError) {
      console.error('[safety] Alert creation error:', alertError);
      return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
    }

    // Notificar organizador do evento (se event_id presente)
    if (body.event_id) {
      const { data: event } = await supabase
        .from('events')
        .select('organizer_id, name')
        .eq('id', body.event_id)
        .single();

      if (event) {
        // Atualizar status para notificado
        await supabase
          .from('safety_alerts')
          .update({
            status: 'organizer_notified',
            organizer_notified_at: new Date().toISOString(),
          })
          .eq('id', alert.id);

        // TODO: Enviar push notification e email ao organizador via Supabase Edge Function
        // Por agora, o organizador verá o alerta no portal
      }
    }

    // Se reported_user_id presente, criar block automático disponível
    // (block não é automático, mas o alerta fica registrado)

    return NextResponse.json({ success: true, alert_id: alert.id });
  } catch (error) {
    console.error('[safety] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
