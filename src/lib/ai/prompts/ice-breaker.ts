/**
 * Prompts para geração de ice-breakers personalizados.
 * A Matter gera sugestões de abertura baseadas nos Oris dos dois usuários.
 */

export const ICE_BREAKER_SYSTEM_PROMPT = `Você é a Matter, a inteligência do Sommar.
Sua tarefa: gerar ice-breakers (frases de abertura) para facilitar conexão entre duas pessoas em um evento.

Regras:
- Máximo 2 frases, total de 140 caracteres
- Tom: leve, curioso, com personalidade. Nunca genérico
- Baseie-se nos interesses em comum que você identificar
- Nunca use clichês de dating app ("oi, tudo bem?", "você vem sempre aqui?")
- Pode ser uma pergunta, observação ou provocação inteligente
- PT-BR natural e informal
- Sem emojis excessivos, máximo 1 se fizer sentido
- A frase deve funcionar tanto para contexto romântico quanto amizade
- Considere o contexto do evento quando fornecido`;

/**
 * Construir prompt para geração de ice-breaker entre dois usuários.
 */
export function buildIceBreakerPrompt(params: {
  userANarrative: string;
  userBNarrative: string;
  matchingFacets: string[];
  eventContext?: string;
  similarity: number;
}): string {
  const { userANarrative, userBNarrative, matchingFacets, eventContext, similarity } = params;

  const facetLabels: Record<string, string> = {
    essencia: 'essência',
    intimo: 'íntimo',
    academico: 'acadêmico',
    profissional: 'profissional',
    social: 'social',
  };

  const facetsText = matchingFacets
    .map((f) => facetLabels[f] ?? f)
    .join(', ');

  let prompt = `Gere 3 opções de ice-breaker para esta conexão.

PESSOA A:
${userANarrative}

PESSOA B:
${userBNarrative}

Facetas em comum: ${facetsText}
Similaridade: ${Math.round(similarity * 100)}%`;

  if (eventContext) {
    prompt += `\nContexto do evento: ${eventContext}`;
  }

  prompt += `

Responda APENAS com um JSON array de 3 strings, sem explicação:
["ice-breaker 1", "ice-breaker 2", "ice-breaker 3"]`;

  return prompt;
}

/**
 * Prompt para ice-breaker de re-engajamento (anti-ghosting).
 * Usado quando a Matter detecta que uma conversa está perdendo ritmo.
 */
export function buildReEngagementPrompt(params: {
  lastMessages: string[];
  userNarrative: string;
  minutesSinceLastMessage: number;
}): string {
  const { lastMessages, userNarrative, minutesSinceLastMessage } = params;

  return `A conversa abaixo perdeu ritmo (${minutesSinceLastMessage} minutos sem resposta).
Gere uma intervenção sutil da Matter para reavivar a conversa.

Últimas mensagens:
${lastMessages.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Perfil do usuário que precisa responder:
${userNarrative}

Regras:
- Máximo 1 frase
- Tom de amiga perspicaz, nunca cobrar
- Pode sugerir um tópico novo baseado no perfil
- Nunca dizer "responda" ou pressionar diretamente
- PT-BR natural

Responda APENAS com a frase de intervenção, sem aspas.`;
}
