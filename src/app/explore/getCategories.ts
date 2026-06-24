import { client } from "../../sanity/lib/client";

interface RawSubcategory {
  title: string;
  value?: { current: string } | string;
  icon?: string;
  description?: string;
}

interface RawCategory {
  title: string;
  value: string;
  icon: string;
  description?: string;
  subcategories?: RawSubcategory[];
  count: number;
}

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
  const categories: RawCategory[] = await client.fetch(`
    *[_type == "category"] | order(order asc) {
      title,
      "value": value.current,
      icon,
      description,
      subcategories,
      "count": count(*[_type == "product" && references(^._id)])
    }
  `);

  const formattedCategories = await Promise.all(
    categories.map(async (category) => {
      let subcategoriesWithCounts: CategoryInfo['subcategories'] = [];

      if (category.subcategories && category.subcategories.length > 0) {
        subcategoriesWithCounts = await Promise.all(
          category.subcategories.map(async (subcat) => {
            const subcategoryValue = typeof subcat.value === 'string' ? subcat.value : subcat.value?.current || '';
            const subcategoryCount: number = await client.fetch(
              `count(*[_type == "product" && category->value.current == $categoryValue && subcategory == $subcategoryValue])`,
              { categoryValue: category.value, subcategoryValue }
            );

            return {
              title: subcat.title,
              value: subcategoryValue,
              icon: subcat.icon,
              description: subcat.description,
              count: subcategoryCount,
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
        subcategories: subcategoriesWithCounts.length > 0 ? subcategoriesWithCounts : undefined,
      };
    })
  );

  const totalProducts = formattedCategories.reduce((sum, cat) => sum + cat.count, 0);
  formattedCategories.push({
    name: "All Products",
    value: "all",
    icon: "🛍️",
    count: totalProducts,
    description: "Browse all our products",
    subcategories: undefined,
  });

  return formattedCategories;
}

export async function getSubcategories(categoryValue: string) {
  const category: { subcategories?: RawSubcategory[] } | null = await client.fetch(`
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

  const subcategoriesWithCounts = await Promise.all(
    category.subcategories.map(async (subcat) => {
      const subcategoryValue = typeof subcat.value === 'string' ? subcat.value : subcat.value?.current || '';

      const count: number = await client.fetch(
        `count(*[_type == "product" && category->value.current == $categoryValue && subcategory == $subcategoryValue])`,
        { categoryValue, subcategoryValue }
      );

      return {
        title: subcat.title,
        value: subcategoryValue,
        icon: subcat.icon,
        description: subcat.description,
        count,
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