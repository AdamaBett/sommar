'use client';

import { SommarLogomark } from '@/components/ui/SommarLogo';

/* ------------------------------------------------------------------ */
/*  Links do footer                                                    */
/* ------------------------------------------------------------------ */

interface FooterLink {
  label: string;
  href: string;
}

const LINKS: FooterLink[] = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Para Organizadores', href: '#organizadores' },
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Termos', href: '/termos' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Footer(): JSX.Element {
  return (
    <footer className="relative z-10 border-t border-white/[0.04] px-6 py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        {/* Logomark */}
        <SommarLogomark size="sm" className="opacity-40" />

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith('#')) {
                  e.preventDefault();
                  const target = document.getElementById(link.href.slice(1));
                  target?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-xs hover:text-white/60 transition-colors duration-200"
              style={{ color: 'var(--text-subtle)' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p
          className="text-xs text-center"
          style={{ color: 'var(--text-subtle)', opacity: 0.5 }}
        >
          &copy; 2026 Sommar. Feito com &#10084;&#65039; em Florianópolis.
        </p>
      </div>
    </footer>
  );
}
