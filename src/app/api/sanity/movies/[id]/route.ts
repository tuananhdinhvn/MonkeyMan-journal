import { NextRequest, NextResponse } from 'next/server'
import { serverClient, checkAuth } from '@/sanity/server-client'
import type { Movie } from '@/lib/data'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const movie: Movie = await req.json()

  await serverClient.patch(id).set({
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
  }).commit()

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await serverClient.delete(id)
  return NextResponse.json({ ok: true })
}
