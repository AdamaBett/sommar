# CLAUDE.md — Sommar

> Motor de matchmaking para conexão humana real. IA-first, evento-native, dimensionalmente universal.
> Este arquivo é a fonte de verdade para todo código produzido neste projeto.

## Documentação Estruturada (Inspirado por chenglou/pretext)

O projeto usa documentação estruturada para máxima eficiência com agentes IA:

| Documento                   | Propósito                                                                   | Quando ler                        |
| --------------------------- | --------------------------------------------------------------------------- | --------------------------------- |
| **CLAUDE.md** (este)        | Fonte suprema de verdade. Spec completa, schema, design, regras de negócio. | SEMPRE, antes de qualquer código. |
| **AGENTS.md**               | Como trabalhar no código. Invariantes, padrões, armadilhas conhecidas.      | Antes de codar.                   |
| **RESEARCH.md**             | O que foi tentado e rejeitado. Decisões de arquitetura com "por quê".       | Antes de propor mudanças.         |
| **TODO.md**                 | Prioridades atuais, o que está fora de escopo, % de completude.             | Antes de escolher o que fazer.    |
| **.claude/CLAUDE.local.md** | Regras de sessão, preferências do Bet, decisões rápidas.                    | Início de sessão.                 |

### Regra de ouro

Qualquer agente IA deve ler `CLAUDE.md` + `AGENTS.md` + `TODO.md` antes de escrever uma única linha.
Qualquer decisão arquitetural significativa deve ser registrada em `RESEARCH.md`.
Qualquer feature completada deve ser adicionada ao Patch Notes neste arquivo.

## Projeto

**Sommar** é infraestrutura de conexão humana. Onde houver duas ou mais pessoas reunidas (evento, bar, praia, congresso, hackathon, retiro, coworking, qualquer lugar), o Sommar facilita o encontro entre elas. A IA central (**Matter**) conduz onboarding conversacional, cria perfis profundos (**Oris**) com 5 facetas, e faz matching via embeddings vetoriais. As pessoas se conectam através de mensagens temporárias (**Correio Elegante**) dentro de lobbies vinculados a eventos ou áreas geográficas. O Sommar é agnóstico ao tipo de vínculo: não decide se o match é romance, amizade, parceria ou mentoria. Mostra POR QUÊ duas pessoas devem se conhecer. Elas decidem o resto.

**Escopo atual:** MSP (Minimum Scaleable Product). Plataforma 100% agnóstica ao tipo de evento e ao organizador. Funciona para festival, congresso, hackathon, retiro, feira, meetup, Campus Party, coworking, qualquer encontro presencial de 50 a 50.000 pessoas. A arquitetura é pensada para escalar desde o dia 1. O campo `matter_context` no evento é o que contextualiza a Matter para cada contexto — é o organizador que escreve isso, não o código. JAMAIS hardcodar referências a eventos específicos, tipos de música, cidades ou qualquer coisa que não seja universal. O Sommar não é uma ferramenta para um evento. É infraestrutura para todos os eventos.

**Time:** Bet (PM, não dev) + Gusta (full-stack dev). Bootstrap, R$1k/mês max.

## Stack

- **Framework:** Next.js 16 (App Router, SSR, otimizado para free tiers)
- **Linguagem:** TypeScript strict mode
- **Backend/DB:** Supabase (Postgres + Auth + Realtime + Storage + Edge Functions)
- **Embeddings:** pgvector extension no Supabase
- **IA conversação:** Claude API — `claude-sonnet-4-6` para Matter (onboarding + lobby), `claude-haiku-4-5` para ice-breakers e extração de dados (tarefa simples, custo 5x menor)
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
- **ZERO travessões (— ou –) em qualquer copy de UI.** Travessão é marca de IA. Use vírgula ou ponto.
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

- `sommar.app/` → Landing page. Hero, dados de solidão, como funciona, pitch B2B, CTA direto de criar conta. CTA principal: "Criar meu Ori" → /login. Se já logado e onboarding completo → redirect para `/lobby`. Sem email capture. A conversão acontece direto pelo CTA.
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
  → Pessoa abre sommar.app/e/[slug-do-evento]
    → Vê info do evento, social proof, feed (read-only)
    → Clica "Participar" → Login
      → Se novo: Onboarding com Matter (3-10 min)
        → Ori nasce → Redirect de volta para /e/[slug-do-evento]
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

