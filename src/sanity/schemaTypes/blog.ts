import { SchemaTypeDefinition } from 'sanity';

const blogSchema: SchemaTypeDefinition = {
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
    { name: 'mainImage', title: 'Main Image', type: 'image', options: { hotspot: true } },
    { name: 'body', title: 'Body', type: 'blockContent' },
  ],
  orderings: [
    {
      title: 'Publishing Date, Newest',
      name: 'publishingDateDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
};

export default blogSchema;