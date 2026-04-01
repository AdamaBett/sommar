# Sommar

> Motor de matchmaking para conexão humana real. IA-first, evento-native.

**Stack:** Next.js 14 (App Router) · TypeScript strict · Supabase · Claude API · OpenAI Embeddings · Vercel

**Repo:** github.com/AdamaBett/sommar
**Domínio:** sommar.app
**Equipe:** Bet (PM) + Gusta (dev)

---

## Setup rápido

```bash
# 1. Clone
git clone https://github.com/AdamaBett/sommar.git
cd sommar

# 2. Instala dependências
npm install

# 3. Variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas chaves (ver seção abaixo)

# 4. Roda
npm run dev
```

Abre http://localhost:3000 — funciona em **modo demo sem nenhuma chave configurada**.
Todas as telas têm mock data funcional para validação visual.

---

## Variáveis de ambiente (`.env.local`)

| Variável | Obrigatória pra dev | Onde pegar |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Não (demo mode) | Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Não (demo mode) | Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Não (demo mode) | Supabase dashboard |
| `ANTHROPIC_API_KEY` | Não (mock) | console.anthropic.com |
| `OPENAI_API_KEY` | Não (mock) | platform.openai.com |
| `NEXT_PUBLIC_APP_URL` | Não | `http://localhost:3000` |

Sem nenhuma chave: app roda em modo demo com dados mock em todas as telas.
Com Supabase configurado: auth real, DB real, realtime real.

---

## Comandos

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Build de produção
npm run lint         # ESLint
npm run typecheck    # TypeScript check (deve ser zero erros)
npm run test         # Vitest (unit)
npm run test:e2e     # Playwright (e2e)
```

---

## Todas as rotas (modo demo, sem login necessário)

### Rotas públicas
| Rota | O que é |
|---|---|
| `/` | Landing page (Hero, stats de solidão, como funciona, pitch B2B, captura de email) |
| `/e/sounds-costa-lagoa` | Página pública de evento (SSR, OG tags, feed, social proof) |
| `/login` | Login com Google/email (mock em dev) |

### App (protegido — funciona sem Supabase em modo demo)
| Rota | O que é |
|---|---|
| `/onboarding` | Chat com a Matter (mock), arquétipos estéticos, facetas, Ori Reveal |
| `/lobby` | CosmosLobby interativo (canvas com orbs, sinapses, drag/pan) |
| `/connections` | Matches ativos + conversas + conexões confirmadas |
| `/events` | Discover de eventos (seguidos, próximos, buscar) |
| `/profile` | Perfil, Ori, facetas, stats |
| `/settings` | Privacidade, dados, logout |

### Admin (super-admin)
| Rota | O que é |
|---|---|
| `/dashboard` | Stats gerais + eventos + feed de atividade |
| `/manage-events` | Lista completa de eventos |
| `/users` | Gestão de usuários |
| `/moderation` | Fila de denúncias |

---

## Fluxo completo para validar (modo demo)

```
/ → /login → /onboarding → /lobby → /connections → /events → /e/sounds-costa-lagoa → /profile → /settings → logout → /
```

Todos os links da nav e CTAs estão conectados. Zero dead-ends.

---

## Arquitetura resumida

```
sommar/
├── CLAUDE.md          # Source of truth do produto (ler antes de codar)
├── AGENTS.md          # Como trabalhar no código (invariantes, armadilhas)
├── RESEARCH.md        # Decisões arquiteturais e o que foi rejeitado
├── TODO.md            # Prioridades atuais
├── supabase/
│   └── migrations/    # SQL das 17 tabelas (rodar no Supabase cloud)
└── src/
    ├── app/           # Next.js App Router (rotas)
    ├── components/    # UI organizada por feature
    ├── lib/           # Supabase client, AI wrappers, utils
    ├── hooks/         # React hooks reutilizáveis
    └── types/         # TypeScript types
```

**CLAUDE.md é a fonte suprema de verdade.** Spec completa do produto, schema do banco, design system, regras de negócio. Ler antes de qualquer coisa.

---

## Banco de dados

17 tabelas desenhadas em `supabase/migrations/`. Para rodar localmente:

```bash
npx supabase start   # Requer Docker
npx supabase db push
```

Para gerar os types TypeScript após mudar o schema:

```bash
npx supabase gen types typescript --local > src/lib/database.types.ts
```

---

## Status do projeto (2026-04-01)

- **Visual/UI:** ~92% — todas as telas existem e navegam
- **Backend/Supabase:** ~25% — maioria mock, Supabase não conectado
- **Deploy:** 0% — precisa Vercel + Supabase cloud

Próximo passo de backend: ver `TODO.md` para prioridades atuais.
