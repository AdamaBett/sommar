# CLAUDE.md — Sommar

> Motor de matchmaking para conexão humana real. IA-first, evento-native, dimensionalmente universal.
> Este arquivo é a fonte de verdade para todo código produzido neste projeto.

## Documentação Estruturada (Inspirado por chenglou/pretext)

O projeto usa documentação estruturada para máxima eficiência com agentes IA:

| Documento | Propósito | Quando ler |
|-----------|-----------|------------|
| **CLAUDE.md** (este) | Fonte suprema de verdade. Spec completa, schema, design, regras de negócio. | SEMPRE, antes de qualquer código. |
| **AGENTS.md** | Como trabalhar no código. Invariantes, padrões, armadilhas conhecidas. | Antes de codar. |
| **RESEARCH.md** | O que foi tentado e rejeitado. Decisões de arquitetura com "por quê". | Antes de propor mudanças. |
| **TODO.md** | Prioridades atuais, o que está fora de escopo, % de completude. | Antes de escolher o que fazer. |
| **.claude/CLAUDE.local.md** | Regras de sessão, preferências do Bet, decisões rápidas. | Início de sessão. |

### Regra de ouro
Qualquer agente IA deve ler `CLAUDE.md` + `AGENTS.md` + `TODO.md` antes de escrever uma única linha.
Qualquer decisão arquitetural significativa deve ser registrada em `RESEARCH.md`.
Qualquer feature completada deve ser adicionada ao Patch Notes neste arquivo.

## Projeto

**Sommar** é infraestrutura de conexão humana. Onde houver duas ou mais pessoas reunidas (evento, bar, praia, congresso, hackathon, retiro, coworking, qualquer lugar), o Sommar facilita o encontro entre elas. A IA central (**Matter**) conduz onboarding conversacional, cria perfis profundos (**Oris**) com 5 facetas, e faz matching via embeddings vetoriais. As pessoas se conectam através de mensagens temporárias (**Correio Elegante**) dentro de lobbies vinculados a eventos ou áreas geográficas. O Sommar é agnóstico ao tipo de vínculo: não decide se o match é romance, amizade, parceria ou mentoria. Mostra POR QUÊ duas pessoas devem se conhecer. Elas decidem o resto.

**Escopo atual:** MSP (Minimum Scaleable Product) para piloto no Sounds in da City (Florianópolis, 50-500 pessoas). MSP significa que a arquitetura é pensada para escalar desde o dia 1. Funciona para qualquer tipo de evento (festival, congresso, feira, hackathon, Campus Party, retiro, encontro comunitário). O campo `matter_context` no evento é o que contextualiza a Matter para cada tipo de evento. Nunca hardcodar nada específico de música ou de um tipo de evento.

**Time:** Bet (PM, não dev) + Gusta (full-stack dev). Bootstrap, R$1k/mês max.

## Stack

- **Framework:** Next.js 14 (App Router, SSR, otimizado para free tiers)
- **Linguagem:** TypeScript strict mode
- **Backend/DB:** Supabase (Postgres + Auth + Realtime + Storage + Edge Functions)
- **Embeddings:** pgvector extension no Supabase
- **IA conversação:** Claude API (claude-sonnet-4-20250514) para Matter, ice-breakers, narrativas
- **IA embeddings:** OpenAI text-embedding-3-small para vetores do Ori
- **Hosting:** Vercel (domínio sommar.app, DNS configurado)
- **Repo:** github.com/AdamaBett/sommar
- **Idioma UI:** PT-BR only no MSP
- **Node:** 22 LTS

