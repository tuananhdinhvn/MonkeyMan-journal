import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { trips } from '@/lib/data';
import { MapPin, Clock, Calendar, Star } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return trips.map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = trips.find((t) => t.slug === slug);
  if (!trip) return {};

  const title = trip.title.en;
  const description = trip.summary.en;
  const image = trip.coverImage;
  const url = `https://monkeyman.vn/travels/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | MonkeyMan`,
      description,
      url,
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | MonkeyMan`,
      description,
      images: [image],
    },
  };
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as 'vi' | 'en' | 'ko';
  const trip = trips.find((t) => t.slug === slug);

  if (!trip) notFound();

  return <TripDetail trip={trip} locale={locale} />;
}

function TripDetail({
  trip,
  locale,
}: {
  trip: (typeof trips)[0];
  locale: 'vi' | 'en' | 'ko';
}) {
  const t = useTranslations('travels');

  return (
    <>
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src={trip.coverImage}
          alt={trip.title[locale]}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-slate-900/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex gap-2 mb-3 flex-wrap">
              {trip.tags.map((tag) => (
                <span key={tag} className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              {trip.title[locale]}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        {/* Back link */}
        <Link
          href="/travels"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-orange-500 text-sm mb-8 transition-colors"
        >
          {t('back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <p className="text-slate-500 text-lg leading-relaxed mb-6 italic border-l-4 border-orange-400 pl-4">
              {trip.summary[locale]}
            </p>
            <div className="prose prose-slate max-w-none">
              {trip.content[locale].split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-5">
              <h3 className="font-bold text-slate-900 mb-4">Trip Info</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">{t('location')}</p>
                    <p className="text-slate-700 font-medium text-sm">{trip.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">{t('duration')}</p>
                    <p className="text-slate-700 font-medium text-sm">{trip.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star size={16} className="text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">{t('best_time')}</p>
                    <p className="text-slate-700 font-medium text-sm">{trip.bestTime[locale]}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">
                      {locale === 'vi' ? 'Ngày đăng' : locale === 'en' ? 'Posted' : '게시일'}
                    </p>
                    <p className="text-slate-700 font-medium text-sm">
                      {new Date(trip.date).toLocaleDateString(
                        locale === 'ko' ? 'ko-KR' : locale === 'en' ? 'en-US' : 'vi-VN',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-orange-500 rounded-2xl p-5 text-white text-center">
              <p className="font-bold mb-2">
                {locale === 'vi' ? 'Muốn đi tour này?' : locale === 'en' ? 'Want this tour?' : '이 투어를 원하시나요?'}
              </p>
              <p className="text-orange-100 text-sm mb-4">
                {locale === 'vi' ? 'Liên hệ với tôi để đặt lịch!' : locale === 'en' ? 'Contact me to book!' : '저에게 연락해 예약하세요!'}
              </p>
              <Link
                href="/contact"
                className="block bg-white text-orange-600 font-bold py-2 rounded-xl hover:bg-orange-50 transition-colors text-sm"
              >
                {locale === 'vi' ? 'Liên hệ ngay' : locale === 'en' ? 'Contact Now' : '지금 연락하기'}
              </Link>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {trip.gallery.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('gallery')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {trip.gallery.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments placeholder */}
        <div className="mt-14 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {locale === 'vi' ? 'Bình luận' : locale === 'en' ? 'Comments' : '댓글'}
          </h2>
          <div className="bg-slate-50 rounded-2xl p-8 text-center">
            <p className="text-slate-500 mb-4">
              {locale === 'vi'
                ? 'Đăng nhập để để lại bình luận'
                : locale === 'en'
                ? 'Sign in to leave a comment'
                : '댓글을 남기려면 로그인하세요'}
            </p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-orange-300 px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-colors">
                <span>🔵</span> Google
              </button>
              <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-orange-300 px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-colors">
                <span>📘</span> Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
