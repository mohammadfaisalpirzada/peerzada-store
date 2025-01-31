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

  // Navigate to the next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wallets.length);
  };

  // Navigate to the previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? wallets.length - 1 : prevIndex - 1
    );
  };

  // Display loading state while fetching data
  if (wallets.length === 0) {
    return <p className="text-center text-gray-500 mt-8">Loading banners...</p>;
  }

  return (
    <div className="relative flex flex-col items-center z-0 mt-4">
      {/* Image Carousel */}
      <div className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
        {/* Display the Current Wallet Image */}
        <Image
          src={urlFor(wallets[currentIndex].image).url()} // Generate image URL dynamically
          alt={wallets[currentIndex].name || "Wallet Image"}
          fill
          className="object-cover"
          priority={true}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white px-4">
          <h2 className="text-2xl sm:text-4xl font-bold text-center">
            {wallets[currentIndex].name}
          </h2>
          <p className="text-md sm:text-lg mt-2 text-center">
            Discount: {wallets[currentIndex].discountPercentage || 0}%
          </p>
          <button className="mt-4 px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-md">
            Shop Now
          </button>
        </div>

        {/* Left Navigation Button */}
        <button
          onClick={handlePrev}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gray-200 bg-opacity-60 hover:bg-red-500 hover:text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg transition-all duration-300 z-10"
        >
          ‹
        </button>

        {/* Right Navigation Button */}
        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-200 bg-opacity-60 hover:bg-red-500 hover:text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg transition-all duration-300 z-10"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default WalletBanner;
