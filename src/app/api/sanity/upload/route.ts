import { NextRequest, NextResponse } from 'next/server'
import { serverClient, checkAuth } from '@/sanity/server-client'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

function guessType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', webp: 'image/webp',
    gif: 'image/gif', avif: 'image/avif',
  }
  return map[ext] ?? 'image/jpeg'
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req.headers.get('x-admin-password')))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file || file.size === 0)
    return NextResponse.json({ error: 'Không có file' }, { status: 400 })

  // Fallback to filename-based detection if type is missing
  const contentType = ALLOWED.includes(file.type) ? file.type : guessType(file.name)
  if (!ALLOWED.includes(contentType))
    return NextResponse.json({ error: 'Chỉ chấp nhận ảnh JPG/PNG/WebP/GIF/AVIF' }, { status: 400 })
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: 'File quá lớn (tối đa 20 MB)' }, { status: 400 })

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await serverClient.assets.upload('image', buffer, {
      filename: file.name,
      contentType,
    })
    return NextResponse.json({ url: asset.url })
  } catch (err) {
    console.error('Sanity upload error:', err)
    return NextResponse.json({ error: 'Upload lên Sanity thất bại' }, { status: 500 })
  }
}