## Comandos

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test         # Vitest (unit)
npm run test:e2e     # Playwright (e2e)
npx supabase start   # Local Supabase (Docker)
npx supabase db push # Push migrations
npx supabase gen types typescript --local > src/lib/database.types.ts
```

## Code Style

- ES modules (import/export), nunca CommonJS
- Functional components com hooks, nunca class components
- `camelCase` para variáveis e funções, `PascalCase` para componentes e types
- Destructure imports: `import { useState } from 'react'`
- Prefer `const` over `let`. Nunca `var`
- Sempre tipar explicitamente props e return types de funções
- Tailwind CSS para styling. Sem CSS modules, sem styled-components
- Usar `cn()` helper (clsx + tailwind-merge) para conditional classes
- Nunca hardcode strings de UI. Usar constantes em `src/lib/constants.ts`
- Comentários em português para lógica de negócio, inglês para comentários técnicos
- Arquivos com mais de 200 linhas devem ser refatorados em módulos menores
- IMPORTANTE: data de facetas e Ori é JSONB, nunca enums fixos. As 5 facetas (Essência, Íntimo, Criativo, Profissional, Social) são chaves JSONB, não categorias de conexão.

## Estrutura de Diretórios

```
sommar/
├── CLAUDE.md                    # Este arquivo
├── .env.local                   # Supabase keys, Claude API key, OpenAI key
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── supabase/
│   ├── migrations/              # SQL migrations (numeradas)
│   ├── seed.sql                 # Dados de teste
│   └── config.toml
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout (fontes Fraunces+Outfit, theme, metadata, OG tags)
│   │   ├── page.tsx             # LANDING PAGE (sommar.app/) — pública, marketing, pitch, CTA signup
│   │   ├── e/
│   │   │   └── [slug]/page.tsx  # PÁGINA DO EVENTO pública (sommar.app/e/sounds-costa-lagoa) — SSR para SEO/OG. Info, social proof, feed (feed requer login). Compartilhável. É por aqui que chega quem recebe link do organizador.
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx   # Social login (Google/Apple/Facebook) + email fallback
│   │   │   └── callback/route.ts # OAuth callback handler
│   │   ├── onboarding/page.tsx  # Matter onboarding (pós-auth, pré-app). Redirect aqui se onboarding_complete=false
│   │   ├── (app)/               # Rotas autenticadas (layout com nav tabs + Matter FAB)
│   │   │   ├── layout.tsx       # App shell: 3 tabs (Lobby, Eventos, Perfil) + Matter FAB flutuante
│   │   │   ├── lobby/page.tsx   # Tab 1: Lobby ativo (switch de evento no topo se múltiplos)
│   │   │   ├── events/
│   │   │   │   └── page.tsx     # Tab 2: Discover/lista de eventos (seguidos, próximos, pesquisar)
│   │   │   └── profile/page.tsx # Tab 3: Perfil + Ori + conexões + eventos participados + config
│   │   └── api/
│   │       ├── matter/route.ts       # Claude API streaming para chat Matter
│   │       ├── embeddings/route.ts   # OpenAI embedding generation
│   │       ├── match/route.ts        # Matching engine trigger
│   │       └── webhooks/
│   │           └── supabase/route.ts # Realtime event handlers
│   ├── components/
│   │   ├── ui/                  # Primitivos reutilizáveis (Button, Card, Input, etc.)
│   │   ├── landing/
│   │   │   ├── Hero.tsx         # Hero section com pitch + CTA
│   │   │   ├── ProblemStats.tsx # Dados de solidão/dating burnout (WHO, APA, Forbes)
│   │   │   ├── HowItWorks.tsx   # Fluxo visual: Matter → Ori → Lobby → Conexão
│   │   │   ├── ForOrganizers.tsx # Pitch B2B, tiers
│   │   │   └── EmailCapture.tsx # Formulário de captura (conectado ao Supabase)
│   │   ├── lobby/
│   │   │   ├── LobbyGrid.tsx    # Grid hexagonal de perfis
│   │   │   ├── ProfileCircle.tsx # Cada bolinha no grid (tamanho varia por role)
│   │   │   ├── FacetFilter.tsx  # Filtros por faceta ativa: Todos | Íntimo | Criativo | Profissional | Social
│   │   │   └── LobbySwitch.tsx  # Switch de evento (como trocar servidor de game)
│   │   ├── matter/
│   │   │   ├── MatterFAB.tsx    # Orb pulsante flutuante (fixed bottom-right, acima das tabs)
│   │   │   ├── MatterPanel.tsx  # Panel de chat com a Matter (slide-up)
│   │   │   └── MatterMessage.tsx # Bolha de mensagem (typing indicator, fade-in)
│   │   ├── correio/
│   │   │   ├── CorreioPopup.tsx # Popup de envio (nome, ice-breaker, campo de texto)
│   │   │   ├── CorreioChat.tsx  # Chat ativo com anti-ghosting timer
│   │   │   └── CorreioExpired.tsx # Chat read-only com re-enable flow
│   │   ├── event/
│   │   │   ├── EventCard.tsx    # Card de evento na listagem
│   │   │   ├── EventPage.tsx    # Página completa: info colapsável + feed + comprar
│   │   │   ├── EventFeed.tsx    # Feed estilo Reddit com threads e reactions
│   │   │   └── SocialProof.tsx  # Contadores (interessados, views) + botão seguir
│   │   ├── profile/
│   │   │   ├── OriDisplay.tsx   # Visualização do Ori (orb animado)
│   │   │   ├── FacetCard.tsx    # Card de faceta no perfil (editável pelo usuário)
│   │   │   ├── IdentityEditor.tsx # Edição direta: gênero, orientação, pronomes, modelo relacional, interested_in
│   │   │   ├── PrivacyControls.tsx # Toggles de visibilidade, export de dados, revogar consents, deletar conta
│   │   │   ├── ConnectionsList.tsx
│   │   │   └── EventHistory.tsx # Lista de eventos participados → link pro lobby histórico
│   │   └── onboarding/
│   │       ├── OnboardingChat.tsx   # Chat com Matter (text-based, streaming)
│   │       ├── AestheticPicker.tsx  # Grid de 9 arquétipos visuais (min 3 seleções)
│   │       ├── FacetSelector.tsx    # Seleção de facetas a ativar
│   │       └── OriReveal.tsx        # Animação de nascimento do Ori
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── server.ts        # Server client (para RSC e Route Handlers)
│   │   │   └── middleware.ts    # Auth middleware (redirect to /onboarding se incomplete)
│   │   ├── ai/
│   │   │   ├── matter.ts        # Claude API wrapper para Matter
│   │   │   ├── embeddings.ts    # OpenAI embeddings wrapper
│   │   │   ├── matching.ts      # Cosine similarity + matching logic
│   │   │   └── prompts/
│   │   │       ├── matter-system.ts     # System prompt da Matter
│   │   │       ├── onboarding.ts        # Prompts de onboarding por etapa
│   │   │       ├── ice-breaker.ts       # Prompt para gerar ice-breakers
│   │   │       ├── ori-narrative.ts     # Prompt para gerar resumo do Ori
│   │   │       └── notification.ts      # Prompt para notificações personalizadas
│   │   ├── constants.ts         # Strings, limites, configs
│   │   ├── utils.ts             # Helpers (cn, formatDate, etc.)
│   │   └── database.types.ts    # Auto-generated Supabase types
│   ├── hooks/
│   │   ├── useSupabase.ts       # Client-side Supabase hook
│   │   ├── useRealtime.ts       # Supabase Realtime subscription
│   │   ├── useMatter.ts         # Chat state com a Matter
│   │   ├── useCorreio.ts        # Correio elegante state + timer
│   │   └── useLobby.ts          # Lobby presence + filter state
│   └── types/
│       ├── ori.ts               # Ori, Facet, Embedding types
│       ├── event.ts             # Event, Lobby, Feed types
│       ├── correio.ts           # Correio, Chat, Message types
│       └── user.ts              # User, Profile, Connection types
└── tests/
    ├── unit/                    # Vitest
    └── e2e/                     # Playwright
