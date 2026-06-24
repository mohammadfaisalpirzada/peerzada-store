'use client';

import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalAmount, itemCount } = useCart();
  const { status } = useSession();
  const router = useRouter();

  const handleCheckout = () => {
    if (status === 'authenticated') {
      router.push('/checkout');
    } else {
      router.push('/login?callbackUrl=/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B80000] text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              <FaArrowLeft />
              Start Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-sm">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1.5 transition-colors"
          >
            <FaTrash className="text-xs" />
            Clear All
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <motion.div
              key={item.productId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl p-4 flex gap-4 items-center shadow-sm border border-gray-100"
            >
              {/* Image */}
              <Link href={`/products/${item.slug}`} className="shrink-0">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FaShoppingBag />
                    </div>
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="block">
                  <h3 className="font-semibold text-gray-900 truncate hover:text-[#B80000] transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-[#B80000] font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <FaMinus className="text-[10px]" />
                </button>
                <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <FaPlus className="text-[10px]" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.productId)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
              >
                <FaTrash className="text-sm" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-xl font-bold text-gray-900">Rs. {totalAmount.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Shipping calculated at checkout</p>
          <button
            onClick={handleCheckout}
            className="w-full py-3.5 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaShoppingBag />
            {status === 'authenticated' ? 'Proceed to Checkout' : 'Sign in to Checkout'}
          </button>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">🔒 Secure Checkout</span>
            <span className="flex items-center gap-1">🚚 Free Shipping</span>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#B80000] font-medium transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
