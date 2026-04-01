'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FACETS } from '@/lib/constants';

interface FacetSelectorProps {
  activeFacets: string[];
  onToggle: (facetId: string) => void;
  onConfirm: () => void;
}

function ToggleSwitch({
  checked,
  disabled = false,
  color,
}: {
  checked: boolean;
  disabled?: boolean;
  color: string;
}): JSX.Element {
  return (
    <div
      className={cn(
        'relative w-11 h-6 rounded-full transition-all duration-300',
        disabled && 'opacity-60',
        checked ? '' : 'bg-white/[0.08]'
      )}
      style={checked ? { backgroundColor: `${color}33` } : undefined}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full shadow-sm"
        animate={{
          left: checked ? 22 : 2,
          backgroundColor: checked ? color : 'rgba(255,255,255,0.3)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={
          checked
            ? { boxShadow: `0 0 8px ${color}66` }
            : undefined
        }
      />
    </div>
  );
}

export function FacetSelector({
  activeFacets,
  onToggle,
  onConfirm,
}: FacetSelectorProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-display font-semibold text-[var(--text-strong)]">
          Seus lados
        </h2>
        <p className="text-sm text-[var(--text-medium)]">
          Ative os tipos de conexão que você quer explorar.
          Pode mudar depois a qualquer momento.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {FACETS.map((facet, index) => {
          const isEssencia = facet.id === 'essencia';
          const isActive = isEssencia || activeFacets.includes(facet.id);

          return (
            <motion.div
              key={facet.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={cn(
                'flex items-center justify-between',
                'px-4 py-3.5 rounded-xl',
                'border transition-all duration-300',
                'backdrop-blur-sm',
                isActive
                  ? 'bg-white/[0.04] border-[rgba(255,255,255,0.08)]'
                  : 'bg-white/[0.02] border-[rgba(255,255,255,0.04)]'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Color dot */}
                <div
                  className="w-3 h-3 rounded-full shrink-0 transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? facet.color : 'rgba(255,255,255,0.15)',
                    boxShadow: isActive ? `0 0 8px ${facet.color}44` : 'none',
                  }}
                />

                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      isActive ? 'text-[var(--text-strong)]' : 'text-[var(--text-subtle)]'
                    )}
                  >
                    {facet.label}
                  </span>
                  {isEssencia && (
                    <span className="text-[10px] text-[var(--text-subtle)]">
                      Sempre ativa
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isEssencia) onToggle(facet.id);
                }}
                disabled={isEssencia}
                className="cursor-pointer disabled:cursor-default"
                aria-label={`${isActive ? 'Desativar' : 'Ativar'} ${facet.label}`}
              >
                <ToggleSwitch
                  checked={isActive}
                  disabled={isEssencia}
                  color={facet.color}
                />
              </button>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        type="button"
        onClick={onConfirm}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'w-full max-w-sm h-12 rounded-full font-medium text-sm',
          'bg-[var(--green)] text-black',
          'hover:bg-[var(--green-glow)] hover:shadow-[0_0_24px_rgba(29,255,168,0.3)]',
          'transition-all duration-300 cursor-pointer'
        )}
      >
        Continuar
      </motion.button>
    </div>
  );
}
