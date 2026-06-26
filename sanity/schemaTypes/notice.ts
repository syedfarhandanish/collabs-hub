import { defineField, defineType } from 'sanity'

export const noticeType = defineType({
  name: 'notice',          // The system ID
  title: 'Notice Board',   // What it looks like in the UI
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline / Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author / Club',
      type: 'string',
      description: 'e.g., Executive Team, IT Club, Debate Society',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Announcement Message',
      type: 'text',
      validation: (Rule) => Rule.required().max(200), // Keep it brief for the dashboard
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})