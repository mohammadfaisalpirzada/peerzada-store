import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'k5n7yxex',
  dataset: 'production',
  apiVersion: '2023-07-03',
  useCdn: process.env.NODE_ENV === 'production', // CDN only in production
});

export default client;
