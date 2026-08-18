import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={roboto.variable} suppressHydrationWarning>
      <body className="bg-white text-ink font-sans antialiased" suppressHydrationWarning>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8CHCD01JT1"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8CHCD01JT1');
        `}</Script>
      </body>
    </html>
  );
}
