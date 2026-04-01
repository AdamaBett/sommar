'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SommarLogo } from '@/components/ui/SommarLogo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function LandingNav(): JSX.Element {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll(): void {
      setScrolled(window.scrollY > 40);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'flex items-center justify-between',
        'px-5 md:px-8 h-16',
        'transition-all duration-300',
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.04]'
          : 'bg-transparent'
      )}
    >
      <SommarLogo size="sm" />

      <Link href="/login">
        <Button variant="secondary" size="sm" className="border-[var(--green)]/40 text-[var(--green-glow)]">
          Criar meu perfil
        </Button>
      </Link>
    </nav>
  );
}