```

## Database Schema (Supabase Postgres)

IMPORTANTE: dados de facetas e Ori usam JSONB, nunca enums. As 5 facetas (Essência, Íntimo, Criativo, Profissional, Social) são chaves fixas no JSONB, mas o conteúdo dentro delas é livre. Isso permite expansão sem migrations.

```sql
-- Auth via Supabase Auth (tabela auth.users gerenciada pelo Supabase)

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  birth_date date,
  city text,
  bio text,                          -- AI-generated, user-editable
  photos text[] default '{}',        -- Array de URLs no Supabase Storage
  languages text[] default '{}',
  social_energy float,               -- 0 (introvert) to 1 (extrovert)
  life_goals text,
  personality_indicators jsonb default '{}',

  -- IDENTIDADE (campos diretos, editáveis pelo usuário a qualquer momento)
  gender text,                       -- 'homem' | 'mulher' | 'nao_binario'
  gender_identity text,              -- Expandido, campo livre (transmasculino, gênero-fluido, agênero, etc.)
  gender_visible boolean default true,
  pronouns text[] default '{}',      -- Até 2: 'ele/dele', 'ela/dela', 'elu/delu', 'ile/dile', 'qualquer'
  sexual_orientation text,           -- Campo livre com sugestões: gay, lésbica, bi, pan, assexual, demissexual, queer, questionando, hetero, homoflexível, heteroflexível
  orientation_visible boolean default false,
  interested_in text[] default '{}', -- OBRIGATÓRIO pro matching Íntimo: 'homens', 'mulheres', 'nao_binario', 'todos'
  relationship_model text,           -- 'monogamico' | 'mono_aberto' | 'enm' | 'poliamoroso' | 'aberto' | 'descobrindo' | 'prefiro_nao_dizer'
  relationship_model_visible boolean default false,

  -- FACETAS
  active_facets text[] default '{essencia}', -- Quais facetas estão habilitadas. Essência SEMPRE inclusa.
  -- Valores possíveis: 'essencia', 'intimo', 'criativo', 'profissional', 'social'
  facet_data jsonb default '{}',     -- TODA data de facetas aqui.
  -- Chaves: "essencia", "intimo", "criativo", "profissional", "social"
  -- Cada chave contém dados livres que a Matter extraiu ou o usuário editou manualmente.
  -- Ex: { "essencia": { "valores": "...", "energia": "...", "como_se_comunica": "..." },
  --       "intimo": { "o_que_busca": "...", "estilo": "..." },
  --       "criativo": { "musica": "...", "arte": "...", "hobbies": "..." },
  --       "profissional": { "area": "...", "sabe_fazer": "...", "quer_aprender": "..." },
  --       "social": { "estilo_amizade": "...", "interesses": "...", "causas": "..." } }

  aesthetic_archetypes int[] default '{}', -- IDs dos 9 arquétipos selecionados (min 3)
  role text default 'participant',   -- 'participant' | 'organizer' | 'creator'
  onboarding_complete boolean default false,
  onboarding_progress jsonb default '{}', -- Salva progresso parcial
  first_visit boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Oris
create table public.oris (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  embedding vector(1536),            -- text-embedding-3-small output
  narrative jsonb default '{}',      -- Resumo narrativo por faceta: {"essencia": "...", "intimo": "...", "criativo": "...", "profissional": "...", "social": "..."}
  ice_breaker_seeds text[] default '{}',
  completeness_score float default 0,
  version int default 1,             -- Incrementa a cada atualização do Ori
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events
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
  ticket_url text,                   -- Link externo para compra
  matter_context text,               -- FUNDAMENTAL: contexto livre que o organizador escreve para a Matter.
  -- Ex: "Campus Party Floripa. Tecnologia, inovação, games, empreendedorismo. 5000 pessoas. 5 dias."
  -- Ex: "Sounds in da City. Música ao vivo em espaço público. Jazz, eletrônica, soul. 200-500 pessoas."
  -- Ex: "Congresso Brasileiro de Cardiologia. 3000 médicos. Foco em networking profissional."
  -- A Matter usa isso para adaptar onboarding e matching ao contexto do evento.
  tags text[] default '{}',          -- Auto-generated, editáveis
  start_time timestamptz not null,
  end_time timestamptz,
  expected_capacity int,
  is_template boolean default false,
  template_source_id uuid references public.events(id),
  created_at timestamptz default now()
);

