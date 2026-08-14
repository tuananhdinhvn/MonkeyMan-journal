import { defineField, defineType } from 'sanity'

const langFields = (name: string, title: string, multiline = false) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      { name: 'vi', title: '🇻🇳 Tiếng Việt', type: multiline ? 'text' : 'string' },
      { name: 'en', title: '🇺🇸 English',     type: multiline ? 'text' : 'string' },
      { name: 'ko', title: '🇰🇷 한국어',       type: multiline ? 'text' : 'string' },
    ],
  })

export const album = defineType({
  name: 'album',
  title: '🖼️ Album ảnh',
  type: 'document',
  fields: [
    langFields('name', 'Tên album'),
    langFields('description', 'Mô tả', true),
    defineField({ name: 'location', title: 'Địa điểm', type: 'string' }),
    defineField({ name: 'date',     title: 'Ngày',     type: 'date' }),
    defineField({ name: 'coverImage', title: 'Ảnh bìa (1400×1050 px, tỉ lệ 4:3)', type: 'image',
      options: { hotspot: true } }),
    defineField({
      name: 'photos',
      title: 'Ảnh trong album (1400×1050 px, tỉ lệ 4:3)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'photo', title: 'Hình ảnh', type: 'image', options: { hotspot: true } }),
          langFields('caption', 'Mô tả ảnh'),
        ],
        preview: {
          select: { media: 'photo', title: 'caption.vi' },
        },
      }],
    }),
    defineField({ name: 'order', title: 'Thứ tự hiển thị', type: 'number' }),
  ],
  orderings: [
    { title: 'Ngày mới nhất', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Thứ tự tuỳ chỉnh', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name.vi', subtitle: 'location', media: 'coverImage' },
  },
})
