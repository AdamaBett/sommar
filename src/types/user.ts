export type UserRole = 'participant' | 'organizer' | 'creator';

export interface Profile {
  id: string;
  display_name: string;
  birth_date: string | null;
  city: string | null;
  bio: string | null;
  photos: string[];
  languages: string[];
  social_energy: number | null;
  life_goals: string | null;
  personality_indicators: Record<string, unknown>;
  active_facets: string[];
  facet_data: Record<string, unknown>;
  aesthetic_archetypes: number[];
  role: UserRole;
  onboarding_complete: boolean;
  onboarding_progress: Record<string, unknown>;
  first_visit: boolean;
  created_at: string;
  updated_at: string;
}
