import client from "../../../sanity/sanityClient";

export type Product = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: any;
  brand: string;
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
    `*[_type == "product"] {
      _id,
      title,
      "slug": slug.current,
      description,
      price,
      image,
      brand,
      "category": category->{title, "value": value.current, subcategories},
      subcategory,
      inStock
    }`
  );
}

// Get products by category
export async function getProductsByCategory(categoryValue: string) {
  return client.fetch(
    `*[_type == "product" && category->value.current == $categoryValue] {
      _id,
      title,
      "slug": slug.current,
      description,
      price,
      image,
      brand,
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
    `*[_type == "product" && category->value.current == $categoryValue && subcategory == $subcategoryValue] {
      _id,
      title,
      "slug": slug.current,
      description,
      price,
      image,
      brand,
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