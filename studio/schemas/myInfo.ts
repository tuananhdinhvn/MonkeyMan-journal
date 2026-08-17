import { defineField, defineType } from 'sanity'

export const myInfo = defineType({
  name: 'myInfo',
  title: '👤 My Info',
  type: 'document',
  fields: [
    defineField({ name: 'portraitImage', title: 'Ảnh chân dung URL (600×800 px, tỉ lệ 3:4)', type: 'url' }),
    defineField({
      name: 'title', title: 'Tiêu đề', type: 'object',
      fields: [
        { name: 'vi', title: '🇻🇳 Tiếng Việt', type: 'string' },
        { name: 'en', title: '🇺🇸 English',     type: 'string' },
        { name: 'ko', title: '🇰🇷 한국어',       type: 'string' },
      ],
    }),
    defineField({
      name: 'text', title: 'Mô tả ngắn', type: 'object',
      fields: [
        { name: 'vi', title: '🇻🇳 Tiếng Việt', type: 'text' },
        { name: 'en', title: '🇺🇸 English',     type: 'text' },
        { name: 'ko', title: '🇰🇷 한국어',       type: 'text' },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'My Info' }),
  },
})
