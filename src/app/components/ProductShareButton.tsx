'use client';

import React, { useState } from 'react';
import { getProductShareData, ShareableProduct } from '@/lib/shareUtils';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaCopy, FaCheck } from 'react-icons/fa';

interface ProductShareButtonProps {
  product: ShareableProduct;
  className?: string;
  iconSize?: number;
}

export default function ProductShareButton({ product, className = '', iconSize = 18 }: ProductShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const shareData = getProductShareData(product);

    // If native Web Share API is available (mobile browsers, Safari, modern Chrome)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
        return;
      } catch (err: any) {
        // If user canceled the share dialog, do nothing
        if (err?.name === 'AbortError') {
          return;
        }
        // If failed or unsupported, fall through to show the fallback menu
      }
    }

    // Fallback menu for desktop or unsupported browsers
    setShowMenu((prev) => !prev);
  };

  const shareData = getProductShareData(product);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 1500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const encoded = encodeURIComponent(`${shareData.text}\n${shareData.url}`);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setShowMenu(false);
  };

  const handleFacebookShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = encodeURIComponent(shareData.url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowMenu(false);
  };

  const handleTwitterShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const text = encodeURIComponent(`Check out ${product.title} at Peerzada Store!\n${shareData.url}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    setShowMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Transparent round button with curved share arrow icon */}
      <button
        onClick={handleShareClick}
        type="button"
        aria-label={`Share ${product.title}`}
        title="Share with photo and details"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white border border-white/30 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        {/* Curved social share arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110 -ml-0.5"
          style={{ width: iconSize, height: iconSize }}
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>

      {/* 1-Click Share Fallback Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 bottom-full mb-2 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 text-gray-800 animate-in fade-in zoom-in-95 duration-150"
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)' }}
          >
            <div className="px-3 py-1.5 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Share Product
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <FaWhatsapp className="w-3.5 h-3.5" />
                </div>
                <span>Share via WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center">
                  {copied ? <FaCheck className="w-3 h-3 text-green-300" /> : <FaCopy className="w-3 h-3" />}
                </div>
                <span>{copied ? 'Copied with Details!' : 'Copy Link & Photo'}</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookShare}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <FaFacebookF className="w-3 h-3" />
                </div>
                <span>Share on Facebook</span>
              </button>
              <button
                type="button"
                onClick={handleTwitterShare}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-sky-600 hover:bg-sky-50 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center">
                  <FaTwitter className="w-3 h-3" />
                </div>
                <span>Share on X / Twitter</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
