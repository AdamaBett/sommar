# RESEARCH.md — O que foi tentado, o que funcionou, o que não funcionou

> Documento vivo. Toda decisão significativa, abordagem testada, ou ideia rejeitada deve ser registrada aqui.
> Inspirado por [chenglou/pretext RESEARCH.md](https://github.com/chenglou/pretext/blob/main/RESEARCH.md).
> Objetivo: evitar que agentes IA ou devs repitam erros ou explorem caminhos já descartados.

## Decisões de Arquitetura

### Facetas como JSONB, não enums ✅
**Tentado:** Enums PostgreSQL para tipos de faceta.
**Resultado:** Rejeitado. JSONB permite expansão sem migrations. As 5 facetas (Essência, Íntimo, Criativo, Profissional, Social) são chaves fixas, mas o conteúdo dentro é livre.
**Por quê:** Flexibilidade > rigidez nesse estágio. Novos campos dentro de uma faceta não exigem ALTER TABLE.

### Grid hexagonal no lobby → Cosmos canvas ✅
**Tentado:** Grid hexagonal CSS com ProfileCircle components.
**Resultado:** Substituído pelo CosmosLobby (canvas interativo). Grid mantido como vista alternativa.
**Por quê:** O cosmos transmite a filosofia do produto (Oris como estrelas buscando conexão). Grid é funcional mas não emocional. Cosmos é a experiência default; grid é fallback de acessibilidade.

### Emojis nos perfis do lobby → Removidos ✅
**Tentado:** Cada participante tinha um emoji representativo (🌿, 💻, etc.).
**Resultado:** Removidos. Orbs agora são estrelas com gradientes de duas cores (colorA/colorB).
**Por quê:** Emojis poluíam a experiência cosmos e quebravam a imersão. Gradientes transmitem individualidade sem ser literal.

### Nomes de facetas antigos → Corrigidos ✅
**Tentado:** Base, Romântico, Amizade, Profissional, Organizador.
**Resultado:** Corrigido para Essência, Íntimo, Criativo, Profissional, Social (CLAUDE.md).
**Por quê:** Os nomes antigos confundiam facetas (camadas da pessoa) com tipos de conexão (o que emerge do match). "Romântico" é um tipo de conexão, não uma faceta. "Íntimo" é a faceta que, quando ativa, pode gerar conexão romântica.

### Social proof com número fake → Removido ✅
**Tentado:** "Junte-se a 127 pessoas interessadas" (hardcoded).
**Resultado:** Substituído por "Vagas limitadas no acesso antecipado."
**Por quê:** Mentir pros usuários é anti-Sommar. FOMO real > números falsos.

### Preço do Correio
**Tentado:** "Primeiro correio grátis. A partir do segundo, R$2,99"
**Resultado:** Corrigido para "5 grátis no check-in + R$0,99 por adicional" (CLAUDE.md).
**Por quê:** Preço mais baixo reduz fricção. 5 grátis incentiva experimentação.

### 3 tabs → 4 tabs no bottom nav ✅
**Tentado:** Lobby, Eventos, Perfil (3 tabs).
**Resultado:** Lobby, Conexões, Eventos, Perfil (4 tabs).
**Por quê:** Pesquisa de concorrentes mostrou que TODOS os apps de conexão têm uma aba dedicada a matches/conversas. Sem isso, o usuário não sabe onde encontrar suas conexões. A pesquisa do Hinge mostrou que "Your Turn" indicators reduzem ghosting em 25%.

## Pesquisa de Concorrentes (Resumo)

### O que Sommar faz MELHOR que todos:
1. **Contexto de evento** — Nenhum concorrente conecta matching a eventos presenciais reais.
2. **Facetas multi-modal** — Mais elegante que Bumble Date/BFF/Bizz. Um Ori, múltiplas camadas.
3. **Anti-ghosting sistêmico** — Timers, Matter nudges, expiração, re-enable. Mais completo que Hinge.
4. **"POR QUÊ"** — Mostra por que duas pessoas devem se conhecer, não só quem.

### O que Sommar aprende dos concorrentes:
- **Hinge:** "Your Turn" indicator, prompts específicos, like algo específico (não a pessoa toda).
- **Bumble:** Multi-modal funciona (50% mais retenção). Mas não destruir dados ao trocar modo.
- **LinkedIn:** Mostrar razão transparente pra conexão. Notificações contextuais.
- **Tinder:** Rejeição oculta protege emocional. Reward variable creates return.
- **Meetup:** Visibilidade de quem vai. RSVP simples.

## Abordagens NÃO Exploradas (Fora de Escopo MSP)

- Geolocalização automática (privacidade > conveniência)
- Swipe mechanic (anti-Sommar, reduz pessoa a foto)
- Gamificação agressiva (streaks, etc.) — talvez no futuro, com cuidado
- Marketplace de eventos (MSP foca em conexão, não venda de ingressos)
- Vídeo chat (complexidade desnecessária no MSP)
