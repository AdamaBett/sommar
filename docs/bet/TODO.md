# TODO.md — Prioridades e Escopo

> Atualizado: 2026-04-03 (Sessão 4)
> Lido por agentes IA antes de qualquer trabalho.

## Status Atual: MSP ~78% completo

### Camadas:
- **Visual/UI**: ~96% (todas as telas existem, portal do organizador completo)
- **Integração backend**: ~45% (extraction layer, Matter streaming, safety alerts, APIs prontas)
- **Segurança**: ~80% (headers CSP/HSTS, rate limiting, input sanitization, profanity filter)
- **Telemetria**: ~70% (PostHog + Vercel Analytics wired, eventos tipados, falta instrumentar componentes)
- **Deploy**: sommar.app no ar, auth depende de Supabase cloud + Google OAuth (ação manual do time)

---

## PRIORIDADE MÁXIMA — Fazer login funcionar

> Sem isso, ninguém pode usar o produto. É o bloqueador de tudo.

- [ ] Criar projeto Supabase cloud (supabase.com → New Project)
- [ ] Rodar migrations em ordem (pasta `supabase/migrations/`)
- [ ] Habilitar pgvector extension no Supabase
- [ ] Configurar Google OAuth no Supabase Auth:
  - Criar projeto no Google Cloud Console
  - Habilitar Google+ API
  - Criar OAuth 2.0 credentials
  - Callback URL: `https://[project].supabase.co/auth/v1/callback`
  - Copiar Client ID + Client Secret para Supabase Auth settings
