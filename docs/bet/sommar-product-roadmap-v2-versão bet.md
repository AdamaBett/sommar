# ☀️ Sommar · Product Roadmap

> **Para:** Gusta (dev full-stack) · **De:** Bet (PM/produto)
> **Última atualização:** 27 mar 2026 (pós-brainstorm Bet × Gusta)
> **Companion doc:** `sommar_contexto_gusta_v2.md` (contexto, glossário, design system, mercado)

---

## Como ler este documento

Tudo organizado em fases. **Fase 1 (MSP)** é o que precisa existir para rodar o primeiro evento real. Fases seguintes são backlog priorizado. Features agrupadas por domínio dentro de cada fase.

```
🟢  Protótipo visual pronto (HTML funcional, precisa virar código real)
🟡  Especificado mas sem protótipo
🔵  Decisão técnica pendente (Gusta decide)
⚪  Conceito validado, precisa de spec detalhada
```

**Princípio de arquitetura:** o Sommar é agnóstico ao tipo de vínculo. Não existem "categorias de conexão" no banco de dados. Existem 7 dimensões de perfil (ver doc de contexto, seção 4). O matching funciona por sobreposição e complementaridade dimensional, ponderado pela intenção contextual. A arquitetura precisa ser dimensional desde o dia 1.

---

## Fase 1 · MSP

> **Objetivo:** rodar 2 eventos reais com o Sounds in da City em Floripa. Coletar dados comportamentais reais.
> **Timeline alvo:** ~2 meses.
> **Escopo:** QR + Matter (onboarding + matching dimensional) + lobby do evento + relatório pós-evento. Tudo web responsivo.

---

### 1.1 · Auth e Onboarding

| #   | Feature                         | Status | Descrição                                                                                                                                             | Notas técnicas                                                                                                                                          |
| --- | ------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Auth participante               | 🟢     | Login via link do evento ou QR. Sem criação de conta complexa.                                                                                        | Supabase Auth. Magic link ou OAuth (Google). QR redireciona pra `/event/[slug]`, daí auth.                                                              |
| 2   | Auth organizador                | 🟡     | Login com email/senha ou OAuth. Perfil separado.                                                                                                      | Supabase Auth com role (`organizer`). RLS policies separadas.                                                                                           |
| 3   | Onboarding via texto com Matter | 🟢     | Conversa guiada. Matter faz perguntas, adapta com base nas respostas, constrói as 7 dimensões do Ori. 3-5 min. Deve parecer conversa, não formulário. | Claude API com system prompt contextualizado pelo evento. Respostas alimentam as 7 dimensões (JSONB). Chat stateful (histórico na session).             |
| 4   | Criação do Ori                  | 🟢     | Ao final do onboarding, Matter gera o Ori. Orbe visual quente. Participante "conhece" sua essência digital.                                           | Output estruturado da Claude API: 7 dimensões extraídas com pesos, resumo do Ori, tom detectado. Persistido no DB.                                      |
| 5   | Seleção de intenção contextual  | 🟡     | Ao entrar num lobby, Matter pergunta o que a pessoa busca ali. Dimensão 7 (intenção) é definida nesse momento.                                        | Subset das dimensões ativado por contexto. É isso que o matching engine usa como filtro principal. Não é dropdown. É pergunta conversacional da Matter. |

---

### 1.2 · Lobby e Localização

| #   | Feature                     | Status | Descrição                                                                                                    | Notas técnicas                                                                      |
| --- | --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| 6   | Lobby de evento (QR)        | 🟢     | Participante escaneia QR e entra no lobby. Constelação visual de participantes. Counter.                     | `events` + `event_participants` junction. Supabase Realtime pra counter e presença. |
| 7   | Check-in via QR             | 🟡     | QR no local confirma presença. Ativa participante no lobby.                                                  | QR gera URL com `event_id`. Se tem Ori: lobby direto. Se não: onboarding.           |
| 8   | Lobby por área (sem evento) | ⚪     | Pessoa seleciona onde está via Google Maps. Entra no lobby do bairro. Vê quem está ativo nas últimas 24-48h. | Google Maps Places API. Geohashing ou PostGIS. Definir granularidade.               |
| 9   | Janela de visibilidade      | 🟡     | Permanece visível no lobby por 24-48h após sair.                                                             | `last_active_at` no participant. Query por timestamp. Parametrizável por lobby.     |

---

### 1.3 · Matching Dimensional

> **Fundamental:** o matching não usa categorias ("romance", "amizade", "projeto"). Usa as 7 dimensões.

