import { NextRequest, NextResponse } from 'next/server'
import { serverClient, checkAuth } from '@/sanity/server-client'
import type { Album } from '@/lib/data'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const album: Album = await req.json()

  await serverClient.patch(id).set({
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
