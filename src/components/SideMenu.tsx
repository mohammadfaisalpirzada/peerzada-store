"use client";

import React from "react";
import Link from "next/link";

const storeItems = [
  "Wallets",
  "Keychains",
  "Frames",
  "Lockets",
  "Pendants",
  "Bracelets",
  "Necklaces",
  "Earrings",
  "Rings",
  "Mugs",
  "Coasters",
  "Bottles",
  "Backpacks",
  "Shields",
  "Fridge Magnets",
  "Wall Frames",
  "Watches",
  "Cufflinks",
  "Tie Pins",
  "Shoes",
  "Caps",
  "T-Shirts",
  "Polo Shirts",
  "Hoodies",
];

const SideMenu = () => {
  return (
    <div className="w-full sm:w-64 text-black bg-white border-r border-gray-200 relative overflow-hidden">
      {/* Peerzada Store Header with Sliding Animation */}
      <div className="p-3 relative">
        <h1 className="text-2xl font-bold uppercase text-red-600 font-roboto whitespace-nowrap animate-slideRightToLeft">
          PEERZADA STORE
        </h1>
      </div>

      {/* Menu Items */}
      <ul className="mt-4">
        {storeItems.map((item, index) => (
          <li
            key={index}
            className={`flex items-center justify-between px-4 py-2 ${
              item === "Wallets"
                ? "hover:bg-gray-100 text-black"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {item === "Wallets" ? (
              <Link href="/walletPage" className="flex items-center justify-between w-full">
                <span>{item}</span>
                <span className="ml-auto pl-3">&gt;</span>
              </Link>
            ) : (
              <>
                <span>{item}</span>
                <span className="ml-auto pl-3">&gt;</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
