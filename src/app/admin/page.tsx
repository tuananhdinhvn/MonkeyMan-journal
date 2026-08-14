'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { trips as staticTrips, movies as staticMovies, albums as staticAlbums, journalPosts as staticJournalPosts } from '@/lib/data';
import type { Trip, Movie, Album, JournalPost } from '@/lib/data';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

/* ─── Storage helpers ─────────────────────────────────────────────────────── */

const K = {
  video:    'admin:video',
  info:     'admin:info',
  trips:    'admin:trips',
  albums:   'admin:albums',
  journal:  'admin:journal',
  movies:   'admin:movies',
  contacts: 'admin:contacts',
  settings: 'admin:siteSettings',
  auth:     'admin:auth',
} as const;

function rd<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
const wr = <T,>(k: string, v: T) => localStorage.setItem(k, JSON.stringify(v));

/* ─── Types & defaults ────────────────────────────────────────────────────── */

type Contact = { label: string; value: string; href: string; icon: string };
type MyInfo = {
  portraitImage: string;
  title: { vi: string; en: string; ko: string };
  text:  { vi: string; en: string; ko: string };
};

const DEF_CONTACTS: Contact[] = [
  { label: 'Điện thoại', value: '+84 xxx xxx xxx', href: 'tel:+84xxxxxxxxx',             icon: '📞' },
  { label: 'Email',      value: 'tuananhdinh.vn@gmail.com', href: 'mailto:tuananhdinh.vn@gmail.com', icon: '✉️' },
  { label: 'YouTube',    value: '@MonkeyMan',   href: '#',                                icon: '▶'  },
  { label: 'TikTok',     value: '@MonkeyMan',   href: '#',                                icon: '♪'  },
  { label: 'WhatsApp',   value: '+84 xxx xxx xxx', href: 'https://wa.me/84xxxxxxxxx',     icon: '💬' },
  { label: 'KakaoTalk',  value: 'MonkeyMan',    href: '#',                                icon: '🟡' },
];

const DEF_INFO: MyInfo = {
  portraitImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  title: {
    vi: 'Mỗi chuyến đi là một trang nhật ký mới',
    en: 'Every trip is a brand new diary page',
    ko: '모든 여행은 새로운 일기의 한 페이지입니다',
  },
  text: {
    vi: 'Kết nối với tôi qua mạng xã hội để không bỏ lỡ bất kỳ chuyến phiêu lưu nào.',
    en: 'Connect with me on social media to never miss any adventure.',
    ko: '소셜 미디어에서 저와 연결하여 어떤 모험도 놓치지 마세요.',
  },
};

const BLANK_TRIP: Trip = {
  slug: '', title: { vi: '', en: '', ko: '' }, location: '', duration: '',
  bestTime: { vi: '', en: '', ko: '' }, summary: { vi: '', en: '', ko: '' },
  content:  { vi: '', en: '', ko: '' }, coverImage: '', gallery: [],
  date: new Date().toISOString().slice(0, 10), tags: [],
};

const BLANK_MOVIE: Movie = {
  id: '', title: '', year: new Date().getFullYear(),
  genre: { vi: '', en: '', ko: '' }, rating: 8,
  poster: '', banner: '', trailer: '',
  impression: { vi: '', en: '', ko: '' }, related: [],
};

const BLANK_ALBUM: Album = {
  id: '',
  name: { vi: '', en: '', ko: '' },
  description: { vi: '', en: '', ko: '' },
  coverImage: '',
  location: '',
  date: new Date().toISOString().slice(0, 10),
  photos: [],
};

const BLANK_POST: JournalPost = {
  id: '',
  coverImage: '',
  title: { vi: '', en: '', ko: '' },
  summary: { vi: '', en: '', ko: '' },
  content: { vi: '', en: '', ko: '' },
  date: new Date().toISOString().slice(0, 10),
  location: '',
};

/* ─── Shared UI components ────────────────────────────────────────────────── */

const BI = 'w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white';
const BT = BI + ' resize-none leading-relaxed';

