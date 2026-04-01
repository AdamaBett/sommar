import { LobbyView } from '@/components/lobby/LobbyView';

// Participant type for mock data
export interface LobbyParticipant {
  id: string;
  nome: string;
  online: boolean;
  tipo: 'intimo' | 'criativo' | 'profissional' | 'social';
  bio: string;
  tags: string[];
  match?: boolean;
  // Visual: each Ori has unique gradient colors
  colorA: string;
  colorB: string;
}

// Helper para gerar participantes
function p(
  id: string, nome: string, online: boolean,
  tipo: LobbyParticipant['tipo'], bio: string, tags: string[],
  colorA: string, colorB: string, match?: boolean
): LobbyParticipant {
  return { id, nome, online, tipo, bio, tags, colorA, colorB, match };
}

// Dados mock — lobby Sounds in da City (~35 pessoas, perspectiva do Bet)
const MOCK_PARTICIPANTS: LobbyParticipant[] = [
  // ── Matches (íntimo = homens, profissional = qualquer) ──
  p('1', 'Caio', true, 'intimo', 'Fotógrafo, café especial e conversas que valem a pena', ['fotografia', 'café', 'viagem'], '#EC4899', '#A855F7', true),
  p('2', 'Leo', true, 'intimo', 'Arquiteto, amante de design e noites de vinho', ['arquitetura', 'design', 'vinho'], '#EC4899', '#FFB840', true),
  p('3', 'Gusta', true, 'profissional', 'Full-stack dev, co-fundador do Sommar', ['código', 'startups', 'IA'], '#FFB840', '#FF6B3D', true),
  p('4', 'Ravi', true, 'profissional', 'Fundador, impacto social e tech for good', ['startup', 'impacto', 'tech'], '#FFB840', '#1DFFA8', true),

  // ── Criativo ──
  p('5', 'Beat', true, 'criativo', 'DJ e produtor musical', ['música', 'eletrônica', 'produção'], '#00D4FF', '#A855F7'),
  p('6', 'Iris', true, 'criativo', 'Artista visual e ilustradora trans', ['arte', 'ilustração', 'queer'], '#1DFFA8', '#A855F7'),
  p('7', 'Liz', false, 'criativo', 'Cantora e compositora', ['música', 'composição', 'voz'], '#00D4FF', '#EC4899'),
  p('8', 'Tom', true, 'criativo', 'Músico e curador de experiências sonoras', ['música', 'curadoria', 'produção'], '#1DFFA8', '#00D4FF'),
  p('9', 'Nina', true, 'criativo', 'Filmmaker e roteirista', ['cinema', 'roteiro', 'storytelling'], '#A855F7', '#EC4899'),

  // ── Social ──
  p('10', 'Sol', false, 'social', 'Permacultora e banco de sementes', ['permacultura', 'agroecologia'], '#A855F7', '#1DFFA8'),
  p('11', 'Kai', true, 'social', 'Empreendedor, surf e comunidade queer', ['comunidade', 'surf', 'lgbtq+'], '#A855F7', '#EC4899'),
  p('12', 'Malu', true, 'social', 'Psicóloga e comunidade LGBTQ+', ['bem-estar', 'comunidade', 'lgbtq+'], '#A855F7', '#00D4FF'),
  p('13', 'Nico', false, 'profissional', 'UX researcher, dados e empatia', ['ux', 'pesquisa', 'produto'], '#FFB840', '#1DFFA8'),
  p('14', 'Mar', false, 'social', 'Oceanógrafo e ativismo ambiental', ['oceano', 'meio ambiente'], '#A855F7', '#1DFFA8'),

  // ── Mais pessoas (lobby vivo, ~35 total) ──
  p('15', 'Dani', true, 'intimo', 'Terapeuta, yoga e presença', ['terapia', 'yoga', 'meditação'], '#EC4899', '#1DFFA8'),
  p('16', 'Vini', true, 'profissional', 'Growth hacker e nerd de dados', ['growth', 'dados', 'marketing'], '#FFB840', '#00D4FF'),
  p('17', 'Jade', true, 'criativo', 'Ceramista e artesanato contemporâneo', ['cerâmica', 'arte', 'manual'], '#00D4FF', '#FFB840'),
  p('18', 'Theo', false, 'social', 'Educador social e voluntariado', ['educação', 'voluntariado', 'impacto'], '#A855F7', '#FFB840'),
  p('19', 'Lua', true, 'intimo', 'Astróloga e taróloga', ['astrologia', 'tarô', 'autoconhecimento'], '#EC4899', '#A855F7'),
  p('20', 'Gael', true, 'profissional', 'Designer de produto, ex-Nubank', ['design', 'produto', 'fintech'], '#FFB840', '#A855F7', true),
  p('21', 'Ayla', false, 'criativo', 'Poeta e performer', ['poesia', 'performance', 'escrita'], '#00D4FF', '#1DFFA8'),
  p('22', 'Beto', true, 'social', 'Dono de bar, curador de encontros', ['gastronomia', 'comunidade', 'eventos'], '#A855F7', '#FF6B3D'),
  p('23', 'Yara', true, 'intimo', 'Enfermeira, trilhas e pôr do sol', ['saúde', 'natureza', 'aventura'], '#EC4899', '#FFB840'),
  p('24', 'Hugo', false, 'profissional', 'Engenheiro de ML, IA generativa', ['IA', 'machine learning', 'python'], '#FFB840', '#00D4FF'),
  p('25', 'Mel', true, 'criativo', 'Fotógrafa analógica e zines', ['fotografia', 'zines', 'analógico'], '#00D4FF', '#EC4899'),
  p('26', 'Davi', true, 'social', 'Ativista climático e organizador', ['clima', 'ativismo', 'política'], '#A855F7', '#1DFFA8'),
  p('27', 'Luna', true, 'criativo', 'Arquiteta de ecovilas', ['ecovilas', 'sustentabilidade', 'design'], '#1DFFA8', '#00D4FF'),
  p('28', 'Raul', false, 'intimo', 'Chef, sabores e afetos', ['gastronomia', 'cozinha', 'afeto'], '#EC4899', '#FF6B3D'),
  p('29', 'Flora', true, 'social', 'Bióloga marinha e mergulhadora', ['biologia', 'mergulho', 'oceano'], '#A855F7', '#00D4FF'),
  p('30', 'Sam', true, 'profissional', 'Product manager, ex-iFood', ['produto', 'tech', 'estratégia'], '#FFB840', '#EC4899'),
  p('31', 'Zoe', true, 'criativo', 'Tatuadora e body artist', ['tattoo', 'arte', 'corpo'], '#00D4FF', '#A855F7'),
  p('32', 'Noel', false, 'social', 'Sommelier e colecionador de histórias', ['vinho', 'histórias', 'curadoria'], '#A855F7', '#FFB840'),
  p('33', 'Isa', true, 'intimo', 'Dança contemporânea e movimento', ['dança', 'corpo', 'expressão'], '#EC4899', '#00D4FF'),
  p('34', 'Fabi', true, 'profissional', 'Venture capital e impacto', ['investimento', 'impacto', 'startups'], '#FFB840', '#1DFFA8'),
  p('35', 'Rio', true, 'criativo', 'Músico de rua e nômade digital', ['música', 'viagem', 'liberdade'], '#1DFFA8', '#FF6B3D'),
];

export default function LobbyPage(): JSX.Element {
  return (
    <LobbyView
      participants={MOCK_PARTICIPANTS}
      eventName="Sounds in da City"
      participantCount={MOCK_PARTICIPANTS.length}
      isLive={true}
    />
  );
}
