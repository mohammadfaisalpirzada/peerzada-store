'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { urlFor } from '@/sanity/lib/image';
import { FaShoppingCart, FaWhatsapp, FaCheck } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CartToast from '../components/CartToast';

interface OrderFormProduct {
  _id: string;
  slug: string;
  title: string;
  price: number;
  color?: string;
  image?: { asset?: { _ref?: string } };
  inStock?: boolean;
}

export default function OrderForm({ product }: { product: OrderFormProduct }) {
  const { addItem, addPendingItem } = useCart();
  const { status } = useSession();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [customDetails, setCustomDetails] = useState('');
  const [noCustomization, setNoCustomization] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');

  const canAddToCart = customDetails.trim().length > 0 || noCustomization;

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    const item = {
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image ? urlFor(product.image).url() : '',
      customDetails: customDetails || undefined,
    };
    if (status === 'unauthenticated') {
      addPendingItem(item);
      router.push(`/login?callbackUrl=/products/${product.slug}`);
      return;
    }
    addItem(item);
    setAdded(true);
    setShowToast(true);
    setTimeout(() => { setAdded(false); setShowToast(false); }, 2000);
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Product Inquiry:%0AProduct: ${product.title}%0AColor: ${product.color || 'N/A'}%0APrice: Rs. ${product.price}%0A---%0AName: ${name}%0AContact: ${contact}%0ADetails: ${details}%0ACustomization: ${customDetails || 'N/A'}`;
    window.open(`https://wa.me/+923458340668?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Custom Details - Required for customized items */}
      <div className={`rounded-xl p-4 border transition-all ${
        noCustomization
          ? 'bg-gray-50 border-gray-200 opacity-60'
          : 'bg-amber-50 border-amber-200'
      }`}>
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Printing / Customization Details <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Please write what you want printed or customized on this item (engraving, text, design, size, etc.)
        </p>
        <textarea
          value={customDetails}
          onChange={e => setCustomDetails(e.target.value)}
          disabled={noCustomization}
          placeholder="e.g. Print 'Happy Birthday Ahmed' on the wallet, silver engraving, size M..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          rows={3}
        />
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={noCustomization}
            onChange={e => { setNoCustomization(e.target.checked); if (e.target.checked) setCustomDetails(''); }}
            className="w-4 h-4 rounded border-gray-300 text-[#B80000] focus:ring-[#B80000] accent-[#B80000] cursor-pointer"
          />
          <span className="text-xs text-gray-500">No customization needed — add as-is</span>
        </label>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.inStock === false || !canAddToCart}
        className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 ${
          !canAddToCart
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            : added
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-[#B80000] to-red-600 text-white hover:scale-[1.02]'
        }`}
      >
        {added ? (
          <><FaCheck className="text-lg" /> Added to Cart!</>
        ) : !canAddToCart ? (
          <><FaShoppingCart className="text-lg" /> Please add customization details</>
        ) : (
          <><FaShoppingCart className="text-lg" /> Add to Cart</>
        )}
      </button>

      {/* WhatsApp Order Form */}
      <form onSubmit={handleOrder} className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FaWhatsapp className="text-green-600" />
          Query via WhatsApp
        </h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
          required
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={contact}
          onChange={e => setContact(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
          required
        />
        <textarea
          placeholder="Order Details (e.g. color, customizations, address)"
          value={details}
          onChange={e => setDetails(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
          rows={3}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <FaWhatsapp />
          Send Query
        </button>
      </form>

      <CartToast show={showToast} onClose={() => setShowToast(false)} itemTitle={product.title} />
    </div>
  );
}
