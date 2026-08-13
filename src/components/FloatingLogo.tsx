'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useTransition } from 'react';

const SUGGESTIONS = {
  vi: {
    msg: 'Bạn muốn chuyển sang\ntiếng Anh không?',
    btn: 'Switch to English →',
    next: 'en',
  },
  en: {
    msg: 'Do you want to switch\nto Vietnamese?',
    btn: 'Chuyển tiếng Việt →',
    next: 'vi',
  },
  ko: {
    msg: '다른 언어로\n전환하시겠어요?',
    btn: '영어로 전환 →',
    next: 'en',
  },
} as const;

export default function FloatingLogo({ logoUrl }: { logoUrl: string }) {
  const locale = useLocale() as 'vi' | 'en' | 'ko';
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [isPending, startTransition] = useTransition();

  const s = SUGGESTIONS[locale] ?? SUGGESTIONS.en;

  function switchLocale() {
    document.cookie = `NEXT_LOCALE=${s.next}; path=/; max-age=31536000; SameSite=Lax`;
    setHovered(false);
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="fixed bottom-7 right-7 z-50 flex flex-col items-end gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Speech bubble */}
      <div
        className={`transition-all duration-300 ease-out ${
          hovered
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 max-w-[200px]">
          <p className="text-[13px] font-sans text-ink leading-snug whitespace-pre-line mb-3">
            {s.msg}
          </p>
          <button
            onClick={switchLocale}
            disabled={isPending}
            className="w-full bg-sage text-white text-[11px] font-semibold font-sans px-3 py-1.5 rounded-lg hover:bg-sage/90 transition-colors disabled:opacity-60"
          >
            {s.btn}
          </button>
          {/* Triangle pointer at bottom-right */}
          <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
        </div>
      </div>

      {/* Monkey logo button */}
      <button
        onClick={() => setHovered((v) => !v)}
        aria-label="Switch language"
        className="w-14 h-14 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.18)] hover:scale-110 hover:shadow-[0_6px_24px_rgba(0,0,0,0.25)] transition-all duration-300"
      >
        <Image
          src={logoUrl}
          alt="MonkeyMan"
          width={56}
          height={56}
          className="object-cover"
        />
      </button>
    </div>
  );
}