## Matter — Arquitetura de Inteligência

### O que cada método de auth nos dá

| Campo             | Google OAuth                  | Email OTP                       |
| ----------------- | ----------------------------- | ------------------------------- |
| Nome              | ✅ `user_metadata.full_name`  | ❌ Matter coleta na 1ª mensagem |
| Email             | ✅                            | ✅                              |
| Foto              | ✅ `user_metadata.avatar_url` | ❌                              |
| Idade             | ❌                            | ❌                              |
| Localização       | ❌                            | ❌                              |
| Gênero/orientação | ❌                            | ❌                              |

**Regra de ouro:** A Matter NUNCA pergunta algo que já sabemos. Se veio do Google e temos o nome → ela cumprimenta pelo nome já na primeira mensagem, sem perguntar.

### Personalização do onboarding

O onboarding não é um script linear. A Matter recebe no contexto:

```json
{
  "auth_method": "google" | "email",
  "known_data": {
    "name": "Matheus",         // se disponível do Google
    "has_photo": true,         // se tem avatar do Google
    "event_context": "Sounds in da City — festival de música ao vivo..."  // se veio de /e/[slug]
  },
  "extracted_so_far": {        // facet_data já extraído
    "essencia": { "valores": "..." }
  },
  "completeness_score": 0.12   // 0 a 1
}
```

Com isso, a Matter adapta:

- Ponto de partida da conversa (o que ainda não sabe)
- Tom (quem veio de festival vs. hackathon recebe abordagens diferentes)
- O que perguntar e em que ordem
- Quanto aprofundar antes de avançar para arquétipos/facetas

### Camada de extração (extraction layer)

Após cada mensagem do usuário, roda um call paralelo e assíncrono com Haiku que:

1. Lê a conversa até aquele ponto
2. Retorna JSON estruturado com o que conseguiu extrair
3. Faz merge incremental no `facet_data` JSONB do perfil (merge, não substituição)
4. Recalcula o `completeness_score` do Ori

O Ori nasce **durante** a conversa, não só no final. O Ori Reveal acontece quando `completeness_score >= 0.65`.

**Formato de saída da extração (Haiku):**

```json
{
  "facet_data": {
    "essencia": {
      "valores": "autonomia, profundidade, leveza",
      "energia_social": "seletivamente extrovertido",
      "como_se_comunica": "direto mas cuidadoso"
    },
    "criativo": {
      "musica": "jazz, soul, eletrônica orgânica"
    }
  },
  "identity": {
    "gender": null,
    "interested_in": ["todos"]
  },
  "completeness_score": 0.28,
  "confidence": "medium"
}
```

Campos com `null` → ainda não mencionados. Nunca presumir.

### Continuidade pós-onboarding

Quando a pessoa abre a Matter no lobby, perfil ou qualquer outra tela:

- O sistema injeta o Ori atual completo no contexto
- A Matter já sabe tudo que foi coletado
- Se surgir oportunidade natural, ela aprofunda uma faceta
- A extração continua rodando → Ori melhora ao longo do tempo
- O `version` do Ori incrementa a cada atualização significativa (score delta > 0.1)

A Matter nunca diz "posso te fazer mais algumas perguntas para completar seu perfil?" — isso é de chatbot. Se quiser aprofundar, ela o faz organicamente dentro do contexto da conversa.

### Onboarding via email OTP

Se a pessoa entrou por email:

1. Supabase envia magic link (sem senha)
2. Após confirmação, redirect para `/onboarding`
3. Primeira mensagem da Matter pergunta o nome preferido (única exceção de pergunta direta)
4. A partir daí, conversa normal
5. O avatar é gerado a partir das iniciais do nome (sem foto)

### Regras de coleta de identidade durante o onboarding

A Matter coleta gênero, orientação e `interested_in` de forma conversacional, NUNCA como formulário. Regras:

