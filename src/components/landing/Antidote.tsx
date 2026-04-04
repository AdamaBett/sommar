'use client';

import { motion } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const GHOST_APPS = [
  { name: 'LinkedIn', top: '8%', left: '5%', size: 15, opacity: 0.18, delay: 0 },
  { name: 'Tinder', top: '55%', left: '12%', size: 17, opacity: 0.22, delay: 0.1 },
  { name: 'Lattes', top: '20%', left: '28%', size: 13, opacity: 0.14, delay: 0.2 },
  { name: 'Instagram', top: '70%', left: '30%', size: 16, opacity: 0.20, delay: 0.15 },
  { name: 'Behance', top: '10%', left: '50%', size: 14, opacity: 0.16, delay: 0.25 },
  { name: 'Hinge', top: '60%', left: '55%', size: 13, opacity: 0.13, delay: 0.3 },
  { name: 'Twitter', top: '30%', left: '68%', size: 15, opacity: 0.17, delay: 0.05 },
  { name: 'Facebook', top: '75%', left: '70%', size: 14, opacity: 0.15, delay: 0.35 },
  { name: 'TikTok', top: '5%', left: '78%', size: 16, opacity: 0.19, delay: 0.12 },
  { name: 'Bumble', top: '45%', left: '85%', size: 13, opacity: 0.14, delay: 0.22 },
  { name: 'Grindr', top: '15%', left: '90%', size: 12, opacity: 0.12, delay: 0.28 },
  { name: 'Threads', top: '80%', left: '48%', size: 14, opacity: 0.16, delay: 0.18 },
];

const FACETS = [
  {
    label: '\u00cdntimo',
    context: 'no bar, no show, no festival',
    gradient: 'linear-gradient(180deg, var(--pink), var(--coral-glow))',
  },
  {
    label: 'Profissional',
    context: 'na palestra, no meetup, no coworking',
    gradient: 'linear-gradient(180deg, var(--amber-glow), var(--amber))',
  },
  {
    label: 'Acad\u00eamico',
    context: 'na confer\u00eancia, no workshop, no congresso',
    gradient: 'linear-gradient(180deg, var(--cyan), var(--purple))',
  },
  {
    label: 'Social',
    context: 'na festa, na trilha, no churrasco',
    gradient: 'linear-gradient(180deg, var(--green-glow), var(--cyan))',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

export function Antidote(): JSX.Element {
  return (
    <section className="relative z-10 px-6 py-28">
      <motion.div
        className="mx-auto max-w-[720px] text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Gradient divider line */}
        <motion.div
          className="mx-auto mb-8 h-px w-16"
          variants={itemVariants}
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--green-glow), transparent)',
          }}
        />

        {/* Section tag */}
        <motion.span
          className="text-[11px] font-medium tracking-[0.2em] uppercase"
          variants={itemVariants}
          style={{ color: 'var(--green-glow)' }}
        >
          A mudança
        </motion.span>

        {/* Ghost Apps Cloud */}
        <motion.div
          className="relative mx-auto mt-10 mb-10 h-[140px] w-full max-w-[600px]"
          variants={itemVariants}
        >
          {GHOST_APPS.map((app) => (
            <motion.span
              key={app.name}
              className="absolute font-display font-light select-none"
              style={{
                top: app.top,
                left: app.left,
                fontSize: `${app.size}px`,
                color: `rgba(255, 255, 255, ${app.opacity})`,
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: app.delay + 0.3, duration: 0.6 }}
            >
              <motion.span
                className="inline-block"
                animate={{ y: [0, -4, 0, 3, 0] }}
                transition={{
                  duration: 4 + app.delay * 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="relative inline-block">
                  {app.name}
                  {/* Strikethrough line */}
                  <motion.span
                    className="absolute left-0 top-1/2 h-[1px] w-full origin-left"
                    style={{
                      background: `rgba(255, 255, 255, ${app.opacity * 0.7})`,
                    }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: app.delay + 0.8,
                      duration: 0.5,
                      ease: EASE_OUT_EXPO,
                    }}
                  />
                </span>
              </motion.span>
            </motion.span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="font-display text-[clamp(22px,4.5vw,36px)] font-light leading-snug mt-6"
          variants={itemVariants}
        >
          <span style={{ color: 'var(--text-medium)' }}>
            Dez apps, dez perfis, dez fragmentos de quem você é.
          </span>{' '}
          <span className="text-gradient-green">Aqui, você é inteiro.</span>
        </motion.h2>

        {/* Body text */}
        <motion.p
          className="mt-7 text-base leading-relaxed"
          variants={itemVariants}
          style={{ color: 'var(--text-medium)' }}
        >
          As redes atuais se beneficiam de te fragmentar. Cada uma captura um
          pedaço e te coloca numa caixinha. No Sommar, sua essência é uma só.
          Você controla quais facetas revelar, conforme o momento.
        </motion.p>

        {/* Facets intro */}
        <motion.p
          className="mt-10 font-display text-lg italic"
          variants={itemVariants}
          style={{ color: 'var(--text-strong)' }}
        >
          Um perfil. O contexto muda. Você decide.
        </motion.p>

        {/* Facets Grid */}
        <motion.div
          className="mt-8 flex flex-col gap-4 text-left"
          variants={containerVariants}
        >
          {FACETS.map((facet) => (
            <motion.div
              key={facet.label}
              className="flex items-center gap-4"
              variants={itemVariants}
            >
              {/* Color accent bar */}
              <div
                className="w-[3px] h-[28px] rounded-full flex-shrink-0"
                style={{ background: facet.gradient }}
              />
              {/* Facet label */}
              <span
                className="text-sm font-medium w-[110px] flex-shrink-0"
                style={{ color: 'var(--text-strong)' }}
              >
                {facet.label}
              </span>
              {/* Context description */}
              <span
                className="text-sm"
                style={{ color: 'var(--text-subtle)' }}
              >
                {facet.context}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom line */}
        <motion.p
          className="mt-12 font-display text-[clamp(16px,3vw,22px)] font-light leading-snug"
          variants={itemVariants}
          style={{ color: 'var(--text-medium)' }}
        >
          Chega de ser{' '}
          <span style={{ color: 'var(--green-glow)' }}>5%</span> de quem você
          é em 10 lugares diferentes.
        </motion.p>

        {/* Bottom accent */}
        <motion.div
          className="mx-auto mt-10 h-px w-10"
          variants={itemVariants}
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--green-glow), transparent)',
            opacity: 0.4,
          }}
        />
      </motion.div>
    </section>
  );
}
