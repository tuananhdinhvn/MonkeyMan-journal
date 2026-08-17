import { defineField, defineType } from 'sanity'

const langString = (name: string, title: string) =>
  defineField({
    name, title, type: 'object',
    fields: [
      { name: 'vi', title: '🇻🇳 Tiếng Việt', type: 'string' },
      { name: 'en', title: '🇺🇸 English',     type: 'string' },
      { name: 'ko', title: '🇰🇷 한국어',       type: 'string' },
    ],
  })

const langText = (name: string, title: string) =>
  defineField({
    name, title, type: 'object',
    fields: [
      { name: 'vi', title: '🇻🇳 Tiếng Việt', type: 'text' },
      { name: 'en', title: '🇺🇸 English',     type: 'text' },
      { name: 'ko', title: '🇰🇷 한국어',       type: 'text' },
    ],
  })

export const movie = defineType({
  name: 'movie',
  title: '🎥 Phim',
  type: 'document',
  fields: [
    defineField({ name: 'title',    title: 'Tên phim (tiếng Anh)', type: 'string' }),
    defineField({ name: 'year',     title: 'Năm ra mắt', type: 'number' }),
    defineField({ name: 'director', title: 'Đạo diễn', type: 'string' }),
    defineField({ name: 'cast',     title: 'Diễn viên chính', type: 'string' }),
    defineField({
      name: 'rating', title: 'Đánh giá (1–10)', type: 'number',
      validation: r => r.min(1).max(10),
    }),
    defineField({ name: 'banner', title: 'Ảnh bìa banner URL (1280×720 px, 16:9)', type: 'url' }),
    defineField({
      name: 'trailer', title: 'Link trailer YouTube', type: 'url',
      validation: r => r.uri({ scheme: ['https', 'http'] }),
    }),
    langString('genre', 'Thể loại'),
    langText('impression', 'Cảm nhận phim'),
    defineField({
      name: 'related',
      title: 'Hình ảnh liên quan (1280×720 px, 16:9)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image', title: 'URL hình ảnh', type: 'url' }),
          langString('caption', 'Mô tả'),
        ],
        preview: {
          select: { title: 'caption.vi', subtitle: 'image' },
        },
      }],
    }),
    defineField({ name: 'order', title: 'Thứ tự hiển thị', type: 'number' }),
  ],
  orderings: [
    { title: 'Năm mới nhất', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
    { title: 'Thứ tự tuỳ chỉnh', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'year' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: String(subtitle) }),
  },
})
