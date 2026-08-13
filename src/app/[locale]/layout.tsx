import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { readFile } from 'fs/promises';
import path from 'path';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HtmlLang from '@/components/HtmlLang';
import FloatingLogo from '@/components/FloatingLogo';

async function getSiteSettings() {
  try {
    const raw = await readFile(path.join(process.cwd(), 'public', 'site-settings.json'), 'utf-8');
    return JSON.parse(raw) as {
      siteName: string;
      logoUrl: string;
      title: { vi: string; en: string; ko: string };
      description: { vi: string; en: string; ko: string };
      ogImage: string;
      keywords: string;
      author: string;
      twitterHandle: string;
      faviconUrl: string;
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as 'vi' | 'en' | 'ko';
  const s = await getSiteSettings();
  if (!s) return {};

  const isIco = s.faviconUrl?.endsWith('.ico');
  const icons: Metadata['icons'] = s.faviconUrl
    ? {
        icon: [{ url: s.faviconUrl, ...(isIco ? {} : { type: 'image/png', sizes: '32x32' }) }],
        apple: [{ url: s.faviconUrl, sizes: '180x180' }],
        shortcut: s.faviconUrl,
      }
    : { icon: '/favicon.ico', shortcut: '/favicon.ico' };

  return {
    title: s.title?.[l] || s.siteName,
    description: s.description?.[l],
    keywords: s.keywords,
    authors: s.author ? [{ name: s.author }] : undefined,
    robots: { index: true, follow: true },
    alternates: { canonical: 'https://monkeyman.vn' },
    openGraph: {
      type: 'website',
      url: 'https://monkeyman.vn',
      siteName: s.siteName,
      locale: l === 'vi' ? 'vi_VN' : l === 'ko' ? 'ko_KR' : 'en_US',
      title: s.title?.[l],
      description: s.description?.[l],
      ...(s.ogImage ? { images: [{ url: s.ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: s.twitterHandle || undefined,
      creator: s.twitterHandle || undefined,
      title: s.title?.[l],
      description: s.description?.[l],
      ...(s.ogImage ? { images: [s.ogImage] } : {}),
    },
    ...(icons ? { icons } : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'vi' | 'en' | 'ko')) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getSiteSettings();
  const logoUrl = settings?.logoUrl || '/images/monkey-man-logo.png';

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLang locale={locale} />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingLogo logoUrl={logoUrl} />
    </NextIntlClientProvider>
  );
}
