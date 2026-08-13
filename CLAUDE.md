# monkey-web — MonkeyMan Personal Blog

## Vision & Strategy

This is a **personal blog** — not a travel agency or commercial website.

**Core purpose:** Chia sẻ cuộc sống cá nhân của Tuấn Anh (MonkeyMan):
- Những chuyến đi phượt, du lịch bản thân đã trải qua
- Trải nghiệm thực tế tại các địa điểm ở Việt Nam
- Sở thích cá nhân: phim, âm nhạc, cuộc sống
- Hình ảnh và video từ những chuyến đi

**Tone:** Nhật ký cá nhân, chân thực, không thương mại. Người đọc là bạn bè,
người quen, hoặc khách nước ngoài muốn hiểu thêm về Việt Nam qua góc nhìn
của một người Việt bình thường — **không** phải khách hàng tiềm năng.

**Languages:** Tiếng Việt (default) · English · 한국어

**Domain:** monkeyman.vn

---

## Design Philosophy

- **Personal & warm** — như đang kể chuyện với bạn bè, không phải pitch
- **Image-forward** — ảnh và video là trung tâm nội dung
- **Smooth animations** — Framer Motion scroll-reveal, page transitions,
  stagger effects — tạo cảm giác ấn tượng khi lướt trang
- **Minimalist layout** — không quảng cáo, không CTA mua hàng, không form đặt tour
- **Mobile-first** — phần lớn người xem truy cập từ điện thoại

---

## Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **i18n**: next-intl v4 — locales: `vi` (default), `en`, `ko`
- **Animations**: Framer Motion — `AnimateSection`, `PageWrapper`, stagger cards
- **Content**: Mock data trong `src/lib/data.ts` → sẽ chuyển sang Sanity CMS sau
- **Media**: Unsplash tạm thời → sẽ dùng Cloudinary cho ảnh/video thật
- **Hosting**: Vercel (zero-config Next.js)

## Structure

```
src/app/[locale]/          locale-aware pages
src/components/            shared UI components
  AnimateSection.tsx        scroll-triggered reveal wrapper
  PageWrapper.tsx           page transition fade-in
  Navbar.tsx                scroll-aware transparent nav
src/lib/data.ts            mock trips, experiences, movies data
messages/{vi,en,ko}.json   i18n strings
```

## Animation Conventions

- **Page transition**: `PageWrapper` — fade + slide up (0.4s) on every page
- **Section reveal**: `AnimateSection` — fade + slide up on scroll into view (`whileInView`, `once: true`)
- **Card stagger**: `AnimateCards` — stagger delay 0.1s between items
- **Navbar**: transparent at top → opaque on scroll (300ms transition)
- Use `ease: [0.25, 0.46, 0.45, 0.94]` (ease-out-quart) for smooth feel

## Pages

| Route | Content |
|-------|---------|
| `/` | Trang chủ — hero cá nhân, about, travels, movies |
| `/travels` | Danh sách chuyến đi (diary entries) |
| `/travels/[slug]` | Chi tiết chuyến đi + gallery + comments |
| `/experiences` | Chia sẻ của người đọc/du khách đã gặp |
| `/movies` | Phim yêu thích cá nhân |
| `/contact` | Thông tin liên hệ đơn giản |

## Content Rules

- ✅ Viết theo dạng nhật ký, kể chuyện cá nhân
- ✅ Ảnh thật của bản thân (thay Unsplash khi có)
- ✅ Bình luận dưới bài viết (sẽ thêm Giscus hoặc Auth.js + DB sau)
- ❌ Không dùng ngôn ngữ bán hàng ("book now", "đặt tour ngay")
- ❌ Không hiển thị giá cả hay package du lịch
- ❌ Không dùng từ "khách hàng" — chỉ là "người đọc" hoặc "bạn bè"

## Backend & Database Notes

Hiện tại không cần backend — nội dung static. Khi cần thêm:

| Feature | Recommended |
|---------|-------------|
| Comments | Giscus (GitHub Discussions) — zero DB, free |
| Contact form | Route Handler + Resend email |
| View counter | Vercel KV (Redis) |
| CMS | Sanity (khi ảnh/bài viết nhiều hơn) |
| Media hosting | Cloudinary (ảnh + video tối ưu tự động) |

## Commands

```
npm run dev     # http://localhost:3000
npm run build   # validate production build
npm run lint
```
