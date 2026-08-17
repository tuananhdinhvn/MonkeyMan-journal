import { NextRequest, NextResponse } from 'next/server'
import { serverClient, checkAuth } from '@/sanity/server-client'
import type { JournalPost } from '@/lib/data'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const post: JournalPost = await req.json()

  await serverClient.patch(id).set({
    title: post.title,
    summary: post.summary,
    coverImage: post.coverImage || null,
    location: post.location,
    date: post.date,
    contentVi: typeof post.content.vi === 'string' ? (post.content.vi || null) : null,
    contentEn: typeof post.content.en === 'string' ? (post.content.en || null) : null,
    contentKo: typeof post.content.ko === 'string' ? (post.content.ko || null) : null,
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
