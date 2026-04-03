-- Safety alerts table (botão de pânico)
create table public.safety_alerts (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id),
  reported_user_id uuid references public.profiles(id),
  event_id uuid references public.events(id),
  lobby_id uuid references public.lobbies(id),
  description text,
  location_note text,
  status text default 'pending',
  organizer_notified_at timestamptz,
  resolved_at timestamptz,
  resolution_note text,
  created_at timestamptz default now()
);

-- Indexes
create index sommar_safety_alerts_event on public.safety_alerts(event_id);
create index sommar_safety_alerts_status on public.safety_alerts(status);
create index sommar_safety_alerts_reported on public.safety_alerts(reported_user_id);

-- RLS
alter table public.safety_alerts enable row level security;

-- Usuário pode criar alertas
create policy "Users can create safety alerts"
  on public.safety_alerts for insert
  with check (auth.uid() = reporter_id);

-- Usuário pode ver seus próprios alertas
create policy "Users can view own alerts"
  on public.safety_alerts for select
  using (auth.uid() = reporter_id);

-- Organizadores podem ver alertas dos seus eventos
create policy "Organizers can view event alerts"
  on public.safety_alerts for select
  using (
    event_id in (
      select id from public.events where organizer_id = auth.uid()
    )
  );

-- Organizadores podem atualizar status dos alertas dos seus eventos
create policy "Organizers can update event alerts"
  on public.safety_alerts for update
  using (
    event_id in (
      select id from public.events where organizer_id = auth.uid()
    )
  );
