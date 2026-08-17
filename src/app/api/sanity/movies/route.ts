import { NextRequest, NextResponse } from 'next/server'
import { serverClient, checkAuth } from '@/sanity/server-client'
import type { Movie } from '@/lib/data'

export async function GET() {
  const raw = await serverClient.fetch<Array<{
    _id: string
    title: string
    year: number
    director: string | null
    cast: string | null
    rating: number
    genre: Movie['genre']
    impression: Movie['impression']
    trailer: string | null
    banner: string | null
    related: Array<{ image: string | null; caption: Movie['related'][0]['caption'] }> | null
  }>>(`
    *[_type == "movie"] | order(coalesce(order, 999), year desc) {
      _id, title, year, director, cast, rating, genre, impression, trailer, banner,
      "related": related[] { image, caption }
    }
  `)
  const movies: Movie[] = raw.map(m => ({
    id: m._id,
    title: m.title ?? '',
    year: m.year ?? new Date().getFullYear(),
    director: m.director ?? '',
    cast: m.cast ?? '',
    rating: m.rating ?? 8,
    genre: m.genre ?? { vi: '', en: '', ko: '' },
    impression: m.impression ?? { vi: '', en: '', ko: '' },
    trailer: m.trailer ?? '',
    banner: m.banner ?? '',
    poster: m.banner ?? '',
    related: (m.related ?? [])
      .filter((r): r is { image: string; caption: Movie['related'][0]['caption'] } => Boolean(r.image)),
  }))
  return NextResponse.json(movies)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const movie: Movie = await req.json()
  const result = await serverClient.create({
    _type: 'movie',
    title: movie.title,
    year: movie.year,
    director: movie.director || null,
    cast: movie.cast || null,
    rating: movie.rating,
    genre: movie.genre,
    impression: movie.impression,
    trailer: movie.trailer || null,
    banner: movie.banner || null,
    related: movie.related.map((r, i) => ({
      _key: `r${i}-${Date.now()}`,
      image: r.image || null,
      caption: r.caption,
    })),
  })
  return NextResponse.json({ id: result._id })
}
