import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import { experiences } from '@/lib/data';
import { Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiences',
  description: 'Stories and impressions from people who have explored Vietnam with me.',
  openGraph: {
    title: 'Experiences | MonkeyMan',
    description: 'Stories and impressions from people who have explored Vietnam with me.',
    url: 'https://monkeyman.vn/experiences',
  },
  twitter: {
    title: 'Experiences | MonkeyMan',
    description: 'Stories and impressions from people who have explored Vietnam with me.',
  },
  alternates: { canonical: 'https://monkeyman.vn/experiences' },
};

export default async function ExperiencesPage() {
  const locale = (await getLocale()) as 'vi' | 'en' | 'ko';
  return <ExperiencesContent locale={locale} />;
}

function ExperiencesContent({ locale }: { locale: 'vi' | 'en' | 'ko' }) {
  const t = useTranslations('experiences');

  return (
    <>
      {/* Header */}
      <div className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-orange-400 font-medium uppercase tracking-widest text-sm mb-3">
            ⭐ Testimonials
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Rating summary */}
      <div className="bg-orange-50 border-b border-orange-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <div className="text-center">
              <p className="text-6xl font-bold text-orange-500">5.0</p>
              <div className="flex gap-1 justify-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className="fill-orange-400 text-orange-400" />
                ))}
              </div>
              <p className="text-slate-500 text-sm mt-1">
                {locale === 'vi' ? 'Đánh giá trung bình' : locale === 'en' ? 'Average Rating' : '평균 평점'}
              </p>
            </div>
            <div className="h-16 w-px bg-orange-200 hidden sm:block" />
            <div className="text-center">
              <p className="text-6xl font-bold text-orange-500">200+</p>
              <p className="text-slate-500 text-sm mt-2">
                {locale === 'vi' ? 'Du khách hài lòng' : locale === 'en' ? 'Happy Travelers' : '만족한 여행자'}
              </p>
            </div>
            <div className="h-16 w-px bg-orange-200 hidden sm:block" />
            <div className="text-center">
              <p className="text-6xl font-bold text-orange-500">15+</p>
              <p className="text-slate-500 text-sm mt-2">
                {locale === 'vi' ? 'Quốc gia' : locale === 'en' ? 'Countries' : '국가'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: exp.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-orange-400 text-orange-400" />
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed italic text-base mb-6">
                &ldquo;{exp.text[locale]}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image src={exp.avatar} alt={exp.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{exp.name}</p>
                  <p className="text-slate-500 text-sm">
                    {exp.country} &middot;{' '}
                    <span className="text-orange-500">{exp.trip}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave a review prompt */}
        <div className="mt-14 text-center bg-slate-900 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            {locale === 'vi' ? 'Đã đi cùng tôi chưa?' : locale === 'en' ? 'Traveled with me before?' : '저와 함께 여행하셨나요?'}
          </h2>
          <p className="text-slate-400 mb-6">
            {locale === 'vi'
              ? 'Chia sẻ trải nghiệm của bạn và giúp người khác khám phá Việt Nam!'
              : locale === 'en'
              ? 'Share your experience and help others discover Vietnam!'
              : '여행 경험을 공유하여 다른 분들이 베트남을 발견하도록 도와주세요!'}
          </p>
          <a
            href="mailto:tuananhdinh.vn@gmail.com"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-colors"
          >
            ✉️ {locale === 'vi' ? 'Gửi trải nghiệm' : locale === 'en' ? 'Share Your Story' : '이야기 공유하기'}
          </a>
        </div>
      </div>
    </>
  );
}