- Se a pessoa não mencionar, não forçar
- Se houver hesitação ou resposta vaga, oferecer saída: _"Sem pressão, você ajusta isso a qualquer momento no perfil"_
- Fallbacks: gênero não declarado → não visível. interested_in não declarado → `["todos"]`. orientation → não visível.
- A Matter NUNCA presume heterossexualidade, monogamia ou binariedade.

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

| Faceta           | Toggle                   | O que contém                                                                                                                                                                          |
| ---------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Essência**     | Sempre ativa, sem toggle | Valores, energia, personalidade, estilo de comunicação. Preenchida automaticamente pela Matter durante o onboarding.                                                                  |
| **Íntimo**       | Liga/desliga por lobby   | Vida afetiva, atração, disponibilidade emocional. Quando ativa, o matching respeita `interested_in` e `relationship_model`. É o sinal claro de "estou aberto pra algo caliente aqui". |
| **Criativo**     | Liga/desliga por lobby   | Gosto musical, estético, referências culturais, hobbies, expressão artística.                                                                                                         |
| **Profissional** | Liga/desliga por lobby   | Área de atuação, expertise, o que sabe fazer, o que quer aprender, o que pode ensinar.                                                                                                |
| **Social**       | Liga/desliga por lobby   | Estilo de amizade, interesses de comunidade, esportes, causas, o que faz por diversão.                                                                                                |

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

## Telemetria — O que precisa ser medido

O Sommar é um produto orientado por dados desde o dia 1. **Absolutamente tudo** que o usuário faz precisa ser rastreável, tanto para melhorar o produto quanto para gerar inteligência para o time e para os organizadores.

### Ferramentas recomendadas (MSP)

- **Vercel Analytics** — page views, vitals, visitors. Grátis no plano Vercel.
- **PostHog** (self-hosted ou cloud free tier) — eventos personalizados, funis, session replay, feature flags.
- Qualquer combinação que respeite LGPD. Nunca Google Analytics (GDPR problemático).

### Eventos a capturar (mínimo)

**Landing page:**

- `landing_viewed` — com UTM params se existirem
- `hero_cta_clicked` — "Criar meu Ori"
- `section_viewed` — qual seção (como_funciona, problema, organizadores, etc.)
- `mid_cta_clicked` — "Quero entrar"
- `final_cta_clicked` — "Criar meu Ori agora"
- `organizer_cta_clicked` — "Criar meu primeiro evento"

**Auth:**

- `login_page_viewed`
- `google_login_started`
- `google_login_completed`
- `email_otp_started`
- `email_otp_completed`
- `login_failed` — com reason

**Onboarding:**

- `onboarding_started`
- `onboarding_message_sent` — com turn number (1ª, 2ª, 3ª mensagem...)
- `aesthetic_picker_viewed`
- `aesthetic_archetype_selected` — quais arquétipos
- `facet_selector_viewed`
- `facet_toggled` — qual faceta, on/off
- `ori_reveal_triggered` — quando completeness_score >= 0.65
- `onboarding_completed` — com completeness_score final e tempo total
- `onboarding_abandoned` — em qual etapa

**Lobby:**

- `lobby_viewed` — qual evento
- `facet_filter_changed`
- `person_popup_opened` — perfil de quem
- `correio_intent` — clicou em "Enviar Correio"
- `correio_sent`
- `match_toast_seen`
- `cosmos_dragged`

**Matter (chat):**

- `matter_fab_opened`
- `matter_message_sent` — nunca logar o conteúdo (privacidade)
- `matter_panel_closed`

**Conversões críticas (funil):**

```
landing_viewed
  → hero_cta_clicked (taxa A)
  → login_page_viewed (taxa B — maioria chega aqui)
  → google_login_completed (taxa C)
  → onboarding_started (taxa D)
  → onboarding_completed (taxa E — objetivo: > 60%)
  → lobby_viewed (taxa F)
  → correio_sent (taxa G — "aha moment" do produto)
```

### Princípios de privacidade

- NUNCA logar conteúdo de mensagens (Matter ou Correio)
- NUNCA logar dados de identidade (gênero, orientação, etc.) nos analytics
- Eventos devem ter IDs anônimos, não user_ids rastreáveis fora do sistema
- Usuário pode opt-out de analytics na tela de Configurações

---

