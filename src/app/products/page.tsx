'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { getProducts, getProductsByCategory, getProductsBySubcategory, getSubcategoriesForCategory, Product } from './getProducts';
import ProductCard from './ProductCard';

type SearchParamsType = { 
  [key: string]: string | string[] | undefined 
};

export default function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParamsType>;
}) {
  // Unwrap the Promise using React.use()
  const resolvedSearchParams = use(searchParams);
  
  // Get category and subcategory from URL params
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
  const subcategory = typeof resolvedSearchParams.subcategory === 'string' ? resolvedSearchParams.subcategory : undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState('All Products');
  const [pageSubtitle, setPageSubtitle] = useState('Discover our wide range of premium products');
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  // Fetch products and page information
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let fetchedProducts: Product[] = [];
        
        if (category && subcategory) {
          // Fetch products by subcategory
          fetchedProducts = await getProductsBySubcategory(category, subcategory);
          
          // Get subcategory title for heading
          const subcats = await getSubcategoriesForCategory(category);
          setSubcategories(subcats || []);
          
          const subcatObj = subcats?.find((sc: any) => (sc.value?.current || sc.value) === subcategory);
          const subcatTitle = subcatObj?.title || (subcategory.charAt(0).toUpperCase() + subcategory.slice(1));
          
          setPageTitle(subcatTitle);
          setPageSubtitle(`Browse our collection of ${subcatTitle.toLowerCase()}`);
        } 
        else if (category) {
          // Fetch products by category
          fetchedProducts = await getProductsByCategory(category);
          
          // Get category title for display
          const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
          setPageTitle(categoryTitle);
          setPageSubtitle(`Browse our collection of ${categoryTitle.toLowerCase()}`);
          
          // Get subcategories for this category
          const subcats = await getSubcategoriesForCategory(category);
          setSubcategories(subcats || []);
          
          if (subcats && subcats.length > 0) {
            setPageSubtitle(`Browse our collection of ${categoryTitle.toLowerCase()} by subcategory`);
          }
        } 
        else {
          // Fetch all products
          fetchedProducts = await getProducts();
          setPageTitle('All Products');
          setPageSubtitle('Discover our wide range of premium products');
          setSubcategories([]);
        }
        
        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [category, subcategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
          <p className="text-xl text-gray-600">{pageSubtitle}</p>
        </div>
        
        {/* Subcategory filters - only show when in a category and subcategories exist */}
        {category && subcategories && subcategories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                href={`/products?category=${category}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!subcategory ? 'bg-[#B80000] text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                All {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}
              </Link>
              
              {subcategories.map((subcat: any) => (
                <Link 
                  key={subcat.value?.current || subcat.value || subcat.title} 
                  href={`/products?category=${category}&subcategory=${subcat.value?.current || subcat.value}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 ${subcategory === (subcat.value?.current || subcat.value) ? 'bg-[#B80000] text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  {subcat.icon && (typeof subcat.icon === 'string' ? <span>{subcat.icon}</span> : subcat.icon)}
                  {subcat.title}
                  {subcat.count > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${subcategory === (subcat.value?.current || subcat.value) ? 'bg-white text-[#B80000]' : 'bg-gray-300 text-gray-700'}`}>
                      {subcat.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-700">Loading products...</h2>
            <p className="text-gray-500 mt-2">Please wait while we fetch the products.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-700">No products found</h2>
            <p className="text-gray-500 mt-2">Try a different category or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}