'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getProducts, getProductsByCategory, getProductsBySubcategory, searchProducts, Product } from './getProducts';
import { getSubcategories } from '../explore/getCategories';
import ProductCard from './ProductCard';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { SkeletonGrid } from '../components/ProductSkeleton';
import { FaFilter, FaTimes } from 'react-icons/fa';

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under Rs. 1,000', min: 0, max: 1000 },
  { label: 'Rs. 1,000 - Rs. 3,000', min: 1000, max: 3000 },
  { label: 'Rs. 3,000 - Rs. 5,000', min: 3000, max: 5000 },
  { label: 'Above Rs. 5,000', min: 5000, max: Infinity },
];

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  interface SubcategoryInfo {
    title: string;
    value: string;
    icon?: string;
    description?: string;
    count: number;
  }
  const [subcategories, setSubcategories] = useState<SubcategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const search = searchParams.get('search');
  const [pageTitle, setPageTitle] = useState('All Products');
  const [showFilters, setShowFilters] = useState(false);

  const [priceRange, setPriceRange] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        let fetchedProducts;
        if (search) {
          fetchedProducts = await searchProducts(search);
          setPageTitle(`Search: "${search}"`);
          setSubcategories([]);
        } else if (category) {
          const fetchedSubcategories = await getSubcategories(category);
          setSubcategories(fetchedSubcategories);

          if (subcategory) {
            fetchedProducts = await getProductsBySubcategory(category, subcategory);
            const catTitle = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const subcatObj = fetchedSubcategories.find(
              (subcat: SubcategoryInfo) => subcat.value?.toString().toLowerCase() === subcategory.toString().toLowerCase()
            );
            const subcatTitle = subcatObj ? subcatObj.title : subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
  }, [category, subcategory, search]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const range = PRICE_RANGES[priceRange];
      if (range && (p.price < range.min || p.price > range.max)) return false;
      if (inStockOnly && p.inStock === false) return false;
      return true;
    });
  }, [products, priceRange, inStockOnly]);

  const activeFilterCount = (priceRange > 0 ? 1 : 0) + (inStockOnly ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 w-64 skeleton mx-auto mb-3" />
            <div className="h-5 w-48 skeleton mx-auto" />
          </div>
          <SkeletonGrid count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">!</span>
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-5 py-2 bg-[#B80000] text-white rounded-xl hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
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
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">{pageTitle}</h1>
          <p className="text-lg text-gray-500">Explore our curated collection of premium products.</p>
          <p className="text-sm text-gray-500 mt-2">{filteredProducts.length} products</p>
        </motion.div>

        {/* Subcategory Chips */}
        {subcategories.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {subcategories.map((subcat) => (
              <Link key={subcat.value} href={`/products?category=${category}&subcategory=${subcat.value}`}>
                <motion.div
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    subcategory === subcat.value
                      ? 'bg-[#B80000] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {subcat.title} ({subcat.count})
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}

        {/* Filter Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'bg-[#B80000] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FaFilter className="text-xs" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-white text-[#B80000] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setPriceRange(0); setInStockOnly(false); }}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                <FaTimes className="text-xs" />
                Clear all filters
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-5 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range, i) => (
                      <button
                        key={i}
                        onClick={() => setPriceRange(i)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          priceRange === i
                            ? 'bg-[#B80000] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <label className="inline-flex items-center gap-2.5 cursor-pointer">
                    <div
                      onClick={() => setInStockOnly(!inStockOnly)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        inStockOnly ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                          inStockOnly ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-700">In stock only</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-400">!</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-1">No products found</h2>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setPriceRange(0); setInStockOnly(false); }}
              className="px-5 py-2 bg-[#B80000] text-white rounded-xl hover:bg-red-700 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
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

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageContent />
    </Suspense>
  );
}
