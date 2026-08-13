'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';

type Contact = { label: string; value: string; href: string; icon: string };

const DEFAULT_CONTACTS: Contact[] = [
  { label: 'Phone',    value: '+84 xxx xxx xxx',          href: 'tel:+84xxxxxxxxx',               icon: 'phone'    },
  { label: 'Email',    value: 'tuananhdinh.vn@gmail.com', href: 'mailto:tuananhdinh.vn@gmail.com', icon: 'email'    },
  { label: 'YouTube',  value: '@MonkeyMan',               href: '#',                              icon: 'youtube'  },
  { label: 'TikTok',   value: '@MonkeyMan',               href: '#',                              icon: 'tiktok'   },
  { label: 'WhatsApp', value: '+84 xxx xxx xxx',          href: 'https://wa.me/84xxxxxxxxx',      icon: 'whatsapp' },
  { label: 'Kakao',    value: 'MonkeyMan',                href: '#',                              icon: 'kakao'    },
];

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'phone')   return <Phone size={28} strokeWidth={1.5} />;
  if (icon === 'email')   return <Mail  size={28} strokeWidth={1.5} />;

  if (icon === 'youtube') return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );

  if (icon === 'tiktok') return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.2 8.2 0 0 0 4.79 1.52V7.01a4.85 4.85 0 0 1-1.02-.32z"/>
    </svg>
  );

  if (icon === 'whatsapp') return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );

  if (icon === 'kakao') return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.85 1.67 5.35 4.24 6.87-.1.37-.64 2.41-.73 2.77-.12.47.17.46.36.33.15-.1 2.37-1.6 3.34-2.26.58.08 1.18.12 1.79.12 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
    </svg>
  );

  return <span className="text-2xl">{icon}</span>;
}

export default function Footer() {
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem('admin:contacts');
        setContacts(stored ? JSON.parse(stored) : DEFAULT_CONTACTS);
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

  return (
    <footer id="call-me">
      {/* ── Logo section — white bg ── */}
      <div className="bg-white pt-8 pb-[50px] flex flex-col items-center">
        <Image
          src="/images/monkey-man-logo.png"
          alt="MonkeyMan"
          width={192}
          height={192}
        />
      </div>

      {/* ── Contact section — dark bg ── */}
      <div style={{ backgroundColor: '#32373c' }} className="text-white">
        <div className="mx-auto max-w-8xl px-6 sm:px-10 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex flex-col items-center gap-2 transition-transform duration-200 hover:scale-110"
              >
                <span className="text-white opacity-90">
                  <SocialIcon icon={c.icon} />
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold font-sans text-white">
                  {c.label}
                </span>
                <span className="text-[12px] text-white/70 text-center leading-snug break-all">
                  {c.value}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
