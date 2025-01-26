'use client';

import React, { useEffect, useState } from 'react';
import { fetchWallets } from '../../sanity/lib/queries';
import { urlFor } from '../../sanity/lib/sanityImage'     // Import the helper function
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

const WalletsPage: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    const getWallets = async () => {
      const data = await fetchWallets();
      setWallets(data);
    };

    getWallets();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Wallets</h1>
      {wallets.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div key={wallet._id} className="border rounded-lg overflow-hidden shadow-lg">
              {wallet.image?.asset && (
                <>
                  {/* Debugging: Log the generated image URL */}
                  {console.log(urlFor(wallet.image).url())}

                  {/* Render the Image using the urlFor helper */}
                  <Image
                    src={urlFor(wallet.image).url()}
                    alt={wallet.name || 'Wallet Image'}
                    width={400}
                    height={300}
                    className="object-cover w-full h-48"
                  />
                </>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{wallet.name}</h2>
                <p className="text-gray-700 text-sm mb-2">{wallet.description}</p>
                <p className="text-gray-900 font-bold">Price: ${wallet.price}</p>
                <p className="text-gray-600">Discount: {wallet.discountPercentage || 0}%</p>
                <p className="text-gray-600">Stock Level: {wallet.stockLevel}</p>
                <p className="text-gray-500 text-xs">Category: {wallet.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletsPage;
