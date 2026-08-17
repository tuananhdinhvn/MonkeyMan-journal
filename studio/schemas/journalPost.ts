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

export const journalPost = defineType({
  name: 'journalPost',
  title: '📝 Bài nhật ký',
  type: 'document',
  fields: [
    langString('title', 'Tiêu đề'),
    langText('summary', 'Tóm tắt ngắn'),
    defineField({ name: 'coverImage', title: 'Ảnh bìa URL (1200×900 px, tỉ lệ 4:3)', type: 'url' }),
    defineField({ name: 'location', title: 'Địa điểm', type: 'string' }),
    defineField({ name: 'date',     title: 'Ngày đăng', type: 'date' }),
    defineField({ name: 'contentVi', title: '🇻🇳 Nội dung (Tiếng Việt)', type: 'text' }),
    defineField({ name: 'contentEn', title: '🇺🇸 Content (English)',      type: 'text' }),
    defineField({ name: 'contentKo', title: '🇰🇷 내용 (한국어)',           type: 'text' }),
  ],
  orderings: [
    { title: 'Ngày mới nhất', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title.vi', subtitle: 'location' },
  },
})
