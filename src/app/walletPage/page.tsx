"use client";

import React from "react";
import Wallets from "../../components/Wallets";
import WalletBanner from "@/app/walletPage/walletBanner";

const WalletPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-roboto">
      {/* Customised Wallets Title */}
      <h1 className="cursor-pointer text-3xl font-bold mb-6 uppercase text-white text-center py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-red-500 via-red-700 to-red-500">
        OUR CUSTOMISED WALLETS
      </h1>

      {/* Banner Component */}
      <WalletBanner />

      {/* Wallets Component */}
      <Wallets showArrows={false} />
    </div>
  );
};

export default WalletPage;
