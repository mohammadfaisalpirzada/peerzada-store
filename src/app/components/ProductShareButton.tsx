'use client';

import React, { useState } from 'react';
import {
  getProductShareData,
  getProductImageUrl,
  fetchProductImageFile,
  downloadProductImage,
  getWhatsAppQueryUrl,
  ShareableProduct,
} from '@/lib/shareUtils';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaCopy, FaCheck, FaDownload, FaSpinner } from 'react-icons/fa';

interface ProductShareButtonProps {
  product: ShareableProduct;
  className?: string;
  iconSize?: number;
}

export default function ProductShareButton({ product, className = '', iconSize = 18 }: ProductShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsLoading(true);
    const shareData = getProductShareData(product);
    const imageUrl = getProductImageUrl(product);

    try {
      // 1. Try to fetch the actual image file to share the real photo
      const imageFile = await fetchProductImageFile(imageUrl, product.title);

      // 2. If mobile device supports sharing binary files (Android Chrome, iPhone Safari)
      if (
        imageFile &&
        typeof navigator !== 'undefined' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [imageFile] })
      ) {
        try {
          await navigator.share({
            files: [imageFile],
            title: shareData.title,
            text: shareData.text,
          });
          setIsLoading(false);
          return;
        } catch (shareErr: any) {
          if (shareErr?.name === 'AbortError') {
            setIsLoading(false);
            return;
          }
        }
      }

      // 3. Fallback: if browser supports sharing text/url natively
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: shareData.title,
            text: shareData.text,
            url: shareData.url,
          });
          setIsLoading(false);
          return;
        } catch (shareErr: any) {
          if (shareErr?.name === 'AbortError') {
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsLoading(false);
    }

    // Fallback menu for desktop or when native share is cancelled/unavailable
    setShowMenu((prev) => !prev);
  };

  const shareData = getProductShareData(product);
  const imageUrl = getProductImageUrl(product);

  const handleDownloadPhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    const ok = await downloadProductImage(imageUrl, product.title);
    setIsLoading(false);
    if (ok) {
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(`${shareData.text}`);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const encoded = encodeURIComponent(shareData.text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setShowMenu(false);
  };

  const handleWhatsAppSellerQuery = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const queryUrl = getWhatsAppQueryUrl(product);
    window.open(queryUrl, '_blank');
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
        disabled={isLoading}
        type="button"
        aria-label={`Share ${product.title}`}
        title="Share with photo and details"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/30 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer disabled:opacity-75"
      >
        {isLoading ? (
          <FaSpinner className="w-3.5 h-3.5 animate-spin text-white" />
        ) : (
          /* Curved social share arrow */
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
        )}
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
            className="absolute left-0 bottom-full mb-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 text-gray-800 animate-in fade-in zoom-in-95 duration-150"
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)' }}
          >
            <div className="px-3 py-1.5 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
              <span>Share Product</span>
              <span className="text-[10px] text-green-600 font-bold">1-Click</span>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <button
                type="button"
                onClick={handleDownloadPhoto}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  {downloaded ? <FaCheck className="w-3 h-3 text-white" /> : <FaDownload className="w-3 h-3" />}
                </div>
                <span>{downloaded ? 'Photo Saved!' : 'Save / Download Photo'}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="w-3.5 h-3.5" />
                </div>
                <span>Share via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppSellerQuery}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="w-3.5 h-3.5" />
                </div>
                <span>WhatsApp Store Query</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center flex-shrink-0">
                  {copied ? <FaCheck className="w-3 h-3 text-green-300" /> : <FaCopy className="w-3 h-3" />}
                </div>
                <span>{copied ? 'Copied Details!' : 'Copy Link & Details'}</span>
              </button>

              <button
                type="button"
                onClick={handleFacebookShare}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <FaFacebookF className="w-3 h-3" />
                </div>
                <span>Share on Facebook</span>
              </button>

              <button
                type="button"
                onClick={handleTwitterShare}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-sky-600 hover:bg-sky-50 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center flex-shrink-0">
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
