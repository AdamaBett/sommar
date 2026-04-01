import OpenAI from 'openai';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;

/* ------------------------------------------------------------------ */
/*  Client singleton (server-side only)                                */
/* ------------------------------------------------------------------ */

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _client;
}

/* ------------------------------------------------------------------ */
/*  Single Embedding                                                   */
/* ------------------------------------------------------------------ */

/** Gerar embedding para texto usando OpenAI text-embedding-3-small */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getClient();
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return response.data[0].embedding;
}

/* ------------------------------------------------------------------ */
/*  Batch Embeddings                                                   */
/* ------------------------------------------------------------------ */

/** Gerar embeddings para multiplos textos em batch */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const client = getClient();
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return response.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

/* ------------------------------------------------------------------ */
/*  Ori Text Builder                                                   */
/* ------------------------------------------------------------------ */

/**
 * Construir texto representativo do Ori para embedding.
 * Combina narrativas de todas as facetas ativas em um texto coeso.
 */
export function buildOriText(
  narrative: Record<string, string>,
  facetData: Record<string, unknown>,
  activeFacets: string[]
): string {
  const parts: string[] = [];

  // Narrativa essência sempre incluída
  if (narrative['essencia']) {
    parts.push(narrative['essencia']);
  }

  // Narrativas das facetas ativas
  for (const facet of activeFacets) {
    if (facet !== 'essencia' && narrative[facet]) {
      parts.push(narrative[facet]);
    }
  }

  // Dados dimensionais relevantes
  for (const facet of activeFacets) {
    const data = facetData[facet];
    if (data && typeof data === 'object') {
      // Extrair valores de texto do JSONB dimensional
      const values = Object.values(data as Record<string, unknown>).filter(
        (v): v is string => typeof v === 'string'
      );
      if (values.length > 0) {
        parts.push(values.join('. '));
      }
    }
  }

  return parts.join(' ');
}

/* ------------------------------------------------------------------ */
/*  Constants export                                                   */
/* ------------------------------------------------------------------ */

export { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS };
