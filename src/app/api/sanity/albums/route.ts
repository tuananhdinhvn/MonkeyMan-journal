import { NextRequest, NextResponse } from 'next/server'
import { serverClient, checkAuth } from '@/sanity/server-client'
import type { Album } from '@/lib/data'

function toDoc(album: Album) {
  return {
    _type: 'album' as const,
    name: album.name,
    description: album.description,
    coverImage: album.coverImage || null,
    location: album.location,
    date: album.date,
    photos: album.photos.map((p, i) => ({
      _key: `p${i}-${Date.now()}`,
      image: p.image || null,
      caption: p.caption,
    })),
  }
}

export async function GET() {
  const raw = await serverClient.fetch<Array<{
    _id: string
    name: Album['name']
    description: Album['description']
    coverImage: string | null
    location: string
    date: string
    photos: Array<{ image: string | null; caption: Album['photos'][0]['caption'] }> | null
  }>>(`
    *[_type == "album"] | order(coalesce(order, 999), date desc) {
      _id, name, description, coverImage, location, date,
      "photos": photos[] { image, caption }
    }
  `)
  const albums: Album[] = raw.map(a => ({
    id: a._id,
    name: a.name ?? { vi: '', en: '', ko: '' },
    description: a.description ?? { vi: '', en: '', ko: '' },
    coverImage: a.coverImage ?? '',
    location: a.location ?? '',
    date: a.date ?? '',
    photos: (a.photos ?? [])
      .filter((p): p is { image: string; caption: Album['photos'][0]['caption'] } => Boolean(p.image)),
  }))
  return NextResponse.json(albums)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const album: Album = await req.json()
  const result = await serverClient.create(toDoc(album))
  return NextResponse.json({ id: result._id })
}
