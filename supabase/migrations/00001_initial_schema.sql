-- =============================================================================
-- Sommar — Initial Schema
-- Matchmaking engine for real human connection
-- =============================================================================

-- Enable extensions
create extension if not exists "pgcrypto" with schema "extensions";
create extension if not exists "vector" with schema "extensions";

-- =============================================================================
-- Helper: updated_at trigger function
-- =============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =============================================================================
-- PROFILES
-- =============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  birth_date date,
  city text,
  bio text,
  photos text[] default '{}',
  languages text[] default '{}',
  social_energy float,
  life_goals text,
  personality_indicators jsonb default '{}',
  active_facets text[] default '{}',
  facet_data jsonb default '{}',
  aesthetic_archetypes int[] default '{}',
  role text default 'participant',  -- 'participant' | 'organizer' | 'creator'
  onboarding_complete boolean default false,
  onboarding_progress jsonb default '{}',
  first_visit boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create index sommar_profiles_role on public.profiles(role);
create index sommar_profiles_onboarding on public.profiles(onboarding_complete);

-- =============================================================================
-- ORIS
-- =============================================================================
create table public.oris (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  embedding vector(1536),
  narrative jsonb default '{}',
  ice_breaker_seeds text[] default '{}',
  completeness_score float default 0,
  version int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger oris_updated_at
  before update on public.oris
  for each row execute function public.handle_updated_at();

create index sommar_oris_user_id on public.oris(user_id);

-- =============================================================================
-- EVENTS
-- =============================================================================
create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id),
  name text not null,
  slug text unique not null,
  description text,
  cover_image_url text,
  location_name text,
  location_lat float,
  location_lng float,
  ticket_url text,
  tags text[] default '{}',
  start_time timestamptz not null,
  end_time timestamptz,
  expected_capacity int,
  is_template boolean default false,
  template_source_id uuid references public.events(id),
  created_at timestamptz default now()
);

create index sommar_events_slug on public.events(slug);
create index sommar_events_organizer on public.events(organizer_id);
create index sommar_events_start_time on public.events(start_time);

-- =============================================================================
-- LOBBIES
-- =============================================================================
create table public.lobbies (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  state text default 'pending',  -- 'pending' | 'active' | 'historical' | 'expired'
  opened_at timestamptz,
  closed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index sommar_lobbies_event_id on public.lobbies(event_id);
create index sommar_lobbies_state on public.lobbies(state);

-- =============================================================================
-- LOBBY PARTICIPANTS
-- =============================================================================
create table public.lobby_participants (
  lobby_id uuid not null references public.lobbies(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  active_facets text[] default '{}',
  role text default 'participant',  -- 'participant' | 'organizer' | 'featured'
  checked_in_at timestamptz default now(),
  primary key (lobby_id, user_id)
);

create index sommar_lobby_participants_user on public.lobby_participants(user_id);

-- =============================================================================
-- CORREIO ELEGANTE CONVERSATIONS
-- =============================================================================
create table public.correio_conversations (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid not null references public.lobbies(id),
  sender_id uuid not null references public.profiles(id),
  receiver_id uuid not null references public.profiles(id),
  state text default 'active',  -- 'active' | 'read_only' | 're_enabled'
  ice_breaker text,
  expires_at timestamptz,
  read_at timestamptz,
  re_enabled_at timestamptz,
  re_enable_method text,  -- 'mission' | 'payment' | null
  created_at timestamptz default now()
);

create index sommar_correio_conversations_lobby on public.correio_conversations(lobby_id);
create index sommar_correio_conversations_sender on public.correio_conversations(sender_id);
create index sommar_correio_conversations_receiver on public.correio_conversations(receiver_id);
create index sommar_correio_conversations_state on public.correio_conversations(state);

-- =============================================================================
-- CORREIO MESSAGES
-- =============================================================================
create table public.correio_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.correio_conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  content text not null,
  created_at timestamptz default now()
);

create index sommar_correio_messages_conversation on public.correio_messages(conversation_id);
create index sommar_correio_messages_sender on public.correio_messages(sender_id);

-- =============================================================================
-- CONNECTIONS
-- =============================================================================
create table public.connections (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.profiles(id),
  user_b_id uuid not null references public.profiles(id),
  event_id uuid references public.events(id),
  confirmed_by_a boolean default false,
  confirmed_by_b boolean default false,
  confirmed_at timestamptz,
  created_at timestamptz default now()
);

create index sommar_connections_user_a on public.connections(user_a_id);
create index sommar_connections_user_b on public.connections(user_b_id);

-- =============================================================================
-- BLOCKS
-- =============================================================================
create table public.blocks (
  blocker_id uuid not null references public.profiles(id),
  blocked_id uuid not null references public.profiles(id),
  created_at timestamptz default now(),
  primary key (blocker_id, blocked_id)
);

create index sommar_blocks_blocked on public.blocks(blocked_id);

-- =============================================================================
-- REPORTS
-- =============================================================================
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id),
  reported_id uuid not null references public.profiles(id),
  conversation_id uuid references public.correio_conversations(id),
  reason text,
  status text default 'pending',  -- 'pending' | 'reviewed' | 'resolved'
  created_at timestamptz default now()
);

