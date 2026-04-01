import { CosmosBackground } from '@/components/landing/CosmosBackground';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <CosmosBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        {children}
      </div>
    </>
  );
}
