import { SchemaTypeDefinition } from 'sanity';

const educationalSchema: SchemaTypeDefinition = {
  name: 'educational',
  title: 'Educational Content',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() },
    { name: 'publishedAt', title: 'Published At', type: 'datetime', validation: Rule => Rule.required() },
    { name: 'mainImage', title: 'Main Image', type: 'image', options: { hotspot: true } },
    { name: 'body', title: 'Body', type: 'blockContent' },
    {
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Mathematics IX', value: 'math-ix' },
          { title: 'Mathematics X', value: 'math-x' },
          { title: 'Subject Notes', value: 'notes' },
          { title: 'Tutorial', value: 'tutorial' },
          { title: 'Solution', value: 'solution' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'subject',
      title: 'Subject',
      type: 'string',
      description: 'Subject area this content belongs to',
      validation: Rule => Rule.required()
    },
    {
      name: 'grade',
      title: 'Grade/Class',
      type: 'string',
      description: 'Grade or class level (e.g., IX, X, XI, XII)',
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Urdu', value: 'ur' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    },
  ],
  orderings: [
    {
      title: 'Publishing Date, Newest',
      name: 'publishingDateDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Subject',
      name: 'subjectAsc',
      by: [{ field: 'subject', direction: 'asc' }],
    },
    {
      title: 'Content Type',
      name: 'contentTypeAsc',
      by: [{ field: 'contentType', direction: 'asc' }],
    },
  ],
};

export default educationalSchema;