| #   | Feature                      | Status | Descrição                                                                                                                                               | Notas técnicas                                                                                                                                                                |
| --- | ---------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10  | Matching por dimensões       | 🟢     | Sommar cruza as dimensões dos participantes no mesmo lobby, pondera pela intenção contextual (dim. 7), e sugere matches.                                | Embeddings das 6 dimensões fixas (text-embedding-3-small ou similar). Cosine similarity com threshold. Dim. 7 (intenção) como filtro/peso. Pode começar simples e evoluir.    |
| 11  | Relatório de compatibilidade | 🟢     | Texto em linguagem natural explicando POR QUÊ aquelas duas pessoas deveriam se conhecer. Sem percentuais, sem categorias fixas. Cada relatório é único. | Claude API com as 7 dimensões de ambas as pessoas como context. Prompt: gerar relatório curto, humano, específico. Mencionar as dimensões que mais se sobrepõem/complementam. |
| 12  | Notificação de match         | 🟢     | Toast no lobby quando match é sugerido.                                                                                                                 | Supabase Realtime ou polling.                                                                                                                                                 |
| 13  | Limite de matches por lobby  | ⚪     | Número limitado pra criar escassez e valor percebido. Matter comunica o limite conversacionalmente.                                                     | Config por lobby (default: X matches). Desbloqueio via gamificação ou pagamento na Fase 2.                                                                                    |

---

### 1.4 · Chat

| #   | Feature                 | Status | Descrição                                                                                                                                  | Notas técnicas                                                                                                       |
| --- | ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 14  | Chat 1:1                | 🟢     | Conversa direta após match aceito. Quebra-gelo sugerido pela Matter. @matter disponível pra ajuda.                                         | Supabase Realtime. `messages` table. @matter trigger chama Claude API com contexto da conversa + dimensões de ambos. |
| 15  | Ori-to-Ori (versão MSP) | ⚪     | Quando offline, status visual "O Ori do João está guardando a conversa pra quando ele voltar". Versão real (Ori responde) fica pra Fase 2. | Indicador de presença no chat. Mensagem automática de status.                                                        |

---

### 1.5 · Dashboard do Organizador

| #   | Feature                  | Status | Descrição                                                                                                                                     | Notas técnicas                                                                                                                                                                  |
| --- | ------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 16  | Criação de evento        | 🟡     | Nome, data, local, descrição, contexto pra Matter (texto livre sobre o evento). Gera QR e link público.                                       | CRUD em `events`. QR gerado server-side (qrcode npm). Link público: `/event/[slug]`. O campo `matter_context` é fundamental: é o que contextualiza a Matter pro tipo de evento. |
| 17  | Dashboard do evento      | 🟡     | Métricas agregadas: participantes ativos, matches feitos, dimensões mais ativas, horários de pico. Tudo anonimizado. Nunca dados individuais. | Views/queries agregadas. Nenhum dado individual exposto. Realtime pra counter.                                                                                                  |
| 18  | Relatório pós-evento     | 🟡     | Matter gera relatório narrativo automático. Texto interpretado, não planilha.                                                                 | Claude API com dados agregados como context. Cron ou trigger manual.                                                                                                            |
| 19  | Página pública do evento | 🟡     | URL compartilhável com info + QR + CTA pra onboarding.                                                                                        | SSR no Next.js. Meta tags pra social sharing. QR inline.                                                                                                                        |
| 20  | Alerta de emergência     | ⚪     | Organizador recebe notificação se alguém aciona botão de pânico.                                                                              | Supabase Realtime channel pra emergências.                                                                                                                                      |

---

### 1.6 · Segurança

| #   | Feature                | Status | Descrição                                                                                    | Notas técnicas                                                                                              |
| --- | ---------------------- | ------ | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 21  | Botão de pânico        | ⚪     | Discreto no app. Notifica organizador, envia localização + áudio pra contatos de emergência. | GPS ativado pontualmente (não persistente). MediaRecorder API pra áudio. Supabase Realtime pro organizador. |
| 22  | Contatos de emergência | ⚪     | Até 3 contatos que recebem notificação em caso de pânico.                                    | No perfil do usuário. Pra contatos externos: considerar Twilio (SMS).                                       |

---

### 1.7 · Perfil e Conexões