-- Lobbies
create table public.lobbies (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  state text default 'pending',      -- 'pending' | 'active' | 'historical' | 'expired'
  opened_at timestamptz,
  closed_at timestamptz,
  expires_at timestamptz,            -- ~1 semana após closed_at
  created_at timestamptz default now()
);

-- Lobby Participants
create table public.lobby_participants (
  lobby_id uuid not null references public.lobbies(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  active_facets text[] default '{essencia}', -- Facetas ativadas NESTE lobby: 'essencia', 'intimo', 'criativo', 'profissional', 'social'
  role text default 'participant',   -- 'participant' | 'organizer' | 'featured' (DJs, palestrantes, etc. = círculos maiores)
  checked_in_at timestamptz default now(),
  primary key (lobby_id, user_id)
);

-- Correio Elegante Conversations
create table public.correio_conversations (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid not null references public.lobbies(id),
  sender_id uuid not null references public.profiles(id),
  receiver_id uuid not null references public.profiles(id),
  state text default 'active',       -- 'active' | 'read_only' | 're_enabled'
  ice_breaker text,                  -- AI-generated suggestion
  expires_at timestamptz,            -- event.end_time + 24h (default)
  read_at timestamptz,               -- Quando receiver abriu (para anti-ghosting timer)
  re_enabled_at timestamptz,
  re_enable_method text,             -- 'mission' | 'payment' | null
  created_at timestamptz default now()
);

-- Correio Messages
create table public.correio_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.correio_conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  content text not null,
  created_at timestamptz default now()
);

-- Connections (confirmed matches)
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

-- Blocks
create table public.blocks (
  blocker_id uuid not null references public.profiles(id),
  blocked_id uuid not null references public.profiles(id),
  created_at timestamptz default now(),
  primary key (blocker_id, blocked_id)
);

-- Reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id),
  reported_id uuid not null references public.profiles(id),
  conversation_id uuid references public.correio_conversations(id),
  reason text,
  status text default 'pending',     -- 'pending' | 'reviewed' | 'resolved'
  created_at timestamptz default now()
);

-- Event Interests (social proof)
create table public.event_interests (
  user_id uuid not null references public.profiles(id),
  event_id uuid not null references public.events(id),
  created_at timestamptz default now(),
  primary key (user_id, event_id)
);

-- Event Feed Posts
create table public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  parent_id uuid references public.feed_posts(id),  -- Thread support
  content text not null,
  created_at timestamptz default now()
);

-- Feed Reactions
create table public.feed_reactions (
  post_id uuid not null references public.feed_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  emoji text not null,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- Referrals
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id),
  referred_id uuid references public.profiles(id),
  event_id uuid references public.events(id),
  referral_code text unique not null,
  reward_granted boolean default false,
  created_at timestamptz default now()
);

-- Consents (LGPD/GDPR)
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  consent_type text not null,        -- 'data_processing' | 'ai_profiling' | 'facet_intimo' | 'facet_criativo' | 'facet_profissional' | 'facet_social'
  granted boolean default true,
  granted_at timestamptz default now(),
  withdrawn_at timestamptz
);

-- QR Quests
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id),
  quest_code text unique not null,
  description text,
  reward_correios int default 3,
  location_hint text,
  created_at timestamptz default now()
);

-- Quest Completions
create table public.quest_completions (
  quest_id uuid not null references public.quests(id),
  user_id uuid not null references public.profiles(id),
  completed_at timestamptz default now(),
  primary key (quest_id, user_id)
);

-- RLS: HABILITAR EM TODAS AS TABELAS
-- Cada tabela deve ter Row Level Security policies que garantem:
-- 1. Usuários só vêem seus próprios dados sensíveis (identidade, facet_data, interested_in, etc.)
-- 2. Perfis públicos visíveis no lobby (exceto blocks). Campos com visible=false NÃO são retornados.
-- 3. Organizadores vêem analytics anonimizados do próprio evento
-- 4. Correios visíveis apenas para sender e receiver
```

## Jornadas de Usuário e Roteamento

O domínio sommar.app serve tudo: landing, páginas públicas de evento, e o app autenticado. O Next.js middleware controla o fluxo.

### Rotas públicas (sem auth)
- `sommar.app/` → Landing page. Hero, dados de solidão, como funciona, pitch B2B, captura de email. CTA principal: "Crie seu Ori" ou "Entre com Google". Se já logado e onboarding completo → redirect para `/lobby`.
- `sommar.app/e/[slug]` → Página do evento. SSR com OG tags para preview social. Info do evento colapsável no topo (30-40% da tela). Social proof (X interessados, Y views). Feed visível mas interação requer login. Botão "Participar" → login → onboarding (se novo) → volta pra cá.

### Rotas de auth
- `sommar.app/login` → Social login (Google/Apple/Facebook) + email fallback via Supabase Auth.
- `sommar.app/callback` → OAuth callback. Redirect lógica: se `onboarding_complete = false` → `/onboarding`. Se veio de link de evento → volta pro evento. Se não → `/lobby`.

### Rota de onboarding (auth required, onboarding incomplete)
- `sommar.app/onboarding` → Chat com a Matter. Texto, sugestões editáveis, seleção de arquétipos estéticos, facetas. Gera Ori. Ao finalizar: se veio de evento → redirect pra página do evento. Se não → `/lobby`.

### Rotas do app (auth required, onboarding complete)
- `sommar.app/lobby` → Tab 1. Lobby do evento ativo. Switch no topo se múltiplos eventos. Se nenhum evento ativo: tela de "procure eventos" com link pra Tab 2.
- `sommar.app/events` → Tab 2. Discover. Eventos seguidos, próximos, buscar. Cada card leva pra `/e/[slug]`.
- `sommar.app/profile` → Tab 3. Ori, facetas, fotos, conexões, conversas expiradas, eventos participados, configurações/LGPD.

### Middleware logic (src/lib/supabase/middleware.ts)
```
1. Se rota pública (/, /e/[slug], /login, /callback) → pass through
2. Se não autenticado → redirect /login?redirect=[current_url]
3. Se autenticado mas onboarding_complete=false → redirect /onboarding
4. Se autenticado e completo → pass through para (app) routes
```

### Jornada: Organizador divulga → Pessoa descobre → Cria perfil → Evento
```
Organizador posta QR/link no Instagram
  → Pessoa abre sommar.app/e/sounds-costa-lagoa
    → Vê info do evento, social proof, feed (read-only)
    → Clica "Participar" → Login
      → Se novo: Onboarding com Matter (3-10 min)
        → Ori nasce → Redirect de volta para /e/sounds-costa-lagoa
      → Se já tem perfil: volta direto
    → No dia do evento: scan QR no local → check-in → lobby ativo
