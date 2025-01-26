import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'k5n7yxex', // Replace with your projectId
  dataset: 'production',     // Replace with your dataset name
  apiVersion: '2023-01-01',      // Use a valid API version
  useCdn: true,                  // Use CDN for faster reads
});

export const fetchProducts = async () => {
  const query = '*[_type == "product"]';
  const products = await sanityClient.fetch(query);
  return products;
};
