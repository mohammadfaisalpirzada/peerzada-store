'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, getProductsByCategory, getProductsBySubcategory } from './getProducts';
import { getSubcategories } from '../explore/getCategories'; // Import getSubcategories
import ProductCard from './ProductCard';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]); // State for subcategories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const [pageTitle, setPageTitle] = useState('All Products');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        let fetchedProducts;
        if (category) {
          const fetchedSubcategories = await getSubcategories(category);
          setSubcategories(fetchedSubcategories);

          if (subcategory) {
            fetchedProducts = await getProductsBySubcategory(category, subcategory);
            const catTitle = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const subcatTitle = subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            setPageTitle(`${subcatTitle} in ${catTitle}`);
          } else {
            fetchedProducts = await getProductsByCategory(category);
            setPageTitle(category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
          }
        } else {
          fetchedProducts = await getProducts();
          setPageTitle('All Products');
          setSubcategories([]);
        }
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [category, subcategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B80000] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-red-600">Error</h2>
            <p className="text-gray-500 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">{pageTitle}</h1>
          <p className="text-lg text-gray-500">Explore our curated collection of premium products.</p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {products.length} products
          </p>
        </motion.div>

        {subcategories.length > 0 && (
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {subcategories.map((subcat) => (
              <Link key={subcat.value} href={`/products?category=${category}&subcategory=${subcat.value}`}>
                <motion.div 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${subcategory === subcat.value ? 'bg-[#B80000] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {subcat.title} ({subcat.count})
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-700">No products found</h2>
            <p className="text-gray-500 mt-2">Check back later for new products.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id || index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}