# Sommar

> Motor de matchmaking para conexão humana real. IA-first, evento-native.

**Stack:** Next.js 16 (App Router) · TypeScript strict · Supabase · Claude API · OpenAI Embeddings · Vercel

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

Abre http://localhost:3000

---

## Variáveis de ambiente (`.env.local`)

| Variável                        | Onde pegar              |
| ------------------------------- | ----------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase dashboard      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase dashboard      |
| `ANTHROPIC_API_KEY`             | console.anthropic.com   |
| `OPENAI_API_KEY`                | platform.openai.com     |
| `NEXT_PUBLIC_APP_URL`           | `http://localhost:3000` |

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

## Todas as rotas

### Rotas públicas

| Rota                    | O que é                                                                           |
| ----------------------- | --------------------------------------------------------------------------------- |
| `/`                     | Landing page (Hero, stats de solidão, como funciona, pitch B2B, captura de email) |
| `/e/sounds-costa-lagoa` | Página pública de evento (SSR, OG tags, feed, social proof)                       |
| `/login`                | Login com Google/email                                               |

### App (protegido)

| Rota           | O que é                                                             |
| -------------- | ------------------------------------------------------------------- |
| `/onboarding`  | Chat com a Matter (mock), arquétipos estéticos, facetas, Ori Reveal |
| `/lobby`       | CosmosLobby interativo (canvas com orbs, sinapses, drag/pan)        |
| `/connections` | Matches ativos + conversas + conexões confirmadas                   |
| `/events`      | Discover de eventos (seguidos, próximos, buscar)                    |
| `/profile`     | Perfil, Ori, facetas, stats                                         |
| `/settings`    | Privacidade, dados, logout                                          |

### Admin (super-admin)

| Rota             | O que é                                    |
| ---------------- | ------------------------------------------ |
| `/dashboard`     | Stats gerais + eventos + feed de atividade |
| `/manage-events` | Lista completa de eventos                  |
| `/users`         | Gestão de usuários                         |

---