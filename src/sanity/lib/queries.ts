import { createClient } from '@sanity/client';
import axios from "axios";

// Initialize Sanity client
const client = createClient({
  projectId: 'k5n7yxex', // Your Sanity project ID
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
});

// Fetch Wallets from Sanity
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
      stockLevel,
      category,
      _updatedAt
    }
  `;
  return await client.fetch(query);
};

// Fetch API Products
export const fetchApiProducts = async () => {
  try {
    const response = await axios.get(
      "https://next-ecommerce-template-4.vercel.app/api/product"
    );
    return response.data.products;
  } catch (error) {
    console.error("Error fetching API products:", error);
    return [];
  }
};
