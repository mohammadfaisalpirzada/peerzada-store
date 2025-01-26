"use client";

import React, { useState, useEffect } from "react";
import { fetchWallets } from "../../sanity/lib/queries"; // Use your wallet query
import Image from "next/image";
import { urlFor } from "../../sanity/lib/sanityImage"; // Helper function for image URLs

interface Wallet {
  _id: string;
  name: string;
  price: string;
  description: string;
  image: {
    asset: {
      _ref: string;
    };
  };
  discountPercentage?: number;
  stockLevel: number;
  category: string;
  _updatedAt: string;
}

const WalletBanner: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch wallets data when the component mounts
  useEffect(() => {
    const loadWallets = async () => {
      const data = await fetchWallets(); // Fetch wallets using the same query
      setWallets(data);
    };

    loadWallets();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wallets.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? wallets.length - 1 : prevIndex - 1
    );
  };

  if (wallets.length === 0) {
    return <p>Loading banners...</p>;
  }

  return (
    <div className="relative flex flex-col items-center z-0 mt-4">
      {/* Image Carousel */}
      <div className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden">
        <Image
          src={urlFor(wallets[currentIndex].image).url()} // Generate image URL dynamically
          alt={wallets[currentIndex].name || "Wallet Image"}
          fill
          className="object-cover"
          priority={true}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">
            {wallets[currentIndex].name}
          </h2>
          <p className="text-lg sm:text-xl mt-2">
            Discount: {wallets[currentIndex].discountPercentage || 0}%
          </p>
          <button className="mt-4 px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WalletBanner;
