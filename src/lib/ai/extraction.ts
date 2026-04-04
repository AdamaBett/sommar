import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/** Dados extraídos de uma mensagem do onboarding */
export interface ExtractionResult {
  facet_data: {
    essencia?: Record<string, string>;
    intimo?: Record<string, string>;
    academico?: Record<string, string>;
    profissional?: Record<string, string>;
    social?: Record<string, string>;
  };
  identity: {
    gender: string | null;
    gender_identity: string | null;
    pronouns: string[] | null;
    sexual_orientation: string | null;
    interested_in: string[] | null;
    relationship_model: string | null;
  };
  completeness_score: number;
  confidence: 'low' | 'medium' | 'high';
}

const EXTRACTION_PROMPT = `Você é um sistema de extração de dados para o Sommar. Analise a conversa de onboarding e extraia informações estruturadas sobre o usuário.

O Sommar usa 5 facetas:
- **Essência**: valores, energia social, estilo de comunicação, personalidade base
- **Íntimo**: vida afetiva, atração, disponibilidade emocional, o que busca em relacionamentos
- **Acadêmico**: formação acadêmica, área de pesquisa, o que estuda, certificações, produção científica
- **Profissional**: área de atuação, expertise, o que sabe fazer, o que quer aprender
- **Social**: estilo de amizade, interesses de comunidade, esportes, causas, diversão

REGRAS:
1. Extraia APENAS o que foi explicitamente mencionado ou claramente implícito
2. Use null para campos não mencionados. NUNCA presuma heterossexualidade, monogamia ou binariedade
3. O completeness_score vai de 0 a 1. Calcule com base em quantas facetas têm dados significativos:
   - Essência com 3+ campos preenchidos: +0.25
   - Cada faceta adicional com 2+ campos: +0.15
   - Identidade (gender + interested_in): +0.10
   - Profundidade (respostas elaboradas vs curtas): +0.05 a +0.15
4. Retorne APENAS JSON válido, sem markdown, sem explicação
5. Faça merge incremental: preserve dados existentes, adicione novos, nunca remova dados já extraídos

Dados já extraídos até agora (faça merge, não substitua):
{existing_data}

Formato de saída (JSON):
{
  "facet_data": {
    "essencia": { "valores": "...", "energia_social": "...", "como_se_comunica": "..." },
    "intimo": { "o_que_busca": "...", "estilo": "..." },
    "academico": { "formacao": "...", "pesquisa": "...", "area": "..." },
    "profissional": { "area": "...", "sabe_fazer": "...", "quer_aprender": "..." },
    "social": { "estilo_amizade": "...", "interesses": "...", "causas": "..." }
  },
  "identity": {
    "gender": null,
    "gender_identity": null,
    "pronouns": null,
    "sexual_orientation": null,
    "interested_in": null,
    "relationship_model": null
  },
  "completeness_score": 0.0,
  "confidence": "low"
}`;

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Extrai dados estruturados da conversa de onboarding usando Haiku (custo baixo) */
export async function extractFromConversation(
  messages: ConversationMessage[],
  existingData: Partial<ExtractionResult> = {}
): Promise<ExtractionResult> {
  const conversationText = messages
    .map(m => `${m.role === 'user' ? 'Usuário' : 'Matter'}: ${m.content}`)
    .join('\n');

  const systemPrompt = EXTRACTION_PROMPT.replace(
    '{existing_data}',
    JSON.stringify(existingData, null, 2)
  );

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Analise esta conversa e extraia os dados:\n\n${conversationText}`,
      },
    ],
  });

  const textBlock = response.content.find(block => block.type === 'text');
  const rawText = textBlock?.text ?? '{}';

  try {
    const parsed = JSON.parse(rawText) as ExtractionResult;
    return mergeExtractionData(existingData, parsed);
  } catch {
    // Se Haiku retornar JSON malformado, retorna dados existentes sem perder nada
    return {
      facet_data: existingData.facet_data ?? {},
      identity: existingData.identity ?? {
        gender: null,
        gender_identity: null,
        pronouns: null,
        sexual_orientation: null,
        interested_in: null,
        relationship_model: null,
      },
      completeness_score: existingData.completeness_score ?? 0,
      confidence: 'low',
    };
  }
}

/** Merge incremental: preserva dados existentes, adiciona novos */
function mergeExtractionData(
  existing: Partial<ExtractionResult>,
  incoming: ExtractionResult
): ExtractionResult {
  const mergedFacets = { ...existing.facet_data };
  const facetKeys = ['essencia', 'intimo', 'academico', 'profissional', 'social'] as const;

  for (const facet of facetKeys) {
    if (incoming.facet_data[facet]) {
      mergedFacets[facet] = {
        ...(mergedFacets[facet] ?? {}),
        ...incoming.facet_data[facet],
      };
    }
  }

  // Identity: só sobrescreve campos que vieram não-null
  const mergedIdentity = {
    gender: incoming.identity.gender ?? existing.identity?.gender ?? null,
    gender_identity: incoming.identity.gender_identity ?? existing.identity?.gender_identity ?? null,
    pronouns: incoming.identity.pronouns ?? existing.identity?.pronouns ?? null,
    sexual_orientation: incoming.identity.sexual_orientation ?? existing.identity?.sexual_orientation ?? null,
    interested_in: incoming.identity.interested_in ?? existing.identity?.interested_in ?? null,
    relationship_model: incoming.identity.relationship_model ?? existing.identity?.relationship_model ?? null,
  };

  return {
    facet_data: mergedFacets,
    identity: mergedIdentity,
    // Score sempre usa o mais recente (Haiku recalcula a cada mensagem)
    completeness_score: incoming.completeness_score,
    confidence: incoming.confidence,
  };
}
