import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'k5n7yxex', // Your Sanity project ID
  dataset: 'production',
  apiVersion: '2023-07-03', // Use current date or your preferred API version
  useCdn: true,
});

export default client;
