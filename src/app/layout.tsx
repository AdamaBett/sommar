import type { Metadata, Viewport } from 'next';
import { Fraunces, Outfit } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-fraunces',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
});

const TAB_TITLE = 'Sommar | Conexões reais'
const OG_TITLE = 'Sommar. A pessoa certa está ao seu lado.'
const OG_DESCRIPTION =
  'A IA cria o seu Ori, entende quem você é de verdade, e te conecta com quem você deveria conhecer, no evento que você está agora. Conexão humana real.'

export const metadata: Metadata = {
  title: {
    default: TAB_TITLE,
    template: '%s | Sommar',
  },
  description: OG_DESCRIPTION,
  metadataBase: new URL('https://sommar.app'),
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: 'https://sommar.app',
    siteName: 'Sommar',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: OG_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${fraunces.variable} ${outfit.variable} font-body antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
