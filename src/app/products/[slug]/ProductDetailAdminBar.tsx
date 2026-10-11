'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaEdit, FaTools } from 'react-icons/fa';
import ProductEditModal, { EditableProduct } from '@/app/components/ProductEditModal';
import { isAdminEmail } from '@/lib/adminAuth';

interface ProductDetailAdminBarProps {
  product: EditableProduct;
}

export default function ProductDetailAdminBar({ product }: ProductDetailAdminBarProps) {
  const { data: session } = useSession();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isAdmin = isAdminEmail(session?.user?.email) || (session?.user as any)?.role === 'admin';

  if (!isAdmin) return null;

  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#B80000] text-white flex items-center justify-center">
            <FaTools className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Admin Mode Active</p>
            <p className="text-[11px] text-gray-600">You can edit the image, title, price, and details right here.</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditOpen(true)}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B80000] hover:bg-black text-white text-xs font-bold rounded-lg shadow transition-all duration-200 hover:scale-105"
        >
          <FaEdit className="w-3.5 h-3.5" />
          <span>Edit Product</span>
        </button>
      </div>

      <ProductEditModal
        product={product}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