- [ ] Adicionar env vars na Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ANTHROPIC_API_KEY`
  - `OPENAI_API_KEY`
- [ ] Configurar Node.js 22 LTS na Vercel (Settings → General → Node.js Version)
- [ ] Testar fluxo completo: Google login → callback → onboarding → lobby
- [ ] Configurar RLS policies em todas as tabelas

---

## Bugs em produção (sommar.app) — corrigir junto com login

- [x] **Prompts de onboarding com facetas erradas** — CORRIGIDO (Sessão 4). Agora usa Essência, Íntimo, Criativo, Profissional, Social.
- [ ] **Middleware redirect** — garantir que callback redireciona para `/e/[slug]` quando usuário veio de página de evento

---

## Prioridade ALTA — Matter real no onboarding

- [x] Conectar `OnboardingChat.tsx` ao endpoint `/api/matter/route.ts` — DONE (Sessão 4)
- [x] Implementar streaming de resposta (SSE) — DONE. Route handler reescrito com streaming via ReadableStream.
- [ ] Injetar dados do Google (nome, has_photo) no contexto da Matter antes da 1ª mensagem
- [x] Corrigir prompts de onboarding (`onboarding.ts`): facetas corretas — DONE
- [x] Hook `useMatter.ts` criado com streaming real + fallback mock — DONE
- [ ] Integrar `useMatter` hook no `OnboardingFlow.tsx` (substituir simulação por hook real)

---

## Prioridade ALTA — Extraction Layer (coração do produto)

- [x] Criar `src/lib/ai/extraction.ts` — DONE (Sessão 4). Call assíncrono com Haiku.
- [x] Criar prompt de extração em `src/lib/ai/prompts/extraction.ts` — DONE
- [x] Implementar merge incremental no `facet_data` JSONB — DONE
- [x] Criar endpoint `/api/onboarding/extract` — DONE
- [x] Disparar extração em background após cada resposta (via `useMatter` hook) — DONE
- [x] Usar `completeness_score >= 0.65` como trigger — IMPLEMENTADO no hook
- [ ] Quando score >= 0.65: chamar `ori-narrative.ts` → gerar narrativa por faceta (prompt pronto, falta wiring)
- [ ] Gerar embedding via OpenAI text-embedding-3-small do texto consolidado
- [ ] Salvar embedding no campo `vector(1536)` da tabela `oris`
- [ ] Trigger do Ori Reveal na UI quando threshold atingido

---

## Prioridade ALTA — Portal do Organizador

> Referência visual: `docs/sommar_organizador_v1.html`
> Rota: `/organizer` (grupo de rotas separado do super-admin `/dashboard`)

- [x] Criar rota `/organizer` com layout separado — DONE (Sessão 4)
- [x] **Criar evento** — formulário completo com nome, slug, descrição, matter_context, datas, local, tickets, capacidade, tags — DONE
- [ ] **QR code de check-in** — placeholder criado, falta integrar biblioteca de QR
- [ ] **QR quests** — criar QRs adicionais espalhados pelo evento (+3 correios cada)
- [x] **Analytics por evento** — DONE. Página com stats, distribuição de facetas, top combos, engajamento por hora.
- [x] **Preview da página pública** — link direto para `/e/[slug]` no analytics — DONE
- [x] **Safety alerts** — aba de segurança no portal com alertas em tempo real — DONE
- [x] API `/api/organizer/events` (POST criar, GET listar) — DONE com validação e RLS
- [ ] Conectar telas do portal ao Supabase real (hoje usa mock data)

---

## Prioridade ALTA — Telemetria

- [x] Instalar Vercel Analytics — DONE (Sessão 4). `<Analytics />` no root layout.
- [x] Instalar PostHog (posthog-js) — DONE
- [x] Criar `src/lib/analytics.ts` — DONE. Wrapper tipado com todos os eventos do funil.
- [x] Criar `AnalyticsProvider.tsx` — DONE. Inicializa PostHog no client.
- [x] Opt-out de analytics (`optOutAnalytics()`, `optInAnalytics()`) — DONE
- [ ] Instrumentar landing page (adicionar `trackEvent()` nos componentes)
- [ ] Instrumentar auth
- [ ] Instrumentar onboarding
- [ ] Instrumentar lobby
- [ ] Instrumentar Matter FAB
- [ ] Adicionar toggle de opt-out na tela de Configurações
- [x] JAMAIS logar conteúdo de mensagens — regra baked no tipo `AnalyticsEvent`

---

## Prioridade ALTA — Segurança (Botão de Pânico)

- [x] Criar migration `safety_alerts` table — DONE (Sessão 4). `00002_safety_alerts.sql` com RLS.
- [x] Criar componente `SafetyButton.tsx` — DONE. Discreto, confirmação dupla, formulário opcional.
- [ ] Adicionar botão em: CorreioChat.tsx, PersonPopup.tsx (menu de contexto), configurações rápidas
- [x] Criar endpoint `/api/safety/alert` — DONE. Salva alerta + notifica organizador.
- [ ] Notificação para organizador: push (se PWA) + email via Supabase Edge Function
- [x] Alertas visíveis no portal do organizador — DONE (`/organizer/safety`)
- [ ] Alertas visíveis no dashboard interno (admin.sommar.app)
- [ ] Block automático disponível junto com o alerta

### Segurança adicional implementada (Sessão 4):
- [x] Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- [x] Rate limiting em todas as APIs (Matter, extraction, safety, organizer)
- [x] Input sanitization (remove HTML, scripts, event handlers)
- [x] Profanity filter server-side
- [x] UUID validation helper
- [x] Slug sanitization

---

## Prioridade MÉDIA — Dashboard Interno (admin.sommar.app)

> Para Bet + Gusta. Separado do portal do organizador.

- [ ] Criar rota `/admin` com auth por lista branca de emails (role = 'superadmin')
- [ ] **Saúde do sistema:** API costs por dia (Claude tokens, OpenAI tokens), erros recentes, latência
- [ ] **Usuários:** total criados, taxa de onboarding completado, completeness score médio
- [ ] **Eventos:** todos os eventos de todos os organizadores, participantes, taxa de matching
- [ ] **Moderação:** fila de denúncias pendentes, safety alerts ativos, blocks recentes
- [ ] **Funil de conversão:** landing_viewed → correio_sent (com taxas em cada etapa)
- [ ] **Qualidade da IA:** Ori Reveals (%age), ice-breakers aceitos vs. recusados

---

## Prioridade MÉDIA — Continuidade da Matter

- [ ] Matter no lobby/outras telas: injetar Ori atual completo no contexto de cada sessão
- [ ] Continuous improvement: toda conversa pós-onboarding roda extração → atualiza Ori se delta > 0.1
- [ ] Versionamento do Ori: incrementar `version` a cada atualização significativa
- [ ] Persistência do histórico: salvar últimas 20 mensagens por usuário no Supabase

---

## Prioridade MÉDIA — Frontend refinamento

- [ ] CosmosLobby: orbs maiores e mais vivos
- [ ] Lobby Tier 1 (pre-event preview): modo "interesse confirmado, QR ainda não escaneado"
- [ ] Animações de transição entre páginas
- [ ] Profile: edição direta de facetas e campos de identidade (sem depender da Matter)
- [ ] Mobile responsiveness: testar em 375px e 390px
- [ ] Correio Chat: tela de conversa ativa com timer anti-ghosting
- [ ] Página do evento (/e/[slug]): melhorar visual do feed

---

## Prioridade BAIXA

- [ ] Testes unitários (Vitest) para extraction layer e matching engine
- [ ] Testes e2e (Playwright): login → onboarding → Ori → lobby → correio
- [ ] Ice-breaker generation via Haiku (conectar real)
- [ ] Lobby realtime presence (Supabase Realtime)
- [ ] QR Quest system (scan QR → +3 correios)
- [ ] Event Feed posting real
- [ ] Push notifications (Correio recebido, match encontrado)
- [ ] Referral system (código + recompensa)
- [ ] Template de eventos (clonar configs)
- [ ] PWA (install prompt, offline support)

---

## Infra — Deploy e Branch Workflow

- [ ] Trabalhar em feature branches a partir de agora:
  - `feat/supabase-setup` — Supabase cloud + auth
  - `feat/matter-real` — Matter real + extraction layer
  - `feat/organizer-portal` — portal do organizador
  - `feat/telemetry` — PostHog + eventos
  - `feat/safety-button` — botão de pânico
- [ ] Node.js 22 LTS na Vercel (trocar de 24.x)
- [ ] Configurar preview deployments para PRs (já deve funcionar com Vercel, confirmar)

---

## Status das telas de Organizador

### O que existe em React (super-admin `/dashboard`)
- `/dashboard` — painel super-admin (stats gerais, todos os eventos, atividade) ✅
- `/manage-events` — lista gerenciável de eventos ✅
- `/users` — gestão de usuários ✅
- `/moderation` — fila de denúncias ✅
- **Bet ainda não validou essas telas visualmente**
- **ATENÇÃO:** Essas são telas de SUPER-ADMIN (Bet+Gusta), não de organizador. O portal do organizador ainda precisa ser construído.

### O que FALTA (só existe no HTML protótipo `docs/sommar_organizador_v1.html`)
- [ ] Portal do organizador separado (`/organizer`) — ver itens em "Prioridade ALTA" acima

---

## FORA DE ESCOPO (MSP)

- Geolocalização automática (privacy by design — sempre manual)
- Swipe mechanic (anti-Sommar)
- Video chat
- Marketplace de ingressos
- Gamificação agressiva (streaks, leaderboards)
- App nativo iOS/Android (PWA primeiro)
- Integração com redes sociais além do login
- Internacionalização (EN) no MSP

---

## Documentação adicional do Bet

Para arquivos de estratégia, análise de mercado, notas de produto, pesquisas de eventos brasileiros: usar a pasta `docs/product/`. Criar conforme necessário. Nunca no root do repo.
