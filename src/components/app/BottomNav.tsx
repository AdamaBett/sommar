'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavTab {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactElement;
}

function LobbyIcon({ active }: { active: boolean }): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2L20.66 7.5V16.5L12 22L3.34 16.5V7.5L12 2Z"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={active ? 'rgba(29,255,168,0.08)' : 'none'}
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.2"
        fill={active ? 'rgba(29,255,168,0.15)' : 'none'}
      />
    </svg>
  );
}

function EventsIcon({ active }: { active: boolean }): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="3"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.5"
        fill={active ? 'rgba(29,255,168,0.08)' : 'none'}
      />
      <path
        d="M3 9H21"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.5"
      />
      <path
        d="M8 2V5"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 2V5"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="15"
        r="2"
        fill={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
      />
    </svg>
  );
}

function ConnectionsIcon({ active }: { active: boolean }): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pessoa esquerda */}
      <circle
        cx="8"
        cy="7"
        r="3"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.3"
        fill={active ? 'rgba(29,255,168,0.08)' : 'none'}
      />
      <path
        d="M3 18C3 15.2386 5.23858 13 8 13"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Pessoa direita */}
      <circle
        cx="16"
        cy="7"
        r="3"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.3"
        fill={active ? 'rgba(29,255,168,0.08)' : 'none'}
      />
      <path
        d="M21 18C21 15.2386 18.7614 13 16 13"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Linha de conexao */}
      <path
        d="M10 15L14 15"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
      {/* Coracao pequeno central */}
      <path
        d="M12 19.5C12 19.5 9.5 17.5 9.5 16.5C9.5 15.7 10.2 15.2 10.8 15.2C11.2 15.2 11.7 15.5 12 16C12.3 15.5 12.8 15.2 13.2 15.2C13.8 15.2 14.5 15.7 14.5 16.5C14.5 17.5 12 19.5 12 19.5Z"
        fill={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
      />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.5"
        fill={active ? 'rgba(29,255,168,0.08)' : 'none'}
      />
      <path
        d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z"
        stroke={active ? '#1DFFA8' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.5"
        fill={active ? 'rgba(29,255,168,0.08)' : 'none'}
      />
    </svg>
  );
}

const tabs: NavTab[] = [
  {
    href: '/lobby',
    label: 'Lobby',
    icon: (active) => <LobbyIcon active={active} />,
  },
  {
    href: '/connections',
    label: 'Conexões',
    icon: (active) => <ConnectionsIcon active={active} />,
  },
  {
    href: '/events',
    label: 'Eventos',
    icon: (active) => <EventsIcon active={active} />,
  },
  {
    href: '/profile',
    label: 'Perfil',
    icon: (active) => <ProfileIcon active={active} />,
  },
];

export function BottomNav(): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        height: '60px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'linear-gradient(to top, #000 60%, transparent)',
      }}
      aria-label="Menu principal"
    >
      <div className="mx-auto flex h-full max-w-lg items-center justify-around px-4">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2',
                'transition-all duration-200',
                isActive
                  ? 'text-green-glow'
                  : 'text-white-subtle hover:text-white-medium'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon(isActive)}
              <span
                className={cn(
                  'font-body leading-none',
                  isActive ? 'text-green-glow' : 'text-white-subtle'
                )}
                style={{ fontSize: '10px', letterSpacing: '0.5px' }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
