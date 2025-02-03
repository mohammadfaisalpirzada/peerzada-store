
// scr/app/store/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HorizontalLine from "@/components/HorizontalLine";
import SideMenu from "@/components/SideMenu";
import ImageCarousel from "@/components/ImageCarousel";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";
import Wallets from "@/components/Wallets";

export default function StorePage() {
  const { status } = useSession(); // `status` is used to check authentication state
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Toggle for mobile side menu (drawer)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check authentication status
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to home/login page if unauthenticated
    } else if (status === "authenticated") {
      setLoading(false); // Stop loading when session is verified
    }
  }, [status, router]); // `status` is a valid dependency here

  // Display loading state while checking session
  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  // Open/close for mobile drawer
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Horizontal Line at top (optional) */}
      <HorizontalLine />

      {/* 
        --- Mobile Half-Round Button --- 
      */}
      <button
        onClick={openSidebar}
        className="sm:hidden fixed top-20 left-0 transform -translate-x-1/2 w-10 h-20 bg-red-600 text-white flex items-center justify-center rounded-r-full shadow z-40"
      >
        &gt;
      </button>

      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
        />
      )}

      {/* Mobile Slide-in Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50 sm:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideMenu />
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Desktop Side Menu */}
        <div className="hidden sm:block">
          <SideMenu />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <ImageCarousel />

          {/* Spacing Before the Customised Wallets Button */}
          <div className="my-8">
            <Link href="/walletPage">
              <h1 className="cursor-pointer text-3xl font-bold mb-6 uppercase text-white text-center py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-red-500 via-red-700 to-red-500">
                CUSTOMISED WALLETS
              </h1>
            </Link>
          </div>

          <Wallets showArrows={true} />
        </div>
      </div>
    </div>
  );
}