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
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
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
