'use client';

import { cn } from '@/lib/utils';
import type { FacetFilterType } from '@/components/lobby/LobbyView';

interface FacetFilterProps {
  activeFilter: FacetFilterType;
  onFilterChange: (filter: FacetFilterType) => void;
}

interface FilterOption {
  id: FacetFilterType;
  label: string;
  emoji?: string;
  activeClass: string;
}

const FILTERS: FilterOption[] = [
  {
    id: 'all',
    label: 'Todos',
    activeClass: 'bg-white/[0.06] border-white/[0.18] text-[var(--text-strong)]',
  },
  {
    id: 'intimo',
    label: 'Íntimo',
    emoji: '\u2764\uFE0F',
    activeClass: 'bg-[rgba(236,72,153,0.1)] border-[rgba(236,72,153,0.3)] text-[var(--pink)]',
  },
  {
    id: 'academico',
    label: 'Acadêmico',
    emoji: '\uD83C\uDF93',
    activeClass: 'bg-[rgba(0,212,255,0.08)] border-[rgba(0,212,255,0.25)] text-[var(--cyan)]',
  },
  {
    id: 'profissional',
    label: 'Profissional',
    emoji: '\uD83D\uDCBC',
    activeClass: 'bg-[rgba(239,159,39,0.08)] border-[rgba(255,184,64,0.25)] text-[var(--amber-glow)]',
  },
  {
    id: 'social',
    label: 'Social',
    emoji: '\uD83E\uDD1D',
    activeClass: 'bg-[rgba(168,85,247,0.08)] border-[rgba(168,85,247,0.25)] text-[var(--purple)]',
  },
];

export function FacetFilter({
  activeFilter,
  onFilterChange,
}: FacetFilterProps): JSX.Element {
  return (
    <div
      className="fixed top-[46px] left-0 right-0 z-50 px-5"
      style={{ background: 'linear-gradient(to bottom, #000 70%, transparent)' }}
    >
      <div className="flex gap-1.5 py-2.5 overflow-x-auto scrollbar-none [-webkit-overflow-scrolling:touch]">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                'py-[7px] px-4 rounded-[20px] text-xs font-normal border whitespace-nowrap',
                'transition-all duration-200 shrink-0 select-none',
                isActive
                  ? filter.activeClass
                  : 'bg-transparent border-[var(--border-subtle)] text-[var(--text-medium)]'
              )}
            >
              {filter.emoji && <span className="mr-1">{filter.emoji}</span>}
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
