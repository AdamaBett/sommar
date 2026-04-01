import { redirect } from 'next/navigation';
import { CosmosBackground } from '@/components/landing/CosmosBackground';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function OnboardingPage(): Promise<JSX.Element> {
  let userId = 'demo-user';
  let savedProgress: Record<string, unknown> = {};

  if (isSupabaseConfigured) {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login');
    }

    userId = user.id;

    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete, onboarding_progress')
      .eq('id', user.id)
      .single();

    if (profile?.onboarding_complete) {
      redirect('/lobby');
    }

    savedProgress = profile?.onboarding_progress ?? {};
  }

  return (
    <>
      <CosmosBackground />
      <div className="relative z-10 min-h-screen">
        <OnboardingFlow
          userId={userId}
          savedProgress={savedProgress}
        />
      </div>
    </>
  );
}
