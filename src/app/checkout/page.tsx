'use client';

import { useCart } from '@/lib/cart-context';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaShoppingBag, FaSpinner, FaCheckCircle, FaPhone, FaMapMarkerAlt, FaUser, FaClipboardList } from 'react-icons/fa';
import { z } from 'zod';
import { QRCodeSVG } from 'qrcode.react';

const checkoutSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[\d\+\-\s]+$/, 'Invalid phone number format'),
  address: z.string().min(10, 'Please enter a complete delivery address (min 10 characters)'),
  notes: z.string().optional(),
  transactionId: z.string().min(4, 'Please enter the transaction/reference ID').optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const EASYPAISA_NUMBER = '03458340669';
const EASYPAISA_NAME = 'Muhammad Faisal Peerzada';
const EASYPAISA_IBAN = 'PK76TMFB0000000021951136';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<'review' | 'form' | 'submitting' | 'success' | 'error'>('review');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CheckoutForm>({
    phone: '',
    address: '',
    notes: '',
    transactionId: '',
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
    setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleContinue = () => {
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        if (!errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
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
          transactionId: form.transactionId,
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

  const inputClass = (field: keyof CheckoutForm) =>
    `w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all ${
      fieldErrors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`flex items-center gap-2 ${step === 'review' || step === 'form' || step === 'submitting' || step === 'success' ? 'text-[#B80000]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'review' || step === 'form' || step === 'submitting' ? 'bg-[#B80000] text-white' :
              step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step === 'success' ? <FaCheckCircle /> : '1'}
            </div>
            <span className="text-sm font-medium hidden sm:inline">Review</span>
          </div>
          <div className={`w-12 h-0.5 ${step === 'form' || step === 'submitting' || step === 'success' ? 'bg-[#B80000]' : 'bg-gray-200'}`} />
          <div className={`flex items-center gap-2 ${step === 'form' || step === 'submitting' ? 'text-[#B80000]' : step === 'success' ? 'text-green-500' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'form' || step === 'submitting' ? 'bg-[#B80000] text-white' :
              step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step === 'success' ? <FaCheckCircle /> : '2'}
            </div>
            <span className="text-sm font-medium hidden sm:inline">Checkout</span>
          </div>
          <div className={`w-12 h-0.5 ${step === 'success' ? 'bg-green-500' : 'bg-gray-200'}`} />
          <div className={`flex items-center gap-2 ${step === 'success' ? 'text-green-500' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-sm font-medium hidden sm:inline">Confirm</span>
          </div>
        </div>

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
          ) : step === 'review' ? (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Review Your Order</h1>
                <p className="text-gray-500 text-sm">Review items before proceeding</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaShoppingBag className="text-[#B80000]" />
                  Order Items ({items.length})
                </h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden relative shrink-0">
                        {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} x Rs. {item.price.toLocaleString()}</p>
                        <p className="text-sm font-semibold text-[#B80000]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-xl font-bold text-gray-900">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-3.5 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Continue to Checkout
                <FaArrowLeft className="rotate-180" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-6">
                <button
                  onClick={() => setStep('review')}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#B80000] transition-colors mb-3"
                >
                  <FaArrowLeft className="text-xs" />
                  Back to Review
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-500 text-sm">Complete your delivery details</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaUser className="text-[#B80000]" />
                      Contact & Delivery
                    </h2>

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
                            className={inputClass('phone') + ' pl-10'}
                          />
                        </div>
                        {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
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
                            rows={3}
                            className={inputClass('address') + ' pl-10 resize-none'}
                          />
                        </div>
                        {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
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

                      {/* EasyPaisa Payment Section */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                          </svg>
                          EasyPaisa Payment
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                          Make payment to the following account and enter the transaction ID below.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-green-100 mb-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Account</p>
                              <p className="text-base font-bold text-gray-900">{EASYPAISA_NUMBER}</p>
                              <p className="text-sm text-gray-500">{EASYPAISA_NAME}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">IBAN</p>
                              <p className="text-sm font-mono font-semibold text-gray-900 break-all">{EASYPAISA_IBAN}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                          <div className="bg-white p-2 rounded-lg border border-green-100 shadow-sm">
                            <QRCodeSVG value={EASYPAISA_NUMBER} size={100} bgColor="#ffffff" fgColor="#15803d" />
                          </div>
                          <div className="text-xs text-gray-400">
                            <p>Scan this QR code with your EasyPaisa app to send payment.</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Transaction / Reference ID <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="transactionId"
                            value={form.transactionId}
                            onChange={handleChange}
                            placeholder="Enter EasyPaisa transaction ID"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all"
                          />
                          {fieldErrors.transactionId && <p className="text-red-500 text-xs mt-1">{fieldErrors.transactionId}</p>}
                        </div>
                      </div>

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

                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-28">
                    <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaClipboardList className="text-[#B80000]" />
                      Order Summary
                    </h2>
                    <div className="space-y-3 mb-4">
                      {items.map(item => (
                        <div key={item.productId} className="flex gap-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden relative shrink-0">
                            {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold text-[#B80000]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
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
