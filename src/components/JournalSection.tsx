'use client';

import { useState } from 'react';
import SmartImage from './SmartImage';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import AnimateSection from './AnimateSection';
import type { JournalPost, JournalContent } from '@/lib/data';

type Locale = 'vi' | 'en' | 'ko';

function ContentRenderer({ content }: { content: JournalContent }) {
  if (Array.isArray(content)) {
    return (
      <div className="prose max-w-none text-[15px] leading-relaxed text-ink/90">
        <PortableText value={content} />
      </div>
    );
  }
  return (
    <div
      className="
        text-[15px] leading-relaxed text-ink/90
        [&_p]:mb-5
        [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-ink
        [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-ink
        [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-4
        [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-4
        [&_li]:mb-1
        [&_strong]:font-semibold [&_strong]:text-ink
        [&_em]:italic
        [&_hr]:border-[#e8e8e8] [&_hr]:my-6
        [&_img]:rounded-lg [&_img]:my-5 [&_img]:max-w-full
        [&_blockquote]:border-l-4 [&_blockquote]:border-sage/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-meta [&_blockquote]:my-5
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

interface Labels {
  sectionLabel: string;
  title: string;
  subtitle: string;
  readMore: string;
  by: string;
}

interface Props {
  posts: JournalPost[];
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

export default function JournalSection({ posts, locale, labels }: Props) {
  const [page, setPage]         = useState(0);
  const [selected, setSelected] = useState<JournalPost | null>(null);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const visible    = posts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const open  = (post: JournalPost) => setSelected(post);
  const close = () => setSelected(null);

  return (
    <>
      {/* Section header */}
      <AnimateSection className="text-center mb-16">
        <h2 className="wl-title text-4xl sm:text-5xl mb-3">{labels.title}</h2>
      </AnimateSection>

      {/* Posts list */}
      <div className="divide-y divide-[#e5e5e5]">
        {visible.map((post, idx) => (
          <AnimateSection key={post.id} delay={idx * 0.07} className="py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

              {/* Image */}
              <button onClick={() => open(post)} className="text-left group">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-[10px]">
                  <SmartImage
                    src={post.coverImage}
                    alt={post.title[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </button>

              {/* Text */}
              <div className="lg:pl-6 lg:pt-0">
                <p className="text-xs text-gray-400 mb-3 font-sans uppercase tracking-wider">
                  {fmtDate(post.date, locale)} · {post.location}
                </p>
                <button onClick={() => open(post)} className="text-left w-full">
                  <h3 className="wl-title text-[26px] sm:text-[32px] mb-5 hover:text-sage transition-colors leading-snug">
                    {post.title[locale]}
                  </h3>
                </button>
                <p className="text-meta text-[15px] leading-relaxed mb-7">
                  {post.summary[locale]}
                </p>
                <button onClick={() => open(post)} className="wl-link">
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
              className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden rounded-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-20 bg-black/30 hover:bg-black/50 text-white transition-colors p-1.5 rounded-full backdrop-blur-sm"
              >
                <X size={16} />
              </button>

              {/* Hero banner */}
              {selected.coverImage && (
                <div className="relative h-[220px] sm:h-[270px] shrink-0">
                  <SmartImage
                    src={selected.coverImage}
                    alt={selected.title[locale]}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/70 text-[11px] font-sans uppercase tracking-widest mb-1.5">
                      {fmtDate(selected.date, locale)} · {selected.location}
                    </p>
                    <h2 className="text-white font-serif text-xl sm:text-2xl font-semibold leading-snug">
                      {selected.title[locale]}
                    </h2>
                  </div>
                </div>
              )}

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1">
                <div className="px-7 py-6">
                  {/* Summary */}
                  {selected.summary[locale] && (
                    <p className="text-meta text-[15px] leading-relaxed mb-6 pb-6 border-b border-[#e8e8e8] italic">
                      {selected.summary[locale]}
                    </p>
                  )}

                  {/* Body */}
                  <ContentRenderer content={selected.content[locale]} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
