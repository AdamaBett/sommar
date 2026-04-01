/**
 * SommarLogo — Componente React oficial da logo H5
 *
 * Uso no projeto:
 *   import SommarLogo, { SommarLogomark } from '@/components/brand/SommarLogo'
 *
 *   <SommarLogo />                  → wordmark dark, tamanho md
 *   <SommarLogo size="lg" />        → tamanho lg (hero, splash)
 *   <SommarLogo size="sm" />        → tamanho sm (nav mobile, footer)
 *   <SommarLogo theme="light" />    → texto escuro, gradientes muted (fundo claro)
 *   <SommarLogomark />              → apenas as ondas MM (loading, avatar)
 *   <SommarLogomark size="lg" />
 */

import React from 'react'

type Size = 'sm' | 'md' | 'lg'
type Theme = 'dark' | 'light'

interface LogoProps {
  size?: Size
  theme?: Theme
  className?: string
}

interface MarkProps {
  size?: Size
  className?: string
}

// ── tamanhos ──────────────────────────────────────────
const FONT: Record<Size, number> = { sm: 28, md: 52, lg: 72 }

// wave width/height escalam proporcionalmente ao font-size md (52px)
const WAVE_W: Record<Size, number> = { sm: 82,  md: 150, lg: 208 }
const WAVE_H: Record<Size, number> = { sm: 23,  md: 42,  lg: 58  }
const STROKE: Record<Size, number> = { sm: 5.5, md: 3.5, lg: 3.2 }
const SPACING: Record<Size, number> = { sm: 2, md: 3, lg: 4 }

// margin-right das ondas = letter-spacing (para igualar espaço dos dois lados)
// margin-left = 0 (letter-spacing já adiciona espaço após o "O")
const WAVE_MARGIN_R: Record<Size, number> = { sm: 2, md: 3, lg: 4 }

// ── gradientes dark (neon) ────────────────────────────
const GradDark = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={`${id}1`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stopColor="#1DFFA8" />
      <stop offset="50%"  stopColor="#00D4FF" />
      <stop offset="100%" stopColor="#A855F7" />
    </linearGradient>
    <linearGradient id={`${id}2`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stopColor="#A855F7" />
      <stop offset="50%"  stopColor="#EC4899" />
      <stop offset="100%" stopColor="#FFB840" />
    </linearGradient>
  </defs>
)

// ── gradientes light (muted) ──────────────────────────
const GradLight = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={`${id}1`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stopColor="#1D9E75" />
      <stop offset="50%"  stopColor="#0099BB" />
      <stop offset="100%" stopColor="#7C3AED" />
    </linearGradient>
    <linearGradient id={`${id}2`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stopColor="#7C3AED" />
      <stop offset="50%"  stopColor="#DB2777" />
      <stop offset="100%" stopColor="#D97706" />
    </linearGradient>
  </defs>
)

// ── paths H5 ──────────────────────────────────────────
// M1 termina em x=82, M2 começa em x=72 → interseção de 10px (a conexão)
const M1 = 'M2 38 C10 38,14 4,22 4 C30 4,34 38,42 38 C50 38,54 4,62 4 C70 4,76 38,82 38'
const M2 = 'M72 38 C78 38,82 4,90 4 C98 4,102 38,110 38 C118 38,122 4,130 4 C138 4,144 38,148 38'

// ── wordmark ──────────────────────────────────────────
export function SommarLogo({ size = 'md', theme = 'dark', className = '' }: LogoProps) {
  const fs      = FONT[size]
  const ww      = WAVE_W[size]
  const wh      = WAVE_H[size]
  const sw      = STROKE[size]
  const ls      = SPACING[size]
  const mr      = WAVE_MARGIN_R[size]
  const color   = theme === 'dark' ? '#ffffff' : '#111111'
  const Grad    = theme === 'dark' ? GradDark : GradLight
  const id      = `logo-${size}-${theme}`

  return (
    <div
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}
    >
      <span style={{
        fontFamily: "'Fraunces', serif",
        fontSize: fs,
        fontWeight: 400,
        color,
        letterSpacing: ls,
        lineHeight: 1,
        userSelect: 'none',
      }}>
        SO
      </span>

      <svg
        width={ww}
        height={wh}
        viewBox="0 0 150 42"
        style={{ flexShrink: 0, marginRight: mr }}
        aria-hidden="true"
      >
        <Grad id={id} />
        <path d={M1} fill="none" stroke={`url(#${id}1)`} strokeWidth={sw} strokeLinecap="round" opacity={0.9} />
        <path d={M2} fill="none" stroke={`url(#${id}2)`} strokeWidth={sw} strokeLinecap="round" opacity={0.9} />
      </svg>

      <span style={{
        fontFamily: "'Fraunces', serif",
        fontSize: fs,
        fontWeight: 400,
        color,
        letterSpacing: ls,
        lineHeight: 1,
        userSelect: 'none',
      }}>
        AR
      </span>
    </div>
  )
}

// ── logomark (ondas apenas) ───────────────────────────
const MARK_W: Record<Size, number> = { sm: 56, md: 88, lg: 120 }
const MARK_H: Record<Size, number> = { sm: 16, md: 25, lg: 34  }
const MARK_S: Record<Size, number> = { sm: 5,  md: 4,  lg: 3   }

export function SommarLogomark({ size = 'md', className = '' }: MarkProps) {
  const id = `mark-${size}`
  return (
    <svg
      width={MARK_W[size]}
      height={MARK_H[size]}
      viewBox="0 0 150 42"
      className={className}
      aria-label="Sommar"
      role="img"
    >
      <defs>
        <linearGradient id={`${id}1`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1DFFA8" />
          <stop offset="50%"  stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id={`${id}2`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#A855F7" />
          <stop offset="50%"  stopColor="#EC4899" />
          <stop offset="100%" stopColor="#FFB840" />
        </linearGradient>
      </defs>
      <path d={M1} fill="none" stroke={`url(#${id}1)`} strokeWidth={MARK_S[size]} strokeLinecap="round" opacity={0.9} />
      <path d={M2} fill="none" stroke={`url(#${id}2)`} strokeWidth={MARK_S[size]} strokeLinecap="round" opacity={0.9} />
    </svg>
  )
}

export default SommarLogo