create index sommar_reports_reported on public.reports(reported_id);
create index sommar_reports_status on public.reports(status);

-- =============================================================================
-- EVENT INTERESTS (social proof)
-- =============================================================================
create table public.event_interests (
  user_id uuid not null references public.profiles(id),
  event_id uuid not null references public.events(id),
  created_at timestamptz default now(),
  primary key (user_id, event_id)
);

create index sommar_event_interests_event on public.event_interests(event_id);

-- =============================================================================
-- FEED POSTS
-- =============================================================================
create table public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  parent_id uuid references public.feed_posts(id),
  content text not null,
  created_at timestamptz default now()
);

create index sommar_feed_posts_event on public.feed_posts(event_id);
create index sommar_feed_posts_author on public.feed_posts(author_id);
create index sommar_feed_posts_parent on public.feed_posts(parent_id);

-- =============================================================================
-- FEED REACTIONS
-- =============================================================================
create table public.feed_reactions (
  post_id uuid not null references public.feed_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  emoji text not null,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- =============================================================================
-- REFERRALS
-- =============================================================================
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id),
  referred_id uuid references public.profiles(id),
  event_id uuid references public.events(id),
  referral_code text unique not null,
  reward_granted boolean default false,
  created_at timestamptz default now()
);

create index sommar_referrals_referrer on public.referrals(referrer_id);
create index sommar_referrals_code on public.referrals(referral_code);

-- =============================================================================
-- CONSENTS (LGPD)
-- =============================================================================
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  consent_type text not null,  -- 'data_processing' | 'ai_profiling' | 'facet_romantic' | 'facet_friendship' | etc.
  granted boolean default true,
  granted_at timestamptz default now(),
  withdrawn_at timestamptz
);

create index sommar_consents_user on public.consents(user_id);
create index sommar_consents_type on public.consents(consent_type);

-- =============================================================================
-- QR QUESTS
-- =============================================================================
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id),
  quest_code text unique not null,
  description text,
  reward_correios int default 3,
  location_hint text,
  created_at timestamptz default now()
);

create index sommar_quests_event on public.quests(event_id);
create index sommar_quests_code on public.quests(quest_code);

-- =============================================================================
-- QUEST COMPLETIONS
-- =============================================================================
create table public.quest_completions (
  quest_id uuid not null references public.quests(id),
  user_id uuid not null references public.profiles(id),
  completed_at timestamptz default now(),
  primary key (quest_id, user_id)
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.oris enable row level security;
alter table public.events enable row level security;
alter table public.lobbies enable row level security;
alter table public.lobby_participants enable row level security;
alter table public.correio_conversations enable row level security;
alter table public.correio_messages enable row level security;
alter table public.connections enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.event_interests enable row level security;
alter table public.feed_posts enable row level security;
alter table public.feed_reactions enable row level security;
alter table public.referrals enable row level security;
alter table public.consents enable row level security;
alter table public.quests enable row level security;
alter table public.quest_completions enable row level security;

-- ---------------------------------------------------------------------------
-- PROFILES policies
-- ---------------------------------------------------------------------------

-- Users can read their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Public profiles visible to authenticated users (excluding blocked)
create policy "profiles_select_public"
  on public.profiles for select
  using (
    auth.role() = 'authenticated'
    and id not in (
      select blocked_id from public.blocks where blocker_id = auth.uid()
    )
  );

-- Users can update their own profile
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (on signup)
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Creators can read all profiles
create policy "profiles_select_creator"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'creator'
    )
  );

-- ---------------------------------------------------------------------------
-- ORIS policies
-- ---------------------------------------------------------------------------

create policy "oris_select_own"
  on public.oris for select
  using (auth.uid() = user_id);

create policy "oris_select_authenticated"
  on public.oris for select
  using (auth.role() = 'authenticated');

create policy "oris_insert_own"
  on public.oris for insert
  with check (auth.uid() = user_id);

create policy "oris_update_own"
  on public.oris for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- EVENTS policies
-- ---------------------------------------------------------------------------

-- Events are publicly readable (for SSR/SEO)
create policy "events_select_all"
  on public.events for select
  using (true);

-- Organizers and creators can insert events
create policy "events_insert_organizer"
  on public.events for insert
  with check (auth.uid() = organizer_id);

-- Organizers can update their own events
create policy "events_update_organizer"
  on public.events for update
  using (auth.uid() = organizer_id)
  with check (auth.uid() = organizer_id);

-- ---------------------------------------------------------------------------
-- LOBBIES policies
-- ---------------------------------------------------------------------------

create policy "lobbies_select_authenticated"
  on public.lobbies for select
  using (auth.role() = 'authenticated');

create policy "lobbies_insert_organizer"
  on public.lobbies for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = event_id and events.organizer_id = auth.uid()
    )
  );

