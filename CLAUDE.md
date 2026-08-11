# monkey-web

Personal portfolio + blog site.

## Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Content**: MDX files in `content/posts/`, parsed with `gray-matter`,
  rendered with `next-mdx-remote`. No CMS, no database — content is
  versioned in git and statically generated (`generateStaticParams`) for
  maximum front-end speed (pages are pre-rendered HTML served from CDN).
- **Backend**: none required for the current scope (static content only).
  See "Backend & database notes" below before adding one.
- **Deployment target**: Vercel (zero-config for Next.js, free tier is
  enough for a personal site, gives CDN + edge caching automatically).

## Structure

```
src/app/            routes (App Router)
src/app/blog/        blog index + [slug] dynamic route
src/lib/posts.ts     reads/parses MDX files from content/posts
content/posts/*.mdx  blog posts (frontmatter: title, date, summary)
```

## Conventions

- Use Server Components by default; only add `"use client"` when a
  component needs interactivity/state.
- Keep pages statically generated where possible — avoid `fetch` with
  `cache: "no-store"` or dynamic APIs unless a feature truly needs
  per-request data (e.g. a view counter).
- New blog post = new `.mdx` file in `content/posts/` with frontmatter
  `title`, `date` (YYYY-MM-DD), `summary`. No other steps needed.
- Tailwind only — no separate CSS files except `globals.css`.

## Backend & database notes (read before adding a backend)

The site currently needs **no backend and no database** — all content is
static. If/when you add a dynamic feature, prefer the smallest option that
solves it:

| Feature | Recommended approach | Why |
|---|---|---|
| Contact form | Next.js Route Handler (`app/api/contact/route.ts`) calling **Resend** or a service like Formspree | No server to manage, generous free tier |
| Comments | **Giscus** (backed by GitHub Discussions) | Zero database, free, no auth to build |
| Newsletter | Buttondown / ConvertKit (external) | No database needed |
| View counter / likes | **Vercel KV** (Redis) or **Supabase** (Postgres) free tier | Simple key-value, cheap at low traffic |
| User accounts (if site grows into a product) | **Supabase** (Postgres + Auth + Storage in one) or NextAuth.js + **Neon**/**Vercel Postgres** | Managed, serverless-friendly, generous free tiers, integrates well with Next.js on Vercel |

Avoid adding a traditional always-on backend server (Express, etc.) for a
personal site — serverless functions (Next.js Route Handlers) deployed on
Vercel cover everything needed here with far less operational overhead.

## Commands

```
npm install     # first time only
npm run dev     # local dev server, http://localhost:3000
npm run build   # production build (also validates the site compiles)
npm run lint
```
