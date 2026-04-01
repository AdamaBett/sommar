import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app/AppShell';

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  let userId = 'demo-user';

  if (isSupabaseConfigured) {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login');
    }

    userId = user.id;
  }

  return <AppShell userId={userId}>{children}</AppShell>;
}
