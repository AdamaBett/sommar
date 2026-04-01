'use client';

import { useMemo } from 'react';
import type { LobbyParticipant } from '@/app/(app)/lobby/page';
import { ProfileCircle } from '@/components/lobby/ProfileCircle';

interface LobbyGridProps {
  participants: LobbyParticipant[];
  onPersonClick: (person: LobbyParticipant) => void;
}

/**
 * Honeycomb hex grid - alternating rows of 3 and 4 items.
 * Offset rows are shifted right by half a hex width (46px).
 * Rows overlap vertically with negative margin (-14px) for honeycomb feel.
 */
export function LobbyGrid({
  participants,
  onPersonClick,
}: LobbyGridProps): JSX.Element {
  const rows = useMemo(() => {
    const result: { items: LobbyParticipant[]; isOffset: boolean }[] = [];
    let index = 0;
    let rowIndex = 0;

    while (index < participants.length) {
      const isOffset = rowIndex % 2 === 1;
      const rowSize = isOffset ? 4 : 3;
      const items = participants.slice(index, index + rowSize);
      result.push({ items, isOffset });
      index += rowSize;
      rowIndex++;
    }

    return result;
  }, [participants]);

  return (
    <div className="flex flex-col items-center gap-0 py-2 px-0">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex justify-center gap-2.5"
          style={{
            marginBottom: rowIdx < rows.length - 1 ? '-14px' : '0',
            marginLeft: row.isOffset ? '46px' : '0',
          }}
        >
          {row.items.map((person, itemIdx) => {
            // Staggered pop-in animation delay
            const delay = (rowIdx * 3 + itemIdx) * 0.05;
            return (
              <ProfileCircle
                key={person.id}
                person={person}
                animationDelay={delay}
                onClick={() => onPersonClick(person)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
