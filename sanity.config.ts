import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision'; // Import the Vision tool
import { productSchema } from '@/sanity/schemaTypes/product';

export default defineConfig({
  name: 'default',
  title: 'Peerzada Store',

  projectId: 'k5n7yxex', // Replace with your project ID
  dataset: 'production', // Replace with your dataset name

  plugins: [deskTool(), visionTool()], // Add Vision tool to plugins

  schema: {
    types: [productSchema], // Add your schemas here
  },
});