## Dashboard Interno (admin.sommar.app)

**Público:** Bet + Gusta + futuros membros do time. Separado do portal do organizador.

Este dashboard é diferente do que o organizador vê. É a visão completa do sistema.

### Rota e acesso

- Domínio separado ou subdomínio: `admin.sommar.app` ou rota `/admin` com auth de time
- Acesso via lista branca de emails no Supabase (role = 'superadmin')
- NUNCA acessível por organizadores ou participantes

### O que o dashboard interno mostra

**Saúde do sistema:**

- API costs em tempo real (Claude API: tokens/dia, $$/dia. OpenAI: embeddings/dia)
- Erros de build/deploy (webhook do Vercel)
- Latência média das rotas de IA
- Supabase: conexões ativas, DB size, Realtime subs

**Usuários:**

- Total de usuários criados (por dia, semana, mês)
- Taxa de completude de onboarding
- Distribuição de facetas ativas (quais facetas as pessoas ativam mais)
- Completeness score médio dos Oris
- Retenção: usuários que voltaram depois do 1º evento

**Eventos:**

- Todos os eventos (nome, organizador, datas, capacidade, status)
- Participantes por evento
- Taxa de matching (matches/participantes)
- Correios enviados por evento

**Moderação:**

- Fila de denúncias pendentes (`reports` table, status = 'pending')
- Blocks recentes (sinal de problemas)
- Conteúdo sinalizado pelo filtro de profanidade

**Qualidade da IA:**

- Completeness score médio por sessão de onboarding
- Tempo médio para completar onboarding
- Quantos Ori Reveals aconteceram (score >= 0.65)
- Ice-breakers gerados vs. usados (taxa de aceitação)

**Telemetria de produto:**

- Funil de conversão completo (landing → correio_sent)
- Bounce rate por seção da landing
- Seção com maior drop-off no onboarding

---

## Inteligência para Organizadores

O valor único que o Sommar oferece ao organizador é **dados que nenhuma outra plataforma de eventos captura**. Não é headcount. É a profundidade das conexões que o evento gerou.

### O que o organizador VÊ (portal do organizador)

**Antes do evento:**

- Preview da página pública
- QR codes para check-in e quests
- Número de interessados no evento e crescimento por dia

**Durante o evento (realtime):**

- Check-ins em tempo real
- Heatmap de facetas ativas (quais facetas as pessoas estão ativando neste evento)
- Correios enviados por hora (indicador de engajamento)

**Após o evento:**

- Total de participantes únicos
- Taxa de conexão: X% dos participantes trocaram pelo menos 1 Correio
- Distribuição por faceta: "70% dos participantes ativaram Profissional"
- Top combinações de facetas nos matches (ex: Profissional+Criativo foi o combo mais comum)
- Conexões confirmadas (ambos clicaram "confirmar conexão")
- NPS implícito: participantes que voltaram a abrir o app após o evento

### O que o organizador NÃO VÊ

- Identidade de usuários individuais (anonimizado por padrão)
- Conteúdo de mensagens (nunca)
- Orientação sexual, pronomes, modelo relacional (nunca)
- Facet_data de qualquer usuário específico

### Pitch para o organizador

_"Você organiza um evento de networking. Hoje você sabe quantas pessoas foram. Com o Sommar, você sabe quantas conexões significativas o seu evento gerou, quais perfis se conectaram mais, e o que as pessoas estavam buscando. Isso é inteligência de evento, não headcount."_

### Tiers de organizador (MSP)

- **Free:** 1 evento, até 200 participantes, analytics básicos
- **Pro (futuramente):** Múltiplos eventos, analytics completos, white-label da landing do evento, suporte

---

## Segurança e Botão de Pânico

O Sommar opera em eventos presenciais onde as pessoas se encontram de verdade. Segurança não é feature, é responsabilidade.

### Botão de pânico (safety button)

**O que é:** Um botão discreto, sempre acessível, que o usuário pode acionar se se sentir inseguro em um evento.

**Onde fica:** Dentro de qualquer conversa de Correio Elegante ativo, no menu de contexto do perfil de outro usuário, e no menu de configurações rápidas (accessible sem scroll).

**O que acontece ao acionar:**