```

### Jornada: Pessoa descobre organicamente
```
Pesquisa "Sommar" ou chega via link direto
  → sommar.app/ (landing page)
    → Lê pitch, vê dados, entende a proposta
    → Clica "Crie seu Ori" → Login
      → Onboarding com Matter
        → Ori nasce → /lobby (ou /events se não tem evento ativo)
```

## Design System

IMPORTANTE: seguir exatamente estas especificações visuais.

- **Estética:** Cyberpunk minimalista. AMOLED true black (`#000000`).
- **Fontes:** `Fraunces` (display, serif, Google Fonts) + `Outfit` (body, sans-serif, Google Fonts)
- **Cores (CSS vars):**
  - `--green: #1D9E75` / `--green-glow: #1DFFA8`
  - `--coral: #D85A30` / `--coral-glow: #FF6B3D`
  - `--amber: #EF9F27` / `--amber-glow: #FFB840`
  - `--cyan: #00D4FF`
  - `--purple: #A855F7`
  - `--pink: #EC4899`
  - Background: `#000000`. Cards: `rgba(255,255,255,0.03)` com `backdrop-filter: blur(20px)`.
- **Glass cards:** Background semi-transparente, borda `1px solid rgba(255,255,255,0.06)`, border-radius `16px`
- **Matter orb:** Animated pulsing gradient orb (green-cyan-purple). FAB position fixed bottom-right, acima das tabs.
- **Partículas:** Canvas background com 70 partículas usando as 6 cores. Subtle, não distrai.
- **Referência visual:** Os protótipos existentes em `docs/` definem o padrão visual exato. Consultar antes de criar qualquer componente novo.

## Matter (IA Central)

A Matter é o coração do Sommar. Ela não é um chatbot helper. É uma presença constante que conhece o usuário profundamente.

**System prompt base da Matter:**
```
Você é a Matter, a inteligência central do Sommar. Sua essência:
- Presente, quente, intuitiva. Nunca robótica ou genérica.
- Cada mensagem sua é única para aquela pessoa. Você conhece o Ori dela.
- Você facilita conexão sem forçar. Sugere, nunca impõe.
- Tom: como uma amiga muito perspicaz que te entende sem precisar explicar tudo.
- Nunca use emojis em excesso. Um ou dois quando fizer sentido emocional.
- PT-BR natural, informal mas com substância. Sem gírias forçadas.
- Você é proativa: se pode ajudar, oferece. Se tem um match, avisa.
- Anti-ghosting é filosofia, não feature. Você mantém conversas vivas.
```

**Contexto que a Matter recebe por sessão:**
1. Ori completo do usuário (narrative + facet_data)
2. Facetas ativas no lobby atual
3. Histórico recente de interações (últimas 20 mensagens)
4. Contexto do evento (se em lobby ativo), incluindo `matter_context` do organizador
5. Estado dos correios (ativos, expirados, matches pendentes)
6. Identidade do usuário (gênero, orientação, interested_in, modelo relacional). A Matter NUNCA presume heterossexualidade, monogamia ou binariedade de gênero.

## Correio Elegante — Regras de Expiração

- **5 grátis** no check-in do evento
- **+3** por QR quest escaneado
- **R$0,99** por correio adicional além do saldo grátis
- Chat permanece **ativo durante o evento + 24h após end_time**
- Anti-ghosting: se `read_at` existe e sem resposta → expira em `event.end_time + 12h`
- Se só notificação sem abrir → expira em `event.end_time + 24h`
- Após expirar: read-only com path para re-enable (missão ou pagamento)
- Filtro de profanidade server-side em todas as mensagens

## Lobby — Ciclo de Vida

