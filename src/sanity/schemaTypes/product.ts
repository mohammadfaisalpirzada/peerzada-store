import { SchemaTypeDefinition } from 'sanity';
import { SubcategoryInput } from '../components/SubcategoryInput';

const productSchema: SchemaTypeDefinition = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Title', 
      type: 'string',
      validation: Rule => Rule.required()
    },
    { 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'price', title: 'Price', type: 'number' },
    { 
      name: 'images', 
      title: 'Product Images', 
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for accessibility'
            }
          ]
        }
      ],
      options: {
        layout: 'grid'
      },
      validation: Rule => Rule.max(4).error('Maximum 4 images allowed')
    },
    // Keep the old image field for backward compatibility
    { 
      name: 'image', 
      title: 'Main Image (Legacy)', 
      type: 'image', 
      options: { hotspot: true },
      description: 'This field is kept for backward compatibility. Use "Product Images" instead.'
    },
    { name: 'brand', title: 'Brand', type: 'string' },
    { name: 'color', title: 'Color', type: 'string' },
    { 
      name: 'category', 
      title: 'Category', 
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      components: {
        input: SubcategoryInput
      },
      description: 'Select a subcategory based on the chosen category'
    },
    { name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true },
  ],
};

export default productSchema;