1. Usuário confirma (toque duplo ou slide para evitar acionamento acidental)
2. Alerta imediato para o organizador do evento com: timestamp, localização aproximada (se permitida), e opcionalmente uma nota de texto
3. O organizador recebe notificação push (se PWA instalado) e email
4. Registro no Supabase (`safety_alerts` table) com evidências para eventual processo
5. Usuário recebe confirmação: "Alerta enviado. Sua segurança é prioridade. Se emergência, ligue 190."
6. Opção de bloquear o outro usuário de forma imediata e silenciosa

**O que NÃO acontece:**

- Não é necessário login para ver o número de emergência (190)
- Não exige localização — é opt-in, não obrigatório
- Não expõe a identidade da vítima para o suspeito

**Schema adicional necessário:**

```sql
create table public.safety_alerts (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id),
  reported_user_id uuid references public.profiles(id),  -- pode ser nulo se ameaça externa
  event_id uuid references public.events(id),
  lobby_id uuid references public.lobbies(id),
  description text,                  -- nota opcional do usuário
  location_note text,                -- onde está (livre, não GPS obrigatório)
  status text default 'pending',     -- 'pending' | 'organizer_notified' | 'resolved'
  organizer_notified_at timestamptz,
  resolved_at timestamptz,
  resolution_note text,
  created_at timestamptz default now()
);
```

**Regras de moderação pós-alerta:**

- Organizador vê alertas no portal em tempo real
- Super-admin (Bet/Gusta) vê todos os alertas no dashboard interno
- 3 alertas contra o mesmo usuário em 30 dias → revisão manual obrigatória

---

## Lobby — Tiers de Acesso

O lobby tem dois modos de acesso para maximizar engajamento sem comprometer a integridade do check-in.

### Tier 1: Acesso antecipado (pre-event)

- **Quando:** Após o usuário confirmar interesse no evento (`event_interests` table) — pode ser dias antes
- **O que pode:** Ver perfis de outros que também confirmaram interesse. Não pode enviar Correio ainda.
- **Objetivo:** Criar antecipação. "Tem 47 pessoas interessadas nesse evento. Você já pode ver quem vai."
- **UI:** Lobby em modo "preview" — orbs visíveis mas sem interação de Correio. Matter pode dizer: "Encontrei 3 pessoas que você vai querer conhecer aqui."

### Tier 2: Check-in presencial (QR obrigatório)

- **Quando:** No dia do evento, via scan do QR de check-in
- **O que habilita:** Acesso COMPLETO ao lobby. Correio Elegante liberado (5 grátis). Matching ativo em tempo real. Presence indicator (online agora).
- **Por que QR é obrigatório para este tier:** Garante que a pessoa está fisicamente no evento. Isso é o que diferencia o Sommar de um app de dating: o encontro acontece no mundo real, com pessoas que estão ali.
- **Anti-abuso:** QR de check-in muda a cada evento e expira em `event.end_time + 2h`. Um QR por evento por usuário.

### Tier 3: Lobby histórico (post-event)

- **Quando:** Após `event.end_time`
- **O que pode:** Ver todos os participantes que fizeram check-in. Conversas ativas ainda funcionam (até expirar). Não pode iniciar novas conversas.
- **Duração:** ~1 semana. Depois vira `expired` e vai para "eventos participados" no perfil.

### Regra de negócio importante

Um usuário pode ter acesso Tier 1 (interesse confirmado) mas nunca chegar ao Tier 2 (não foi ao evento). Isso é normal. O lobby histórico que ele verá mostrará "você não fez check-in neste evento" — sem punição, mas sem acesso a Correio retroativo.

---

## Visão de Longo Prazo

O Sommar começa em eventos presenciais porque é onde a proposta de valor é mais óbvia e defensável. Mas a arquitetura é construída para expandir.

### Próximas fronteiras (pós-MSP)

- **Geo-lobbies:** Lobbies vinculados a locais (bar, coworking, praia) em vez de eventos com data. "Estou no Café Cultura agora." O QR de check-in fica na parede do estabelecimento.
- **Lobbies permanentes de comunidade:** Grupos de interesse (meetup semanal, time de esporte, república estudantil). Sem data de expiração.
- **Sommar para empresas:** Onboarding de times, integração entre departamentos, match por skills para projetos internos.
- **API pública para organizadores:** Organizadores integram o Sommar ao próprio app/site via API. O Ori e o matching ficam no Sommar; a experiência fica no app deles.