function Inp({ className, ...r }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${BI}${className ? ` ${className}` : ''}`} {...r} />;
}
function Txt({ className, rows = 4, ...r }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { rows?: number }) {
  return <textarea className={`${BT}${className ? ` ${className}` : ''}`} rows={rows} {...r} />;
}
function Btn({ variant = 'primary', className, children, ...r }: {
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = {
    primary:   'bg-gray-800 text-white hover:bg-gray-700',
    secondary: 'border border-gray-300 text-gray-600 hover:bg-gray-50',
    danger:    'bg-red-500 text-white hover:bg-red-600',
  }[variant];
  return (
    <button className={`px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${v}${className ? ` ${className}` : ''}`} {...r}>
      {children}
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-8 pb-6 border-b border-gray-100">
      <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-1">{title}</h2>
      {desc && <p className="text-sm text-gray-500">{desc}</p>}
    </div>
  );
}

function LangRow({ label, values, onChange, multiline = false, rows = 3 }: {
  label: string;
  values: { vi: string; en: string; ko: string };
  onChange: (lang: 'vi' | 'en' | 'ko', val: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const langs: Array<['vi' | 'en' | 'ko', string]> = [['vi', '🇻🇳 VI'], ['en', '🇺🇸 EN'], ['ko', '🇰🇷 KO']];
  return (
    <Field label={label}>
      <div className="grid grid-cols-3 gap-3">
        {langs.map(([lang, flag]) => (
          <div key={lang}>
            <p className="text-[10px] text-gray-400 mb-1 font-semibold">{flag}</p>
            {multiline
              ? <Txt value={values[lang]} onChange={e => onChange(lang, e.target.value)} rows={rows} />
              : <Inp value={values[lang]} onChange={e => onChange(lang, e.target.value)} />
            }
          </div>
        ))}
      </div>
    </Field>
  );
}

/* ─── Upload helpers ─────────────────────────────────────────────────────── */

// Resize image client-side via canvas → JPEG data URL (no server needed)
function resizeToDataUrl(file: File, maxPx = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const blobUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error('load')); };
    img.src = blobUrl;
  });
}

function UploadBtn({ onUploaded, label = '↑ Upload' }: { onUploaded: (url: string) => void; label?: string }) {
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={loading}
        className="shrink-0 border border-dashed border-gray-300 rounded px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-40 whitespace-nowrap"
      >
        {loading ? 'Đang xử lý...' : label}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async e => {
          const file = e.target.files?.[0];
          if (!file) return;
          e.target.value = '';
          setLoading(true);
          try {
            const dataUrl = await resizeToDataUrl(file);
            onUploaded(dataUrl);
          } catch {
            alert('Không thể đọc ảnh — thử lại');
          }
          setLoading(false);
        }}
      />
    </>
  );
}

function ImageInput({ value, onChange, label, hint }: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        <Inp value={value} onChange={e => onChange(e.target.value)} placeholder="https://... hoặc upload ảnh" />
        <UploadBtn onUploaded={onChange} />
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-20 w-auto object-cover rounded border border-gray-200" />
      )}
    </Field>
  );
}

function GalleryInput({ images, onChange }: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const upd = (i: number, url: string) => onChange(images.map((x, j) => j === i ? url : x));
  const rm  = (i: number) => onChange(images.filter((_, j) => j !== i));
  const add = (url = '') => onChange([...images, url]);

  return (
    <Field label="Album ảnh">
      <div className="space-y-2 mb-3">
        {images.map((img, i) => (
          <div key={i} className="flex items-center gap-2">
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" className="w-14 h-9 object-cover rounded shrink-0 border border-gray-100" />
            )}
            <Inp value={img} onChange={e => upd(i, e.target.value)} placeholder="https://..." />
            <UploadBtn onUploaded={url => upd(i, url)} label="↑" />
            <button
              type="button"
              onClick={() => rm(i)}
              className="shrink-0 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Btn variant="secondary" className="text-xs" onClick={() => add('')}>+ Thêm URL</Btn>
        <UploadBtn onUploaded={url => add(url)} label="↑ Upload ảnh mới" />
      </div>
    </Field>
  );
}

/* ─── Albums section ─────────────────────────────────────────────────────── */

function AlbumForm({ album, isNew, onChange, onSave, onCancel }: {
  album: Album; isNew: boolean;
  onChange: (a: Album) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const set = <Kk extends keyof Album>(field: Kk, val: Album[Kk]) => onChange({ ...album, [field]: val });
  const setLang = (field: 'name' | 'description', lang: 'vi' | 'en' | 'ko', val: string) =>
    onChange({ ...album, [field]: { ...album[field], [lang]: val } });

  const updPhoto = (i: number, field: 'image' | 'vi' | 'en' | 'ko', val: string) =>
    set('photos', album.photos.map((p, idx) => {
      if (idx !== i) return p;
      if (field === 'image') return { ...p, image: val };
      return { ...p, caption: { ...p.caption, [field]: val } };
    }));

  const addPhoto = (url = '') =>
    set('photos', [...album.photos, { image: url, caption: { vi: '', en: '', ko: '' } }]);

  const removePhoto = (i: number) =>
    set('photos', album.photos.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Quay lại
        </button>
        <h2 className="text-xl font-serif font-semibold text-gray-800">
          {isNew ? 'Thêm album mới' : 'Sửa album'}
        </h2>
      </div>

      <div className="space-y-6">
        <LangRow label="Tên album" values={album.name} onChange={(l, v) => setLang('name', l, v)} />
        <LangRow label="Mô tả" values={album.description} onChange={(l, v) => setLang('description', l, v)} multiline rows={3} />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Địa điểm">
            <Inp value={album.location} onChange={e => set('location', e.target.value)} placeholder="Quảng Ninh, Việt Nam" />
          </Field>
          <Field label="Ngày">
            <Inp type="date" value={album.date} onChange={e => set('date', e.target.value)} />
          </Field>
        </div>

        <ImageInput label="Ảnh bìa" value={album.coverImage} onChange={url => set('coverImage', url)}
          hint="Kích thước tối ưu: 1400 × 1050 px (tỉ lệ 4:3). Hệ thống tự nén ảnh khi upload." />

        {/* Photos array */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Ảnh trong album ({album.photos.length})
          </label>
          <div className="space-y-3 mb-3">
            {album.photos.map((photo, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  {photo.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.image} alt="" className="w-14 h-9 object-cover rounded shrink-0 border border-gray-200" />
                  )}
                  <Inp value={photo.image} onChange={e => updPhoto(i, 'image', e.target.value)} placeholder="URL ảnh..." />
                  <UploadBtn onUploaded={url => updPhoto(i, 'image', url)} label="↑" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="shrink-0 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none px-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['vi', 'en', 'ko'] as const).map(lang => (
                    <div key={lang}>
                      <p className="text-[10px] text-gray-400 mb-1 font-semibold">
                        {lang === 'vi' ? '🇻🇳 Caption' : lang === 'en' ? '🇺🇸 Caption' : '🇰🇷 캡션'}
                      </p>
                      <Inp value={photo.caption[lang]} onChange={e => updPhoto(i, lang, e.target.value)} placeholder="..." />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Btn variant="secondary" className="text-xs" onClick={() => addPhoto('')}>+ Thêm URL</Btn>
            <UploadBtn onUploaded={url => addPhoto(url)} label="↑ Upload ảnh mới" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
        <Btn onClick={onSave}>Lưu</Btn>
        <Btn variant="secondary" onClick={onCancel}>Huỷ</Btn>
      </div>
    </div>
  );
}

function AlbumsSection({ onSaved }: { onSaved: () => void }) {
  const [albums, setAlbums]     = useState<Album[]>(staticAlbums);
  const [editing, setEditing]   = useState<Album | null>(null);
  const [isNew, setIsNew]       = useState(false);

  useEffect(() => setAlbums(rd(K.albums, staticAlbums)), []);

  const commit = (updated: Album[]) => { wr(K.albums, updated); setAlbums(updated); onSaved(); };

  const startEdit = (a: Album) => { setEditing({ ...a }); setIsNew(false); };
  const startNew  = () => { setEditing({ ...BLANK_ALBUM, id: `album-${Date.now()}` }); setIsNew(true); };

  const saveEdit = () => {
    if (!editing) return;
    commit(isNew ? [...albums, editing] : albums.map(a => a.id === editing.id ? editing : a));
    setEditing(null);
  };

  const del = (id: string) => {
    if (!confirm('Xoá album này?')) return;
    commit(albums.filter(a => a.id !== id));
  };

  if (editing) return <AlbumForm album={editing} isNew={isNew} onChange={setEditing} onSave={saveEdit} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-1">My Album</h2>
          <p className="text-sm text-gray-500">Quản lý album ảnh của chuyến đi</p>
        </div>
        <Btn onClick={startNew}>+ Thêm album</Btn>
      </div>

      <div className="space-y-2">
        {albums.map((a) => (
          <div key={a.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              {a.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.coverImage} alt="" className="w-12 h-8 object-cover rounded shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{a.name.vi || a.id}</p>
                <p className="text-xs text-gray-400">{a.location} · {a.date} · {a.photos.length} ảnh</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 ml-3">
              <Btn variant="secondary" className="text-xs px-3 py-1.5" onClick={() => startEdit(a)}>Sửa</Btn>
              <Btn variant="danger" className="text-xs px-3 py-1.5" onClick={() => del(a.id)}>Xoá</Btn>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Btn variant="secondary" onClick={() => {
          if (confirm('Reset về dữ liệu gốc? Mọi thay đổi sẽ bị mất.')) {
            localStorage.removeItem(K.albums);
            setAlbums(staticAlbums);
            onSaved();
          }
        }}>
          Reset về dữ liệu gốc
        </Btn>
      </div>
    </div>
  );
}

/* ─── Journal admin section ───────────────────────────────────────────────── */

function JournalPostForm({ post, isNew, onChange, onSave, onCancel }: {
  post: JournalPost; isNew: boolean;
  onChange: (p: JournalPost) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [contentTab, setContentTab] = useState<'vi' | 'en' | 'ko'>('vi');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const set = <Kk extends keyof JournalPost>(field: Kk, val: JournalPost[Kk]) =>
    onChange({ ...post, [field]: val });
  const setLang = (field: 'title' | 'summary' | 'content', lang: 'vi' | 'en' | 'ko', val: string) =>
    onChange({ ...post, [field]: { ...post[field], [lang]: val } });

  const handleImageUpload = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = imageInputRef.current;
      if (!input) { resolve(null); return; }
      const handler = async () => {
        input.removeEventListener('change', handler);
        const file = input.files?.[0];
        input.value = '';
        if (!file) { resolve(null); return; }
        try {
          const url = await resizeToDataUrl(file);
          resolve(url);
        } catch {
          resolve(null);
        }
      };
      input.addEventListener('change', handler);
      input.click();
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Quay lại
        </button>
        <h2 className="text-xl font-serif font-semibold text-gray-800">
          {isNew ? 'Thêm bài nhật ký mới' : 'Sửa bài nhật ký'}
        </h2>
      </div>

      {/* Hidden file input for image upload in editor */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />

      <div className="space-y-6">
        <ImageInput label="Ảnh bìa" value={post.coverImage} onChange={url => set('coverImage', url)} />

        <LangRow label="Tiêu đề" values={post.title} onChange={(l, v) => setLang('title', l, v)} />
        <LangRow label="Tóm tắt ngắn" values={post.summary} onChange={(l, v) => setLang('summary', l, v)} multiline rows={2} />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Địa điểm">
            <Inp value={post.location} onChange={e => set('location', e.target.value)} placeholder="Quảng Ninh, Việt Nam" />
          </Field>
          <Field label="Ngày">
            <Inp type="date" value={post.date} onChange={e => set('date', e.target.value)} />
          </Field>
        </div>

        {/* Content with language tabs */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Nội dung bài viết
          </label>
          <div className="flex gap-1 mb-3">
            {(['vi', 'en', 'ko'] as const).map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setContentTab(lang)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  contentTab === lang
                    ? 'bg-gray-800 text-white'
                    : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {lang === 'vi' ? '🇻🇳 VI' : lang === 'en' ? '🇺🇸 EN' : '🇰🇷 KO'}
              </button>
            ))}
          </div>
          <RichTextEditor
            key={contentTab}
            value={post.content[contentTab]}
            onChange={html => setLang('content', contentTab, html)}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
        <Btn onClick={onSave}>Lưu</Btn>
        <Btn variant="secondary" onClick={onCancel}>Huỷ</Btn>
      </div>
    </div>
  );
}

function JournalAdminSection({ onSaved }: { onSaved: () => void }) {
  const [posts, setPosts]       = useState<JournalPost[]>(staticJournalPosts);
  const [editing, setEditing]   = useState<JournalPost | null>(null);
  const [isNew, setIsNew]       = useState(false);

  useEffect(() => setPosts(rd(K.journal, staticJournalPosts)), []);

  const commit = (updated: JournalPost[]) => { wr(K.journal, updated); setPosts(updated); onSaved(); };

  const startEdit = (p: JournalPost) => { setEditing({ ...p }); setIsNew(false); };
  const startNew  = () => { setEditing({ ...BLANK_POST, id: `post-${Date.now()}` }); setIsNew(true); };

  const saveEdit = () => {
    if (!editing) return;
    commit(isNew ? [...posts, editing] : posts.map(p => p.id === editing.id ? editing : p));
    setEditing(null);
  };

  const del = (id: string) => {
    if (!confirm('Xoá bài viết này?')) return;
    commit(posts.filter(p => p.id !== id));
  };

  if (editing) return <JournalPostForm post={editing} isNew={isNew} onChange={setEditing} onSave={saveEdit} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-1">My Journal</h2>
          <p className="text-sm text-gray-500">Quản lý bài nhật ký du lịch</p>
        </div>
        <Btn onClick={startNew}>+ Thêm bài viết</Btn>
      </div>

      <div className="space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              {p.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt="" className="w-12 h-8 object-cover rounded shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{p.title.vi || p.id}</p>
                <p className="text-xs text-gray-400">{p.location} · {p.date}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 ml-3">
              <Btn variant="secondary" className="text-xs px-3 py-1.5" onClick={() => startEdit(p)}>Sửa</Btn>
              <Btn variant="danger" className="text-xs px-3 py-1.5" onClick={() => del(p.id)}>Xoá</Btn>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Btn variant="secondary" onClick={() => {
          if (confirm('Reset về dữ liệu gốc? Mọi thay đổi sẽ bị mất.')) {
            localStorage.removeItem(K.journal);
            setPosts(staticJournalPosts);
            onSaved();
          }
        }}>
          Reset về dữ liệu gốc
        </Btn>
      </div>
    </div>
  );
}

/* ─── Video section ───────────────────────────────────────────────────────── */

function VideoSection({ onSaved }: { onSaved: () => void }) {
  const [url, setUrl] = useState('');
  useEffect(() => setUrl(rd(K.video, 'https://www.youtube.com/watch?v=NSnkb1IAjbE')), []);

  return (
    <div>
      <SectionTitle title="Video Intro" desc="Link YouTube cho video nền trang chủ" />
      <div className="space-y-5">
        <Field label="YouTube URL" hint="Sau khi lưu, tải lại trang chủ để xem thay đổi.">
          <Inp className="font-mono" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..." />
        </Field>
        {url && (
          <div className="aspect-video bg-black rounded overflow-hidden">
            <iframe className="w-full h-full border-0"
              src={`https://www.youtube.com/embed/${url.match(/[?&]v=([^&#]+)/)?.[1] ?? url.match(/youtu\.be\/([^?&#]+)/)?.[1] ?? ''}?autoplay=0&rel=0`}
              allow="encrypted-media" allowFullScreen />
          </div>
        )}
      </div>
      <div className="mt-6">
        <Btn onClick={() => { wr(K.video, url); onSaved(); }}>Lưu thay đổi</Btn>
      </div>
    </div>
  );
}

/* ─── My Info section ─────────────────────────────────────────────────────── */

function InfoSection({ onSaved }: { onSaved: () => void }) {
  const [info, setInfo] = useState<MyInfo>(DEF_INFO);
  useEffect(() => setInfo(rd(K.info, DEF_INFO)), []);

  const setLang = (field: 'title' | 'text', lang: 'vi' | 'en' | 'ko', val: string) =>
    setInfo(p => ({ ...p, [field]: { ...p[field], [lang]: val } }));

  return (
    <div>
      <SectionTitle title="My Info" desc="Ảnh đại diện và giới thiệu cá nhân" />
      <div className="space-y-5">
        <ImageInput
          label="Ảnh chân dung"
          value={info.portraitImage}
          onChange={url => setInfo(p => ({ ...p, portraitImage: url }))}
        />
        <LangRow label="Tiêu đề" values={info.title} onChange={(l, v) => setLang('title', l, v)} />
        <LangRow label="Mô tả ngắn" values={info.text} onChange={(l, v) => setLang('text', l, v)} multiline rows={3} />
      </div>
      <div className="mt-6">
        <Btn onClick={() => { wr(K.info, info); onSaved(); }}>Lưu thay đổi</Btn>
      </div>
    </div>
  );
}

/* ─── Trip form ───────────────────────────────────────────────────────────── */

