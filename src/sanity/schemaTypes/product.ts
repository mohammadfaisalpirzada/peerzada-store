import { SchemaTypeDefinition } from 'sanity';

const walletSchema: SchemaTypeDefinition = {
  name: 'wallet',
  title: 'Wallet',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'brand', title: 'Brand', type: 'string' },
    { name: 'color', title: 'Color', type: 'string' },
    { name: 'inStock', title: 'In Stock', type: 'boolean' },
  ],
};

export default walletSchema;
