"use client";

import React from "react";
import Wallets from "../../components/Wallets";
import WalletBanner from "./WalletBanner";

const WalletPage: React.FC = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1518543007102-cd2910486d8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Page Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8 font-roboto z-10">
        {/* Customised Wallets Title */}
        <h1 className="cursor-pointer text-4xl font-extrabold mb-8 uppercase text-center py-4 rounded-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-red-500 via-red-700 to-red-500 shadow-lg">
          OUR CUSTOMISED WALLETS
        </h1>

        {/* Banner Component */}
        <div className="mb-10">
          <WalletBanner />
        </div>

        {/* Wallets Component */}
        <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
          <Wallets showArrows={false} />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="absolute bottom-0 left-0 w-full py-100 bg-black bg-opacity-80 text-center text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} Peerzada Store. All Rights Reserved.
      </footer>
    </div>
  );
};

export default WalletPage;
