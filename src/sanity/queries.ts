import { client } from './client'
import type { Album, JournalPost, Movie } from '@/lib/data'

// ─── Image projection helper ────────────────────────────────────────────────
// Returns a CDN URL with width optimisation from a Sanity image reference.
const imgUrl = (field: string, w = 1400) =>
  `"${field}": ${field}.asset->url + "?w=${w}&auto=format&fit=max"`

// ─── Albums ─────────────────────────────────────────────────────────────────
export async function fetchAlbums(): Promise<Album[]> {
  const query = `*[_type == "album"] | order(coalesce(order, 999), date desc) {
    "id": _id,
    name, description, location, date,
    ${imgUrl('coverImage')},
    "photos": photos[] {
      ${imgUrl('image', 1400).replace('"image"', '"photo"').replace('image.asset', 'photo.asset')},
      caption
    }
  }`
  // photos projection needs special handling
  const albumsRaw = await client.fetch<RawAlbum[]>(`
    *[_type == "album"] | order(coalesce(order, 999), date desc) {
      "id": _id,
      name, description, location, date,
      "coverImage": coverImage.asset->url + "?w=1400&auto=format&fit=max",
      "photos": photos[] {
        "image": photo.asset->url + "?w=1400&auto=format&fit=max",
        caption
      }
    }
  `)
  return albumsRaw.map(a => ({
    ...a,
    photos: (a.photos ?? []).filter((p): p is { image: string; caption: Album['photos'][0]['caption'] } => Boolean(p.image)),
  }))
}

type RawAlbum = Omit<Album, 'photos'> & {
  photos: Array<{ image: string | null; caption: Album['photos'][0]['caption'] }> | null
}

// ─── Journal posts ───────────────────────────────────────────────────────────
export async function fetchJournalPosts(): Promise<JournalPost[]> {
  return client.fetch(`
    *[_type == "journalPost"] | order(date desc) {
      "id": _id,
      title, summary, location, date,
      "coverImage": coverImage.asset->url + "?w=1200&auto=format&fit=max",
      "content": {
        "vi": contentVi,
        "en": contentEn,
        "ko": contentKo
      }
    }
  `)
}

// ─── Movies ─────────────────────────────────────────────────────────────────
export async function fetchMovies(): Promise<Movie[]> {
  const raw = await client.fetch<RawMovie[]>(`
    *[_type == "movie"] | order(coalesce(order, 999), year desc) {
      "id": _id,
      title, year, rating, genre, impression, trailer,
      "banner": banner.asset->url + "?w=1280&auto=format&fit=max",
      "poster": banner.asset->url + "?w=600&auto=format&fit=max",
      "related": related[] {
        "image": image.asset->url + "?w=1280&auto=format&fit=max",
        caption
      }
    }
  `)
  return raw.map(m => ({
    ...m,
    related: (m.related ?? []).filter((r): r is { image: string; caption: Movie['related'][0]['caption'] } => Boolean(r.image)),
  }))
}

type RawMovie = Omit<Movie, 'related'> & {
  related: Array<{ image: string | null; caption: Movie['related'][0]['caption'] }> | null
}

// ─── My Info ─────────────────────────────────────────────────────────────────
export async function fetchMyInfo() {
  return client.fetch<{
    portraitImage: string
    title: { vi: string; en: string; ko: string }
    text:  { vi: string; en: string; ko: string }
  } | null>(`
    *[_type == "myInfo"][0] {
      "portraitImage": portraitImage.asset->url + "?w=800&auto=format&fit=max",
      title, text
    }
  `)
}

// ─── Video Intro ─────────────────────────────────────────────────────────────
export async function fetchVideoUrl(): Promise<string | null> {
  const doc = await client.fetch<{ url: string } | null>(
    `*[_type == "videoIntro"][0]{ url }`
  )
  return doc?.url ?? null
}
