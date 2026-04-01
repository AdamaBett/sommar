import { MATCH_THRESHOLD } from '@/lib/constants';

/* ------------------------------------------------------------------ */
/*  Cosine Similarity                                                  */
/* ------------------------------------------------------------------ */

/** Calcular similaridade cossenoidal entre dois vetores */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MatchCandidate {
  userId: string;
  embedding: number[];
  facets: string[];
}

export interface MatchResult {
  userId: string;
  similarity: number;
  matchingFacets: string[];
}

/* ------------------------------------------------------------------ */
/*  Find Matches                                                       */
/* ------------------------------------------------------------------ */

/** Encontrar matches acima do threshold no lobby */
export function findMatches(
  userEmbedding: number[],
  candidates: MatchCandidate[],
  activeFacets: string[],
  threshold: number = MATCH_THRESHOLD
): MatchResult[] {
  return candidates
    .filter((candidate) => {
      // Pelo menos uma faceta em comum
      const commonFacets = candidate.facets.filter((f) =>
        activeFacets.includes(f)
      );
      return commonFacets.length > 0;
    })
    .map((candidate) => ({
      userId: candidate.userId,
      similarity: cosineSimilarity(userEmbedding, candidate.embedding),
      matchingFacets: candidate.facets.filter((f) =>
        activeFacets.includes(f)
      ),
    }))
    .filter((match) => match.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
}

/* ------------------------------------------------------------------ */
/*  Batch Matching (para todos os pares no lobby)                      */
/* ------------------------------------------------------------------ */

export interface BatchMatchResult {
  userA: string;
  userB: string;
  similarity: number;
  matchingFacets: string[];
}

/**
 * Calcular todos os pares de matches acima do threshold em um lobby.
 * Evita comparacoes duplicadas (A-B e B-A) e auto-comparacoes.
 */
export function batchMatchLobby(
  participants: MatchCandidate[],
  threshold: number = MATCH_THRESHOLD
): BatchMatchResult[] {
  const results: BatchMatchResult[] = [];

  for (let i = 0; i < participants.length; i++) {
    for (let j = i + 1; j < participants.length; j++) {
      const a = participants[i];
      const b = participants[j];

      // Facetas em comum
      const matchingFacets = a.facets.filter((f) => b.facets.includes(f));
      if (matchingFacets.length === 0) continue;

      const similarity = cosineSimilarity(a.embedding, b.embedding);
      if (similarity >= threshold) {
        results.push({
          userA: a.userId,
          userB: b.userId,
          similarity,
          matchingFacets,
        });
      }
    }
  }

  return results.sort((a, b) => b.similarity - a.similarity);
}
