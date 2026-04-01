import { CosmosBackground } from '@/components/landing/CosmosBackground';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { ProblemStats } from '@/components/landing/ProblemStats';
import { Antidote } from '@/components/landing/Antidote';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { NotJustDating } from '@/components/landing/NotJustDating';
import { MidCTA } from '@/components/landing/MidCTA';
import { ForOrganizers } from '@/components/landing/ForOrganizers';
import { FinalCTA } from '@/components/landing/FinalCTA';
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
        <MidCTA />
        <ForOrganizers />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