function TripForm({ trip, isNew, onChange, onSave, onCancel }: {
  trip: Trip; isNew: boolean;
  onChange: (t: Trip) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const set = <K extends keyof Trip>(field: K, val: Trip[K]) => onChange({ ...trip, [field]: val });
  const setLang = (field: 'title' | 'summary' | 'content' | 'bestTime', lang: 'vi' | 'en' | 'ko', val: string) =>
    onChange({ ...trip, [field]: { ...trip[field], [lang]: val } });

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Quay lại
        </button>
        <h2 className="text-xl font-serif font-semibold text-gray-800">
          {isNew ? 'Thêm chuyến đi mới' : 'Sửa chuyến đi'}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug (dùng cho URL)" hint="Ví dụ: ha-long-bay">
            <Inp value={trip.slug} onChange={e => set('slug', e.target.value)} placeholder="ten-chuyen-di" />
          </Field>
          <Field label="Ngày">
            <Inp type="date" value={trip.date} onChange={e => set('date', e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Địa điểm">
            <Inp value={trip.location} onChange={e => set('location', e.target.value)} placeholder="Quảng Ninh, Việt Nam" />
          </Field>
          <Field label="Thời gian">
            <Inp value={trip.duration} onChange={e => set('duration', e.target.value)} placeholder="2-3 ngày" />
          </Field>
        </div>

        <LangRow label="Tên chuyến đi" values={trip.title} onChange={(l, v) => setLang('title', l, v)} />
        <LangRow label="Tóm tắt ngắn" values={trip.summary} onChange={(l, v) => setLang('summary', l, v)} multiline rows={3} />
        <LangRow label="Nội dung bài viết" values={trip.content} onChange={(l, v) => setLang('content', l, v)} multiline rows={8} />

        <ImageInput
          label="Ảnh bìa"
          value={trip.coverImage}
          onChange={url => set('coverImage', url)}
        />

        <GalleryInput images={trip.gallery} onChange={imgs => set('gallery', imgs)} />

        <Field label="Tags" hint="Phân cách bằng dấu phẩy">
          <Inp value={trip.tags.join(', ')}
            onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="biển, núi, văn hóa" />
        </Field>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
        <Btn onClick={onSave}>Lưu</Btn>
        <Btn variant="secondary" onClick={onCancel}>Huỷ</Btn>
      </div>
    </div>
  );
}

/* ─── Trips section ───────────────────────────────────────────────────────── */

function TripsSection({ onSaved }: { onSaved: () => void }) {
  const [trips, setTrips]   = useState<Trip[]>(staticTrips);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [isNew, setIsNew]   = useState(false);

  useEffect(() => setTrips(rd(K.trips, staticTrips)), []);

  const commit = (updated: Trip[]) => { wr(K.trips, updated); setTrips(updated); onSaved(); };

  const startEdit = (t: Trip) => { setEditing({ ...t }); setIsNew(false); };
  const startNew  = () => { setEditing({ ...BLANK_TRIP, slug: `trip-${Date.now()}` }); setIsNew(true); };

  const saveEdit = () => {
    if (!editing) return;
    commit(isNew ? [...trips, editing] : trips.map(t => t.slug === editing.slug ? editing : t));
    setEditing(null);
  };

  const del = (slug: string) => {
    if (!confirm('Xoá chuyến đi này?')) return;
    commit(trips.filter(t => t.slug !== slug));
  };

  if (editing) return <TripForm trip={editing} isNew={isNew} onChange={setEditing} onSave={saveEdit} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-1">Albums / Journal</h2>
          <p className="text-sm text-gray-500">Quản lý chuyến đi, album ảnh và bài nhật ký</p>
        </div>
        <Btn onClick={startNew}>+ Thêm mới</Btn>
      </div>

      <div className="space-y-2">
        {trips.map((t) => (
          <div key={t.slug} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              {t.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.coverImage} alt="" className="w-12 h-8 object-cover rounded shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{t.title.vi || t.slug}</p>
                <p className="text-xs text-gray-400">{t.location} · {t.date}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 ml-3">
              <Btn variant="secondary" className="text-xs px-3 py-1.5" onClick={() => startEdit(t)}>Sửa</Btn>
              <Btn variant="danger" className="text-xs px-3 py-1.5" onClick={() => del(t.slug)}>Xoá</Btn>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Btn variant="secondary" onClick={() => {
          if (confirm('Reset về dữ liệu gốc? Mọi thay đổi sẽ bị mất.')) {
            localStorage.removeItem(K.trips);
            setTrips(staticTrips);
            onSaved();
          }
        }}>
          Reset về dữ liệu gốc
        </Btn>
      </div>
    </div>
  );
}

/* ─── Movie form ──────────────────────────────────────────────────────────── */

function MovieForm({ movie, isNew, onChange, onSave, onCancel }: {
  movie: Movie; isNew: boolean;
  onChange: (m: Movie) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const set = <K extends keyof Movie>(field: K, val: Movie[K]) => onChange({ ...movie, [field]: val });
  const setLang = (field: 'genre' | 'impression', lang: 'vi' | 'en' | 'ko', val: string) =>
    onChange({ ...movie, [field]: { ...movie[field], [lang]: val } });

  const addRelated = () =>
    set('related', [...movie.related, { image: '', caption: { vi: '', en: '', ko: '' } }]);

  const setRelated = (i: number, field: 'image' | 'vi' | 'en' | 'ko', val: string) =>
    set('related', movie.related.map((r, idx) => {
      if (idx !== i) return r;
      if (field === 'image') return { ...r, image: val };
      return { ...r, caption: { ...r.caption, [field]: val } };
    }));

  const removeRelated = (i: number) => set('related', movie.related.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Quay lại
        </button>
        <h2 className="text-xl font-serif font-semibold text-gray-800">
          {isNew ? 'Thêm phim mới' : 'Sửa thông tin phim'}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Tên phim (Tiếng Anh)" hint="Tên gốc của phim">
            <Inp value={movie.title} onChange={e => set('title', e.target.value)} placeholder="The Motorcycle Diaries" />
          </Field>
          <Field label="Năm ra mắt">
            <Inp type="number" value={movie.year} onChange={e => set('year', parseInt(e.target.value) || 2024)} min={1900} max={2099} />
          </Field>
          <Field label="Đánh giá (1–10)">
            <div className="flex items-center gap-3">
              <Inp type="range" min={1} max={10} value={movie.rating} className="flex-1 h-9 cursor-pointer border-0 px-0 focus:ring-0"
                onChange={e => set('rating', parseInt(e.target.value))} />
              <span className="text-lg font-serif font-semibold text-gray-700 w-8 text-center">{movie.rating}</span>
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ImageInput label="Ảnh bìa ngang (banner)" hint="Tỉ lệ 16:9"
            value={movie.banner} onChange={url => set('banner', url)} />
          <Field label="Link trailer YouTube">
            <Inp value={movie.trailer} onChange={e => set('trailer', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </Field>
        </div>

        <LangRow label="Thể loại" values={movie.genre} onChange={(l, v) => setLang('genre', l, v)} />
        <LangRow label="Cảm nhận phim" values={movie.impression} onChange={(l, v) => setLang('impression', l, v)} multiline rows={4} />

        {/* Related images */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Hình ảnh liên quan ({movie.related.length})
            </label>
            <button onClick={addRelated} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              + Thêm ảnh
            </button>
          </div>
          <div className="space-y-3">
            {movie.related.map((rel, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  {rel.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={rel.image} alt="" className="w-14 h-9 object-cover rounded shrink-0 border border-gray-200" />
                  )}
                  <Inp value={rel.image} onChange={e => setRelated(i, 'image', e.target.value)}
                    placeholder="URL hình ảnh..." />
                  <UploadBtn onUploaded={url => setRelated(i, 'image', url)} label="↑" />
                  <button onClick={() => removeRelated(i)} className="shrink-0 text-gray-400 hover:text-red-500 transition-colors text-xs px-2 py-2.5">
                    Xoá
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['vi', 'en', 'ko'] as const).map(lang => (
                    <div key={lang}>
                      <p className="text-[10px] text-gray-400 mb-1 font-semibold">
                        {lang === 'vi' ? '🇻🇳 Mô tả' : lang === 'en' ? '🇺🇸 Caption' : '🇰🇷 설명'}
                      </p>
                      <Inp value={rel.caption[lang]} onChange={e => setRelated(i, lang, e.target.value)} placeholder="..." />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
        <Btn onClick={onSave}>Lưu</Btn>
        <Btn variant="secondary" onClick={onCancel}>Huỷ</Btn>
      </div>
    </div>
  );
}

/* ─── Movies section ──────────────────────────────────────────────────────── */

function MoviesSection({ onSaved }: { onSaved: () => void }) {
  const [movies, setMovies]   = useState<Movie[]>(staticMovies);
  const [editing, setEditing] = useState<Movie | null>(null);
  const [isNew, setIsNew]     = useState(false);

  useEffect(() => setMovies(rd(K.movies, staticMovies)), []);

  const commit = (updated: Movie[]) => { wr(K.movies, updated); setMovies(updated); onSaved(); };

  const startEdit = (m: Movie) => { setEditing({ ...m }); setIsNew(false); };
  const startNew  = () => {
    setEditing({ ...BLANK_MOVIE, id: Date.now().toString() });
    setIsNew(true);
  };

  const saveEdit = () => {
    if (!editing) return;
    commit(isNew ? [...movies, editing] : movies.map(m => m.id === editing.id ? editing : m));
    setEditing(null);
  };

  const del = (id: string) => {
    if (!confirm('Xoá phim này?')) return;
    commit(movies.filter(m => m.id !== id));
  };

  if (editing) return <MovieForm movie={editing} isNew={isNew} onChange={setEditing} onSave={saveEdit} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-1">Movies</h2>
          <p className="text-sm text-gray-500">Quản lý danh sách phim yêu thích</p>
        </div>
        <Btn onClick={startNew}>+ Thêm phim</Btn>
      </div>

      <div className="space-y-2">
        {movies.map((m) => (
          <div key={m.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              {m.banner && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.banner} alt="" className="w-16 h-9 object-cover rounded shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{m.title} <span className="text-gray-400 font-normal">({m.year})</span></p>
                <div className="flex items-center gap-1 mt-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className={`text-[10px] ${i < m.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                  ))}
                  <span className="text-xs text-gray-400 ml-1">{m.rating}/10</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 ml-3">
              <Btn variant="secondary" className="text-xs px-3 py-1.5" onClick={() => startEdit(m)}>Sửa</Btn>
              <Btn variant="danger" className="text-xs px-3 py-1.5" onClick={() => del(m.id)}>Xoá</Btn>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Btn variant="secondary" onClick={() => {
          if (confirm('Reset về dữ liệu gốc? Mọi thay đổi sẽ bị mất.')) {
            localStorage.removeItem(K.movies);
            setMovies(staticMovies);
            onSaved();
          }
        }}>
          Reset về dữ liệu gốc
        </Btn>
      </div>
    </div>
  );
}

/* ─── Contacts section ────────────────────────────────────────────────────── */

function ContactsSection({ onSaved }: { onSaved: () => void }) {
  const [contacts, setContacts] = useState<Contact[]>(DEF_CONTACTS);
  useEffect(() => setContacts(rd(K.contacts, DEF_CONTACTS)), []);

  const set = (i: number, field: keyof Contact, val: string) =>
    setContacts(cs => cs.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  return (
    <div>
      <SectionTitle title="Call Me" desc="Thông tin liên hệ hiển thị trong footer" />
      <div className="space-y-4">
        {contacts.map((c, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-3">
              <Field label="Icon (emoji)">
                <Inp value={c.icon} onChange={e => set(i, 'icon', e.target.value)} className="text-center text-lg" />
              </Field>
              <Field label="Tên hiển thị">
                <Inp value={c.label} onChange={e => set(i, 'label', e.target.value)} placeholder="Điện thoại" />
              </Field>
              <Field label="Giá trị">
                <Inp value={c.value} onChange={e => set(i, 'value', e.target.value)} placeholder="+84 xxx" />
              </Field>
              <Field label="Link (href)">
                <Inp value={c.href} onChange={e => set(i, 'href', e.target.value)} placeholder="https://..." />
              </Field>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Btn onClick={() => { wr(K.contacts, contacts); onSaved(); }}>Lưu thay đổi</Btn>
      </div>
    </div>
  );
}

/* ─── Site Settings section ───────────────────────────────────────────────── */

type SiteSettings = {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  title: { vi: string; en: string; ko: string };
  description: { vi: string; en: string; ko: string };
  ogImage: string;
  keywords: string;
  author: string;
  twitterHandle: string;
  gaId: string;
};

const DEF_SETTINGS: SiteSettings = {
  siteName: 'MonkeyMan',
  logoUrl: '',
  faviconUrl: '',
  title: { vi: 'MonkeyMan — Nhật Ký Du Lịch', en: 'MonkeyMan — Travel Journal', ko: 'MonkeyMan — 여행 일지' },
  description: {
    vi: 'Nhật ký du lịch cá nhân của Tuấn Anh — khám phá Việt Nam qua từng chuyến đi.',
    en: 'Personal travel journal by Tuấn Anh — exploring Vietnam through every journey.',
    ko: '뚜언 아인의 개인 여행 일지 — 모든 여행을 통해 베트남을 탐험합니다.',
  },
  ogImage: '',
  keywords: 'travel, vietnam, du lịch, MonkeyMan, phượt',
  author: 'Tuấn Anh',
  twitterHandle: '',
  gaId: '',
};

function SiteSettingsSection({ onSaved }: { onSaved: () => void }) {
  const [s, setS]       = useState<SiteSettings>(DEF_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.json())
      .then((data: Partial<SiteSettings>) => setS({ ...DEF_SETTINGS, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upd = <Kk extends keyof SiteSettings>(key: Kk, val: SiteSettings[Kk]) =>
    setS(prev => ({ ...prev, [key]: val }));

  const updLang = (field: 'title' | 'description', lang: 'vi' | 'en' | 'ko', val: string) =>
    setS(prev => ({ ...prev, [field]: { ...prev[field], [lang]: val } }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': PW },
        body: JSON.stringify(s),
      });
      if (res.ok) {
        wr(K.settings, s);
        onSaved();
      } else {
        alert('Lưu thất bại');
      }
    } catch {
      alert('Lỗi kết nối');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Đang tải...</p>;

  return (
    <div>
      <SectionTitle title="Cài đặt trang web" desc="Logo, favicon, tiêu đề, mô tả và thông tin SEO chung" />
      <div className="space-y-6">

        <Field label="Tên trang web">
          <Inp value={s.siteName} onChange={e => upd('siteName', e.target.value)} placeholder="MonkeyMan" />
        </Field>

        <ImageInput
          label="Logo"
          value={s.logoUrl}
          onChange={url => upd('logoUrl', url)}
          hint="Khuyến nghị: SVG hoặc PNG trong suốt"
        />

        <ImageInput
          label="Favicon"
          value={s.faviconUrl}
          onChange={url => upd('faviconUrl', url)}
          hint="Nên dùng ảnh vuông (32×32 hoặc 64×64 px). Sau khi lưu, reload trang để thấy thay đổi."
        />

        <LangRow
          label="Tiêu đề trang (Page Title)"
          values={s.title}
          onChange={(lang, val) => updLang('title', lang, val)}
        />

        <LangRow
          label="Mô tả trang (Meta Description)"
          values={s.description}
          onChange={(lang, val) => updLang('description', lang, val)}
          multiline
          rows={3}
        />

        <ImageInput
          label="OG Image (ảnh chia sẻ mạng xã hội)"
          value={s.ogImage}
          onChange={url => upd('ogImage', url)}
          hint="Khuyến nghị: 1200×630 px"
        />

        <Field label="Từ khóa SEO (Keywords)" hint="Ngăn cách bằng dấu phẩy">
          <Inp
            value={s.keywords}
            onChange={e => upd('keywords', e.target.value)}
            placeholder="travel, vietnam, du lịch, phượt"
          />
        </Field>

        <Field label="Tác giả (Author)">
          <Inp value={s.author} onChange={e => upd('author', e.target.value)} placeholder="Tuấn Anh" />
        </Field>

        <Field label="Twitter / X handle">
          <Inp
            value={s.twitterHandle}
            onChange={e => upd('twitterHandle', e.target.value)}
            placeholder="@MonkeyMan"
          />
        </Field>

        <Field label="Google Analytics ID" hint="Sau khi lưu, reload trang để kích hoạt tracking">
          <Inp
            value={s.gaId}
            onChange={e => upd('gaId', e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="font-mono"
          />
        </Field>

      </div>
      <div className="mt-6">
        <Btn onClick={save} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Btn>
      </div>
    </div>
  );
}

/* ─── Journal combined section (Albums + Journal posts) ──────────────────── */

type JournalTab = 'album' | 'journal';

function JournalCombinedSection({ onSaved }: { onSaved: () => void }) {
  const [tab, setTab] = useState<JournalTab>('journal');
  return (
    <div>
      <div className="flex gap-1 mb-8 border-b border-gray-100 pb-4">
        <button
          onClick={() => setTab('journal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'journal' ? 'bg-gray-800 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          📝 Bài nhật ký
        </button>
        <button
          onClick={() => setTab('album')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'album' ? 'bg-gray-800 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          🖼️ Album ảnh
        </button>
      </div>
      {tab === 'journal' && <JournalAdminSection onSaved={onSaved} />}
      {tab === 'album'   && <AlbumsSection       onSaved={onSaved} />}
    </div>
  );
}

/* ─── Main Admin Page ─────────────────────────────────────────────────────── */

type Section = 'settings' | 'video' | 'info' | 'journal' | 'movies' | 'contacts';

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'settings',  label: 'Cài đặt chung',    icon: '⚙️' },
  { id: 'video',     label: 'Video Intro',       icon: '🎬' },
  { id: 'info',      label: 'My Info',           icon: '👤' },
  { id: 'journal',   label: 'My Journal',        icon: '📝' },
  { id: 'movies',    label: 'My Movies',         icon: '🎥' },
  { id: 'contacts',  label: 'Call Me',           icon: '📞' },
];

const PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'monkeyman';

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false);
  const [pw, setPw]           = useState('');
  const [pwErr, setPwErr]     = useState(false);
  const [section, setSection] = useState<Section>('settings');
  const [toast, setToast]     = useState('');

  useEffect(() => {
    try {
      if (sessionStorage.getItem(K.auth) === '1') setAuthed(true);
    } catch {}
  }, []);

  const login = () => {
    if (pw === PW) {
      try { sessionStorage.setItem(K.auth, '1'); } catch {}
      setAuthed(true);
      setPwErr(false);
    } else {
      setPwErr(true);
    }
  };

  const showToast = () => {
    setToast('Đã lưu thành công!');
    setTimeout(() => setToast(''), 2500);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="font-serif text-2xl font-semibold text-gray-800">MonkeyMan</h1>
            <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mật khẩu</label>
              <input
                type="password"
                className={`${BI} ${pwErr ? 'border-red-300 focus:ring-red-300' : ''}`}
                value={pw}
                onChange={e => { setPw(e.target.value); setPwErr(false); }}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="••••••••"
                autoFocus
              />
              {pwErr && <p className="text-xs text-red-500 mt-1">Mật khẩu không đúng</p>}
            </div>
            <button
              onClick={login}
              className="w-full bg-gray-800 text-white rounded py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Đăng nhập
            </button>
          </div>
          <p className="text-xs text-gray-300 text-center mt-6">Mật khẩu mặc định: monkeyman</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Về trang blog
          </a>
          <p className="font-serif text-lg font-semibold text-gray-800 leading-none">MonkeyMan</p>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-sans mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                section === s.id
                  ? 'bg-gray-100 text-gray-800 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="text-base leading-none">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="block text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ↗ Xem trang chủ
          </a>
          <button
            onClick={() => { try { sessionStorage.removeItem(K.auth); } catch {} setAuthed(false); setPw(''); }}
            className="block text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur border-b border-gray-200 px-8 py-3 flex justify-end">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="text-xs text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
            ← Về trang blog
          </a>
        </div>

        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg font-medium">
            ✓ {toast}
          </div>
        )}
        <div className="p-8 max-w-3xl">
          {section === 'settings'  && <SiteSettingsSection      onSaved={showToast} />}
          {section === 'video'     && <VideoSection              onSaved={showToast} />}
          {section === 'info'      && <InfoSection               onSaved={showToast} />}
          {section === 'journal'   && <JournalCombinedSection    onSaved={showToast} />}
          {section === 'movies'    && <MoviesSection             onSaved={showToast} />}
          {section === 'contacts'  && <ContactsSection           onSaved={showToast} />}
        </div>
      </main>
    </div>
  );
}