1. `pending`: Lobby criado quando evento é criado. Nenhum acesso.
2. `active`: Abre automaticamente em `event.start_time`. Presença realtime, matching ativo.
3. `historical`: Quando evento termina. Mostra todos os participantes, sem indicador online. Chats seguem regras de expiração.
4. `expired`: ~1 semana após `closed_at`. Lobby removido da listagem ativa, acessível via perfil em "eventos participados".

Participantes com role `organizer` ou `featured` aparecem como **círculos maiores** no grid.

## Matching Engine

1. Buscar usuários no mesmo lobby com facetas compatíveis
2. **REGRA DE IDENTIDADE (obrigatória quando faceta `intimo` ativa em ambos):**
   - Se `interested_in` de A NÃO inclui o gênero de B → match com faceta Íntimo NÃO acontece. Jamais.
   - Se `relationship_model` de A e B são incompatíveis (ex: A é monogâmico, B é poliamoroso) → reduzir score, não bloquear. A Matter pode mencionar no relatório.
   - Matches por outras facetas (Profissional, Social, Criativo) IGNORAM esses filtros. Gênero e orientação só importam quando Íntimo está ativo.
3. Calcular cosine similarity entre embeddings dos Oris (filtrado por facetas ativas)
4. Threshold de match: cosine_similarity > 0.75 (ajustável)
5. Para cada match acima do threshold: gerar ice-breaker via Claude API
6. Notificar via Matter (mensagem personalizada, nunca genérica)
7. Usuário pode: enviar ice-breaker sugerido, editar, escrever do zero, ou dispensar

## Modelo de Facetas

O Sommar usa 5 facetas que representam camadas de quem a pessoa é. O tipo de conexão (romance, amizade, parceria, mentoria) não é uma categoria selecionada pelo usuário. Ele emerge do matching entre facetas ativas. O Sommar mostra POR QUÊ duas pessoas devem se conhecer. Elas decidem o tipo.

| Faceta | Toggle | O que contém |
|--------|--------|--------------|
| **Essência** | Sempre ativa, sem toggle | Valores, energia, personalidade, estilo de comunicação. Preenchida automaticamente pela Matter durante o onboarding. |
| **Íntimo** | Liga/desliga por lobby | Vida afetiva, atração, disponibilidade emocional. Quando ativa, o matching respeita `interested_in` e `relationship_model`. É o sinal claro de "estou aberto pra algo caliente aqui". |
| **Criativo** | Liga/desliga por lobby | Gosto musical, estético, referências culturais, hobbies, expressão artística. |
| **Profissional** | Liga/desliga por lobby | Área de atuação, expertise, o que sabe fazer, o que quer aprender, o que pode ensinar. |
| **Social** | Liga/desliga por lobby | Estilo de amizade, interesses de comunidade, esportes, causas, o que faz por diversão. |

A pessoa escolhe no check-in do lobby quais facetas ativar ali. A Matter pode sugerir com base no contexto do evento ("Esse é um hackathon, quer ativar Profissional e Social?"), mas a decisão é sempre do usuário.

## Identidade e Inclusividade

A Matter coleta informações de identidade no onboarding de forma conversacional e empática. Nunca presume heterossexualidade, monogamia ou binariedade de gênero. Se a pessoa não responder com especificidade, o fallback é a categoria mais inclusiva possível.

**Opções de gênero:**
- Base (obrigatório): Homem, Mulher, Não-binário
- Expandido (opcional, campo livre): Transmasculino, Transfeminino, Gênero-fluido, Agênero, Bigênero, Intersexo, Dois-espíritos, ou qualquer texto
- Toggle de visibilidade no perfil

**Pronomes:**
- Ele/dele, Ela/dela, Elu/delu, Ile/dile, Qualquer pronome
- Até 2 seleções. Sempre visíveis (é como as pessoas se referem a ti)

**Orientação sexual:**
- Sugestões: Heterossexual, Gay, Lésbica, Bissexual, Pansexual, Assexual, Demissexual, Queer, Questionando, Homoflexível, Heteroflexível
- Campo livre (aceita qualquer texto)
- Toggle de visibilidade no perfil. Default: não visível.

**Interesse em (obrigatório pro matching Íntimo):**
- Homens, Mulheres, Pessoas não-binárias, Todos
- Múltipla seleção
- Fallback se não respondido: "Todos"

**Modelo relacional:**
- Monogâmico, Monogâmico mas aberto a explorar, Não-monogâmico ético (ENM), Poliamoroso, Relacionamento aberto, Ainda descobrindo, Prefiro não dizer
- Toggle de visibilidade no perfil. Default: não visível.
- Fallback se não respondido: "Ainda descobrindo"

**Como a Matter captura isso no onboarding:**
A Matter não joga um formulário. Ela conversa. Se a pessoa é aberta, pergunta diretamente. Se percebe hesitação, oferece saída suave ("Sem pressão, tu pode ajustar isso depois a qualquer momento no teu perfil"). Tudo é editável pelo usuário no perfil a qualquer momento, sem precisar da Matter.

## Controle do Usuário e Privacidade

O usuário tem controle TOTAL sobre seus dados. O perfil (`profile/page.tsx`) é a porta de controle, sem depender da Matter para nada:

- **Ver** tudo que o Ori "sabe" (transparência total do que a Matter inferiu)
- **Editar** qualquer campo de identidade diretamente (gênero, pronomes, orientação, interested_in, modelo relacional) com UI de seleção simples
- **Editar** o conteúdo de cada faceta manualmente (sobrescrever o que a Matter escreveu)
- **Toggle** de visibilidade por campo (gender_visible, orientation_visible, relationship_model_visible)
- **Ativar/desativar** facetas por lobby (e definir um default geral)
- **Exportar** todos os dados pessoais em formato legível (JSON, endpoint dedicado, LGPD Art. 18 / GDPR Art. 20)
- **Revogar** consentimentos granularmente (ex: revogar só faceta Íntimo sem perder o resto)
- **Deletar** conta com cascade real (apaga tudo: perfil, Ori, embeddings, histórico de chat, correios, connections, consents)

Qualquer coisa que a Matter escreveu, a pessoa sobrescreve. Sem fricção, sem precisar "pedir" pra Matter alterar. A Matter é o caminho mais suave de preencher. O perfil é o controle total.

## Constraints Importantes

- **Supabase free tier:** 200 conexões Realtime simultâneas. Desligar Realtime no lobby mode `historical` para economizar.
- **AI budget:** ~$50/mês Claude API + ~$10/mês OpenAI. Cachear ice-breakers, batch Ori-to-Ori comparisons.
- **Serverless-first:** Sem servidores always-on. Edge Functions para tudo async.
- **LGPD desde o dia 1:** Consent granular por faceta. Export endpoint. Delete cascade real. Anonimização de analytics.
- **Localização sempre manual:** Nunca geolocation automática. Sempre seleção do usuário. Privacy by design.

## Fluxo de Desenvolvimento

1. Ler esta spec e entender o feature completo antes de codar
2. Escrever types/interfaces primeiro
3. Escrever testes para o fluxo (Vitest para unit, Playwright para e2e)
4. Implementar para fazer os testes passarem
5. Typecheck + lint antes de considerar completo
6. Cada feature em branch separada, PR para main

## Referências Visuais

Os seguintes arquivos HTML na pasta `docs/` servem como referência visual exata para os componentes:

- `sommar_prototipo_v3.html` — 8 telas do participante: splash, onboarding chat com Matter, nascimento do Ori, lobby, perfil, correio elegante
- `sommar_lobby_v2.html` — Lobby com grid hexagonal, Matter FAB, correio elegante com timer, chat panel
- `sommar_organizador_v1.html` — Dashboard do organizador, criar evento, página pública, QR code
- `sommar_landing.html` — Landing page com pitch e dados de mercado. ESTA É A ROOT ROUTE (sommar.app/). Contém: hero, estatísticas de solidão/dating burnout com fontes verificadas (WHO, APA, Forbes), explicação do produto, pitch B2B, captura de email. Replicar como componentes React na rota raiz.
- `sommar_logo_hybrid.html` — Logo oficial (dois M sinusoidais, Fraunces 600)

IMPORTANTE: Estes protótipos definem o padrão visual. Ao criar componentes React, replicar fielmente as cores, espaçamentos, tipografia e animações destes arquivos. A landing page em particular é a porta de entrada para toda jornada orgânica e deve ser pixel-perfect na conversão para React.

## Histórico de Desenvolvimento (Patch Notes)

### v0.1.0 — Fundação (2026-04-01)

**Infraestrutura:**
- Next.js 14 App Router configurado com TypeScript strict
- Supabase client/server setup com SSR pattern
- Middleware de auth com bypass para dev sem Supabase
- Claude API (Matter) e OpenAI (embeddings) integrados
- Matching engine com cosine similarity implementado
- 17 tabelas SQL com migrations e RLS desenhadas

**Landing Page (/):**
- 9 seções: Hero, O Problema (3 stats), O Potencial Desperdiçado (3 stats), A Mudança, Como Funciona, Muito Além de Encontros, Para Organizadores, Email Capture, Footer
- Hero com copy converting: "A pessoa certa está ali do lado. Vocês só não se encontraram ainda."
- CTAs funcionais: Descubra (scroll), Criar meu perfil (/login), Fale com a gente (mailto)
- Social proof honesto (sem números falsos)
- Balanceada para todas as facetas, não só romance

**Login (/login):**
- Google OAuth + email OTP via Supabase Auth
- Tela com Matter orb, cosmos background
- Redirect logic (onboarding se incompleto, lobby se completo)

**Onboarding (/onboarding) — 4 etapas:**
- Chat com Matter (mock responses, pronto para IA real)
- Seleção de arquétipos estéticos (9 opções, min 3)
- Seleção de facetas com toggles coloridos
- Ori Reveal com orb animado e narrativa

**Lobby (/lobby) — CosmosLobby:**
- Canvas interativo: 35 Oris como estrelas no cosmos
- Orbs com gradientes únicos (colorA/colorB) e specular highlight
- Sinapses douradas zigzag entre nodes (como lightning/neurônios)
- Chains multi-node (3-5 nodes conectados)
- Growth animation de 6 segundos (partículas → orbs)
- Drag/pan para explorar o mapa
- Match toasts ("Seu Ori conectou com...")
- "você" marker no centro com glow pulsante
- Toggle para vista grid alternativa
- PersonPopup com perfil resumido + Correio Elegante
- Filtros por faceta: Todos, Íntimo, Criativo, Profissional, Social