### O que nunca muda (invariantes de visão)

- Sempre presencial-first: o objetivo é sempre o encontro olho no olho
- Sempre agnóstico ao tipo de vínculo: o Sommar não decide se é amor, amizade ou parceria
- Sempre dimensional: o Ori tem 5 facetas, não é um perfil de 3 fotos
- Sempre transparente: o usuário sempre sabe o que a IA sabe sobre ele

---

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

- Next.js 16 App Router configurado com TypeScript strict
- Supabase client/server setup com SSR pattern
- Middleware de auth com bypass para dev sem Supabase
- Claude API (Matter) e OpenAI (embeddings) integrados
- Matching engine com cosine similarity implementado
- 17 tabelas SQL com migrations e RLS desenhadas

**Landing Page (/):**

- Estrutura original: Hero, ProblemStats, Antidote, HowItWorks, NotJustDating, ForOrganizers, EmailCapture, Footer
- Hero copy original: "A pessoa certa está ali do lado. Vocês só não se encontraram ainda."
- CTAs originais: Descubra (scroll), Criar meu perfil (/login), Fale com a gente (mailto)
- Social proof honesto (sem números falsos)
- Balanceada para todas as facetas, não só romance
- NOTA: Estrutura e copy foram completamente revisados na Sessão 3 (ver abaixo)

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

**Sessão 1 (2026-04-01):** Setup completo do zero. Next.js 16 + TypeScript + Supabase + Tailwind. 87 arquivos criados. Landing page 9 seções. Onboarding 4 etapas. Lobby com grid hexagonal. Todas as rotas do app. Admin dashboard. Correio Elegante. Auth flow. Middleware. AI integrations (Claude + OpenAI). Build passando.

**Sessão 2 (2026-04-01 cont.):** Assessment honesto — UI ~90% mas integração backend ~25%. Modo demo criado (todas as telas funcionam sem Supabase). CTAs da landing corrigidos. Facetas renomeadas para CLAUDE.md spec (Essência/Íntimo/Criativo/Profissional/Social). Correio Elegante wired no lobby. Hero copy reescrito. Stats "O Potencial Desperdiçado" adicionados. Landing balanceada para todas as facetas. CosmosLobby criado (canvas com orbs, sinapses, drag). 35 participantes mock. Perfil do Bet (Matheus Betinelli). Gramática PT-BR corrigida em 24 arquivos. Pesquisa de concorrentes (Tinder, Hinge, Bumble, LinkedIn, Meetup). Tab Conexões adicionada. Settings + logout criados. Revisão sistemática: zero dead-ends. Header lobby fixado. Sinapses douradas zigzag. AGENTS.md, RESEARCH.md, TODO.md criados.

**Sessão 3 (2026-04-01 cont.):** Documentação estratégica e landing overhaul. CRO.md criado com benchmarks, CTAs, onboarding, dark design, social proof. README.md reescrito para Gusta clonar e rodar. Plataforma declarada 100% universal/agnóstica (removidas todas referências a "Sounds in da City"). Regra de travessão adicionada em CLAUDE.md e AGENTS.md: ZERO dashes/travessões em qualquer copy de UI, jamais. NeonCTA.tsx criado (botão com borda neon animada via conic-gradient rotativo). Hero.tsx reescrito: "A pessoa certa está ao seu lado", NeonCTA "Criar meu Ori", secondary link "ou descubra como funciona" corrigido para scroll target #sobre. HowItWorks.tsx reescrito: icon+title inline, descrições enxutas. FinalCTA.tsx criado (substituiu EmailCapture — CTA direto de criar conta). MidCTA.tsx criado (CTA de meio de página). ForOrganizers.tsx: CTA primário "Criar meu primeiro evento" + secondary email. page.tsx atualizado: estrutura Hero → ProblemStats → Antidote → HowItWorks → NotJustDating → MidCTA → ForOrganizers → FinalCTA → Footer. Bug fix: scroll target Hero corrigido (#comecar → #sobre). .gitignore: adicionado .claude/ para não commitar memória interna do Claude Code. Vercel configurado: framework preset → Next.js, deploy automático do GitHub main. Build fix: removido import framer-motion não usado em FinalCTA.tsx. Estimativas de custo de API documentadas: ~$8-10 por evento de 200 pessoas, ~$20-25 por 500 pessoas. CLAUDE.md expandido: seção completa de Matter Intelligence Architecture, extraction layer protocol, continuous improvement do Ori, regras de coleta de identidade. CLAUDE.md expandido (Sessão 3): Telemetria completa (eventos a capturar, funil de conversão, ferramentas), Dashboard Interno (admin.sommar.app, saúde do sistema, moderação, métricas de IA), Inteligência para Organizadores (o que vê vs. não vê, pitch, tiers), Segurança e Botão de Pânico (schema safety_alerts, fluxo de alerta), Lobby Tiers de Acesso (pre-event/QR/histórico), Visão de Longo Prazo (geo-lobbies, comunidades, API pública).

