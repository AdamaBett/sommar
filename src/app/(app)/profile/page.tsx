import { ProfileView } from '@/components/profile/ProfileView';

// Dados mock — perfil do Bet (Matheus Betinelli)
const MOCK_PROFILE = {
  id: 'u1',
  display_name: 'Matheus Betinelli',
  bio: 'PM visionário, construindo o futuro da conexão humana. Movido por ideias que mudam o jogo, IA, e encontros que fazem sentido. Floripa born.',
  active_facets: ['essencia', 'intimo', 'profissional', 'academico', 'social'],
  facet_data: {
    essencia: {
      social_energy: 0.85,
      values: ['autenticidade', 'visão', 'empatia', 'inclusividade'],
    },
    intimo: {
      looking_for: 'conexão genuína com alguém que compartilhe profundidade',
      interested_in: ['homens'],
      orientation: 'gay',
    },
    profissional: {
      area: 'Product Management, IA, Startups',
      sabe_fazer: 'CRO, jornadas de usuário, lógica de negócio, pitch',
      quer_aprender: 'dev full-stack, design de sistemas, growth hacking',
    },
    academico: {
      formacao: 'Administração, MBA em Produto Digital',
      pesquisa: 'comportamento humano em plataformas digitais',
      area: 'product management, IA aplicada, UX research',
    },
    social: {
      estilo_amizade: 'poucos e bons, conversas profundas, risadas reais',
      interesses: ['eventos', 'comunidade tech', 'conexões reais'],
    },
  },
  aesthetic_archetypes: [2, 5, 6],
  ori_narrative: {
    essencia: 'Você carrega uma energia que mistura visão estratégica com calor humano genuíno. Pessoas se sentem vistas perto de você, porque você realmente escuta.',
    intimo: 'Busca profundidade sem pressa. Conexão pra você é olhar nos olhos e sentir que não precisa explicar tudo. Você sabe o que quer e não tem medo de esperar pelo certo.',
    profissional: 'Mente de produto, coração de construtor. Você enxerga o que os outros ainda não veem e tem a paciência de transformar visão em realidade.',
    academico: 'Sua mente transita entre gestão, tecnologia e comportamento humano. Você transforma teoria em produto e pesquisa em decisão.',
    social: 'Seu círculo é curado, não acumulado. Cada amizade sua tem peso e história. Você é o tipo de pessoa que transforma um jantar casual em conversa inesquecível.',
  },
  stats: {
    events_count: 5,
    matches_count: 18,
    connections_count: 7,
  },
};

export default function ProfilePage(): React.ReactElement {
  return <ProfileView profile={MOCK_PROFILE} />;
}
