import { NextRequest, NextResponse } from 'next/server';

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface CreateEventRequest {
  name: string;
  slug: string;
  description?: string;
  matter_context: string;
  start_time: string;
  end_time?: string;
  location_name?: string;
  ticket_url?: string;
  expected_capacity?: number;
  tags?: string[];
}

/** POST /api/organizer/events — Criar novo evento */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CreateEventRequest;

    // Validação básica
    if (!body.name || !body.slug || !body.matter_context || !body.start_time) {
      return NextResponse.json(
        { error: 'Nome, slug, matter_context e start_time são obrigatórios' },
        { status: 400 }
      );
    }

    // Sanitização do slug
    const cleanSlug = body.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');

    if (!cleanSlug) {
      return NextResponse.json({ error: 'Slug inválido' }, { status: 400 });
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json({ success: true, demo: true, event_id: 'demo-event-1' });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verificar se slug já existe
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('slug', cleanSlug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Slug já existe. Escolha outro nome.' }, { status: 409 });
    }

    // Criar evento
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        organizer_id: user.id,
        name: body.name,
        slug: cleanSlug,
        description: body.description ?? null,
        matter_context: body.matter_context,
        start_time: body.start_time,
        end_time: body.end_time ?? null,
        location_name: body.location_name ?? null,
        ticket_url: body.ticket_url ?? null,
        expected_capacity: body.expected_capacity ?? null,
        tags: body.tags ?? [],
      })
      .select()
      .single();

    if (eventError) {
      console.error('[organizer/events] Error:', eventError);
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }

    // Criar lobby automaticamente (state = pending)
    await supabase.from('lobbies').insert({
      event_id: event.id,
      state: 'pending',
    });

    // Atualizar role do usuário para organizer se necessário
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'participant') {
      await supabase
        .from('profiles')
        .update({ role: 'organizer' })
        .eq('id', user.id);
    }

    return NextResponse.json({ success: true, event_id: event.id, slug: cleanSlug });
  } catch (error) {
    console.error('[organizer/events] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/** GET /api/organizer/events — Listar eventos do organizador */
export async function GET(): Promise<NextResponse> {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ events: [], demo: true });
  }

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        lobbies (id, state, opened_at, closed_at),
        event_interests (count)
      `)
      .eq('organizer_id', user.id)
      .order('start_time', { ascending: false });

    if (error) {
      console.error('[organizer/events] List error:', error);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('[organizer/events] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
