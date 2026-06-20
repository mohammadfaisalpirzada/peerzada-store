'use client';

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, Suspense, useRef } from 'react';
import NewArrivalCard from './NewArrivalCard';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from '../utils/useDebounce';

interface CategoryInfo {
  name: string;
  value: string;
  icon: string;
  count: number;
  description?: string;
}

// Product type from Sanity
interface SearchProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  brand?: string;
  inStock?: boolean;
  category?: {
    title: string;
    value: string;
  };
}

interface Product {
  _id: string;
  title: string;
  slug: { current: string } | string;
  description: string;
  price: number;
  imageUrl: string;
  _createdAt: string;
  inStock?: boolean;
  category?: {
    title: string;
  };
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch search results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    async function fetchResults() {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data ?? []);
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  // Click outside to close results
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToProduct = (slug: string) => {
    setShowResults(false);
    setQuery('');
    router.push(`/products/${slug}`);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className={`w-5 h-5 ${isSearching ? 'text-[#B80000]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (e.target.value) setShowResults(true); }}
          onFocus={() => { if (results.length > 0) setShowResults(true); }}
          placeholder="Search products by name, brand, or description..."
          className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B80000]/20 focus:border-[#B80000] shadow-sm hover:shadow-md transition-all duration-300"
        />

        {/* Clear / Spinner */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-[#B80000] border-t-transparent rounded-full animate-spin" />
          ) : query ? (
            <button
              onClick={() => { setQuery(''); setResults([]); setShowResults(false); }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              type="button"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (debouncedQuery.trim()) && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {results.length === 0 && !isSearching ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-gray-500 font-medium">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => navigateToProduct(product.slug)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0 group"
                  type="button"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#B80000] transition-colors truncate">
                      {product.title}
                    </h4>
                    {product.brand && (
                      <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-gray-900">Rs. {product.price}</span>
                      {product.category?.title && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {product.category.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <svg className="w-5 h-5 text-gray-300 group-hover:text-[#B80000] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ))
            )}

            {/* View all results link */}
            {results.length > 0 && (
              <Link
                href={`/products?search=${encodeURIComponent(debouncedQuery)}`}
                onClick={() => { setShowResults(false); setQuery(''); }}
                className="block w-full text-center py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-[#B80000] transition-colors"
              >
                View all {results.length} results
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchParamsWrapper() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [heading, setHeading] = useState('All Categories');
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, newArrivalsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/new-arrivals?limit=4'),
        ]);
        const categoriesData = await categoriesRes.json();
        const newArrivalsData = await newArrivalsRes.json();
        setCategories(categoriesData ?? []);
        setNewArrivals(newArrivalsData ?? []);
        // Set heading based on category param
        if (category) {
          // Try to find the category title from categoriesData
          const catObj = (categoriesData ?? []).find((cat: any) => cat.value === category);
          setHeading(catObj ? catObj.name : category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        } else {
          setHeading('All Categories');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B80000] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">{heading}</h1>
          <p className="text-lg text-gray-500">Discover our wide range of premium products</p>
        </motion.div>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <SearchBar />
        </motion.div>

        {/* New Arrivals Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl font-semibold text-gray-800"
            >
              <motion.span
                animate={{ 
                  color: ['#1f2937', '#dc2626', '#1f2937'],
                  textShadow: [
                    '0 0 0px rgba(220, 38, 38, 0)',
                    '0 0 10px rgba(220, 38, 38, 0.5)',
                    '0 0 0px rgba(220, 38, 38, 0)'
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                New Arrivals
              </motion.span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link 
                href="/products" 
                className="text-[#B80000] hover:text-red-700 font-medium transition-colors duration-200"
              >
                Explore More →
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {newArrivals.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <NewArrivalCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Categories Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
            >
              <Link 
                href={category.value === 'all' ? '/products' : `/products?category=${category.value}`}
                className="h-full"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 text-center group cursor-pointer min-h-[340px] max-h-[380px] flex flex-col justify-between items-center">
                  <div className="text-6xl mb-4">
                    {typeof category.icon === 'string' ? (
                      <span>{category.icon}</span>
                    ) : (
                      category.icon
                    )}
                  </div>
                  <h2 className="font-semibold text-gray-800 text-xl group-hover:text-indigo-600 transition-colors duration-300 mb-2 text-center">
                    {category.name}
                    {category.count > 0 && (
                      <span className="ml-2 text-sm bg-gray-100 text-gray-700 py-1 px-2 rounded-full">
                        {category.count}
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-500 text-sm text-justify max-w-xs mx-auto mt-2 mb-3 line-clamp-3">
                    {category.description}
                  </p>
                  <div className="text-gray-600 mb-3">Browse Collection →</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper />
    </Suspense>
  );
}
