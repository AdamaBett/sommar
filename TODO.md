# TODO.md — Prioridades e Escopo

> Atualizado: 2026-04-01
> Lido por agentes IA antes de qualquer trabalho.

## Status Atual: MSP ~65% completo

### Camadas:
- **Visual/UI**: ~92% (todas as telas existem e navegam)
- **Integração backend**: ~25% (maioria é mock, Supabase não conectado)
- **Deploy**: sommar.app no ar ✅, mas auth quebrado sem env vars

---

## Bugs em produção (sommar.app) — corrigir primeiro

- [ ] **CTA "Descubra" na landing** salta para o email capture (fundo da página) em vez de rolar suavemente para a próxima seção. Fix: mudar o `scrollIntoView` target de `#comecar` para o ID da seção de problema (`#problema` ou similar).
- [ ] **Login com Google quebra** — Supabase não está configurado na Vercel (sem env vars). Precisa: criar projeto Supabase cloud → configurar Google OAuth → adicionar env vars na Vercel.
- [ ] **Email capture é fake** — `setTimeout` simulando sucesso, nenhum email é salvo em lugar nenhum. Comentário no código diz "Simulação de envio". Precisa conectar ao Supabase ou remover.
- [ ] **Prompts de onboarding com facetas erradas** — `onboarding.ts` usa "Romântico, Amizade, Profissional, Organizador" em vez de "Essência, Íntimo, Criativo, Profissional, Social". Corrigir para match com CLAUDE.md.

---

## Decisões de produto pendentes (Bet decidir)

- [ ] **Email capture na landing: manter ou substituir?**
  - Opção A: Substituir por CTA direto de criar conta (recomendado para o piloto)
  - Opção B: Manter como waitlist real (precisa salvar no Supabase) com copy específico do evento
  - Se mantiver: mudar copy de "vagas limitadas" para algo vinculado ao Sounds in da City
- [ ] **Seção final da landing:** Repensar. Atualmente é email capture genérico. Para um piloto com data e evento específico, deveria ser um CTA urgente e contextualizado.

---

## Prioridade ALTA — Backend/Auth

### Supabase cloud
- [ ] Criar projeto Supabase cloud
- [ ] Rodar migrations (17 tabelas + pgvector)
- [ ] Configurar RLS em todas as tabelas
- [ ] Adicionar env vars na Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Auth
- [ ] Configurar Google OAuth no Supabase Auth (client ID + secret do Google Cloud Console)
- [ ] Testar fluxo completo: Google login → callback → onboarding → lobby
- [ ] Configurar email OTP (magic link) — alternativa para quem não usa Google
- [ ] Middleware: garantir que callback redireciona para evento de origem quando veio de `/e/[slug]`

### Matter real no onboarding
- [ ] Adicionar `ANTHROPIC_API_KEY` nas env vars da Vercel
- [ ] Conectar `OnboardingChat.tsx` ao endpoint `/api/matter/route.ts` (hoje usa mock)
- [ ] Injetar dados do Google (nome, has_photo) no contexto da Matter pré-conversa
- [ ] Corrigir prompts de onboarding (`onboarding.ts`): nomes corretos das facetas
- [ ] Implementar streaming de resposta (evitar delay de resposta inteira antes de mostrar)

### Extraction layer (coração do produto)
- [ ] Criar `src/lib/ai/extraction.ts` — call assíncrono com Haiku após cada mensagem do usuário
- [ ] Definir JSON schema de saída da extração (facet_data parcial + identity + completeness_score)
- [ ] Implementar merge incremental no `facet_data` JSONB (merge, não substituição)
- [ ] Criar endpoint `/api/onboarding/extract` para rodar extração server-side
- [ ] Conectar: após cada resposta da Matter, disparar extração em background
- [ ] Usar `completeness_score >= 0.65` como trigger para o Ori Reveal
- [ ] Criar prompt de extração em `src/lib/ai/prompts/extraction.ts`

