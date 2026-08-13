'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Trip } from '@/lib/data';

interface Props {
  slides: Trip[];
  locale: 'vi' | 'en' | 'ko';
  readMore: string;
  byLabel: string;
}

export default function HeroSlider({ slides, locale, readMore, byLabel }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  );
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6500);
    return () => clearInterval(id);
  }, [next, paused]);

  const slide = slides[current];
  const date = new Date(slide.date).toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : locale === 'en' ? 'en-US' : 'vi-VN',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div
      className="relative w-full overflow-hidden bg-ink"
      style={{ height: 'calc(100vh - 114px)', minHeight: 560 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background image (crossfade) ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.slug + '-bg'}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image src={slide.coverImage} alt={slide.title[locale]} fill className="object-cover" priority />
          {/* Gradient: dark at bottom-left, lighter at top-right */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/35 to-black/10" />
        </motion.div>
      </AnimatePresence>

      {/* ── Slide content ── */}
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto max-w-8xl w-full px-6 sm:px-10 pb-16 sm:pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.slug + '-txt'}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-2xl"
            >
              {/* Category */}
              <p className="wl-category text-white/75 mb-3">{slide.tags[0]}</p>
              {/* Thin line */}
              <div className="w-8 h-px bg-white/50 mb-5" />

              {/* Title */}
              <h1 className="font-serif text-white font-semibold leading-tight mb-5"
                style={{ fontSize: 'clamp(32px, 5vw, 58px)' }}>
                {slide.title[locale]}
              </h1>

              {/* Meta */}
              <p className="text-white/55 text-sm font-sans mb-6">
                {date}&nbsp;&nbsp;/&nbsp;&nbsp;{byLabel}&nbsp;Tuấn Anh
              </p>

              {/* Read more */}
              <Link
                href={`/travels/${slide.slug}`}
                className="inline-flex items-center gap-2 text-white text-[11px] uppercase tracking-widest2 font-semibold border-b border-white/40 hover:border-white pb-0.5 transition-colors font-sans"
              >
                {readMore} &nbsp;→
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Arrows ── */}
      {[
        { dir: 'prev', fn: prev, pos: 'left-4 sm:left-6' },
        { dir: 'next', fn: next, pos: 'right-4 sm:right-6' },
      ].map(({ dir, fn, pos }) => (
        <button
          key={dir}
          onClick={fn}
          className={`absolute ${pos} top-1/2 -translate-y-1/2 w-11 h-11 border border-white/25 hover:border-white/70 flex items-center justify-center text-white/60 hover:text-white transition-all`}
          aria-label={dir}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {dir === 'prev' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
          </svg>
        </button>
      ))}

      {/* ── Dots ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-500 ${
              i === current
                ? 'w-8 h-[2px] bg-white'
                : 'w-3 h-[2px] bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
