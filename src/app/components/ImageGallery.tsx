'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images?: string[];
  imageUrl?: string; // Legacy fallback
  title: string;
  className?: string;
}

export default function ImageGallery({ images, imageUrl, title, className = "" }: ImageGalleryProps) {
  // Use new images array if available, otherwise fallback to legacy imageUrl
  const allImages = images && images.length > 0 ? images.filter(Boolean) : (imageUrl ? [imageUrl] : []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center h-96 ${className}`}>
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image Display */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={allImages[selectedImageIndex]}
              alt={`${title} - Image ${selectedImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={selectedImageIndex === 0}
              onError={() => {
                console.error('Image failed to load:', allImages[selectedImageIndex]);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Navigation - Only show if multiple images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                selectedImageIndex === index 
                  ? 'border-[#B80000] ring-2 ring-[#B80000]/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={imageUrl}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                onError={() => {
                  console.error('Thumbnail failed to load:', imageUrl);
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {allImages.length > 1 && (
        <div className="text-center text-sm text-gray-500">
          {selectedImageIndex + 1} of {allImages.length}
        </div>
      )}
    </div>
  );
}