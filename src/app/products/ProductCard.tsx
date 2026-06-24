'use client';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Product } from './getProducts';
import { useRouter } from 'next/navigation';
import { PakistanFlag } from '../utils/flagUtils';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import { FaShoppingCart, FaWhatsapp } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image ? urlFor(product.image).url() : '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello, I'm interested in ordering the ${product.title}. Please provide more information.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/+923458340668?text=${encodedMessage}`, '_blank');
  };

  // Find the subcategory object from the category's subcategories array
  const getSubcategoryTitle = () => {
    if (!product.subcategory || !product.category.subcategories) {
      return null;
    }
    
    const subcategoryObj = product.category.subcategories.find(
      subcat => subcat.value === product.subcategory
    );
    
    return subcategoryObj?.title || null;
  };

  const subcategoryTitle = getSubcategoryTitle();

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
      onClick={() => router.push(`/products/${product.slug}`)}
      role="button"
      tabIndex={0}
      onKeyPress={e => { if (e.key === 'Enter') router.push(`/products/${product.slug}`); }}
    >
      <div className="relative h-64 w-full">
        <PakistanFlag />
        {product.image && (
          <Image
            src={urlFor(product.image).url()}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
          <div className="flex flex-col gap-1">
            <span className={
              subcategoryTitle
                ? "bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded"
                : "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
            }>
              {subcategoryTitle || product.category.title}
            </span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-gray-900">Rs. {product.price}</span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="mt-auto space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full font-medium py-2 px-4 rounded transition-all duration-300 flex items-center justify-center gap-2 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-[#B80000] hover:bg-red-700 text-white'
            }`}
          >
            <FaShoppingCart className="text-sm" />
            {added ? 'Added!' : 'Add to Cart'}
          </button>
          <button
            onClick={handleWhatsAppOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
            disabled={!product.inStock}
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}