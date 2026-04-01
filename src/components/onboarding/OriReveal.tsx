'use client';

import { motion } from 'framer-motion';
import { MatterOrb } from '@/components/ui/MatterOrb';
import { cn } from '@/lib/utils';

interface OriRevealProps {
  narrative: string;
  onContinue: () => void;
}

/** Particula para o efeito de "nascimento" */
function BurstParticle({
  delay,
  color,
  angle,
}: {
  delay: number;
  color: string;
  angle: number;
}): JSX.Element {
  const distance = 80 + Math.random() * 120;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{
        backgroundColor: color,
        left: '50%',
        top: '50%',
        marginLeft: -3,
        marginTop: -3,
      }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, x * 0.5, x],
        y: [0, y * 0.5, y],
        scale: [0, 1.5, 0.5],
      }}
      transition={{
        duration: 1.6,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

const PARTICLE_COLORS = [
  '#1DFFA8',
  '#00D4FF',
  '#A855F7',
  '#FFB840',
  '#EC4899',
  '#FF6B3D',
];

export function OriReveal({
  narrative,
  onContinue,
}: OriRevealProps): JSX.Element {
  // Gerar particulas em angulos distribuidos
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    delay: 0.3 + Math.random() * 0.5,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    angle: (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-12 text-center">
      {/* Orb com particulas de nascimento */}
      <div className="relative mb-10">
        {/* Burst particles */}
        {particles.map(p => (
          <BurstParticle
            key={p.id}
            delay={p.delay}
            color={p.color}
            angle={p.angle}
          />
        ))}

        {/* Glow de fundo */}
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.6, 0.3], scale: [0.5, 1.8, 1.4] }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{
            background:
              'radial-gradient(circle, rgba(29,255,168,0.15) 0%, transparent 70%)',
            width: 300,
            height: 300,
            marginLeft: -55,
            marginTop: -55,
          }}
        />

        {/* Orb principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <MatterOrb size="xl" />
        </motion.div>
      </div>

      {/* Titulo */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="text-2xl font-display font-semibold text-[var(--text-strong)] mb-3"
      >
        Seu{' '}
        <span className="text-[var(--amber-glow)]">Ori</span>{' '}
        nasceu
      </motion.h1>

      {/* Narrativa do Ori */}
      {narrative && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-sm text-[var(--text-medium)] leading-relaxed max-w-xs mb-4"
        >
          {narrative}
        </motion.p>
      )}

      {/* Descrição */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="text-xs text-[var(--text-subtle)] leading-relaxed max-w-xs mb-10"
      >
        Ele é sua presença digital no Sommar. Autônomo, discreto,
        e sempre trabalhando por você.
      </motion.p>

      {/* Botão */}
      <motion.button
        type="button"
        onClick={onContinue}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'h-12 px-8 rounded-full font-medium text-sm',
          'bg-[var(--green)] text-black',
          'hover:bg-[var(--green-glow)] hover:shadow-[0_0_24px_rgba(29,255,168,0.3)]',
          'transition-all duration-300 cursor-pointer'
        )}
      >
        Explorar o Sommar
      </motion.button>
    </div>
  );
}
