'use client';

import { useState, useEffect } from 'react';

const DEFAULT_VIDEO = 'https://www.youtube.com/watch?v=NSnkb1IAjbE';

function buildEmbedUrl(youtubeUrl: string): string {
  const match =
    youtubeUrl.match(/[?&]v=([^&#]+)/) ??
    youtubeUrl.match(/youtu\.be\/([^?&#]+)/);
  const id = match?.[1] ?? '';
  return (
    `https://www.youtube.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    `&controls=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&cc_load_policy=0&disablekb=1`
  );
}

export default function HomeVideoHero() {
  const [videoUrl, setVideoUrl] = useState(DEFAULT_VIDEO);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem('admin:video');
        if (stored) {
          const parsed = JSON.parse(stored);
          setVideoUrl(typeof parsed === 'string' && parsed ? parsed : DEFAULT_VIDEO);
        } else {
          setVideoUrl(DEFAULT_VIDEO);
        }
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

  const embedUrl = buildEmbedUrl(videoUrl);

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: '100svh' }}>

      {/* ── YouTube iframe: luôn cover toàn màn hình mọi tỉ lệ ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <iframe
          src={embedUrl}
          title="Hero video"
          allow="autoplay; encrypted-media"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            /* max() đảm bảo iframe luôn lớn hơn viewport dù landscape hay portrait */
            width: 'max(100vw, 177.78vh)',
            height: 'max(100vh, 56.25vw)',
            transform: 'translate(-50%, -50%)',
            border: 'none',
          }}
        />
      </div>

      {/* ── Overlay: che tên video/kênh YouTube ở trên và dưới ── */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      {/* ── Overlay gradient trung tâm ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none" />

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/45 animate-bounce">
        <span className="text-[9px] uppercase tracking-[0.25em] font-sans">Scroll</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>

    </section>
  );
}
