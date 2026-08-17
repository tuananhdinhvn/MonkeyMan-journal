'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmartImage from './SmartImage';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Album } from '@/lib/data';

interface Props {
  albums: Album[];
  locale: 'vi' | 'en' | 'ko';
}

const ALBUM_LABEL = { vi: 'Xem Album', en: 'View Album', ko: '앨범 보기' };
const AUTO_INTERVAL = 5000;

export default function DestinationSlider({ albums, locale }: Props) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const goNext = useCallback(
    () => setActive((a) => (a + 1) % Math.max(albums.length, 1)),
    [albums.length]
  );

  // Auto-advance albums, pause when lightbox is open
  useEffect(() => {
    if (lightboxOpen || albums.length === 0) return;
    const t = setInterval(goNext, AUTO_INTERVAL);
    return () => clearInterval(t);
  }, [goNext, lightboxOpen, albums.length]);

  if (albums.length === 0) return null;

  const album = albums[Math.min(active, albums.length - 1)] ?? albums[0];
  // Cover image always first, then the rest of the photos
  const images = [album.coverImage, ...album.photos.map(p => p.image)];

  const goPrev = () => setActive((a) => (a - 1 + albums.length) % albums.length);

  const openLightbox = (idx = 0) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  const lbNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i + 1) % images.length);
  };
  const lbPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i - 1 + images.length) % images.length);
  };

  const date = new Date(album.date).toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : locale === 'en' ? 'en-US' : 'vi-VN',
    { year: 'numeric', month: 'long' }
  );

  // Index 0 = cover (no caption), index N = photos[N-1]
  const currentCaption = lightboxIdx > 0 ? album.photos[lightboxIdx - 1]?.caption[locale] : undefined;

  return (
    <>
      {/* ── Album card ── */}
      <div className="flex flex-col lg:flex-row lg:h-[560px] gap-0">

        {/* Left: main cover image */}
        <div
          className="relative lg:w-[58%] aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden bg-ink cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={album.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <SmartImage
                src={album.coverImage}
                alt={album.name[locale]}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </AnimatePresence>

          {/* Album count badge */}
          <div className="absolute top-4 right-4 bg-black/50 text-white text-[11px] font-sans uppercase tracking-widest px-3 py-1.5 backdrop-blur-sm">
            {images.length} {locale === 'vi' ? 'ảnh' : locale === 'en' ? 'photos' : '장'}
          </div>
        </div>

        {/* Right: info + thumbnails */}
        <div className="lg:w-[42%] bg-cream flex flex-col px-10 lg:px-14 py-10 lg:py-14 lg:h-full lg:overflow-hidden">

          {/* Text content — grows to fill, centers text vertically on desktop */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={album.id + '-txt'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                <p className="wl-meta mb-4">{date} &nbsp;·&nbsp; {album.location}</p>

                <h2 className="wl-title text-3xl sm:text-4xl mb-5">
                  {album.name[locale]}
                </h2>

                <p className="text-meta text-[15px] leading-relaxed mb-8">
                  {album.description[locale]}
                </p>

                <button
                  onClick={() => openLightbox(0)}
                  className="wl-link text-left"
                >
                  {ALBUM_LABEL[locale]} →
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Thumbnail nav — pinned to bottom ── */}
          <div className="mt-10 pt-8 border-t border-[#e0ddd3]">
            <div className="flex gap-3 overflow-x-auto pb-1 snap-x scrollbar-none">
              {albums.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setActive(i)}
                  className={`relative h-24 w-[calc(33.333%-8px)] min-w-[calc(33.333%-8px)] snap-start shrink-0 overflow-hidden transition-all duration-300 ${
                    i === active
                      ? 'opacity-100 ring-2 ring-sage ring-offset-1'
                      : 'opacity-45 hover:opacity-70'
                  }`}
                >
                  <SmartImage src={a.coverImage} alt={a.name[locale]} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Prev / Next controls */}
          <div className="flex gap-3 mt-5 mb-2 justify-end">
            <button
              onClick={goPrev}
              className="w-9 h-9 border border-[#d0ccc3] rounded-lg flex items-center justify-center text-meta hover:text-sage hover:border-sage transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goNext}
              className="w-9 h-9 border border-[#d0ccc3] rounded-lg flex items-center justify-center text-meta hover:text-sage hover:border-sage transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10 p-2"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={26} />
            </button>

            {/* Counter */}
            <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-sans tracking-widest uppercase">
              {lightboxIdx + 1} / {images.length}
            </p>

            {/* Title */}
            <p className="absolute top-14 left-1/2 -translate-x-1/2 text-white/70 text-base font-serif font-bold whitespace-nowrap">
              {album.name[locale]}
            </p>

            {/* Prev */}
            <button
              className="absolute left-3 sm:left-6 text-white/60 hover:text-white transition-colors z-10 p-3"
              onClick={lbPrev}
            >
              <ChevronLeft size={34} />
            </button>

            {/* Main image */}
            <div
              className="relative w-full max-w-5xl mx-20 sm:mx-24 aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIdx}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28 }}
                  className="absolute inset-0"
                >
                  <SmartImage
                    src={images[lightboxIdx]}
                    alt={`${album.name[locale]} — ${lightboxIdx + 1}`}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next */}
            <button
              className="absolute right-3 sm:right-6 text-white/60 hover:text-white transition-colors z-10 p-3"
              onClick={lbNext}
            >
              <ChevronRight size={34} />
            </button>

            {/* Caption + thumbnail strip — stacked with 20px gap */}
            <div
              className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              {currentCaption && (
                <p className="text-white/70 text-sm font-serif text-center px-10">
                  {currentCaption}
                </p>
              )}
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIdx(i)}
                    className={`relative w-14 h-10 overflow-hidden transition-all duration-200 ${
                      i === lightboxIdx
                        ? 'opacity-100 ring-2 ring-white ring-offset-1 ring-offset-black'
                        : 'opacity-35 hover:opacity-65'
                    }`}
                  >
                    <SmartImage src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
