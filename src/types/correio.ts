export type CorreioState = 'active' | 'read_only' | 're_enabled';
export type ReEnableMethod = 'mission' | 'payment';

export interface CorreioConversation {
  id: string;
  lobby_id: string;
  sender_id: string;
  receiver_id: string;
  state: CorreioState;
  ice_breaker: string | null;
  expires_at: string | null;
  read_at: string | null;
  re_enabled_at: string | null;
  re_enable_method: ReEnableMethod | null;
  created_at: string;
}

export interface CorreioMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Connection {
  id: string;
  user_a_id: string;
  user_b_id: string;
  event_id: string | null;
  confirmed_by_a: boolean;
  confirmed_by_b: boolean;
  confirmed_at: string | null;
  created_at: string;
}
