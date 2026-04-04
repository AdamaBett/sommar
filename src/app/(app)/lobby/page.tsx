import { LobbyView } from '@/components/lobby/LobbyView';

// Participant type for mock data
export interface LobbyParticipant {
  id: string;
  nome: string;
  online: boolean;
  tipo: 'intimo' | 'academico' | 'profissional' | 'social';
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

  // ── Acadêmico ──
  p('5', 'Beat', true, 'academico', 'Doutorando em neurociência computacional', ['neurociência', 'IA', 'pesquisa'], '#00D4FF', '#A855F7'),
  p('6', 'Iris', true, 'academico', 'Pesquisadora em estudos de gênero e sociologia', ['sociologia', 'gênero', 'queer'], '#1DFFA8', '#A855F7'),
  p('7', 'Liz', false, 'academico', 'Mestranda em linguística aplicada', ['linguística', 'educação', 'pesquisa'], '#00D4FF', '#EC4899'),
  p('8', 'Tom', true, 'academico', 'Professor de física e divulgador científico', ['física', 'divulgação', 'ensino'], '#1DFFA8', '#00D4FF'),
  p('9', 'Nina', true, 'academico', 'Pós-doc em ciência de dados e ética em IA', ['dados', 'ética', 'IA'], '#A855F7', '#EC4899'),

  // ── Social ──
  p('10', 'Sol', false, 'social', 'Permacultora e banco de sementes', ['permacultura', 'agroecologia'], '#A855F7', '#1DFFA8'),
  p('11', 'Kai', true, 'social', 'Empreendedor, surf e comunidade queer', ['comunidade', 'surf', 'lgbtq+'], '#A855F7', '#EC4899'),
  p('12', 'Malu', true, 'social', 'Psicóloga e comunidade LGBTQ+', ['bem-estar', 'comunidade', 'lgbtq+'], '#A855F7', '#00D4FF'),
  p('13', 'Nico', false, 'profissional', 'UX researcher, dados e empatia', ['ux', 'pesquisa', 'produto'], '#FFB840', '#1DFFA8'),
  p('14', 'Mar', false, 'social', 'Oceanógrafo e ativismo ambiental', ['oceano', 'meio ambiente'], '#A855F7', '#1DFFA8'),

  // ── Mais pessoas (lobby vivo, ~35 total) ──
  p('15', 'Dani', true, 'intimo', 'Terapeuta, yoga e presença', ['terapia', 'yoga', 'meditação'], '#EC4899', '#1DFFA8'),
  p('16', 'Vini', true, 'profissional', 'Growth hacker e nerd de dados', ['growth', 'dados', 'marketing'], '#FFB840', '#00D4FF'),
  p('17', 'Jade', true, 'academico', 'Doutora em antropologia cultural', ['antropologia', 'cultura', 'etnografia'], '#00D4FF', '#FFB840'),
  p('18', 'Theo', false, 'social', 'Educador social e voluntariado', ['educação', 'voluntariado', 'impacto'], '#A855F7', '#FFB840'),
  p('19', 'Lua', true, 'intimo', 'Astróloga e taróloga', ['astrologia', 'tarô', 'autoconhecimento'], '#EC4899', '#A855F7'),
  p('20', 'Gael', true, 'profissional', 'Designer de produto, ex-Nubank', ['design', 'produto', 'fintech'], '#FFB840', '#A855F7', true),
  p('21', 'Ayla', false, 'academico', 'Pesquisadora em literatura comparada', ['literatura', 'teoria', 'escrita'], '#00D4FF', '#1DFFA8'),
  p('22', 'Beto', true, 'social', 'Dono de bar, curador de encontros', ['gastronomia', 'comunidade', 'eventos'], '#A855F7', '#FF6B3D'),
  p('23', 'Yara', true, 'intimo', 'Enfermeira, trilhas e pôr do sol', ['saúde', 'natureza', 'aventura'], '#EC4899', '#FFB840'),
  p('24', 'Hugo', false, 'profissional', 'Engenheiro de ML, IA generativa', ['IA', 'machine learning', 'python'], '#FFB840', '#00D4FF'),
  p('25', 'Mel', true, 'academico', 'Mestranda em comunicação e mídias digitais', ['comunicação', 'mídia', 'pesquisa'], '#00D4FF', '#EC4899'),
  p('26', 'Davi', true, 'social', 'Ativista climático e organizador', ['clima', 'ativismo', 'política'], '#A855F7', '#1DFFA8'),
  p('27', 'Luna', true, 'academico', 'Doutoranda em urbanismo sustentável', ['urbanismo', 'sustentabilidade', 'pesquisa'], '#1DFFA8', '#00D4FF'),
  p('28', 'Raul', false, 'intimo', 'Chef, sabores e afetos', ['gastronomia', 'cozinha', 'afeto'], '#EC4899', '#FF6B3D'),
  p('29', 'Flora', true, 'social', 'Bióloga marinha e mergulhadora', ['biologia', 'mergulho', 'oceano'], '#A855F7', '#00D4FF'),
  p('30', 'Sam', true, 'profissional', 'Product manager, ex-iFood', ['produto', 'tech', 'estratégia'], '#FFB840', '#EC4899'),
  p('31', 'Zoe', true, 'academico', 'Professora de bioquímica e biotecnologia', ['bioquímica', 'biotech', 'ensino'], '#00D4FF', '#A855F7'),
  p('32', 'Noel', false, 'social', 'Sommelier e colecionador de histórias', ['vinho', 'histórias', 'curadoria'], '#A855F7', '#FFB840'),
  p('33', 'Isa', true, 'intimo', 'Dança contemporânea e movimento', ['dança', 'corpo', 'expressão'], '#EC4899', '#00D4FF'),
  p('34', 'Fabi', true, 'profissional', 'Venture capital e impacto', ['investimento', 'impacto', 'startups'], '#FFB840', '#1DFFA8'),
  p('35', 'Rio', true, 'academico', 'Pesquisador em economia criativa e nomadismo', ['economia', 'pesquisa', 'mobilidade'], '#1DFFA8', '#FF6B3D'),
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
