'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const visible = !isHome || scrolled;

  const NAV_LINKS = [
    { id: 'home',       label: 'Home',       offset: 0  },
    { id: 'my-info',    label: 'My Info',    offset: 20 },
    { id: 'my-album',   label: 'My Album',   offset: 20 },
    { id: 'my-journal', label: 'My Journal', offset: 0  },
    { id: 'my-movies',  label: 'My Movies',  offset: 0  },
    { id: 'call-me',    label: 'Call Me',    offset: 0  },
  ];

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string, offset = 0) => {
    if (!isHome) return;
    e.preventDefault();
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
    setMobileOpen(false);
  };

  return (
    <header
      className={`
        ${isHome ? 'fixed' : 'sticky'} top-0 z-50 w-full bg-white
        transition-all duration-500 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}
        ${scrolled ? 'shadow-[0_1px_12px_rgba(0,0,0,0.09)]' : ''}
      `}
    >

      {/* ── MAIN NAV (desktop) ──────── */}
      <div className="border-b border-[#e8e8e8] hidden md:block bg-white">
        <div className="mx-auto max-w-8xl px-6 sm:px-10">
          <div className="flex h-[72px] items-center">
            {/* Left nav */}
            <nav className="flex items-center gap-8 flex-1">
              {NAV_LINKS.slice(0, 3).map((l) => (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={(e) => scrollTo(e, l.id, l.offset)}
                  className="text-[12px] uppercase tracking-widest2 font-bold transition-all duration-200 whitespace-nowrap text-ink hover:text-sage px-3 py-2 rounded-lg hover:bg-sage/10"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Center: Logo */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/#home"
              onClick={(e) => scrollTo(e, 'home')}
              className="px-8 shrink-0 text-center"
            >
              <span className="font-serif text-[28px] font-semibold text-ink tracking-wide leading-none">
                MonkeyMan
              </span>
              <p className="text-[9px] uppercase tracking-widest3 text-meta font-sans mt-0.5">
                Travel Journal
              </p>
            </a>

            {/* Right nav */}
            <nav className="flex items-center gap-8 flex-1 justify-end">
              {NAV_LINKS.slice(3).map((l) => (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={(e) => scrollTo(e, l.id, l.offset)}
                  className="text-[12px] uppercase tracking-widest2 font-bold transition-all duration-200 whitespace-nowrap text-ink hover:text-sage px-3 py-2 rounded-lg hover:bg-sage/10"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ── MOBILE NAV ── */}
      <div className="md:hidden border-b border-[#e8e8e8] bg-white">
        <div className="flex h-[60px] items-center justify-between px-5">
          <Link href="/" className="text-center">
            <span className="font-serif text-[22px] font-semibold text-ink tracking-wide leading-none">MonkeyMan</span>
            <p className="text-[8px] uppercase tracking-widest3 text-meta font-sans mt-0.5">Travel Journal</p>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-ink hover:text-sage transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Animated dropdown */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-[#e8e8e8] px-5 py-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`/#${l.id}`}
                onClick={(e) => scrollTo(e, l.id, l.offset)}
                className="block py-2.5 px-3 text-[12px] uppercase tracking-widest2 font-bold transition-all duration-200 text-ink hover:text-sage rounded-lg hover:bg-sage/10"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-[#f0f0f0]">
              <LanguageSwitcher hideKo />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
