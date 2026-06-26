import { defineConfig, defineType, defineField } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

// ============================================================================
// 1. THE SCHEMA (Validation Removed to Unlock the Publish Button)
// ============================================================================
const noticeType = defineType({
  name: 'notice',          
  title: 'Notice Board',   
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline / Title',
      type: 'string',
      // Validation removed!
    }),
    defineField({
      name: 'author',
      title: 'Author / Club',
      type: 'string',
      description: 'e.g., Executive Team, IT Club, Debate Society',
      // Validation removed!
    }),
    defineField({
      name: 'message',
      title: 'Announcement Message',
      type: 'text',
      // Validation removed!
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
});

// ============================================================================
// 2. THE MAIN CONFIGURATION
// ============================================================================
export default defineConfig({
  basePath: '/studio', 
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7qlg8qk8',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: 'Collabs Hub Admin',
  
  plugins: [structureTool(), visionTool()],

  schema: {
    // 👇 Plug the schema in directly, bypassing the external folder
    types: [noticeType], 
  },
});