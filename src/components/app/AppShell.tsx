'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { BottomNav } from '@/components/app/BottomNav';
import { MatterFAB } from '@/components/matter/MatterFAB';
import { MatterPanel } from '@/components/matter/MatterPanel';

interface AppShellProps {
  userId: string;
  children: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AppShell({ userId, children }: AppShellProps): React.ReactElement {
  const [matterOpen, setMatterOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  const handleOpenMatter = useCallback(() => {
    setMatterOpen(true);
    setHasNotification(false);
  }, []);

  const handleCloseMatter = useCallback(() => {
    setMatterOpen(false);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Conteudo principal com padding inferior para a nav bar */}
      <main className="pb-[80px]">
        {children}
      </main>

      {/* Matter FAB flutuante */}
      <MatterFAB
        hasNotification={hasNotification}
        onClick={handleOpenMatter}
      />

      {/* Bottom navigation tabs */}
      <BottomNav />

      {/* Matter chat panel (slide-up overlay) */}
      <MatterPanel
        isOpen={matterOpen}
        onClose={handleCloseMatter}
      />
    </div>
  );
}
