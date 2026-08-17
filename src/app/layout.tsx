import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { readFile } from 'fs/promises';
import path from 'path';
import Script from 'next/script';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'MonkeyMan — Personal Travel Journal from Vietnam', template: '%s | MonkeyMan' },
  description: 'Personal travel journal by Tuấn Anh — exploring Vietnam through every journey.',
  metadataBase: new URL('https://monkeyman.vn'),
  openGraph: {
    type: 'website',
    url: 'https://monkeyman.vn',
    siteName: 'MonkeyMan',
    locale: 'en_US',
    title: 'MonkeyMan — Personal Travel Journal from Vietnam',
    description: 'Personal travel journal by Tuấn Anh — exploring Vietnam through every journey.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MonkeyMan — Personal Travel Journal from Vietnam',
    description: 'Personal travel journal by Tuấn Anh — exploring Vietnam through every journey.',
  },
};

async function getGaId(): Promise<string> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'public', 'site-settings.json'), 'utf-8');
    return (JSON.parse(raw) as { gaId?: string }).gaId ?? '';
  } catch {
    return '';
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = await getGaId();

  return (
    <html className={roboto.variable} suppressHydrationWarning>
      <body className="bg-white text-ink font-sans antialiased" suppressHydrationWarning>
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
