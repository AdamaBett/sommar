# CRO.md — Melhores Práticas de Conversão, UX e Design

> Compilado em 2026-04-01. Referência para todas as decisões de produto, copy e UI do Sommar.
> Fontes: Unbounce, Omnius, Arclen, Userflow, Userpilot, VWO, AppInventiv + pesquisa primária.

---

## 1. CRO — Landing Page

### Benchmarks
- SaaS: taxa de conversão base de 3,8% (média geral: 6,6%)
- Taxa de ativação média: 37,5% (63% dos usuários nunca chegam ao "aha moment")
- **Melhorar ativação em 25% gera 34% mais receita**

### Alavancas críticas

| Alavanca | Impacto | Ação |
|---|---|---|
| Formulários com 3-5 campos | +120% conversão vs. 11 campos | Nunca pedir mais do que o essencial |
| Velocidade < 2s | 3x mais conversões que 5s | Otimizar imagens, CDN, lazy load |
| Copy em linguagem simples (nível 5°-7° ano) | 6x mais conversão que linguagem técnica | Frases curtas, voz ativa, benefícios > features |
| CTAs personalizados | 202% melhor que CTAs genéricos | Copy único por contexto de seção |
| Social proof acima da dobra | Previne abandono imediato | Pelo menos 1 trust signal visível sem scroll |

### Ordem ideal das seções
1. **Hero** — headline, subheadline, visual, CTA principal
2. **Proposta de valor** — 2-3 benefícios principais
3. **Social proof** — depoimentos, contadores, logos
4. **Como funciona** — 3-5 passos, visual de progresso
5. **Social proof secundário** — caso de uso específico
6. **CTA do meio** — para quem chegou até aqui mas não converteu ainda
7. **Para segmento específico** (ex: organizadores)
8. **CTA final** — headline forte + CTA grande + escape secundário
9. **Footer**

**Regra:** nenhum usuário deve rolar mais de 2 seções sem ver um CTA.

---

## 2. CTAs — Copy e Design

### Fórmula
```
[Verbo de ação] + [Benefício/resultado] + [modificador opcional]
```

### Verbos que convertem
- **Descoberta:** Encontrar, Ver, Descobrir, Explorar
- **Ação:** Criar, Começar, Entrar, Experimentar
- **Benefício:** Acessar, Desbloquear, Garantir
- **EVITAR:** Enviar, Clique aqui, Próximo, Ok, Continuar genérico

### Especificidade faz diferença
- "Compre agora" → "Encontre o presente perfeito pra ela" = +82% CTR
- CTAs genéricos: 2-4% conversão
- CTAs específicos e contextuais: 6-12% conversão

### Design do botão
- **Tamanho mínimo:** 44×44px (Apple) / 48×48px (Google) — crítico em mobile
- **Cor:** Neon/vibrante em fundo escuro — o contraste é o que vende
- **Contraste WCAG AA:** mínimo 4.5:1 para texto normal
- **Estados obrigatórios:** default, hover, active, disabled
- **Animação:** sutil pulse no hover (opacity 100%→80%→100%, 1.5s)
- **Neon glow:** `box-shadow: 0 0 20px rgba(cor, 0.3)` — só em CTAs primários

### Copy por posição na LP
| Posição | Contexto do usuário | Copy recomendado |
|---|---|---|
| Hero | Chegou agora, não sabe nada | "Criar meu Ori" — específico, curioso |
| Após problema | Identificou a dor | "Chega de scroll. Começa a conectar." |
| Após como funciona | Entendeu o produto | "Já vi o suficiente. Quero entrar." |
| Final | Leu tudo, está convencido ou saindo | "Criar meu Ori agora" com urgência visual |

---

## 3. Onboarding — Boas Práticas

### Impacto
- Bom onboarding melhora retenção em **50%**
- 74% dos usuários abandonam se o onboarding for complicado demais
- 63% dos clientes citam onboarding como fator decisivo na assinatura

### Princípios
- **3-7 telas no máximo** — cada tela = 1 ação
- **< 2 minutos** para o onboarding essencial
- **Progresso visível** (barra, dots ou "2/5") reduz abandono
- **Opção de pular** em toda tela — paradoxalmente, aumenta completion rate
- **Divulgação progressiva** — mostra 1 coisa por vez, nunca formulário longo
- **Ajuda contextual** — aparece no momento de necessidade, não antes
- **1-2 perguntas de qualificação** no início → segmenta a experiência

