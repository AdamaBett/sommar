export type LobbyState = 'pending' | 'active' | 'historical' | 'expired';

export interface SommarEvent {
  id: string;
  organizer_id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  ticket_url: string | null;
  tags: string[];
  start_time: string;
  end_time: string | null;
  expected_capacity: number | null;
  is_template: boolean;
  template_source_id: string | null;
  created_at: string;
}

export interface Lobby {
  id: string;
  event_id: string;
  state: LobbyState;
  opened_at: string | null;
  closed_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface LobbyParticipant {
  lobby_id: string;
  user_id: string;
  active_facets: string[];
  role: string;
  checked_in_at: string;
}

export interface FeedPost {
  id: string;
  event_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
}
