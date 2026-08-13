import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'public', 'site-settings.json');

const DEFAULT = {
  siteName: 'MonkeyMan',
  logoUrl: '',
  faviconUrl: '',
  title: {
    vi: 'MonkeyMan — Nhật Ký Du Lịch',
    en: 'MonkeyMan — Travel Journal',
    ko: 'MonkeyMan — 여행 일지',
  },
  description: {
    vi: 'Nhật ký du lịch cá nhân của Tuấn Anh — khám phá Việt Nam qua từng chuyến đi.',
    en: 'Personal travel journal by Tuấn Anh — exploring Vietnam through every journey.',
    ko: '뚜언 아인의 개인 여행 일지 — 모든 여행을 통해 베트남을 탐험합니다.',
  },
  ogImage: '',
  keywords: 'travel, vietnam, du lịch, MonkeyMan, phượt',
  author: 'Tuấn Anh',
  twitterHandle: '',
  gaId: '',
};

function checkAuth(req: NextRequest): boolean {
  const pw = req.headers.get('x-admin-password');
  return pw === (process.env.ADMIN_PASSWORD ?? 'monkeyman');
}

async function readSettings() {
  try {
    const raw = await readFile(FILE, 'utf-8');
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export async function GET() {
  return NextResponse.json(await readSettings());
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const merged = { ...DEFAULT, ...body };
    await writeFile(FILE, JSON.stringify(merged, null, 2));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Không thể lưu cài đặt' }, { status: 500 });
  }
}
