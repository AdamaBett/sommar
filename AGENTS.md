# AGENTS.md — Instruções para Agentes IA

> Este arquivo deve ser lido por QUALQUER agente IA (Claude Code, Codex, Cursor, etc.) antes de escrever uma única linha de código.
> Inspirado por [chenglou/pretext AGENTS.md](https://github.com/chenglou/pretext/blob/main/AGENTS.md).

## Hierarquia de Verdade

1. **CLAUDE.md** — Fonte suprema. Spec completa do produto, schema, design system, regras de negócio.
2. **AGENTS.md** (este arquivo) — Como trabalhar no código. Invariantes, padrões, armadilhas.
3. **RESEARCH.md** — O que já foi tentado e rejeitado. Não repita erros.
4. **TODO.md** — Prioridades atuais e o que está fora de escopo.
5. **Código existente** — Leia antes de mudar. Entenda os padrões.

## Invariantes (NUNCA violar)

### Arquitetura
- Next.js 14 App Router. Nunca Pages Router.
- TypeScript strict. Zero erros em `npm run typecheck` antes de considerar qualquer tarefa completa.
- Supabase para tudo (auth, DB, realtime, storage). Nunca outro backend.
- Todas as páginas protegidas devem funcionar SEM Supabase configurado (modo demo com mock data). Use o padrão `isSupabaseConfigured` com dynamic import.

### Facetas
- São 5 e SOMENTE 5: **Essência**, **Íntimo**, **Criativo**, **Profissional**, **Social**
- IDs no código (keys, tipos): `essencia`, `intimo`, `criativo`, `profissional`, `social`
- Labels para usuário: com acentos corretos (`Essência`, `Íntimo`, etc.)
- Cores: Essência=#1DFFA8, Íntimo=#EC4899, Criativo=#00D4FF, Profissional=#FFB840, Social=#A855F7
- Essência é SEMPRE ativa, sem toggle. As outras 4 são togglable por lobby.
- Dados de faceta são JSONB, nunca enums fixos.

### Identidade e Inclusividade
- A Matter NUNCA presume heterossexualidade, monogamia ou binariedade de gênero.
- Matching Íntimo respeita `interested_in` obrigatoriamente.
- Orientação sexual: default não visível. Gênero: default visível.

### Correio Elegante
- 5 grátis no check-in do evento
- +3 por QR quest escaneado
- R$0,99 por correio adicional
- Chat ativo durante evento + 24h

### UI/Design
- AMOLED true black (#000000). Nunca cinza escuro, nunca off-black.
- Glass cards: `rgba(255,255,255,0.03)` + `backdrop-filter: blur(20px)` + border `rgba(255,255,255,0.06)`
- Fontes: Fraunces (display/serif) + Outfit (body/sans)
- Texto de UI em PT-BR com acentos corretos. Sempre.
- Emojis: com moderação. A Matter usa no máximo 1-2 por mensagem.

### Navegação
- Bottom nav: Lobby | Conexões | Eventos | Perfil (4 tabs) + Matter FAB
- Matter FAB: fixed bottom-right, acima das tabs, z-40

## Padrões de Código

### Novo componente
```typescript
// 1. 'use client' se usa hooks/state/events
'use client';
// 2. Imports organizados: react, next, componentes, lib, types
import { useState } from 'react';
// 3. Interface de props tipada
interface MyComponentProps { ... }
// 4. Export nomeado (nunca default export pra componentes)
export function MyComponent({ ... }: MyComponentProps): JSX.Element {
```

### Nova página (App Router)
```typescript
// Server component por padrão
// Se precisa de Supabase, use o padrão:
const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function Page() {
  if (isSupabaseConfigured) {
    const { createClient } = await import('@/lib/supabase/server');
    // ... real data
  }
  // ... mock data fallback
}
```

### Onde colocar o quê
- Componentes reutilizáveis: `src/components/ui/`
- Componentes de feature: `src/components/{feature}/`
- Hooks: `src/hooks/`
- Tipos: `src/types/`
- Utilitários: `src/lib/`
- Prompts de IA: `src/lib/ai/prompts/`

## Armadilhas Conhecidas

1. **`useSearchParams()` precisa de `<Suspense>`** em páginas que usam. Já causou erro de build.
2. **Route groups `(app)` e `(admin)` não podem ter rotas com mesmo nome** (ex: ambos com `/events`). Admin usa `/manage-events`.
3. **Supabase server client crasha sem env vars** — sempre use dynamic import com check.
4. **Animação CSS `wave-bar`** — definida no tailwind config, não criar aliases diferentes.
5. **`LobbyParticipant` não tem mais `emoji`, `grad`, `glow`, `ring`** — usa `colorA` e `colorB`.

## Como Verificar Seu Trabalho

```bash
npm run typecheck    # DEVE passar com zero erros
npm run lint         # DEVE passar (warnings de <img> ok)
npm run build        # DEVE compilar sem erros
```

## Equipe

- **Bet (Matheus Betinelli)** — PM, não dev. Foco em CRO, jornadas, lógica de negócio, copy. Ele valida todas as telas visualmente.
- **Gusta** — Full-stack dev. Vai integrar backend real. Código precisa estar limpo e pronto.
- **Matter (Claude API)** — IA central do produto. System prompt em `src/lib/ai/prompts/matter-system.ts`.
