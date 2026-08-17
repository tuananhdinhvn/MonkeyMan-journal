import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { trips } from '@/lib/data';
import { MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Journal',
  description: 'Explore Vietnam and beyond through my personal travel diary — every trip, every memory.',
  openGraph: {
    title: 'Travel Journal | MonkeyMan',
    description: 'Explore Vietnam and beyond through my personal travel diary — every trip, every memory.',
    url: 'https://monkeyman.vn/travels',
  },
  twitter: {
    title: 'Travel Journal | MonkeyMan',
    description: 'Explore Vietnam and beyond through my personal travel diary — every trip, every memory.',
  },
  alternates: { canonical: 'https://monkeyman.vn/travels' },
};

export default async function TravelsPage() {
  const locale = (await getLocale()) as 'vi' | 'en' | 'ko';
  return <TravelsContent locale={locale} />;
}

function TravelsContent({ locale }: { locale: 'vi' | 'en' | 'ko' }) {
  const t = useTranslations('travels');

  return (
    <>
      {/* Header */}
      <div className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-orange-400 font-medium uppercase tracking-widest text-sm mb-3">
            ✈️ Vietnam Travel
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Trips grid */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <Link key={trip.slug} href={`/travels/${trip.slug}`}>
              <article className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col">
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={trip.coverImage}
                    alt={trip.title[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
                    {trip.tags.map((tag) => (
                      <span key={tag} className="bg-orange-500/90 text-white text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-slate-400 text-xs mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {trip.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {trip.duration}
                    </span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-orange-500 transition-colors mb-2">
                    {trip.title[locale]}
                  </h2>

                  <p className="text-slate-500 text-sm leading-relaxed flex-1">
                    {trip.summary[locale]}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {new Date(trip.date).toLocaleDateString(
                        locale === 'ko' ? 'ko-KR' : locale === 'en' ? 'en-US' : 'vi-VN',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </span>
                    <span className="text-orange-500 text-sm font-medium group-hover:underline">
                      {t('read_more')} →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
