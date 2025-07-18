import { SchemaTypeDefinition } from 'sanity';
import React from 'react';

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Helper function to validate emoji input
const validateEmoji = (icon: string): boolean => {
  // Allow emojis, letters, numbers, and some safe characters
  if (!icon) return true; // Allow empty values
  // This regex allows emojis and basic text
  return icon.length <= 10; // Just limit the length instead of restricting characters
}

const categorySchema: SchemaTypeDefinition = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Title', 
      type: 'string',
      validation: Rule => Rule.required()
    },
    { 
      name: 'value', 
      title: 'Value', 
      type: 'slug',
      description: 'Auto-generated from title, used for filtering',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) => generateSlug(input)
      },
      validation: Rule => Rule.required()
    },
    { 
      name: 'icon', 
      title: 'Icon (Emoji)', 
      type: 'string', 
      description: 'Emoji or text icon to represent this category (max 10 characters)',
      validation: Rule => Rule.custom(icon => {
        if (typeof icon === 'string' && !validateEmoji(icon)) {
          return 'Icon must be 10 characters or less';
        }
        return true;
      })
    },
    { 
      name: 'description', 
      title: 'Description', 
      type: 'text' 
    },
    { 
      name: 'order', 
      title: 'Display Order', 
      type: 'number', 
      description: 'Lower numbers appear first',
      initialValue: 0
    },
    {
      name: 'subcategories',
      title: 'Subcategories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'value',
              title: 'Value',
              type: 'slug',
              options: {
                source: 'title',
                maxLength: 96,
                slugify: (input: string) => generateSlug(input)
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'icon',
              title: 'Icon (Emoji)',
              type: 'string',
              description: 'Emoji or text icon to represent this subcategory (max 10 characters)',
              validation: Rule => Rule.custom(icon => {
                if (typeof icon === 'string' && !validateEmoji(icon)) {
                  return 'Icon must be 10 characters or less';
                }
                return true;
              })
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text'
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'value.current',
              media: 'icon'
            },
            prepare(selection: any) {
              const { title, subtitle, media } = selection;
              return {
                title: title,
                subtitle: subtitle || 'Auto-generated value',
                media: media ? React.createElement('span', {style: {fontSize: '2rem'}}, media) : undefined
              };
            }
          }
        }
      ],
      description: 'Add subcategories for this category'
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'value.current',
      media: 'icon',
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection;
      return {
        title: title,
        subtitle: subtitle || 'Auto-generated value',
        media: media ? React.createElement('span', {style: {fontSize: '2rem'}}, media) : undefined
      };
    }
  },
};

export default categorySchema;
