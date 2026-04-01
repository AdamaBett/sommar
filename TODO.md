# TODO.md — Prioridades e Escopo

> Atualizado: 2026-04-01
> Lido por agentes IA antes de qualquer trabalho.

## Status Atual: MSP ~65% completo

### Camadas:
- **Visual/UI**: ~92% (todas as telas existem e navegam)
- **Integração backend**: ~25% (maioria é mock, Supabase não conectado)
- **Deploy**: 0% (precisa configurar Vercel + Supabase cloud)

---

## O que foi validado visualmente pelo Bet
- [x] Landing page (9 seções)
- [x] Login
- [x] Onboarding (4 etapas: chat Matter mock, arquétipos, facetas, Ori Reveal)
- [x] CosmosLobby (canvas interativo, orbs, sinapses, drag/pan)
- [x] Conexões
- [x] Eventos (discover)
- [x] Página pública de evento (/e/[slug])
- [x] Perfil
- [x] Settings + logout
- [x] Admin dashboard (super-admin)
- [ ] **Fluxo de organizador — NÃO VALIDADO AINDA** (ver seção abaixo)

---

## Status das telas de Organizador

### O que existe em React (admin route group `/dashboard`)
- `/dashboard` — visão super-admin (stats gerais, todos os eventos, feed de atividade) ✅
- `/manage-events` — lista de todos os eventos (admin) ✅
- `/users` — gestão de usuários ✅
- `/moderation` — fila de denúncias ✅

### O que FALTA (existe só no HTML protótipo `sommar_organizador_v1.html`)
- [ ] **Portal do organizador** — visão separada do super-admin. Organizador vê só os seus eventos.
- [ ] **Criar evento** — formulário completo: nome, slug, datas, cover image, location, ticket URL, `matter_context`, tags, capacidade esperada
- [ ] **Geração de QR code** — QR de check-in por evento, QR de quests
- [ ] **Analytics por evento** — breakdown de participantes, taxa de conexão, correios enviados, facetas mais ativas
- [ ] **Preview da página pública** — organizador vê como ficou o /e/[slug]

> Prioridade: construir após validação visual do Bet nos fluxos existentes.
> Referência: `sommar_organizador_v1.html` na raiz do projeto.

---

## Prioridade ALTA (próximas sessões)

### Frontend — Refinamento Visual
- [ ] CosmosLobby: orbs ainda podem ser maiores e mais vivos
- [ ] Animações de transição entre páginas (fade, slide)
- [ ] Onboarding: trocar chat mock por Matter real (Claude API)
- [ ] Profile: permitir edição de facetas e campos de identidade
- [ ] Evento público (/e/[slug]): melhorar visual do feed
- [ ] Mobile responsiveness: testar em 375px (iPhone) e 390px
- [ ] Correio Chat: tela de conversa ativa com timer anti-ghosting
- [ ] **Fluxo de organizador: criar evento + QR code** (ver seção acima)

### Backend — Integração Supabase
- [ ] Configurar projeto Supabase cloud
- [ ] Rodar migrations (17 tabelas)
- [ ] Conectar EmailCapture ao Supabase (salvar emails de waitlist)
- [ ] Criar endpoint /api/onboarding/complete
- [ ] Conectar onboarding ao Supabase (salvar perfil + Ori)
- [ ] Conectar lobby ao Supabase (real-time presence)
- [ ] Conectar correio ao Supabase (mensagens reais)
- [ ] Conectar perfil ao Supabase (dados reais do usuário)
- [ ] Conectar admin ao Supabase (queries reais)

### Infra — Deploy
- [ ] Push para GitHub (github.com/AdamaBett/sommar) — **primeiro commit pronto**
- [ ] Configurar Vercel (domínio sommar.app)
- [ ] Configurar env vars no Vercel (Supabase, Claude API, OpenAI)
- [ ] Configurar Supabase Auth providers (Google, Apple, Facebook)

## Prioridade MÉDIA

- [ ] RLS policies em todas as tabelas Supabase
- [ ] Testes unitários (Vitest) para matching engine
- [ ] Testes e2e (Playwright) para fluxos principais
- [ ] Matter chat streaming real (Claude API) — modelo a definir (ver RESEARCH.md)
- [ ] Geração real de embeddings (OpenAI)
- [ ] Ice-breaker generation via Claude
- [ ] QR Quest system (scan + reward)
- [ ] Event Feed posting (criar posts, responder, reagir)
- [ ] Push notifications (Correio recebido, match encontrado)
- [ ] Acessibilidade: screen readers, alto contraste, reduce motion (quick wins já feitos)

## Prioridade BAIXA (nice-to-have)

- [ ] Referral system (código + recompensa)
- [ ] Template de eventos (clonar configs)
- [ ] Acessibilidade avançada para neurodivergentes
- [ ] Internacionalização (EN além de PT-BR)
- [ ] PWA (install prompt, offline support)
- [ ] Analytics dashboard real para organizadores

## FORA DE ESCOPO (MSP)

- Geolocalização automática (privacy by design)
- Swipe mechanic (anti-Sommar)
- Video chat
- Marketplace de ingressos
- Gamificação agressiva (streaks, leaderboards)
- App nativo (iOS/Android) — PWA primeiro
