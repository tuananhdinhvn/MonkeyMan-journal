'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool }    from '@sanity/vision'
import { schemaTypes }   from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'monkeyman-blog',
  title: 'MonkeyMan Blog',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Nội dung')
          .items([
            S.documentTypeListItem('album')      .title('🖼️ My Album'),
            S.documentTypeListItem('journalPost').title('📝 My Journal'),
            S.documentTypeListItem('movie')      .title('🎥 My Movies'),
            S.divider(),
            S.documentTypeListItem('myInfo')    .title('👤 My Info'),
            S.documentTypeListItem('videoIntro').title('🎬 Video Intro'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
