'use client';

import React, { useEffect, useState } from 'react';
import { fetchWallets } from '../sanity/lib/queries';
import { urlFor } from '../sanity/lib/sanityImage';
import Image from 'next/image';

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

interface WalletsProps {
  wallets?: Wallet[]; // Allow preloaded wallets to be passed as props
  showArrows?: boolean; // Control whether to show the rotate arrows
}

const Wallets: React.FC<WalletsProps> = ({ wallets: initialWallets = [], showArrows = true }) => {
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets || []);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadWallets = async () => {
      if (!initialWallets?.length) {
        const data = await fetchWallets();
        setWallets(data);
      }
    };

    loadWallets();
  }, [initialWallets]);

  const rotateLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wallets.length) % wallets.length);
  };

  const rotateRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wallets.length);
  };

  const visibleItems = showArrows
    ? wallets.slice(currentIndex, currentIndex + 3).concat(
        wallets.slice(0, Math.max(0, currentIndex + 3 - wallets.length))
      )
    : wallets;

  return (
    <div className="max-w-6xl mx-auto px-4 py-1 font-roboto relative">
      {wallets.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="relative">
          {/* Rotate Left Button */}
          {showArrows && (
            <button
              onClick={rotateLeft}
              className="absolute left-4 top-[calc(50%-4rem)] bg-gradient-to-r from-white/20 to-white/10 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:scale-110 shadow-md hover:shadow-lg rounded-full w-12 h-12 flex items-center justify-center z-10 transition-all duration-300"
            >
              ‹
            </button>
          )}

          {/* Wallets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
            {visibleItems.map((wallet) => (
              <div
                key={wallet._id}
                className="border rounded-lg shadow-lg p-1 flex flex-col items-center justify-between h-[28rem] bg-white"
              >
                {/* Image Section */}
                {wallet.image?.asset && (
                  <div className="relative w-full">
                    <Image
                      src={urlFor(wallet.image).url()}
                      alt={wallet.name || 'Wallet Image'}
                      width={400}
                      height={300}
                      className="object-cover w-full h-48"
                    />
                  </div>
                )}

                {/* Wallet Name */}
                <div className="w-full bg-gradient-to-r from-white via-gray-100 to-white text-center py-2 px-3 mt-2 rounded-lg shadow-md">
                  <h2 className="text-red-500 font-bold uppercase truncate">
                    {wallet.name}
                  </h2>
                </div>

                {/* Wallet Details */}
                <div className="p-4 flex flex-col items-start justify-between w-full">
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {wallet.description}
                  </p>
                  <p className="text-gray-900 font-bold">Price: ${wallet.price}</p>
                  <p className="text-gray-600">Discount: {wallet.discountPercentage || 0}%</p>
                  <p className="text-gray-600">Stock Level: {wallet.stockLevel}</p>
                  <p className="text-gray-500 text-xs">Category: {wallet.category}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rotate Right Button */}
          {showArrows && (
            <button
              onClick={rotateRight}
              className="absolute right-4 top-[calc(50%-4rem)] bg-gradient-to-r from-white/20 to-white/10 text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:scale-110 shadow-md hover:shadow-lg rounded-full w-12 h-12 flex items-center justify-center z-10 transition-all duration-300"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Wallets;
