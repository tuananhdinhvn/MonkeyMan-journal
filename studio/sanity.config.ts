import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'monkeyman-blog',
  title: 'MonkeyMan Blog',
  projectId: 'o0qjv3va',
  dataset: 'production',
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
