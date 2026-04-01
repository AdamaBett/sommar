// Identidade
export const APP_NAME = 'Sommar';
export const MATTER_NAME = 'Matter';

// Limites do sistema
export const MAX_CORREIO_FREE = 5;
export const MAX_CORREIO_QUEST = 3;
export const MATCH_THRESHOLD = 0.75;
export const MAX_PHOTOS = 6;
export const MIN_ARCHETYPES = 3;
export const ONBOARDING_STEPS = 4;

// Estados do lobby
export const LOBBY_STATES = {
  pending: 'pending',
  active: 'active',
  historical: 'historical',
  expired: 'expired',
} as const;

// Estados do correio elegante
export const CORREIO_STATES = {
  active: 'active',
  read_only: 'read_only',
  re_enabled: 're_enabled',
} as const;

// Roles de usuário
export const ROLES = {
  participant: 'participant',
  organizer: 'organizer',
  creator: 'creator',
} as const;

// Tipos de conexão dimensionais (JSONB, nunca enums fixos)
export const CONNECTION_TYPES = [
  { id: 'romantico', label: 'Romântico', emoji: '\u2764\uFE0F', color: '#EC4899' },
  { id: 'amizade', label: 'Amizade', emoji: '\uD83E\uDD1D', color: '#1DFFA8' },
  { id: 'projetos', label: 'Projetos', emoji: '\uD83D\uDE80', color: '#00D4FF' },
  { id: 'comunidade', label: 'Comunidade', emoji: '\uD83C\uDF0D', color: '#FFB840' },
  { id: 'profissional', label: 'Profissional', emoji: '\uD83D\uDCBC', color: '#A855F7' },
  { id: 'mentoria', label: 'Mentoria', emoji: '\uD83C\uDF31', color: '#1D9E75' },
  { id: 'cultura', label: 'Cultura', emoji: '\uD83C\uDFA8', color: '#FF6B3D' },
  { id: 'inesperado', label: 'Inesperado', emoji: '\u2728', color: '#EF9F27' },
] as const;

// Facetas do perfil (5 facetas: Essência sempre ativa, demais toggleáveis)
export const FACETS = [
  { id: 'essencia', label: 'Essência', color: '#1DFFA8' },
  { id: 'intimo', label: 'Íntimo', color: '#EC4899' },
  { id: 'criativo', label: 'Criativo', color: '#00D4FF' },
  { id: 'profissional', label: 'Profissional', color: '#FFB840' },
  { id: 'social', label: 'Social', color: '#A855F7' },
] as const;

// Arquétipos estéticos (seleção mínima de 3 no onboarding)
export const ARCHETYPES = [
  { id: 1, emoji: '\uD83C\uDF19', label: 'Noturno' },
  { id: 2, emoji: '\uD83C\uDF1E', label: 'Solar' },
  { id: 3, emoji: '\uD83C\uDF0A', label: 'Fluido' },
  { id: 4, emoji: '\uD83D\uDD25', label: 'Intenso' },
  { id: 5, emoji: '\uD83C\uDF3F', label: 'Orgânico' },
  { id: 6, emoji: '\u26A1', label: 'Elétrico' },
  { id: 7, emoji: '\uD83D\uDCAB', label: 'Cósmico' },
  { id: 8, emoji: '\uD83C\uDFB6', label: 'Rítmico' },
  { id: 9, emoji: '\uD83E\uDDE9', label: 'Analítico' },
] as const;

// Design system colors (mapeados para CSS variables)
export const COLORS = {
  green: '#1D9E75',
  greenGlow: '#1DFFA8',
  coral: '#D85A30',
  coralGlow: '#FF6B3D',
  amber: '#EF9F27',
  amberGlow: '#FFB840',
  cyan: '#00D4FF',
  purple: '#A855F7',
  pink: '#EC4899',
  background: '#000000',
  cardBg: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.06)',
} as const;

// UI Strings (PT-BR)
export const STRINGS = {
  // Landing
  heroTitle: 'Conexão humana real',
  heroSubtitle: 'A inteligência que te entende. O evento que conecta.',
  ctaSignup: 'Crie seu Ori',
  ctaLogin: 'Entrar',

  // Onboarding
  onboardingWelcome: 'Oi! Eu sou a Matter, a inteligência do Sommar.',
  onboardingStart: 'Vamos criar seu Ori juntos?',
  onboardingComplete: 'Seu Ori nasceu!',

  // Lobby
  lobbyEmpty: 'Nenhum evento ativo. Que tal explorar?',
  lobbyExplore: 'Descobrir eventos',

  // Correio
  correioSend: 'Enviar correio elegante',
  correioExpired: 'Este correio expirou',
  correioReEnable: 'Reativar conversa',

  // Matter
  matterGreeting: 'Como posso te ajudar?',
  matterTyping: 'Matter está pensando...',

  // Perfil
  profileEdit: 'Editar perfil',
  profileConnections: 'Conexões',
  profileEvents: 'Eventos',

  // Geral
  loading: 'Carregando...',
  error: 'Algo deu errado. Tente novamente.',
  retry: 'Tentar novamente',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  save: 'Salvar',
  back: 'Voltar',
} as const;
