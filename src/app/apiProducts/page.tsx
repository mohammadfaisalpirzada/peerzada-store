"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  imagePath: string;
  price: string;
  description: string;
  discountPercentage: number;
  stockLevel: number;
  category: string;
}

const ApiProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("../api/template"); // Use the Next.js API route
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching API products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title Section */}
      <h1 className="text-3xl font-extrabold mb-8 uppercase text-white text-center py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-red-500 via-red-700 to-red-500">
        API PRODUCTS
      </h1>

      {/* Loading & No Data Handling */}
      {loading ? (
        <p className="text-center py-6 text-gray-500 text-lg font-semibold">
          Loading...
        </p>
      ) : products.length === 0 ? (
        <p className="text-center py-6 text-gray-500 text-lg font-semibold">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-lg p-5 bg-white transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center relative overflow-hidden"
            >
              {/* Image Section (Preserves Full Image) */}
              <div className="relative w-full h-[250px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.imagePath}
                  alt={product.name}
                  fill
                  className="object-contain w-full h-full rounded-lg shadow-md"
                />
              </div>

              {/* Product Details */}
              <div className="w-full text-center mt-4">
                <h2 className="text-lg font-extrabold text-red-600 uppercase truncate px-2">
                  {product.name}
                </h2>
                <p className="text-gray-700 font-semibold text-lg">
                  ${product.price}
                </p>
                <p className="text-gray-500 text-sm mt-2 px-3 line-clamp-2">
                  {product.description}
                </p>
                {product.discountPercentage > 0 && (
                  <p className="text-red-500 font-bold mt-2">
                    Discount: {product.discountPercentage}%
                  </p>
                )}
              </div>

              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-transparent opacity-30 rounded-lg pointer-events-none"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiProductsPage;
