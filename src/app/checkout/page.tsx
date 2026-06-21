'use client';

import { useCart } from '@/lib/cart-context';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaShoppingBag, FaSpinner, FaCheckCircle, FaPhone, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'submitting' | 'success' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    phone: '',
    address: '',
    notes: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && status !== 'loading') {
      router.push('/cart');
    }
  }, [items, status, router]);

  if (status === 'loading' || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <FaSpinner className="animate-spin text-2xl text-[#B80000]" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !form.address) {
      setErrorMsg('Phone and address are required.');
      return;
    }
    setStep('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
          })),
          totalAmount,
          phone: form.phone,
          address: form.address,
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Order failed');
      }

      clearCart();
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStep('form');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {step === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/20">
                <FaCheckCircle className="text-3xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Thank you for your order! We&apos;ll confirm it via WhatsApp shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/products"
                  className="px-6 py-3 bg-[#B80000] text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/cart"
                  className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  View Orders
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Header */}
              <div className="mb-6">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#B80000] transition-colors mb-3"
                >
                  <FaArrowLeft className="text-xs" />
                  Back to Cart
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-500 text-sm">Complete your order</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Form */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaUser className="text-[#B80000]" />
                      Contact & Delivery
                    </h2>

                    {/* User email (read-only) */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={session?.user?.email || ''}
                        readOnly
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm"
                      />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="03XX-XXXXXXX"
                            required
                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                          <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Street, city, province..."
                            required
                            rows={3}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (optional)</label>
                        <textarea
                          name="notes"
                          value={form.notes}
                          onChange={handleChange}
                          placeholder="Any special instructions..."
                          rows={2}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all resize-none"
                        />
                      </div>

                      {/* Error */}
                      {errorMsg && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                          {errorMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={step === 'submitting'}
                        className="w-full py-3.5 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {step === 'submitting' ? (
                          <><FaSpinner className="animate-spin" /> Placing Order...</>
                        ) : (
                          <><FaShoppingBag /> Place Order — Rs. {totalAmount.toLocaleString()}</>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-28">
                    <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-4">
                      {items.map(item => (
                        <div key={item.productId} className="flex gap-3">
                          <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden relative shrink-0">
                            {item.image && (
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold text-[#B80000]">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total</span>
                        <span className="text-xl font-bold text-gray-900">Rs. {totalAmount.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Free shipping included</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
