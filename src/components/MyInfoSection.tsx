'use client';

import { useState, useEffect } from 'react';
import SmartImage from './SmartImage';

type Locale = 'vi' | 'en' | 'ko';
type MyInfo = {
  portraitImage: string;
  title: { vi: string; en: string; ko: string };
  text:  { vi: string; en: string; ko: string };
};

const DEFAULT: MyInfo = {
  portraitImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  title: {
    vi: 'Mỗi chuyến đi là một trang nhật ký mới',
    en: 'Every trip is a brand new diary page',
    ko: '모든 여행은 새로운 일기의 한 페이지입니다',
  },
  text: {
    vi: 'Kết nối với tôi qua mạng xã hội để không bỏ lỡ bất kỳ chuyến phiêu lưu nào.',
    en: 'Connect with me on social media to never miss any adventure.',
    ko: '소셜 미디어에서 저와 연결하여 어떤 모험도 놓치지 마세요.',
  },
};

export default function MyInfoSection({ locale }: { locale: Locale }) {
  const [info, setInfo] = useState<MyInfo>(DEFAULT);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem('admin:info');
        setInfo(stored ? JSON.parse(stored) : DEFAULT);
      } catch {}
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('focus', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('focus', load);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center gap-0">
      <div className="md:w-[35%] flex justify-center">
        <div className="relative w-[260px] aspect-[3/4] overflow-hidden rounded-full">
          <SmartImage src={info.portraitImage} alt="MonkeyMan" fill className="object-cover" />
        </div>
      </div>
      <div className="md:w-[65%] px-8 md:px-10 lg:px-12 py-16 md:py-0">
        <h2 className="wl-title text-3xl sm:text-4xl mb-5">{info.title[locale]}</h2>
        <p className="text-meta text-[15px] leading-relaxed mb-8">{info.text[locale]}</p>
      </div>
    </div>
  );
}