create policy "lobbies_update_organizer"
  on public.lobbies for update
  using (
    exists (
      select 1 from public.events
      where events.id = event_id and events.organizer_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- LOBBY PARTICIPANTS policies
-- ---------------------------------------------------------------------------

create policy "lobby_participants_select_authenticated"
  on public.lobby_participants for select
  using (auth.role() = 'authenticated');

create policy "lobby_participants_insert_own"
  on public.lobby_participants for insert
  with check (auth.uid() = user_id);

create policy "lobby_participants_update_own"
  on public.lobby_participants for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "lobby_participants_delete_own"
  on public.lobby_participants for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- CORREIO CONVERSATIONS policies
-- ---------------------------------------------------------------------------

-- Only sender and receiver can see conversations
create policy "correio_conversations_select_participant"
  on public.correio_conversations for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "correio_conversations_insert_sender"
  on public.correio_conversations for insert
  with check (auth.uid() = sender_id);

create policy "correio_conversations_update_participant"
  on public.correio_conversations for update
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- ---------------------------------------------------------------------------
-- CORREIO MESSAGES policies
-- ---------------------------------------------------------------------------

-- Only conversation participants can see messages
create policy "correio_messages_select_participant"
  on public.correio_messages for select
  using (
    exists (
      select 1 from public.correio_conversations
      where correio_conversations.id = conversation_id
        and (correio_conversations.sender_id = auth.uid()
          or correio_conversations.receiver_id = auth.uid())
    )
  );

create policy "correio_messages_insert_participant"
  on public.correio_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.correio_conversations
      where correio_conversations.id = conversation_id
        and (correio_conversations.sender_id = auth.uid()
          or correio_conversations.receiver_id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- CONNECTIONS policies
-- ---------------------------------------------------------------------------

create policy "connections_select_own"
  on public.connections for select
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

create policy "connections_insert_participant"
  on public.connections for insert
  with check (auth.uid() = user_a_id or auth.uid() = user_b_id);

create policy "connections_update_participant"
  on public.connections for update
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- ---------------------------------------------------------------------------
-- BLOCKS policies
-- ---------------------------------------------------------------------------

create policy "blocks_select_own"
  on public.blocks for select
  using (auth.uid() = blocker_id);

create policy "blocks_insert_own"
  on public.blocks for insert
  with check (auth.uid() = blocker_id);

create policy "blocks_delete_own"
  on public.blocks for delete
  using (auth.uid() = blocker_id);

-- ---------------------------------------------------------------------------
-- REPORTS policies
-- ---------------------------------------------------------------------------

create policy "reports_select_own"
  on public.reports for select
  using (auth.uid() = reporter_id);

create policy "reports_insert_own"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

-- Creators can read all reports
create policy "reports_select_creator"
  on public.reports for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'creator'
    )
  );

-- ---------------------------------------------------------------------------
-- EVENT INTERESTS policies
-- ---------------------------------------------------------------------------

create policy "event_interests_select_authenticated"
  on public.event_interests for select
  using (auth.role() = 'authenticated');

create policy "event_interests_insert_own"
  on public.event_interests for insert
  with check (auth.uid() = user_id);

create policy "event_interests_delete_own"
  on public.event_interests for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- FEED POSTS policies
-- ---------------------------------------------------------------------------

create policy "feed_posts_select_authenticated"
  on public.feed_posts for select
  using (auth.role() = 'authenticated');

create policy "feed_posts_insert_authenticated"
  on public.feed_posts for insert
  with check (auth.uid() = author_id);

create policy "feed_posts_delete_own"
  on public.feed_posts for delete
  using (auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- FEED REACTIONS policies
-- ---------------------------------------------------------------------------

create policy "feed_reactions_select_authenticated"
  on public.feed_reactions for select
  using (auth.role() = 'authenticated');

create policy "feed_reactions_insert_own"
  on public.feed_reactions for insert
  with check (auth.uid() = user_id);

create policy "feed_reactions_delete_own"
  on public.feed_reactions for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- REFERRALS policies
-- ---------------------------------------------------------------------------

create policy "referrals_select_own"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_id);

create policy "referrals_insert_own"
  on public.referrals for insert
  with check (auth.uid() = referrer_id);

-- ---------------------------------------------------------------------------
-- CONSENTS policies (LGPD)
-- ---------------------------------------------------------------------------

create policy "consents_select_own"
  on public.consents for select
  using (auth.uid() = user_id);

create policy "consents_insert_own"
  on public.consents for insert
  with check (auth.uid() = user_id);

create policy "consents_update_own"
  on public.consents for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- QUESTS policies
-- ---------------------------------------------------------------------------

create policy "quests_select_authenticated"
  on public.quests for select
  using (auth.role() = 'authenticated');

create policy "quests_insert_organizer"
  on public.quests for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = event_id and events.organizer_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- QUEST COMPLETIONS policies
-- ---------------------------------------------------------------------------

create policy "quest_completions_select_own"
  on public.quest_completions for select
  using (auth.uid() = user_id);

create policy "quest_completions_insert_own"
  on public.quest_completions for insert
  with check (auth.uid() = user_id);
