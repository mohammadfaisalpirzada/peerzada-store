import { client } from "../../sanity/lib/client";

export type CategoryInfo = {
  name: string;
  value: string;
  icon: string;
  count: number;
  description?: string;
  subcategories?: Array<{
    title: string;
    value: string;
    icon?: string;
    description?: string;
    count: number;
  }>;
};

export async function getCategories() {
  // Fetch categories from Sanity with subcategories
  const categories = await client.fetch(`
    *[_type == "category"] | order(order asc) {
      title,
      "value": value.current,
      icon,
      description,
      subcategories,
      "count": count(*[_type == "product" && references(^._id)])
    }
  `);

  // Transform to match expected format and calculate subcategory counts
  const formattedCategories = await Promise.all(
    categories.map(async (category: any) => {
      let subcategoriesWithCounts = [];
      
      if (category.subcategories && category.subcategories.length > 0) {
        subcategoriesWithCounts = await Promise.all(
          category.subcategories.map(async (subcat: any) => {
            const subcategoryValue = subcat.value?.current || subcat.value;
            const subcategoryCount = await client.fetch(
              `count(*[_type == "product" && category->value.current == $categoryValue && subcategory == $subcategoryValue])`,
              { categoryValue: category.value, subcategoryValue }
            );
            
            return {
              title: subcat.title,
              value: subcategoryValue,
              icon: subcat.icon,
              description: subcat.description,
              count: subcategoryCount
            };
          })
        );
      }

      return {
        name: category.title,
        value: category.value,
        icon: category.icon,
        count: category.count,
        description: category.description,
        subcategories: subcategoriesWithCounts.length > 0 ? subcategoriesWithCounts : undefined
      };
    })
  );

  // Add "All Products" category
  const totalProducts = formattedCategories.reduce((sum: number, cat: any) => sum + cat.count, 0);
  formattedCategories.push({
    name: "All Products",
    value: "all",
    icon: "🛍️",
    count: totalProducts,
    description: "Browse all our products"
  });

  return formattedCategories;
}

// Get subcategories for a specific category
export async function getSubcategories(categoryValue: string) {
  // First, let's check what products exist for this category
  const productsInCategory = await client.fetch(`
    *[_type == "product" && category->value.current == $categoryValue] {
      title,
      subcategory,
      "categoryValue": category->value.current
    }
  `, { categoryValue });
  
  console.log('Products in category:', productsInCategory);

  const category = await client.fetch(`
    *[_type == "category" && value.current == $categoryValue][0] {
      subcategories[] {
        title,
        value,
        icon,
        description
      }
    }
  `, { categoryValue });

  if (!category?.subcategories) return [];

  // Calculate counts for each subcategory
  const subcategoriesWithCounts = await Promise.all(
    category.subcategories.map(async (subcat: any) => {
      const subcategoryValue = subcat.value?.current || subcat.value;
      
      // Count products that match this exact subcategory
      const count = await client.fetch(
        `count(*[_type == "product" && category->value.current == $categoryValue && subcategory == $subcategoryValue])`,
        { categoryValue, subcategoryValue }
      );
      
      return {
        title: subcat.title,
        value: subcategoryValue,
        icon: subcat.icon,
        description: subcat.description,
        count
      };
    })
  );

  return subcategoriesWithCounts;
}

export async function getNewArrivals(limit = 6) {
  // Fetch latest products from Sanity using _createdAt
  const products = await client.fetch(`
    *[_type == "product"] | order(_createdAt desc)[0...$limit] {
      _id,
      title,
      slug,
      image,
      images,
      "imageUrl": image.asset->url,
      "imageUrls": images[].asset->url,
      price,
      description,
      category->{title, value},
      _createdAt
    }
  `, { limit });
  return products;
}