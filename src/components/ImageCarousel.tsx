"use client";

import React, { useState } from "react";
import Image from "next/image"; // Import Image from next/image

const images = [
  { src: "/banner1.jpg", title: "Leather Wallets", discount: "Premium Quality Leather - 30% Off" },
  { src: "/banner2.jpg", title: "Trendy Wallets", discount: "Stylish and Compact - Up to 25% Off" },
  { src: "/banner3.jpg", title: "Classic Wallets", discount: "Timeless Elegance - Flat 20% Off" },
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative flex flex-col items-center z-0 mt-4">
      {/* Image Carousel */}
      <div className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden">
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].title}
          fill // Ensures the image covers the container
          className="object-cover"
          priority={true} // Prioritize loading the first image
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">{images[currentIndex].title}</h2>
          <p className="text-lg sm:text-xl mt-2">{images[currentIndex].discount}</p>
          <button className="mt-4 px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
