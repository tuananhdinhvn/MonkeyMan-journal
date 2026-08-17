'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmartImage from './SmartImage';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import type { Movie } from '@/lib/data';

type Locale = 'vi' | 'en' | 'ko';

interface Props {
  movies: Movie[];
  locale: Locale;
  sectionLabel: string;
  sectionTitle: string;
  subtitle?: string;
  seeAll: string;
}

const LABEL = {
  related:   { vi: 'Hình ảnh liên quan', en: 'Related Images',    ko: '관련 이미지' },
  backVideo: { vi: 'Quay lại intro',     en: 'Back to intro',     ko: '소개로 돌아가기' },
  allMovies: { vi: 'Tất cả bộ phim',     en: 'All Movies',        ko: '전체 영화' },
  backList:  { vi: 'Quay lại danh sách', en: 'Back to list',      ko: '목록으로 돌아가기' },
  director:  { vi: 'Đạo diễn',           en: 'Director',          ko: '감독' },
  cast:      { vi: 'Diễn viên',          en: 'Cast',              ko: '출연' },
  genre:     { vi: 'Thể loại',           en: 'Genre',             ko: '장르' },
};

const PAGE_SIZE = 4;
const AUTO_MS   = 5000;

function buildTrailerUrl(url: string) {
  const match = url.match(/[?&]v=([^&#]+)/) ?? url.match(/youtu\.be\/([^?&#]+)/);
  const id = match?.[1] ?? '';
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export default function MovieSection({ movies, locale, sectionLabel, sectionTitle, subtitle, seeAll }: Props) {
  const [page, setPage]         = useState(0);
  const [showAll, setShowAll]   = useState(false);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [fromList, setFromList] = useState(false);
  const [selImage, setSelImage] = useState<{ src: string; caption: string } | null>(null);

  const totalPages = Math.ceil(movies.length / PAGE_SIZE);
  const visible    = movies.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const nextPage = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages]);

  const closeDetail = useCallback(() => {
    setSelected(null);
    setSelImage(null);
    if (fromList) setShowAll(true);
  }, [fromList]);

  const openFromGrid = (movie: Movie) => {
    setSelected(movie);
    setFromList(false);
    setSelImage(null);
  };

  const openFromList = (movie: Movie) => {
    setSelected(movie);
    setFromList(true);
    setSelImage(null);
  };

  // Auto-slide only when no popup open
  useEffect(() => {
    if (movies.length <= PAGE_SIZE || selected || showAll) return;
    const t = setInterval(nextPage, AUTO_MS);
    return () => clearInterval(t);
  }, [nextPage, movies.length, selected, showAll]);

  // Escape key handling
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selImage)   { setSelImage(null); return; }
      if (selected)   { closeDetail(); return; }
      if (showAll)    { setShowAll(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selImage, selected, showAll, closeDetail]);

  return (
    <>
      {/* ── Section header ── */}
      <div className="mb-12">
        {sectionLabel && <p className="wl-section-label mb-2">{sectionLabel}</p>}
        <h2 className="wl-title text-3xl sm:text-4xl">{sectionTitle}</h2>
        {subtitle && <p className="text-meta text-[15px] leading-relaxed mt-3">{subtitle}</p>}
      </div>

      {/* ── 4-column grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.38 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 min-h-[320px] content-start items-start"
        >
          {visible.map((movie) => (
            <button key={movie.id} onClick={() => openFromGrid(movie)} className="group text-left self-start">
              <div className="relative aspect-video overflow-hidden bg-gray-100 mb-4 rounded-[10px]">
                <SmartImage
                  src={movie.banner}
                  alt={movie.title}
                  fill
                  className="object-cover brightness-125 group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute bottom-2 right-2 bg-sage text-white text-[10px] px-2 py-0.5 font-sans font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  ★ {movie.rating}/10
                </span>
              </div>
              <h4 className="wl-title text-[15px] font-bold leading-snug group-hover:text-sage transition-colors">
                {movie.title}
              </h4>
              <p className="wl-meta text-[12px] mt-1">
                {movie.year}{movie.director ? ` · ${movie.director}` : ''}
              </p>
              {movie.genre?.[locale] && (
                <p className="wl-meta text-[11px] mt-0.5 opacity-70">{movie.genre[locale]}</p>
              )}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Page dots */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)} className="w-7 h-7 rounded-lg border border-[#d0ccc3] flex items-center justify-center text-meta hover:text-sage hover:border-sage transition-colors">
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === page ? 'w-6 bg-sage' : 'w-1.5 bg-[#ccc] hover:bg-sage/50'
              }`}
            />
          ))}
          <button onClick={nextPage} className="w-7 h-7 rounded-lg border border-[#d0ccc3] flex items-center justify-center text-meta hover:text-sage hover:border-sage transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* See all — below grid */}
      <div className="mt-6 flex justify-center">
        <button onClick={() => setShowAll(true)} className="wl-link">
          {seeAll} →
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          ALL MOVIES LIST POPUP
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showAll && !selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setShowAll(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0,    y: 18, scale: 0.97 }}
              transition={{ duration: 0.28 }}
              className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden rounded-[10px] flex flex-col max-h-[88vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#e8e8e8] shrink-0">
                <h3 className="wl-title text-xl">{LABEL.allMovies[locale]}</h3>
                <button onClick={() => setShowAll(false)} className="text-meta hover:text-ink transition-colors p-2 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable grid */}
              <div className="overflow-y-auto flex-1 p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {movies.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => openFromList(movie)}
                      className="group text-left"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-100 mb-3 rounded-[10px]">
                        <SmartImage
                          src={movie.banner}
                          alt={movie.title}
                          fill
                          className="object-cover brightness-125 group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-2 right-2 bg-sage text-white text-[10px] px-2 py-0.5 font-sans font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          ★ {movie.rating}/10
                        </span>
                      </div>
                      <h4 className="wl-title text-[14px] font-bold leading-snug group-hover:text-sage transition-colors">
                        {movie.title}
                      </h4>
                      <p className="wl-meta text-[11px] mt-0.5">
                        {movie.year}{movie.director ? ` · ${movie.director}` : ''}
                      </p>
                      {movie.genre?.[locale] && (
                        <p className="wl-meta text-[10px] mt-0.5 opacity-70">{movie.genre[locale]}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          MOVIE DETAIL POPUP
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[210] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={closeDetail}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0,    y: 18, scale: 0.97 }}
              transition={{ duration: 0.28 }}
              className="relative w-full max-w-[1500px] bg-white shadow-2xl overflow-hidden rounded-[10px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative border-b border-[#e8e8e8] px-16 py-5 text-center">
                {fromList && (
                  <button
                    onClick={closeDetail}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold font-sans text-meta hover:text-sage transition-colors"
                  >
                    <ArrowLeft size={12} />
                    {LABEL.backList[locale]}
                  </button>
                )}
                <h3 className="wl-title text-[23px] font-bold leading-snug">{selected.title}</h3>
                <p className="text-meta font-sans text-[14px] mt-1">{selected.year}</p>
                <button onClick={closeDetail} className="absolute right-4 top-1/2 -translate-y-1/2 text-meta hover:text-ink transition-colors p-2 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col md:flex-row max-h-[75vh] overflow-hidden">
                {/* Left: video or image */}
                <div className="md:w-[55%] shrink-0 bg-black">
                  <AnimatePresence mode="wait">
                    {selImage ? (
                      <motion.div key="img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="relative aspect-video">
                        <SmartImage src={selImage.src} alt="" fill className="object-contain" sizes="55vw" />
                      </motion.div>
                    ) : (
                      <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="relative aspect-video">
                        <iframe
                          key={selected.id}
                          src={buildTrailerUrl(selected.trailer)}
                          title={selected.title}
                          allow="autoplay; encrypted-media; fullscreen"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full border-none"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: info */}
                <div className="md:w-[45%] flex flex-col overflow-y-auto">
                  <div className="p-5 flex-1">
                    <AnimatePresence mode="wait">
                      {selImage ? (
                        <motion.div key="img-info" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22 }}>
                          <button
                            onClick={() => setSelImage(null)}
                            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold font-sans text-meta hover:text-sage transition-colors mb-5"
                          >
                            <ArrowLeft size={12} />
                            {LABEL.backVideo[locale]}
                          </button>
                          <p className="font-serif text-ink text-[15px] leading-relaxed">{selImage.caption}</p>
                        </motion.div>
                      ) : (
                        <motion.div key="review" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22 }}>
                          <div className="flex gap-0.5 mb-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <span key={i} className={`text-sm ${i < selected.rating ? 'text-sage' : 'text-[#e0e0e0]'}`}>★</span>
                            ))}
                            <span className="text-meta text-xs ml-2 font-sans">{selected.rating}/10</span>
                          </div>
                          {(selected.director || selected.cast || selected.genre?.[locale]) && (
                            <table className="w-full mb-4 pb-4 border-b border-[#e8e8e8] text-xs font-sans border-collapse">
                              <tbody>
                                {selected.director && (
                                  <tr>
                                    <td className="text-[10px] font-semibold uppercase tracking-wider text-ink/50 pr-4 py-1 whitespace-nowrap w-px align-top">{LABEL.director[locale]}</td>
                                    <td className="text-meta py-1">{selected.director}</td>
                                  </tr>
                                )}
                                {selected.cast && (
                                  <tr>
                                    <td className="text-[10px] font-semibold uppercase tracking-wider text-ink/50 pr-4 py-1 whitespace-nowrap w-px align-top">{LABEL.cast[locale]}</td>
                                    <td className="text-meta py-1">{selected.cast}</td>
                                  </tr>
                                )}
                                {selected.genre?.[locale] && (
                                  <tr>
                                    <td className="text-[10px] font-semibold uppercase tracking-wider text-ink/50 pr-4 py-1 whitespace-nowrap w-px align-top">{LABEL.genre[locale]}</td>
                                    <td className="text-meta py-1">{selected.genre[locale]}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          )}
                          <p className="font-serif text-ink text-[15px] leading-relaxed">{selected.impression[locale]}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Related images */}
                  {selected.related.length > 0 && (
                    <div className="p-5 border-t border-[#e8e8e8] shrink-0">
                      <p className="wl-category mb-3">{LABEL.related[locale]}</p>
                      <div className="grid grid-cols-4 gap-2">
                        {selected.related.map((rel, i) => (
                          <button
                            key={i}
                            onClick={() => setSelImage({ src: rel.image, caption: rel.caption[locale] })}
                            className={`relative aspect-video overflow-hidden transition-all duration-200 ${
                              selImage?.src === rel.image ? 'ring-2 ring-sage opacity-100' : 'opacity-85 hover:opacity-100'
                            }`}
                          >
                            <SmartImage src={rel.image} alt="" fill className="object-cover" sizes="15vw" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