### Geração do Ori
- [ ] Quando `completeness_score >= 0.65`: chamar `ori-narrative.ts` para gerar narrativa por faceta
- [ ] Gerar embedding via OpenAI (`text-embedding-3-small`) do texto consolidado do perfil
- [ ] Salvar embedding no campo `vector(1536)` da tabela `oris`
- [ ] Salvar narrativa no campo `narrative` JSONB da tabela `oris`
- [ ] Trigger do Ori Reveal na UI quando score atinge threshold

---

## Prioridade ALTA — Continuidade da Matter

- [ ] **Matter no lobby/outras telas:** injetar Ori atual no contexto de cada sessão
- [ ] **Continuous improvement:** toda conversa com a Matter (pós-onboarding) roda extração → atualiza Ori se delta > 0.1
- [ ] **Versionamento do Ori:** incrementar `version` a cada atualização significativa
- [ ] **Estado persistente:** salvar histórico de conversa com Matter no Supabase (últimas 20 mensagens por usuário)

---

## Prioridade ALTA — Frontend refinamento

- [ ] CosmosLobby: orbs maiores e mais vivos
- [ ] Animações de transição entre páginas (fade, slide)
- [ ] Profile: edição direta de facetas e campos de identidade (sem depender da Matter)
- [ ] Evento público (/e/[slug]): melhorar visual do feed
- [ ] Mobile responsiveness: testar em 375px e 390px
- [ ] Correio Chat: tela de conversa ativa com timer anti-ghosting

---

## Prioridade MÉDIA

- [ ] Testes unitários (Vitest) para extraction layer e matching engine
- [ ] Testes e2e (Playwright) para fluxo completo: login → onboarding → Ori → lobby
- [ ] Ice-breaker generation via Haiku (não Sonnet — tarefa simples)
- [ ] Correio mensagens reais (salvar no Supabase)
- [ ] Lobby realtime presence (Supabase Realtime)
- [ ] QR Quest system (scan QR → +3 correios)
- [ ] Event Feed posting real (criar posts, responder, reagir)
- [ ] Push notifications (Correio recebido, match encontrado)
- [ ] Email capture → Supabase (se decisão for manter)

---

## Status das telas de Organizador

### O que existe em React (admin route group `/dashboard`)
- `/dashboard` — painel super-admin (stats gerais, todos os eventos, atividade) ✅
- `/manage-events` — lista gerenciável de eventos ✅
- `/users` — gestão de usuários ✅
- `/moderation` — fila de denúncias ✅
- **Bet ainda não validou essas telas visualmente**

### O que FALTA (só existe no HTML protótipo `docs/sommar_organizador_v1.html`)
- [ ] Portal do organizador — visão separada do super-admin. Organizer vê só seus eventos.
- [ ] Criar evento — formulário completo com `matter_context`, cover image, datas, QR, capacidade
- [ ] Geração de QR code — check-in + quests
- [ ] Analytics por evento — breakdown de participantes, taxa de conexão, facetas mais ativas
- [ ] Preview da página pública antes de publicar

---

## Infra — Deploy

- [ ] Configurar env vars completas na Vercel (Supabase + Anthropic + OpenAI)
- [ ] Node.js version na Vercel: trocar de 24.x para 22 LTS (alinhado com CLAUDE.md)
- [ ] Configurar Supabase Auth providers (Google, Apple/email)

---

## Prioridade BAIXA (nice-to-have)

- [ ] Referral system (código + recompensa)
- [ ] Template de eventos (clonar configs)
- [ ] Acessibilidade avançada para neurodivergentes
- [ ] Internacionalização (EN além de PT-BR)
- [ ] PWA (install prompt, offline support)
- [ ] Analytics dashboard real para organizadores

---

## FORA DE ESCOPO (MSP)

- Geolocalização automática (privacy by design)
- Swipe mechanic (anti-Sommar)
- Video chat
- Marketplace de ingressos
- Gamificação agressiva (streaks, leaderboards)
- App nativo (iOS/Android) — PWA primeiro
