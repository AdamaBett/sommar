import { CosmosBackground } from '@/components/landing/CosmosBackground';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { ProblemStats } from '@/components/landing/ProblemStats';
import { Antidote } from '@/components/landing/Antidote';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { NotJustDating } from '@/components/landing/NotJustDating';
import { ForOrganizers } from '@/components/landing/ForOrganizers';
import { EmailCapture } from '@/components/landing/EmailCapture';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage(): JSX.Element {
  return (
    <>
      <CosmosBackground />
      <LandingNav />
      <main>
        <Hero />
        <ProblemStats />
        <Antidote />
        <HowItWorks />
        <NotJustDating />
        <ForOrganizers />
        <EmailCapture />
      </main>
      <Footer />
    </>
  );
}
