"use client";

import React from "react";

interface ArrowButtonProps {
  direction: "left" | "right"; // Specify the direction
  onClick: () => void; // Click handler
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ direction, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 transform -translate-y-1/2 ${
        direction === "left" ? "left-4" : "right-4"
      } w-12 h-12 rounded-full bg-gradient-to-r ${
        direction === "left"
          ? "from-pink-500 to-red-500"
          : "from-red-500 to-pink-500"
      } text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110`}
    >
      <span
        className={`text-2xl font-bold ${
          direction === "left" ? "-rotate-90" : "rotate-90"
        }`}
      >
        →
      </span>
    </button>
  );
};

export default ArrowButton;
