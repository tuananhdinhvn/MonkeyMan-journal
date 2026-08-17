import { NextRequest, NextResponse } from 'next/server'
import { serverClient, checkAuth } from '@/sanity/server-client'
import type { JournalPost } from '@/lib/data'

export async function GET() {
  const raw = await serverClient.fetch<Array<{
    _id: string
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
      _id, title, summary, coverImage, location, date,
      contentVi, contentEn, contentKo
    }
  `)
  const posts: JournalPost[] = raw.map(p => ({
    id: p._id,
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
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const post: JournalPost = await req.json()
  const result = await serverClient.create({
    _type: 'journalPost',
    title: post.title,
    summary: post.summary,
    coverImage: post.coverImage || null,
    location: post.location,
    date: post.date,
    contentVi: typeof post.content.vi === 'string' ? (post.content.vi || null) : null,
    contentEn: typeof post.content.en === 'string' ? (post.content.en || null) : null,
    contentKo: typeof post.content.ko === 'string' ? (post.content.ko || null) : null,
  })
  return NextResponse.json({ id: result._id })
}
