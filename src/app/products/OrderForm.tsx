'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { urlFor } from '@/sanity/lib/image';
import { FaShoppingCart, FaWhatsapp, FaCheck } from 'react-icons/fa';

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
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image ? urlFor(product.image).url() : '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Product Inquiry:%0AProduct: ${product.title}%0AColor: ${product.color || 'N/A'}%0APrice: Rs. ${product.price}%0A---%0AName: ${name}%0AContact: ${contact}%0ADetails: ${details}`;
    window.open(`https://wa.me/+923458340668?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.inStock === false}
        className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 ${
          added
            ? 'bg-green-500 text-white'
            : 'bg-gradient-to-r from-[#B80000] to-red-600 text-white hover:scale-[1.02]'
        }`}
      >
        {added ? (
          <><FaCheck className="text-lg" /> Added to Cart!</>
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
    </div>
  );
}
