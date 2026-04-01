export interface Ori {
  id: string;
  user_id: string;
  embedding: number[] | null;
  narrative: Record<string, string>;
  ice_breaker_seeds: string[];
  completeness_score: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Facet {
  id: string;
  label: string;
  color: string;
  active: boolean;
}

export interface MatchResult {
  user_id: string;
  similarity: number;
  matching_facets: string[];
  ice_breaker: string | null;
}
