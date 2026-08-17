import { client } from './client'
import type { Album, JournalPost, Movie } from '@/lib/data'

// ─── Albums ─────────────────────────────────────────────────────────────────
export async function fetchAlbums(): Promise<Album[]> {
  const raw = await client.fetch<Array<{
    id: string
    name: Album['name']
    description: Album['description']
    coverImage: string | null
    location: string
    date: string
    photos: Array<{ image: string | null; caption: Album['photos'][0]['caption'] }> | null
  }>>(`
    *[_type == "album"] | order(coalesce(order, 999), date desc) {
      "id": _id,
      name, description, location, date,
      coverImage,
      "photos": photos[] { image, caption }
    }
  `)
  return raw.map(a => ({
    id: a.id,
    name: a.name,
    description: a.description,
    coverImage: a.coverImage ?? '',
    location: a.location ?? '',
    date: a.date ?? '',
    photos: (a.photos ?? []).filter((p): p is { image: string; caption: Album['photos'][0]['caption'] } => Boolean(p.image)),
  }))
}

// ─── Journal posts ───────────────────────────────────────────────────────────
export async function fetchJournalPosts(): Promise<JournalPost[]> {
  const raw = await client.fetch<Array<{
    id: string
    title: JournalPost['title']
    summary: JournalPost['summary']
    coverImage: string | null
    location: string
    date: string
    contentVi: string | null
    contentEn: string | null
    contentKo: string | null
  }>>(`
    *[_type == "journalPost"] | order(date desc) {
      "id": _id,
      title, summary, location, date,
      coverImage,
      contentVi, contentEn, contentKo
    }
  `)
  return raw.map(p => ({
    id: p.id,
    title: p.title ?? { vi: '', en: '', ko: '' },
    summary: p.summary ?? { vi: '', en: '', ko: '' },
    coverImage: p.coverImage ?? '',
    location: p.location ?? '',
    date: p.date ?? '',
    content: {
      vi: p.contentVi ?? '',
      en: p.contentEn ?? '',
      ko: p.contentKo ?? '',
    },
  }))
}

// ─── Movies ─────────────────────────────────────────────────────────────────
export async function fetchMovies(): Promise<Movie[]> {
  const raw = await client.fetch<Array<{
    id: string
    title: string
    year: number
    director: string | null
    cast: string | null
    rating: number
    genre: Movie['genre']
    impression: Movie['impression']
    trailer: string
    banner: string | null
    related: Array<{ image: string | null; caption: Movie['related'][0]['caption'] }> | null
  }>>(`
    *[_type == "movie"] | order(coalesce(order, 999), year desc) {
      "id": _id,
      title, year, director, cast, rating, genre, impression, trailer,
      banner,
      "related": related[] { image, caption }
    }
  `)
  return raw.map(m => ({
    id: m.id,
    title: m.title,
    year: m.year,
    director: m.director ?? '',
    cast: m.cast ?? '',
    rating: m.rating,
    genre: m.genre,
    impression: m.impression,
    trailer: m.trailer ?? '',
    banner: m.banner ?? '',
    poster: m.banner ?? '',
    related: (m.related ?? []).filter((r): r is { image: string; caption: Movie['related'][0]['caption'] } => Boolean(r.image)),
  }))
}

// ─── My Info ─────────────────────────────────────────────────────────────────
export async function fetchMyInfo() {
  return client.fetch<{
    portraitImage: string
    title: { vi: string; en: string; ko: string }
    text:  { vi: string; en: string; ko: string }
  } | null>(`*[_type == "myInfo"][0]{ portraitImage, title, text }`)
}

// ─── Video Intro ─────────────────────────────────────────────────────────────
export async function fetchVideoUrl(): Promise<string | null> {
  const doc = await client.fetch<{ url: string } | null>(`*[_type == "videoIntro"][0]{ url }`)
  return doc?.url ?? null
}
