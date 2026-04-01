# TODO.md — Prioridades e Escopo

> Atualizado: 2026-04-01 (Sessão 3)
> Lido por agentes IA antes de qualquer trabalho.

## Status Atual: MSP ~65% completo

### Camadas:
- **Visual/UI**: ~92% (todas as telas existem e navegam)
- **Integração backend**: ~25% (maioria é mock, Supabase não conectado)
- **Deploy**: sommar.app no ar com landing nova, auth quebrado sem env vars

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

- [ ] **Prompts de onboarding com facetas erradas** — `src/lib/ai/prompts/onboarding.ts` usa "Romântico, Amizade, Profissional, Organizador" em vez de "Essência, Íntimo, Criativo, Profissional, Social". Fix urgente.
- [ ] **Middleware redirect** — garantir que callback redireciona para `/e/[slug]` quando usuário veio de página de evento

---

## Prioridade ALTA — Matter real no onboarding

- [ ] Conectar `OnboardingChat.tsx` ao endpoint `/api/matter/route.ts` (hoje usa mock responses)
- [ ] Implementar streaming de resposta (SSE) para evitar delay de resposta completa antes de exibir
- [ ] Injetar dados do Google (nome, has_photo) no contexto da Matter antes da 1ª mensagem
- [ ] Corrigir prompts de onboarding (`onboarding.ts`): facetas corretas + tom correto

---

## Prioridade ALTA — Extraction Layer (coração do produto)

- [ ] Criar `src/lib/ai/extraction.ts` — call assíncrono com Haiku após cada mensagem do usuário
- [ ] Criar prompt de extração em `src/lib/ai/prompts/extraction.ts` com JSON schema de saída
- [ ] Formato de saída esperado:
  ```json
  {
    "facet_data": { "essencia": {...}, "intimo": {...}, ... },
    "identity": { "gender": null, "interested_in": ["todos"] },
    "completeness_score": 0.28,
    "confidence": "medium"
  }
  ```
- [ ] Implementar merge incremental no `facet_data` JSONB (nunca substituir, sempre fazer merge)
- [ ] Criar endpoint `/api/onboarding/extract` para rodar extração server-side
- [ ] Disparar extração em background após cada resposta da Matter (não bloquear a conversa)
- [ ] Usar `completeness_score >= 0.65` como trigger para o Ori Reveal
- [ ] Quando score >= 0.65: chamar `ori-narrative.ts` → gerar narrativa por faceta
- [ ] Gerar embedding via OpenAI text-embedding-3-small do texto consolidado
- [ ] Salvar embedding no campo `vector(1536)` da tabela `oris`
- [ ] Trigger do Ori Reveal na UI quando threshold atingido

---

## Prioridade ALTA — Portal do Organizador

> Referência visual: `docs/sommar_organizador_v1.html`
> Rota: `/organizer` ou grupo de rotas separado do super-admin `/dashboard`

- [ ] Criar rota `/organizer` com layout separado (sem bottom nav do app, com nav de organizador)
- [ ] **Criar evento** — formulário completo:
  - Nome, slug, descrição, cover image
  - `matter_context` (campo de texto livre, crucial — é o que a Matter usa para contextualizar)
  - Data/hora início e fim
  - Localização (nome manual, sem GPS automático)
  - Link de ingressos externo (opcional)
  - Capacidade esperada
  - Tags
- [ ] **QR code de check-in** — gerar após criar evento. Exibir para organizer imprimir/exibir no local.
- [ ] **QR quests** — criar QRs adicionais espalhados pelo evento (+3 correios cada)
- [ ] **Analytics por evento** (post-event):
  - Total de participantes com check-in
  - Taxa de conexão (% que enviou pelo menos 1 Correio)
  - Distribuição de facetas ativas
  - Top combos de facetas nos matches
  - Conexões confirmadas
  - Correios enviados por hora (gráfico de engajamento)
- [ ] **Preview da página pública** antes de publicar (`/e/[slug]`)
- [ ] **Safety alerts** — aba de segurança no portal do organizador com alertas em tempo real
- [ ] Garantir que organizer só vê seus próprios eventos (RLS + middleware check)

---

## Prioridade ALTA — Telemetria

- [ ] Instalar Vercel Analytics (1 linha no layout.tsx)
- [ ] Instalar PostHog (npm install posthog-js)
- [ ] Criar `src/lib/analytics.ts` — wrapper para `posthog.capture()` com tipos
- [ ] Instrumentar landing page:
  - `landing_viewed`, `hero_cta_clicked`, `section_viewed`, `mid_cta_clicked`, `final_cta_clicked`, `organizer_cta_clicked`
- [ ] Instrumentar auth:
  - `login_page_viewed`, `google_login_started`, `google_login_completed`, `login_failed`
- [ ] Instrumentar onboarding:
  - `onboarding_started`, `onboarding_message_sent` (turn number, sem conteúdo), `ori_reveal_triggered`, `onboarding_completed` (com completeness_score + tempo total), `onboarding_abandoned` (em qual etapa)
- [ ] Instrumentar lobby:
  - `lobby_viewed`, `correio_intent`, `correio_sent`, `match_toast_seen`
- [ ] Instrumentar Matter FAB:
  - `matter_fab_opened`, `matter_panel_closed`
- [ ] Adicionar opt-out de analytics em Configurações (toggle + chamada `posthog.opt_out_capturing()`)
- [ ] JAMAIS logar conteúdo de mensagens nos eventos de analytics

---

## Prioridade ALTA — Segurança (Botão de Pânico)

- [ ] Criar migration `safety_alerts` table (schema em CLAUDE.md)
- [ ] Criar componente `SafetyButton.tsx` — botão discreto, requer confirmação dupla
- [ ] Adicionar botão em: CorreioChat.tsx, PersonPopup.tsx (menu de contexto), configurações rápidas
- [ ] Criar endpoint `/api/safety/alert` — salva alerta + notifica organizador do evento
- [ ] Notificação para organizador: push (se PWA) + email via Supabase
- [ ] Alertas visíveis no portal do organizador em tempo real
- [ ] Alertas visíveis no dashboard interno (admin.sommar.app)
- [ ] Block automático disponível junto com o alerta

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