| #   | Feature                    | Status | Descrição                                                                                                 | Notas técnicas                                                                                                        |
| --- | -------------------------- | ------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 23  | Perfil com Ori e dimensões | 🟢     | Orbe do Ori, as 7 dimensões visualizadas como camadas ricas, toggles de visibilidade por contexto, stats. | Dimensões = JSONB no Supabase. Cada dimensão: `{ key, values[], weights{}, visible_in_context }`. Toggle é por lobby. |
| 24  | Lista de conexões          | 🟢     | Agrupadas por evento/contexto. Orbes coloridos. Status de conversa.                                       | Junction `connections` com status, event_id. Agrupado por evento na query.                                            |

---

## Fase 2 · Pós-MSP (Backlog Priorizado)

> Features validadas no brainstorm que ficam fora do MSP por escopo. Ordenadas por valor vs esforço.

### 2.1 · Onboarding por Voz

A pessoa faz uma chamada de voz com a Matter. Matter infere dimensões, tom, ritmo, vocabulário. Tudo vai pro Ori sem a pessoa perceber que está preenchendo perfil.
**Esforço:** Alto (speech-to-text, Claude com transcrição). **Fallback:** onboarding por texto já existe.

### 2.2 · Seleção Visual de Preferências Estéticas

9 arquétipos visuais fixos. Pessoa escolhe 3. Matter constrói mapa de afinidade estética sem filtros explícitos. Alimenta a dimensão 5 (Expressão e Estética).
**Esforço:** Médio. Funciona apenas pra contextos onde atração visual é relevante.

### 2.3 · Feed por Evento e Feed por Área

Feed de evento: fotos, missões, momentos, UGC em tempo real. Feed de área: o que está acontecendo no bairro/cidade agora.
**Esforço:** Médio/Alto. **Valor:** Alto pra retenção entre eventos.

### 2.4 · Mapa de Calor Anônimo

Dentro do lobby de bairro, mostra concentração de pessoas ativas. Sem posição individual. Incentiva deslocamento pra onde tem mais gente.
**Esforço:** Médio. Google Maps JS API + geohashing dos check-ins.

### 2.5 · Gamificação

XP silencioso: serotonina ambiental (glitter, confetti). XP acumula por qualidade de interação, não por volume de matches. **Cuidado validado:** gamificação pode incentivar colecionar conexões em vez de aprofundá-las. O glitter aparece quando uma conexão se sustenta, não quando um match é enviado.
Subfeatures: totens físicos com QR em eventos, desbloqueio de matches via missões, cross-product com ideaXchange (futuro).

### 2.6 · Ori-to-Ori Real

O Ori conversa em nome da pessoa quando offline. Baseado nas dimensões e histórico. Pessoa vê e aprova o que o Ori disse.
**Esforço:** Alto. Prompt engineering complexo, UX de "o que meu Ori disse", consentimento.

### 2.7 · Perfil de Artista/Criador

Visibilidade aumentada, link rastreável com revenue share, dashboard com dados da audiência. Matter conecta criador com pessoas relevantes.
**Esforço:** Médio. Novo role, dashboard extra, tracking de links.

### 2.8 · Follow-up Pós-Evento (Pesquisa Invisível)

Matter entra em contato no dia seguinte, conversacionalmente. Captura dados que nenhuma pesquisa formal capturaria.
**Esforço:** Baixo/Médio. **Valor:** Enorme pra iteração de produto.

### 2.9 · Modelo Relacional no Onboarding

Matter pergunta modelo relacional (monogamia, não-monogamia, etc.) sem julgamento, em linguagem natural. Alimenta a dimensão 6.
**Esforço:** Baixo (campo no perfil + prompt ajustado). **Sensibilidade:** Alta.

---

## Fase 3 · Longo Prazo

| Feature                        | Descrição                                                                | Esforço    |
| ------------------------------ | ------------------------------------------------------------------------ | ---------- |
| App nativo (iOS/Android)       | Necessário pra localização passiva (notificação ao entrar em área ativa) | Muito alto |
| Integração Spotify             | Semântica musical como faceta da dimensão 5 (Expressão). Opt-in.         | Alto       |
| Integração WhatsApp            | Lembretes pós-match. API oficial cara em escala.                         | Médio/Alto |
| Ticket commerce                | Comprar ingresso direto no Sommar. Futuro distante.                      | Muito alto |
| Lobby espontâneo               | 50 pontinhos na praia = evento sem nome. Agregação espontânea visível.   | Médio      |
| API de dados pra organizadores | Endpoint com dados anonimizados pra integração com sistemas do evento.   | Médio      |

---

## Telas (Screen Map)

### Participante · 8 telas · protótipo visual pronto

