import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

let initialized = false;

/** Inicializa PostHog no client. Chamar uma vez no root layout. */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (initialized) return;
  if (!POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    autocapture: false,
    // Privacidade: nunca capturar texto de inputs
    mask_all_text: false,
    mask_all_element_attributes: false,
  });

  initialized = true;
}

/** Opt-out de analytics (LGPD) */
export function optOutAnalytics(): void {
  if (typeof window === 'undefined') return;
  posthog.opt_out_capturing();
}

/** Opt-in de analytics */
export function optInAnalytics(): void {
  if (typeof window === 'undefined') return;
  posthog.opt_in_capturing();
}

/** Verifica se analytics está ativo */
export function isAnalyticsOptedOut(): boolean {
  if (typeof window === 'undefined') return false;
  return posthog.has_opted_out_capturing();
}

/** Identifica usuário (pós-login, sem dados sensíveis) */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!POSTHOG_KEY) return;
  posthog.identify(userId, properties);
}

/** Reset de identidade (logout) */
export function resetAnalytics(): void {
  if (typeof window === 'undefined') return;
  posthog.reset();
}

// ------------------------------------------------------------------
// Eventos tipados
// JAMAIS logar conteúdo de mensagens, dados de identidade ou PII
// ------------------------------------------------------------------

type AnalyticsEvent =
  // Landing
  | { name: 'landing_viewed'; properties?: { utm_source?: string; utm_medium?: string; utm_campaign?: string } }
  | { name: 'hero_cta_clicked' }
  | { name: 'section_viewed'; properties: { section: string } }
  | { name: 'mid_cta_clicked' }
  | { name: 'final_cta_clicked' }
  | { name: 'organizer_cta_clicked' }
  // Auth
  | { name: 'login_page_viewed' }
  | { name: 'google_login_started' }
  | { name: 'google_login_completed' }
  | { name: 'email_otp_started' }
  | { name: 'email_otp_completed' }
  | { name: 'login_failed'; properties: { reason: string } }
  // Onboarding
  | { name: 'onboarding_started' }
  | { name: 'onboarding_message_sent'; properties: { turn_number: number } }
  | { name: 'aesthetic_picker_viewed' }
  | { name: 'aesthetic_archetype_selected'; properties: { archetype_ids: number[] } }
  | { name: 'facet_selector_viewed' }
  | { name: 'facet_toggled'; properties: { facet: string; enabled: boolean } }
  | { name: 'ori_reveal_triggered'; properties: { completeness_score: number } }
  | { name: 'onboarding_completed'; properties: { completeness_score: number; duration_seconds: number } }
  | { name: 'onboarding_abandoned'; properties: { step: string } }
  // Lobby
  | { name: 'lobby_viewed'; properties: { event_id: string } }
  | { name: 'facet_filter_changed'; properties: { facet: string } }
  | { name: 'person_popup_opened' }
  | { name: 'correio_intent' }
  | { name: 'correio_sent' }
  | { name: 'match_toast_seen' }
  | { name: 'cosmos_dragged' }
  // Matter
  | { name: 'matter_fab_opened' }
  | { name: 'matter_panel_closed' };

/** Captura evento tipado. Nunca logar conteúdo de mensagens. */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  if (!POSTHOG_KEY) return;

  const { name, ...rest } = event;
  const properties = 'properties' in rest ? rest.properties : undefined;
  posthog.capture(name, properties);
}
