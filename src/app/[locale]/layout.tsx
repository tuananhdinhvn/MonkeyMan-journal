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

type SiteSettings = {
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

const SETTINGS_FALLBACK: SiteSettings = {
  siteName: 'MonkeyMan',
  logoUrl: '/images/monkey-man-logo.png',
  title: {
    vi: 'MonkeyMan — Nhật Ký Du Lịch Cá Nhân của Tuấn Anh',
    en: 'MonkeyMan — Personal Travel Journal from Vietnam',
    ko: 'MonkeyMan — 베트남 여행 일지 | Tuấn Anh',
  },
  description: {
    vi: 'Nhật ký du lịch cá nhân của Tuấn Anh — khám phá Việt Nam qua từng chuyến đi.',
    en: 'Personal travel journal by Tuấn Anh — exploring Vietnam through every journey.',
    ko: '뚜언 아인의 개인 여행 일지 — 모든 여행을 통해 베트남을 탐험합니다.',
  },
  ogImage: '/images/monkey-man-logo.png',
  keywords: 'travel, vietnam, du lịch, MonkeyMan',
  author: 'Monkey Man',
  twitterHandle: '@MonkeyMan',
  faviconUrl: '/favicon.ico',
};

async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'public', 'site-settings.json'), 'utf-8');
    return { ...SETTINGS_FALLBACK, ...JSON.parse(raw) };
  } catch {
    return SETTINGS_FALLBACK;
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
      locale: 'en_US',
      title: s.title?.en || s.siteName,
      description: s.description?.en,
    },
    twitter: {
      card: 'summary_large_image',
      site: s.twitterHandle || undefined,
      creator: s.twitterHandle || undefined,
      title: s.title?.en || s.siteName,
      description: s.description?.en,
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