### Decisões de produto registradas (Sessão 3):

- Plataforma é 100% universal. JAMAIS hardcodar evento específico no código ou docs.
- ZERO travessões em copy. É sinal de IA. Usa vírgula, ponto, ou reescreve.
- Landing não tem email capture. Tem CTA direto para criar conta.
- NeonCTA é o CTA principal do produto. Animação de borda neon rotativa.
- Dashboard interno (admin.sommar.app) é separado do portal do organizador.
- Telemetria em tudo, mas NUNCA logar conteúdo de mensagens.
- Botão de pânico é responsabilidade, não feature. Entra no MSP.
- Lobby tem 3 tiers: interesse (ver sem interagir), QR check-in (full access), histórico (read-only).

### v0.2.0 — Infra de IA, Segurança e Portal do Organizador (2026-04-03)

**Sessão 4:** Bet dormiu e o agente trabalhou. Foco em construir tudo que não depende de ação manual (Supabase cloud, Google OAuth).

**Bug fixes:**

- Fix: `onboarding.ts` usava facetas erradas ("Romântico, Amizade, Profissional, Organizador"). Corrigido para as 5 facetas corretas (Essência, Íntimo, Criativo, Profissional, Social) com descrições de cada uma.

**Extraction Layer (coração do produto):**

- `src/lib/ai/extraction.ts` criado. Call assíncrono com Haiku (`claude-haiku-4-5-20251001`) após cada mensagem.
- Merge incremental de `facet_data` JSONB (nunca substitui, sempre faz merge).
- `completeness_score` calculado automaticamente (0 a 1).
- Endpoint `/api/onboarding/extract` (edge runtime).
- Prompts de extração e narrativa do Ori em `src/lib/ai/prompts/extraction.ts`.

**Matter Streaming:**

- `/api/matter/route.ts` reescrito com suporte a streaming SSE via ReadableStream.
- Rate limiting (30 req/min por IP).
- Input sanitization (remove HTML, scripts, event handlers).
- Mensagens limitadas a 5000 chars e histórico trimado a 40 mensagens.
- Hook `useMatter.ts` criado: streaming real + fallback mock + extração em background.

**Telemetria:**

- PostHog (`posthog-js`) + Vercel Analytics (`@vercel/analytics`) instalados.
- `src/lib/analytics.ts`: wrapper tipado com TODOS os eventos do funil (landing → correio_sent).
- `AnalyticsProvider.tsx` no root layout.
- Opt-out/opt-in para LGPD (`optOutAnalytics()`, `optInAnalytics()`).
- Regra baked: tipo `AnalyticsEvent` NUNCA permite logar conteúdo de mensagens.

**Safety Button (Botão de Pânico):**

- Migration `00002_safety_alerts.sql` com RLS (organizadores veem alertas dos seus eventos).
- `SafetyButton.tsx`: botão discreto, confirmação dupla, formulário de detalhes opcional.
- Endpoint `/api/safety/alert` com criação de alerta + notificação ao organizador.
- Número de emergência 190 sempre visível.

**Portal do Organizador:**