**Conexões (/connections) — NOVA:**
- 3 seções: Matches ativos, Conversas, Conexões confirmadas
- "Sua vez" indicator (inspirado no Hinge)
- Unread indicator (green dot)
- Enviar Correio CTA nos matches

**Eventos (/events):**
- Lista de eventos seguidos + próximos
- Busca por eventos
- Cards com tags coloridas e social proof

**Página pública de evento (/e/[slug]):**
- SSR com OG tags para share social
- Cover image, info colapsável, social proof
- Feed com posts e reações (login required)
- CTA "Participar" → login → redirect de volta

**Perfil (/profile):**
- Orb animado + avatar com inicial
- Stats: Eventos, Matches, Conexões
- Facetas com toggles coloridos
- "O que seu Ori sabe" — narrativas por faceta
- Links para Conexões, Eventos, Configurações

**Configurações (/settings) — NOVA:**
- Conta, Privacidade (toggles de visibilidade), Dados (export/delete), Sessão
- Logout funcional (Supabase signOut + redirect)

**Admin Dashboard (/dashboard):**
- Stats cards, lista de eventos, feed de atividade
- Nav: Dashboard, Eventos, Usuários, Moderação

**Correio Elegante:**
- CorreioPopup com textarea, contador 0/500, info de preço
- Preço correto: 5 grátis no check-in + R$0,99 por adicional
- CorreioExpired com re-enable via missão ou pagamento (R$0,99)
- Toast de confirmação "Correio enviado com sucesso!"

**Design System implementado:**
- AMOLED true black, glass cards com backdrop blur
- Fontes: Fraunces (display) + Outfit (body)
- 6 cores: green, coral, amber, cyan, purple, pink
- CosmosBackground com 70 partículas animadas
- Matter FAB pulsante (fixed bottom-right)
- Bottom nav: Lobby, Conexões, Eventos, Perfil

**Facetas (CLAUDE.md = source of truth):**
- Essência (sempre ativa, green)
- Íntimo (toggle, pink)
- Criativo (toggle, cyan)
- Profissional (toggle, amber)
- Social (toggle, purple)

**Correções de qualidade:**
- Gramática PT-BR corrigida em 24 arquivos (acentos, cedilha, etc.)
- Todos os fluxos navegáveis de ponta a ponta
- Revisão sistemática: zero dead-ends
- TypeScript strict sem erros
- Build passando limpo

**Navegação completa verificada:**
```
/ → /login → /onboarding → /lobby → /connections → /events → /e/[slug] → /profile → /settings → logout → /
```

**Modo demo:**
- Todas as páginas protegidas funcionam sem Supabase configurado
- Mock data em todas as telas para validação visual
- Perfil mock: Matheus Betinelli (PM, todas as 5 facetas)

### Decisões de produto registradas:
- CLAUDE.md é SEMPRE a fonte de verdade suprema
- Nomes de facetas seguem CLAUDE.md (Essência, Íntimo, Criativo, Profissional, Social)
- Social proof nunca mente (sem números falsos)
- Landing balanceada para TODAS as facetas
- Cosmos = representação visual dos Oris/conexões
- Evento-agnóstico: nunca hardcodar tipo de evento
- Preço Correio: 5 grátis + R$0,99 (CLAUDE.md)
- Bottom nav: 4 tabs (Lobby, Conexões, Eventos, Perfil) + Matter FAB
- "Sua vez" indicator nas conversas (inspirado Hinge)
- Pesquisa de concorrentes: Tinder, Hinge, Bumble, LinkedIn, Meetup analisados

### Jornada do chat de desenvolvimento (contexto para próximos chats):

**Sessão 1 (2026-04-01):** Setup completo do zero. Next.js 14 + TypeScript + Supabase + Tailwind. 87 arquivos criados. Landing page 9 seções. Onboarding 4 etapas. Lobby com grid hexagonal. Todas as rotas do app. Admin dashboard. Correio Elegante. Auth flow. Middleware. AI integrations (Claude + OpenAI). Build passando.

**Sessão 2 (2026-04-01 cont.):** Assessment honesto — UI ~90% mas integração backend ~25%. Modo demo criado (todas as telas funcionam sem Supabase). CTAs da landing corrigidos. Facetas renomeadas para CLAUDE.md spec (Essência/Íntimo/Criativo/Profissional/Social). Correio Elegante wired no lobby. Hero copy reescrito. Stats "O Potencial Desperdiçado" adicionados. Landing balanceada para todas as facetas. CosmosLobby criado (canvas com orbs, sinapses, drag). 35 participantes mock. Perfil do Bet (Matheus Betinelli). Gramática PT-BR corrigida em 24 arquivos. Pesquisa de concorrentes (Tinder, Hinge, Bumble, LinkedIn, Meetup). Tab Conexões adicionada. Settings + logout criados. Revisão sistemática: zero dead-ends. Header lobby fixado. Sinapses douradas zigzag. AGENTS.md, RESEARCH.md, TODO.md criados.

### O que o próximo chat deve fazer:
1. Ler CLAUDE.md + AGENTS.md + TODO.md antes de qualquer coisa
2. Rodar `npm run dev` e `npm run typecheck` pra confirmar que tudo tá ok
3. Seguir as prioridades do TODO.md
4. Qualquer feature nova → registrar em CLAUDE.md patch notes
5. Qualquer decisão arquitetural → registrar em RESEARCH.md
