/** Prompt para geração de narrativa do Ori por faceta */
export const ORI_NARRATIVE_PROMPT = `Com base nos dados extraídos do onboarding, gere uma narrativa curta e poética para cada faceta que tem dados.

Dados do Ori:
{facet_data}

Identidade:
{identity}

Para cada faceta com dados, gere 2 a 3 frases que:
- Capturem a energia única da pessoa naquela dimensão
- Usem metáforas sutis (não clichês)
- Sejam em segunda pessoa ("você...")
- Soem como algo que a pessoa leria e pensaria "sim, isso sou eu"
- Nunca usem travessões longos ou curtos

Retorne JSON com a estrutura:
{
  "essencia": "narrativa...",
  "intimo": "narrativa..." ou null se sem dados,
  "academico": "narrativa..." ou null se sem dados,
  "profissional": "narrativa..." ou null se sem dados,
  "social": "narrativa..." ou null se sem dados
}

Retorne APENAS JSON válido.`;

/** Prompt para gerar texto consolidado para embedding */
export const EMBEDDING_TEXT_PROMPT = `Com base nos dados do Ori abaixo, gere um texto consolidado de 200-300 palavras que capture a essência completa desta pessoa. Este texto será usado para gerar embeddings vetoriais para matching.

Dados do Ori:
{facet_data}

Identidade (usar apenas para contexto de matching, não descrever explicitamente):
{identity}

Regras:
- Texto corrido, sem bullet points
- Cubra todas as facetas que têm dados
- Foque em valores, interesses, estilo e o que a pessoa busca
- Nunca mencione dados técnicos, embeddings ou IA
- Nunca use travessões longos ou curtos
- PT-BR natural

Retorne APENAS o texto, sem JSON, sem formatação.`;
