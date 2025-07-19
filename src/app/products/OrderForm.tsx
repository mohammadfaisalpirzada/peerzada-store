'use client';
import { useState } from 'react';

export default function OrderForm({ product }: { product: any }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Order Request:%0AProduct: ${product.title}%0AColor: ${product.color || 'N/A'}%0APrice: Rs. ${product.price}%0A---%0AName: ${name}%0AContact: ${contact}%0ADetails: ${details}`;
    window.open(`https://wa.me/+923458340668?text=${message}`, '_blank');
  };

  return (
    <form onSubmit={handleOrder} className="mt-6 flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Order this product</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Contact Number"
        value={contact}
        onChange={e => setContact(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <textarea
        placeholder="Order Details (e.g. color, customizations, address)"
        value={details}
        onChange={e => setDetails(e.target.value)}
        className="border rounded px-3 py-2"
        rows={3}
        required
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
      >
        Order via WhatsApp
      </button>
    </form>
  );
} 