### Para o Sommar especificamente
- Onboarding conversacional (Matter) > formulário = menor percepção de esforço
- Mostrar progresso do Ori durante a conversa (completeness_score visual)
- Nunca perguntar o que já sabemos (Google nos deu o nome → usar)
- Primeiro "aha moment" = ver o Ori nascer → deve acontecer em < 5 minutos
- Permissões (faceta Íntimo, por exemplo) devem explicar o benefício antes de pedir

---

## 4. Design Dark/AMOLED

### Paleta
- **Fundo primário:** `#000000` (AMOLED true black — economiza bateria em OLED)
- **Surfaces elevadas:** `rgba(255,255,255,0.03-0.08)` — nunca cinza sólido
- **Bordas:** `rgba(255,255,255,0.06-0.18)` — semi-transparentes
- **Texto forte:** `rgba(255,255,255,0.87)`
- **Texto médio:** `rgba(255,255,255,0.60)`
- **Texto sutil:** `rgba(255,255,255,0.35)`
- **Acents neon:** usar as 6 cores do Sommar (green-glow, cyan, purple, pink, coral-glow, amber-glow)

### Sombras em tema escuro
- Sombras precisam ser **mais claras** em fundos escuros (contra-intuitivo)
- `box-shadow: 0 4px 12px rgba(0,0,0,0.4)` para elevação
- Neon glow em CTAs: `box-shadow: 0 0 20px rgba(29,255,168,0.25)`

### Espaçamento
- Tema escuro parece mais pesado → aumentar whitespace em 10-15% vs. tema claro
- Scale: 8, 12, 16, 24, 32, 48px
- Padding de cards: 16-24px

### Tipografia
- Letter-spacing ligeiramente aumentado (+0.5px) melhora leitura em fundo escuro
- Line-height: 1.5-1.6× para body text
- Mínimo 16px para leitura longa

### Animações
- Transições: 200-300ms
- Easing: ease-out para entradas, ease-in para saídas
- Nunca flashes brilhantes (agressivo em dark)
- Limite: < 3 animações por tela

---

## 5. Social Proof

### Impacto
- Trust signals: +42% conversão
- Depoimentos: +34% conversão
- Ratings visíveis: +270% em alguns casos

### Tipos por prioridade
1. **Depoimentos com foto + cargo + empresa** — mais impactante
2. **Contador de usuários** ("X pessoas já criaram seu Ori")
3. **Avaliações externas** (Trustpilot, App Store rating)
4. **Menções em mídia** (TechCrunch, Exame, etc.)
5. **Logos de empresas** (só se reconhecíveis — B2B)

### Regras
- **Específico converte melhor que genérico:** "Conheci meu co-fundador no evento" > "Ótimo app"
- Sempre com foto real (nunca stock photo)
- Posicionar acima da dobra (pelo menos 1)
- Repetir em 2-3 pontos da LP com tipos diferentes

### Para o MSP (sem usuários reais ainda)
- Usar dados reais de mercado (WHO, APA, Forbes sobre solidão/dating burnout)
- "Seja um dos primeiros" + contador de interessados (mesmo que pequeno)
- **Nunca inventar números** — erode confiança quando descoberto

---

## 6. Checklist pré-publicação

### Landing Page
- [ ] CTA primário visível sem scroll
- [ ] Formulários têm no máximo 5 campos
- [ ] Copy em linguagem simples (sem jargão)
- [ ] Social proof acima da dobra
- [ ] Mobile responsivo (testar em 375px e 390px)
- [ ] Botões com mínimo 44px de altura
- [ ] Cada CTA tem copy único e contextual
- [ ] Uma ação primária por seção

### Onboarding
- [ ] Máximo 7 telas
- [ ] Cada tela = 1 ação
- [ ] Progresso visível
- [ ] Skip em toda tela
- [ ] Primeiro "aha moment" em < 5 min
- [ ] Não pede o que já sabemos

### Design
- [ ] Contraste WCAG AA em todos os textos
- [ ] Estados hover/active/disabled definidos
- [ ] Animações < 300ms
- [ ] Touch targets 44-48px em mobile
- [ ] Neon glow apenas em CTAs primários

---

## Fontes
- Unbounce, Omnius, Arclen (CRO/SaaS)
- Userflow, Userpilot, VWO (Onboarding)
- AppInventiv, HakunaMatata Tech, Tekrevol (Dark Theme)
- MailerLite, Nudgify, KlientBoost (Social Proof)
- WebAIM (Acessibilidade/Contraste)
