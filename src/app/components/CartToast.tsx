'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaShoppingCart, FaCheck, FaTimes } from 'react-icons/fa';

interface CartToastProps {
  show: boolean;
  onClose: () => void;
  itemTitle?: string;
}

export default function CartToast({ show, onClose, itemTitle }: CartToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 80, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-6 left-1/2 z-[100] w-[90vw] max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <FaCheck className="text-green-600 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Added to Cart!</p>
              <p className="text-xs text-gray-500 truncate">{itemTitle || 'Item added'}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/cart"
                className="px-4 py-2 bg-[#B80000] text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <FaShoppingCart />
                View Cart
              </Link>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-xs text-gray-500" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
