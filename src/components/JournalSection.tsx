'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import AnimateSection from './AnimateSection';
import type { Trip } from '@/lib/data';

type Locale = 'vi' | 'en' | 'ko';

interface Labels {
  sectionLabel: string;
  title: string;
  subtitle: string;
  readMore: string;
  by: string;
}

interface Props {
  trips: Trip[];
  locale: Locale;
  labels: Labels;
}

const PAGE_SIZE = 3;

function fmtDate(d: string, locale: Locale) {
  return new Date(d).toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : locale === 'en' ? 'en-US' : 'vi-VN',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
}

export default function JournalSection({ trips: propTrips, locale, labels }: Props) {
  const [page, setPage]         = useState(0);
  const [selected, setSelected] = useState<Trip | null>(null);
  const [lsTrips, setLsTrips]   = useState<Trip[] | null>(null);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem('admin:trips');
        setLsTrips(stored ? JSON.parse(stored) : null);
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

  const trips = lsTrips ?? propTrips;

  const totalPages = Math.ceil(trips.length / PAGE_SIZE);
  const visible    = trips.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const open  = (trip: Trip) => setSelected(trip);
  const close = () => setSelected(null);

  return (
    <>
      {/* Section header */}
      <AnimateSection className="text-center mb-16">
        
        <h2 className="wl-title text-4xl sm:text-5xl mb-3">{labels.title}</h2>
        
      </AnimateSection>

      {/* Posts list */}
      <div className="divide-y divide-[#e5e5e5]">
        {visible.map((trip, idx) => (
          <AnimateSection key={trip.slug} delay={idx * 0.07} className="py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

              {/* Image */}
              <button onClick={() => open(trip)} className="text-left group">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-[10px]">
                  <Image
                    src={trip.coverImage}
                    alt={trip.title[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </button>

              {/* Text */}
              <div className="lg:pl-6 lg:pt-0">
                
                <button onClick={() => open(trip)} className="text-left w-full">
                  <h3 className="wl-title text-[26px] sm:text-[32px] mb-5 hover:text-sage transition-colors leading-snug">
                    {trip.title[locale]}
                  </h3>
                </button>
                <p className="text-meta text-[15px] leading-relaxed mb-7">
                  {trip.summary[locale]}
                </p>
                <button onClick={() => open(trip)} className="wl-link">
                  {labels.readMore} →
                </button>
              </div>
            </div>
          </AnimateSection>
        ))}
      </div>

      {/* Numbered pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 border border-[#d0ccc3] rounded-lg flex items-center justify-center text-meta hover:text-sage hover:border-sage transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-9 h-9 border rounded-lg text-[12px] font-semibold font-sans transition-colors ${
                i === page
                  ? 'border-sage bg-sage text-white'
                  : 'border-[#d0ccc3] text-meta hover:border-sage hover:text-sage'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-9 h-9 border border-[#d0ccc3] rounded-lg flex items-center justify-center text-meta hover:text-sage hover:border-sage transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* ── Journal popup ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0,    y: 18, scale: 0.97 }}
              transition={{ duration: 0.28 }}
              className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden rounded-[10px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 text-meta hover:text-ink transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col md:flex-row max-h-[88vh]">
                {/* Left: cover image */}
                <div className="md:w-[42%] shrink-0 relative min-h-[240px] md:min-h-0">
                  <Image
                    src={selected.coverImage}
                    alt={selected.title[locale]}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Right: scrollable content */}
                <div className="md:w-[58%] overflow-y-auto">
                  <div className="p-8">
                    
                    <h2 className="wl-title text-2xl sm:text-3xl mb-5 leading-snug">
                      {selected.title[locale]}
                    </h2>
                    <p className="text-meta text-[15px] leading-relaxed mb-6 pb-6 border-b border-[#e8e8e8]">
                      {selected.summary[locale]}
                    </p>
                    <div className="font-serif text-ink text-[16px] leading-relaxed whitespace-pre-line mb-8">
                      {selected.content[locale]}
                    </div>
               
               
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