| #   | Tela                                         | Ref                        |
| --- | -------------------------------------------- | -------------------------- |
| 1   | QR Landing (Matter + Login)                  | `sommar_prototipo_v3.html` |
| 2   | Chat com Matter (onboarding, Ori nasce)      | `sommar_prototipo_v3.html` |
| 3   | Lobby (constelação, toast de match, counter) | `sommar_prototipo_v3.html` |
| 4   | Match (relatório dimensional, quebra-gelo)   | `sommar_prototipo_v3.html` |
| 5   | Match variante (outro contexto dimensional)  | `sommar_prototipo_v3.html` |
| 6   | Chat 1:1 (@matter disponível)                | `sommar_prototipo_v3.html` |
| 7   | Perfil (Ori, 7 dimensões, toggles, stats)    | `sommar_prototipo_v3.html` |
| 8   | Conexões (agrupadas por evento)              | `sommar_prototipo_v3.html` |

### Organizador · 4 telas · especificado

| #   | Tela                                        | Ref                          |
| --- | ------------------------------------------- | ---------------------------- |
| 9   | Login/Cadastro                              | `sommar_organizador_v1.html` |
| 10  | Dashboard (métricas agregadas)              | `sommar_organizador_v1.html` |
| 11  | Criação de evento (contexto pra Matter, QR) | `sommar_organizador_v1.html` |
| 12  | Página pública do evento (share, QR)        | `sommar_organizador_v1.html` |

### Extras · 4 telas · Fase 2

| #   | Tela                             |
| --- | -------------------------------- |
| 13  | Splash/Landing do app            |
| 14  | Pós-evento (follow-up da Matter) |
| 15  | Descoberta de eventos            |
| 16  | Configurações/Conta              |

---

## Schema de Dados (Proposta Inicial)

> Ponto de partida pro Gusta refinar. Supabase/Postgres.
> **Nota:** não existe campo `connection_type` como enum. As dimensões são a base de tudo.

```sql
-- USERS
users (
  id              uuid PRIMARY KEY,
  email           text UNIQUE,
  name            text,
  role            text CHECK (role IN ('participant','organizer','creator')),
  avatar_url      text,

  -- As 7 dimensões do Ori (o coração do modelo)
  ori_dimensions  jsonb NOT NULL DEFAULT '{}',
  -- Estrutura:
  -- {
  --   "values_worldview":     { "signals": [...], "weights": {...} },
  --   "energy_social_style":  { "signals": [...], "weights": {...} },
  --   "knowledge_practice":   { "signals": [...], "weights": {...} },
  --   "life_moment":          { "signals": [...], "weights": {...} },
  --   "expression_aesthetic":  { "signals": [...], "weights": {...} },
  --   "relational_model":     { "signals": [...], "weights": {...} }
  -- }
  -- Dim. 7 (intenção contextual) é por lobby, não por user.

  ori_summary         text,          -- resumo gerado pela Matter
  ori_tone            text,          -- tom detectado no onboarding
  emergency_contacts  jsonb,
  created_at          timestamptz,
  last_active_at      timestamptz
);

-- EVENTS
events (
  id              uuid PRIMARY KEY,
  organizer_id    uuid REFERENCES users(id),
  name            text,
  slug            text UNIQUE,
  description     text,
  location_name   text,
  location_lat    float,
  location_lng    float,
  starts_at       timestamptz,
  ends_at         timestamptz,

  matter_context  text,    -- contexto livre pro Matter (fundamental!)
  -- Ex: "Campus Party Floripa. Evento de tecnologia, inovação, games,
  --  empreendedorismo. 5000 participantes. Faixa etária 18-35.
  --  Camping no local. 5 dias."

  qr_code_url     text,
  status          text CHECK (status IN ('draft','active','ended')),
  created_at      timestamptz
);

-- PARTICIPAÇÃO EM EVENTOS
event_participants (
  id              uuid PRIMARY KEY,
  event_id        uuid REFERENCES events(id),
  user_id         uuid REFERENCES users(id),

  -- Dimensão 7: intenção contextual NESTE evento
  contextual_intent  jsonb,
  -- Ex: { "seeking": "co-founder for climate tech project",
  --       "showing": ["knowledge_practice", "values_worldview"],
  --       "open_to": "anything unexpected" }

  -- Quais dimensões estão visíveis neste contexto
  visible_dimensions  jsonb,

  checked_in_at    timestamptz,
  last_seen_at     timestamptz,
  status           text CHECK (status IN ('active','inactive'))
);

-- LOBBIES (eventos + áreas)
lobbies (
  id              uuid PRIMARY KEY,
  event_id        uuid REFERENCES events(id),  -- null = lobby de área
  area_name       text,
  geohash         text,
  location_lat    float,
  location_lng    float,
  created_at      timestamptz
);

-- MATCHES (dimensional, sem categorias fixas)
matches (
  id                      uuid PRIMARY KEY,
  event_id                uuid REFERENCES events(id),
  lobby_id                uuid REFERENCES lobbies(id),
  user_a_id               uuid REFERENCES users(id),
  user_b_id               uuid REFERENCES users(id),

  -- Quais dimensões mais contribuíram pro match
  top_dimensions          jsonb,
  -- Ex: ["values_worldview", "knowledge_practice", "life_moment"]

  -- Relatório gerado pela Claude API
  compatibility_report    text,

  -- Score dimensional (pra ordenação interna, nunca mostrado ao user)
  dimensional_score       float,

  status      text CHECK (status IN ('suggested','accepted','declined','expired')),
  created_at  timestamptz,
  responded_at timestamptz
);

-- MENSAGENS
messages (
  id          uuid PRIMARY KEY,
  match_id    uuid REFERENCES matches(id),
  sender_id   uuid REFERENCES users(id),
  content     text,
  is_ori      boolean DEFAULT false,   -- true se o Ori mandou
  is_matter   boolean DEFAULT false,   -- true se foi @matter
  created_at  timestamptz
);

-- EMERGÊNCIAS
emergency_alerts (
  id            uuid PRIMARY KEY,
  user_id       uuid REFERENCES users(id),
  event_id      uuid REFERENCES events(id),
  location_lat  float,
  location_lng  float,
  audio_url     text,
  status        text CHECK (status IN ('triggered','acknowledged','resolved')),
  created_at    timestamptz
);
```

