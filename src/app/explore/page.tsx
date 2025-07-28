'use client';

import Link from "next/link";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getCategories, getNewArrivals, CategoryInfo } from "./getCategories";
import NewArrivalCard from './NewArrivalCard';

// Product type from NewArrivalCard.tsx
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

export default function ExplorePage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, newArrivalsData] = await Promise.all([
          getCategories(),
          getNewArrivals(4)
        ]);
        setCategories(categoriesData);
        setNewArrivals(newArrivalsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-24">
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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Categories</h1>
          <p className="text-xl text-gray-600">Discover our wide range of premium products</p>
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
