'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const CATEGORIES = [
  { name: "Customised Gifts", slug: "customised-gifts", emoji: "🎁" },
  { name: "Clothing", slug: "clothing", emoji: "👕" },
  { name: "Wallets", slug: "wallets", emoji: "👜" },
  { name: "Premium", slug: "premium", emoji: "✨" },
  { name: "Accessories", slug: "accessories", emoji: "💎" },
];

export default function Home() {
  const [randomCategories, setRandomCategories] = useState<typeof CATEGORIES>([]);

  useEffect(() => {
    // Get 2 random categories
    const shuffled = [...CATEGORIES].sort(() => Math.random() - 0.5);
    setRandomCategories(shuffled.slice(0, 2));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative w-24 sm:w-32 h-24 sm:h-32 flex items-center justify-center">
              <Image
                src="/images/logo.svg"
                alt="Peerzada Store Logo"
                width={120}
                height={120}
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-3 sm:mb-4 leading-tight">
            PEERZADA.STORE
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium mb-4 sm:mb-6">
            Premium Wallets & Luxury Accessories
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-xl mx-auto">
            Discover our curated collection of handcrafted wallets and premium accessories. Quality meets style.
          </p>

          {/* CTA Buttons - First Row (Shop Now & Premium Gifts) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto mb-4">
            <Link
              href="/explore"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
            >
              <span className="text-xl sm:text-2xl">🛍️</span>
              <span>Shop Now</span>
            </Link>

            <Link
              href="/products?category=customised-gifts"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
            >
              <span className="text-xl sm:text-2xl">🎁</span>
              <span>Premium Gifts</span>
            </Link>
          </div>

          {/* CTA Buttons - Second Row (Random Categories) */}
          {randomCategories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
              {randomCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
                >
                  <span className="text-xl sm:text-2xl">{category.emoji}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Handcrafted with finest materials</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick shipping across Pakistan</p>
            </div>
            <div className="text-center sm:text-right">
              <h3 className="font-semibold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-sm text-gray-600">Safe & encrypted transactions</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              © 2026 Peerzada Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
