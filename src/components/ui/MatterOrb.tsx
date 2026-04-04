import { cn } from '@/lib/utils';

type OrbSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type OrbVariant = 'default' | 'ethereal';

interface MatterOrbProps {
  size?: OrbSize;
  variant?: OrbVariant;
  className?: string;
}

const sizeMap: Record<OrbSize, number> = {
  xs: 24,
  sm: 40,
  md: 80,
  lg: 140,
  xl: 190,
};

// Blur scales with orb size for proper glow effect
const blurMap: Record<OrbSize, number> = {
  xs: 6,
  sm: 10,
  md: 25,
  lg: 40,
  xl: 50,
};

export function MatterOrb({
  size = 'md',
  variant = 'default',
  className,
}: MatterOrbProps): JSX.Element {
  const px = sizeMap[size];
  const baseBlur = blurMap[size];
  const isEthereal = variant === 'ethereal';

  // Ethereal increases blur by ~50%
  const blur = isEthereal ? Math.round(baseBlur * 1.5) : baseBlur;

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      {/* Aura — outermost breathing glow */}
      <div
        className="absolute rounded-full"
        style={{
          inset: isEthereal ? '-15%' : '0',
          background: 'radial-gradient(circle, var(--green-glow) 0%, var(--cyan) 50%, transparent 70%)',
          filter: `blur(${blur}px)`,
          opacity: isEthereal ? 0.5 : 1,
          animation: 'orb-breathe 5s ease-in-out infinite',
        }}
      />

      {/* S2 — warm secondary sphere (coral/pink/amber) */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '10%',
          background: 'radial-gradient(circle at 60% 40%, var(--coral-glow) 0%, var(--pink) 40%, var(--amber-glow) 80%)',
          opacity: isEthereal ? 0.3 : 0.6,
          filter: isEthereal ? `blur(${Math.round(baseBlur * 0.4)}px)` : undefined,
          animation: 'orb-float-2 9s ease-in-out infinite',
        }}
      />

      {/* S1 — cool secondary sphere (green/cyan/purple) */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '15%',
          background: 'radial-gradient(circle at 40% 60%, var(--green-glow) 0%, var(--cyan) 45%, var(--purple) 90%)',
          opacity: isEthereal ? 0.35 : 0.7,
          filter: isEthereal ? `blur(${Math.round(baseBlur * 0.3)}px)` : undefined,
          animation: 'orb-float-1 7s ease-in-out infinite',
        }}
      />

      {/* Core — bright center pulse */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '30%',
          background: isEthereal
            ? 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, var(--green-glow) 40%, var(--cyan) 80%)'
            : 'radial-gradient(circle, #fff 0%, var(--green-glow) 40%, var(--cyan) 80%)',
          opacity: isEthereal ? 0.6 : 1,
          filter: isEthereal ? `blur(${Math.round(baseBlur * 0.3)}px)` : undefined,
          animation: 'orb-pulse 4s ease-in-out infinite',
        }}
      />

      {/* Ring — thin rotating border */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid rgba(29, 255, 168, ${isEthereal ? 0.1 : 0.25})`,
          animation: 'orb-rotate 30s linear infinite',
        }}
      />
    </div>
  );
}
