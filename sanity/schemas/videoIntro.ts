import { defineField, defineType } from 'sanity'

export const videoIntro = defineType({
  name: 'videoIntro',
  title: '🎬 Video Intro',
  type: 'document',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description: 'Ví dụ: https://www.youtube.com/watch?v=XXXXXXXXX',
      validation: r => r.uri({ scheme: ['https', 'http'] }),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Video Intro' }),
  },
})