- Route group `(organizer)` com layout autenticado (role = organizer ou creator).
- `OrganizerHeader.tsx` com navegação: Meus Eventos, Criar Evento, Segurança.
- `/organizer` — Lista de eventos com stats (interessados, check-ins, correios, taxa de conexão).
- `/organizer/create` — Formulário completo: nome, slug auto-gerado, descrição, matter_context (campo crucial), datas, local, tickets, capacidade, tags.
- `/organizer/event/[id]` — Analytics: stats cards, distribuição de facetas (bar chart), top combos de facetas, engajamento por hora (bar chart), contexto da Matter.
- `/organizer/safety` — Alertas de segurança com status (pendente/notificado/resolvido).
- API `/api/organizer/events` (POST criar + GET listar) com validação de slug e criação automática de lobby.

**Security Hardening:**

- `next.config.mjs`: headers CSP, HSTS (2 anos + preload), X-Frame-Options DENY, X-Content-Type-Options nosniff, Permissions-Policy (camera/microphone/geolocation desabilitados).
- `src/lib/security.ts`: rate limiting in-memory (serverless-compatible), input sanitization, slug sanitization, UUID validation, profanity filter server-side.
- Rate limits aplicados em: Matter (30/min), Extraction (30/min), Safety (5/min), Organizer (20/min).
- Cleanup automático do rate limit store a cada 60s.

**Qualidade:**

- TypeScript: zero erros (`npm run typecheck` passando).
- ESLint: zero erros (apenas warnings de `<img>` pre-existentes).
- Build: 24 páginas compiladas com sucesso.

**Arquivos criados nesta sessão:**

```
src/lib/analytics.ts                          # Wrapper PostHog tipado
src/lib/security.ts                           # Rate limiting, sanitização, profanity
src/lib/ai/extraction.ts                      # Extraction layer (Haiku)
src/lib/ai/prompts/extraction.ts              # Prompts de extração + narrativa
src/hooks/useMatter.ts                        # Hook streaming + mock + extração
src/components/AnalyticsProvider.tsx           # Provider PostHog
src/components/SafetyButton.tsx               # Botão de pânico
src/components/organizer/OrganizerHeader.tsx   # Header do portal
src/app/(organizer)/layout.tsx                # Layout autenticado
src/app/(organizer)/organizer/page.tsx        # Lista de eventos
src/app/(organizer)/organizer/create/page.tsx # Criar evento
src/app/(organizer)/organizer/event/[id]/page.tsx # Analytics do evento
src/app/(organizer)/organizer/safety/page.tsx # Alertas de segurança
src/app/api/onboarding/extract/route.ts       # API extração
src/app/api/safety/alert/route.ts             # API alertas
src/app/api/organizer/events/route.ts         # API eventos organizador
supabase/migrations/00002_safety_alerts.sql   # Migration safety
```

### Decisões de produto registradas (Sessão 4):

- Portal do organizador é separado do super-admin (`/organizer` vs `/dashboard`)
- Rate limiting é in-memory (OK pro MSP serverless, reseta em cold start)
- Extraction layer usa Haiku (5x mais barato que Sonnet) para custo controlado
- Profanity filter é server-side, patterns básicos em PT-BR
- CSP permite PostHog e Vercel Analytics como fontes externas
- API routes usam edge runtime para melhor performance

### O que o próximo chat deve fazer:

1. Ler CLAUDE.md + AGENTS.md + TODO.md antes de qualquer coisa
2. **BLOQUEADOR**: Bet/Gusta precisam configurar Supabase cloud + Google OAuth + env vars Vercel (checklist detalhado no TODO.md)
3. Após Supabase configurado: testar fluxo completo login → onboarding → lobby
4. Integrar `useMatter` hook no `OnboardingFlow.tsx` (substituir mock por hook real)
5. Gerar QR codes reais no portal do organizador (biblioteca de QR)
6. Instrumentar componentes com `trackEvent()` da analytics
7. Adicionar `SafetyButton` no CorreioChat.tsx e PersonPopup.tsx
8. Adicionar `NEXT_PUBLIC_POSTHOG_KEY` nas env vars da Vercel
9. Qualquer feature nova → registrar em CLAUDE.md patch notes
