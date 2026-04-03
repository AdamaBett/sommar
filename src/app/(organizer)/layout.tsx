import { redirect } from 'next/navigation';
import { ROLES } from '@/lib/constants';

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const metadata = {
  title: 'Portal do Organizador',
};

export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  if (isSupabaseConfigured) {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Organizadores e creators podem acessar
    if (profile?.role !== ROLES.organizer && profile?.role !== ROLES.creator) {
      redirect('/lobby');
    }
  }

  return <div className="min-h-screen bg-black text-white">{children}</div>;
}
