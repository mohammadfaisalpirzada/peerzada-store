import client from "../../../sanity/sanityClient";

export type Product = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: any;
  imageUrl?: string;
  brand: string;
  color?: string;
  category: {
    title: string;
    value: string;
    subcategories?: Array<{
      title: string;
      value: string;
      icon?: string;
      description?: string;
    }>;
  };
  subcategory?: string;
  inStock: boolean;
};

// Get all products
export async function getProducts() {
  return client.fetch(
    `*[_type == "product"] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      price,
      image,
      "imageUrl": image.asset->url,
      brand,
      color,
      "category": category->{title, "value": value.current, subcategories},
      subcategory,
      inStock
    }`
  );
}

// Get products by category
export async function getProductsByCategory(categoryValue: string) {
  return client.fetch(
    `*[_type == "product" && category->value.current == $categoryValue] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      price,
      image,
      "imageUrl": image.asset->url,
      brand,
      color,
      "category": category->{title, "value": value.current, subcategories},
      subcategory,
      inStock
    }`,
    { categoryValue }
  );
}

// Get products by subcategory
export async function getProductsBySubcategory(categoryValue: string, subcategoryValue: string) {
  return client.fetch(
    `*[_type == "product" && category->value.current == $categoryValue && subcategory == $subcategoryValue] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      price,
      image,
      "imageUrl": image.asset->url,
      brand,
      color,
      "category": category->{title, "value": value.current, subcategories},
      subcategory,
      inStock
    }`,
    { categoryValue, subcategoryValue }
  );
}

// Get all subcategories for a specific category
export async function getSubcategoriesForCategory(categoryValue: string) {
  return client.fetch(
    `*[_type == "category" && value.current == $categoryValue][0].subcategories`,
    { categoryValue }
  );
}

// Get a single product by slug
export async function getProductBySlug(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      price,
      image,
      "imageUrl": image.asset->url,
      brand,
      color,
      "category": category->{title, "value": value.current, subcategories},
      subcategory,
      inStock
    }`,
    { slug }
  );
}