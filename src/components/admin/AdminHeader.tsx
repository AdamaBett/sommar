'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SommarLogo } from '@/components/ui/SommarLogo';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/manage-events', label: 'Eventos' },
  { href: '/users', label: 'Usuários' },
  { href: '/moderation', label: 'Moderação' },
] as const;

interface AdminHeaderProps {
  userName?: string;
}

export function AdminHeader({ userName = 'Creator' }: AdminHeaderProps): JSX.Element {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <SommarLogo size="sm" />
            </Link>
            <div className="hidden sm:block h-6 w-px bg-white/[0.08]" />
            <h1 className="hidden sm:block font-display text-lg text-white/70">
              Torre de Controle
            </h1>
          </div>

          {/* Navegação */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Avatar */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50 hidden sm:block">{userName}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green-glow)] to-[var(--cyan)] flex items-center justify-center text-black text-xs font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Navegação mobile */}
        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200',
                  isActive
                    ? 'text-white bg-white/[0.08]'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
