'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const ALL_LOCALES = [
  { code: 'vi', label: 'VI' },
  { code: 'en', label: 'EN' },
  { code: 'ko', label: 'KO' },
];

export default function LanguageSwitcher({ atTop = false, hideKo = false }: { atTop?: boolean; hideKo?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const locales = hideKo ? ALL_LOCALES.filter((l) => l.code !== 'ko') : ALL_LOCALES;

  function switchLocale(next: string) {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-0.5">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => switchLocale(l.code)}
          disabled={isPending}
          className={`px-2 py-1 text-[10px] uppercase tracking-widest font-medium transition-colors rounded ${
            locale === l.code
              ? atTop
                ? 'text-white border-b border-white'
                : 'text-ink border-b border-ink'
              : atTop
              ? 'text-white/40 hover:text-white'
              : 'text-gray-400 hover:text-ink'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
