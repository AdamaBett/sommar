import { cn } from '@/lib/utils';

type OrbSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface MatterOrbProps {
  size?: OrbSize;
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
  className,
}: MatterOrbProps): JSX.Element {
  const px = sizeMap[size];
  const blur = blurMap[size];

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      {/* Aura — outermost breathing glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--green-glow) 0%, var(--cyan) 50%, transparent 70%)',
          filter: `blur(${blur}px)`,
          animation: 'orb-breathe 5s ease-in-out infinite',
        }}
      />

      {/* S2 — warm secondary sphere (coral/pink/amber) */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '10%',
          background: 'radial-gradient(circle at 60% 40%, var(--coral-glow) 0%, var(--pink) 40%, var(--amber-glow) 80%)',
          opacity: 0.6,
          animation: 'orb-float-2 9s ease-in-out infinite',
        }}
      />

      {/* S1 — cool secondary sphere (green/cyan/purple) */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '15%',
          background: 'radial-gradient(circle at 40% 60%, var(--green-glow) 0%, var(--cyan) 45%, var(--purple) 90%)',
          opacity: 0.7,
          animation: 'orb-float-1 7s ease-in-out infinite',
        }}
      />

      {/* Core — bright center pulse */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '30%',
          background: 'radial-gradient(circle, #fff 0%, var(--green-glow) 40%, var(--cyan) 80%)',
          animation: 'orb-pulse 4s ease-in-out infinite',
        }}
      />

      {/* Ring — thin rotating border */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '1px solid rgba(29, 255, 168, 0.25)',
          animation: 'orb-rotate 30s linear infinite',
        }}
      />
    </div>
  );
}
