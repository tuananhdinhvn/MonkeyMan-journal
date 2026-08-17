import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import { fetchMovies } from '@/sanity/queries';
import type { Movie } from '@/lib/data';
import { Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movie Collection',
  description: 'Movies I love — especially those based on true stories. My personal film diary.',
  openGraph: {
    title: 'Movie Collection | MonkeyMan',
    description: 'Movies I love — especially those based on true stories. My personal film diary.',
    url: 'https://monkeyman.vn/movies',
  },
  twitter: {
    title: 'Movie Collection | MonkeyMan',
    description: 'Movies I love — especially those based on true stories. My personal film diary.',
  },
  alternates: { canonical: 'https://monkeyman.vn/movies' },
};

export default async function MoviesPage() {
  const locale = (await getLocale()) as 'vi' | 'en' | 'ko';
  const movies = await fetchMovies();
  return <MoviesContent locale={locale} movies={movies} />;
}

function MoviesContent({ locale, movies }: { locale: 'vi' | 'en' | 'ko'; movies: Movie[] }) {
  const t = useTranslations('movies');

  return (
    <>
      {/* Header */}
      <div className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-orange-400 font-medium uppercase tracking-widest text-sm mb-3">
            🎬 Cinema
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-white font-bold text-lg leading-tight">{movie.title}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-slate-300 text-xs">{movie.year}</span>
                    {movie.genre[locale] && <>
                      <span className="text-slate-500 text-xs">·</span>
                      <span className="text-slate-300 text-xs">{movie.genre[locale]}</span>
                    </>}
                  </div>
                  {movie.director && (
                    <p className="text-slate-400 text-xs mt-0.5">Dir. {movie.director}</p>
                  )}
                </div>
              </div>

              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.floor(movie.rating / 2) }).map((_, i) => (
                      <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-orange-500">{movie.rating}/10</span>
                  <span className="text-xs text-slate-400">
                    — {t('rating')}
                  </span>
                </div>

                {movie.cast && (
                  <p className="text-slate-500 text-xs mb-3">
                    <span className="font-semibold text-slate-600">Cast: </span>{movie.cast}
                  </p>
                )}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {movie.impression[locale]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion */}
        <div className="mt-14 text-center">
          <p className="text-slate-500 mb-3">
            {locale === 'vi'
              ? 'Bạn có gợi ý phim hay không?'
              : locale === 'en'
              ? 'Have a movie suggestion?'
              : '영화 추천이 있으신가요?'}
          </p>
          <a
            href="mailto:tuananhdinh.vn@gmail.com"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            ✉️ {locale === 'vi' ? 'Gợi ý cho tôi' : locale === 'en' ? 'Suggest to me' : '추천해 주세요'}
          </a>
        </div>
      </div>
    </>
  );
}