### RLS (Row Level Security)

- **Participantes:** veem apenas seus dados, seus matches, suas mensagens.
- **Organizadores:** veem dados agregados do seu evento. Nunca individuais, nunca nomes em métricas.
- **Emergency alerts:** organizador vê alertas do seu evento. Participante vê apenas os seus.

---

## Integrações Externas

### MSP (necessárias pro primeiro evento)

| Serviço                   | Uso                                                |
| ------------------------- | -------------------------------------------------- |
| Supabase Auth             | Login (magic link, OAuth Google)                   |
| Claude API                | Matter (onboarding, relatório, follow-up, @matter) |
| Google Maps Places API    | Seleção de local pra lobby                         |
| QR code gen (server-side) | QR do evento                                       |

### Fase 2+

| Serviço                      | Uso                                         |
| ---------------------------- | ------------------------------------------- |
| Whisper API / Web Speech API | Onboarding por voz                          |
| Twilio                       | SMS pra botão de pânico (contatos externos) |
| Stripe ou similar            | Pagamentos B2B e B2C                        |

### Fase 3+

| Serviço               | Uso                                |
| --------------------- | ---------------------------------- |
| Spotify API           | Dimensão 5 (Expressão) enriquecida |
| WhatsApp Business API | Lembretes pós-match                |

---

## Workflow de Desenvolvimento

```
1. Spec de features e fluxos (este doc + screen map + protótipos)
      ↓
2. Testes automatizados pra cada fluxo (antes do código)
      ↓
3. Claude Code implementa código pra fazer os testes passarem
      ↓
4. Feature a feature, ciclos curtos. Ship incremental.
      ↓
5. Bet valida UX como PM. Gusta valida arquitetura e implementação.
```

---

## Checklist de Pré-Desenvolvimento

```
[ ] Gusta validar/ajustar tech stack
[ ] Definir estrutura exata do JSONB das 7 dimensões
[ ] Decidir granularidade do lobby de área (geohash level, raio)
[ ] Decidir fluxo de auth do participante (magic link vs OAuth vs ambos)
[ ] Definir o que o QR resolve (login + check-in ou só check-in)
[ ] Fechar UI das telas do organizador com Bet
[ ] Validar schema de dados proposto
[ ] Setup do repositório (Next.js 16, Supabase project, Vercel project)
[ ] Criar CLAUDE.md no repo (instruções pro Claude Code)
[ ] Primeiro ciclo: auth + onboarding + criação de Ori
```

---

> Este roadmap é vivo. O brainstorm completo (`sommar_brainstorm_gusta_260327.html`) tem contexto detalhado de cada feature, incluindo citações, debates e riscos.
