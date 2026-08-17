import { NextRequest, NextResponse } from 'next/server'
import { serverClient, checkAuth } from '@/sanity/server-client'

export async function GET() {
  const doc = await serverClient.fetch<{ url: string } | null>(`*[_type == "videoIntro"][0]{ url }`)
  return NextResponse.json({ url: doc?.url ?? '' })
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url }: { url: string } = await req.json()
  const existing = await serverClient.fetch<{ _id: string } | null>(`*[_type == "videoIntro"][0]{ _id }`)

  if (existing) {
    await serverClient.patch(existing._id).set({ url }).commit()
  } else {
    await serverClient.create({ _type: 'videoIntro', url })
  }

  return NextResponse.json({ ok: true })
}
