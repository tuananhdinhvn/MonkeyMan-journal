import { NextRequest, NextResponse } from 'next/server'
import { serverClient, checkAuth } from '@/sanity/server-client'

type MyInfo = { portraitImage: string; title: { vi: string; en: string; ko: string }; text: { vi: string; en: string; ko: string } }

export async function GET() {
  const doc = await serverClient.fetch<MyInfo | null>(`*[_type == "myInfo"][0]{ portraitImage, title, text }`)
  return NextResponse.json(doc ?? null)
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const info: MyInfo = await req.json()
  const existing = await serverClient.fetch<{ _id: string } | null>(`*[_type == "myInfo"][0]{ _id }`)

  if (existing) {
    await serverClient.patch(existing._id).set({
      portraitImage: info.portraitImage || null,
      title: info.title,
      text: info.text,
    }).commit()
  } else {
    await serverClient.create({
      _type: 'myInfo',
      portraitImage: info.portraitImage || null,
      title: info.title,
      text: info.text,
    })
  }

  return NextResponse.json({ ok: true })
}
