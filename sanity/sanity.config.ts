import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from '../src/sanity/schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Peerzada Store',
  projectId: 'k5n7yxex',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
