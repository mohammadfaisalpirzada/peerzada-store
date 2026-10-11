'use client';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Product } from './getProducts';
import { useRouter } from 'next/navigation';
import { PakistanFlag } from '../utils/flagUtils';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import { FaShoppingCart, FaWhatsapp, FaEdit } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import CartToast from '../components/CartToast';
import ProductShareButton from '../components/ProductShareButton';
import ProductEditModal from '../components/ProductEditModal';
import { getWhatsAppQueryUrl } from '@/lib/shareUtils';
import { isAdminEmail } from '@/lib/adminAuth';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem, addPendingItem } = useCart();
  const { data: session, status } = useSession();
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isAdmin = isAdminEmail(session?.user?.email) || (session?.user as any)?.role === 'admin';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const item = {
      productId: currentProduct._id,
      slug: currentProduct.slug,
      title: currentProduct.title,
      price: currentProduct.price,
      image: currentProduct.image ? urlFor(currentProduct.image).url() : (currentProduct.imageUrl || ''),
    };
    if (status === 'unauthenticated') {
      addPendingItem(item);
      router.push(`/login?callbackUrl=/products/${currentProduct.slug}`);
      return;
    }
    addItem(item);
    setAdded(true);
    setShowToast(true);
    setTimeout(() => {
      setAdded(false);
      setShowToast(false);
    }, 2000);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const waUrl = getWhatsAppQueryUrl(currentProduct);
    window.open(waUrl, '_blank');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = (updated: Partial<Product>) => {
    setCurrentProduct((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Find the subcategory object from the category's subcategories array
  const getSubcategoryTitle = () => {
    if (!currentProduct.subcategory || !currentProduct.category?.subcategories) {
      return null;
    }

    const subcategoryObj = currentProduct.category.subcategories.find(
      (subcat) => subcat.value === currentProduct.subcategory
    );

    return subcategoryObj?.title || null;
  };

  const subcategoryTitle = getSubcategoryTitle();
  const displayImageUrl = currentProduct.imageUrl || (currentProduct.image ? urlFor(currentProduct.image).url() : null);

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer relative group/card"
        onClick={() => router.push(`/products/${currentProduct.slug}`)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter') router.push(`/products/${currentProduct.slug}`);
        }}
      >
        <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
          <PakistanFlag />

          {/* Admin Direct Edit Trigger */}
          {isAdmin && (
            <button
              onClick={handleEditClick}
              type="button"
              title="Admin: Edit Photo & Details"
              className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#B80000] hover:bg-black text-white text-xs font-bold rounded-lg shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105"
            >
              <FaEdit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}

          {/* 1-Click Transparent Round Share Button (Left Bottom of Image) */}
          <div className="absolute bottom-3 left-3 z-20">
            <ProductShareButton product={currentProduct} />
          </div>

          {displayImageUrl && (
            <Image
              src={displayImageUrl}
              alt={currentProduct.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{currentProduct.title}</h3>
            <div className="flex flex-col gap-1">
              <span
                className={
                  subcategoryTitle
                    ? 'bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded'
                    : 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'
                }
              >
                {subcategoryTitle || currentProduct.category?.title || 'Product'}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{currentProduct.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-gray-900">Rs. {currentProduct.price.toLocaleString()}</span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                currentProduct.inStock !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {currentProduct.inStock !== false ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <div className="mt-auto space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={currentProduct.inStock === false}
              className={`w-full font-medium py-2 px-4 rounded transition-all duration-300 flex items-center justify-center gap-2 ${
                added ? 'bg-green-500 text-white' : 'bg-[#B80000] hover:bg-red-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FaShoppingCart className="text-sm" />
              {added ? 'Added!' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
              title="Send Inquiry with Photo & Link"
            >
              <FaWhatsapp className="text-base" />
              <span>WhatsApp Query</span>
            </button>
          </div>
        </div>
        <CartToast show={showToast} onClose={() => setShowToast(false)} itemTitle={currentProduct.title} />
      </div>

      {/* Admin Edit Modal */}
      {isAdmin && (
        <ProductEditModal
          product={{
            _id: currentProduct._id,
            title: currentProduct.title,
            price: currentProduct.price,
            description: currentProduct.description,
            imageUrl: displayImageUrl || undefined,
            inStock: currentProduct.inStock,
            brand: currentProduct.brand,
            color: currentProduct.color,
          }}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
}