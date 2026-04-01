import { type Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Entrar | Sommar',
  description: 'Entre no Sommar e descubra conexões que fazem sentido.',
};

export default function LoginPage(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
