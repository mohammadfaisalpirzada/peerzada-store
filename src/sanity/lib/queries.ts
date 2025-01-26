import { createClient } from '@sanity/client';

// Initialize Sanity client
const client = createClient({
  projectId: 'k5n7yxex', // Your Sanity project ID
  dataset: 'production', // Your dataset
  apiVersion: '2023-01-01', // Use the latest API version
  useCdn: true, // Use CDN for faster responses
});

// Fetch wallets
export const fetchWallets = async () => {
  const query = `

*[_type == "product" && category == "Wallet"] | order(_updatedAt desc) {
  _id,
  name,
  price,
  description,
  image {
    asset {
      _ref
    }
  },
  discountPercentage,
  isFeaturedProduct,
  stockLevel,
  category,
  _updatedAt
}
  `;

  return await client.fetch(query);
};



