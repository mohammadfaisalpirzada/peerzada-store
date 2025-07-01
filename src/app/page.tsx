// src/app/page.tsx
"use client"; // Ensures this runs only on the client side

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * HomePage Component
 * ------------------
 * - If the user is **authenticated**, they are redirected to `/store`.
 * - If **not authenticated**, a welcoming landing page with a Login button is shown.
 * - While authentication is being checked, a **loading state** is displayed.
 */
const HomePage = () => {
  const { status } = useSession(); // Fetch user's authentication status
  const router = useRouter(); // Next.js router for navigation

  // Redirect authenticated users to the store page
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/store"); // Send logged-in users to `/store`
    }
  }, [status, router]);

  // Show loading text while authentication status is being checked
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-red-600">
          Checking login status...
        </div>
      </div>
    );
  }

  // If the user is NOT logged in, show the landing page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <img
        src="/images/logo.svg"
        alt="Peerzada Store Logo"
        className="w-32 h-32 mb-6 drop-shadow-lg"
      />
      <h1 className="text-3xl md:text-5xl font-bold text-red-700 mb-4 text-center">
        Welcome to Peerzada Store
      </h1>
      <p className="text-gray-600 text-lg md:text-xl mb-8 text-center max-w-xl">
        Discover the best wallets and accessories. Shop with confidence and style!
      </p>
      <Link
        href="/store"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-200 text-lg"
      >
        Explore Store
      </Link>
      <Link
        href="/auth/signin"
        className="mt-4 text-red-600 hover:underline text-base"
      >
        Login
      </Link>
    </div>
  );
};

export default HomePage; // Export the component as the default page
