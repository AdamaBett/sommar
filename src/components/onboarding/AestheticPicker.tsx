'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ARCHETYPES, MIN_ARCHETYPES } from '@/lib/constants';

interface AestheticPickerProps {
  selected: number[];
  onToggle: (id: number) => void;
  onConfirm: () => void;
}

export function AestheticPicker({
  selected,
  onToggle,
  onConfirm,
}: AestheticPickerProps): JSX.Element {
  const canConfirm = selected.length >= MIN_ARCHETYPES;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-display font-semibold text-[var(--text-strong)]">
          Suas energias
        </h2>
        <p className="text-sm text-[var(--text-medium)]">
          Escolha pelo menos {MIN_ARCHETYPES} que combinam com voce
        </p>
      </div>

      {/* Grid 3x3 */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {ARCHETYPES.map((archetype, index) => {
          const isSelected = selected.includes(archetype.id);

          return (
            <motion.button
              key={archetype.id}
              type="button"
              onClick={() => onToggle(archetype.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.93 }}
              className={cn(
                'relative flex flex-col items-center justify-center gap-2',
                'aspect-square rounded-2xl',
                'border transition-all duration-300',
                'backdrop-blur-sm',
                isSelected
                  ? 'bg-[rgba(29,158,117,0.1)] border-[var(--green)] shadow-[0_0_20px_rgba(29,255,168,0.15)]'
                  : 'bg-white/[0.03] border-[rgba(255,255,255,0.06)] hover:bg-white/[0.06] hover:border-[rgba(255,255,255,0.12)]'
              )}
            >
              {/* Checkmark overlay quando selecionado */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--green)] flex items-center justify-center"
                >
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}

              {/* Emoji circle */}
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
                  'transition-all duration-300',
                  isSelected
                    ? 'bg-[rgba(29,255,168,0.1)] shadow-[0_0_12px_rgba(29,255,168,0.2)]'
                    : 'bg-white/[0.04]'
                )}
              >
                {archetype.emoji}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-300',
                  isSelected
                    ? 'text-[var(--green-glow)]'
                    : 'text-[var(--text-medium)]'
                )}
              >
                {archetype.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Contador + botao */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <span className="text-xs text-[var(--text-subtle)]">
          {selected.length} de {MIN_ARCHETYPES} minimo
        </span>

        <motion.button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm}
          whileTap={canConfirm ? { scale: 0.97 } : undefined}
          className={cn(
            'w-full h-12 rounded-full font-medium text-sm',
            'transition-all duration-300',
            canConfirm
              ? 'bg-[var(--green)] text-black hover:bg-[var(--green-glow)] hover:shadow-[0_0_24px_rgba(29,255,168,0.3)] cursor-pointer'
              : 'bg-white/[0.06] text-[var(--text-subtle)] cursor-not-allowed'
          )}
        >
          Confirmar escolhas
        </motion.button>
      </div>
    </div>
  );
}
