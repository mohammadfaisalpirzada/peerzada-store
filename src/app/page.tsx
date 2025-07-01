// src/app/page.tsx
"use client"; // Ensures this runs only on the client side

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login/LoginForm";

/**
 * HomePage Component
 * ------------------
 * - If the user is **authenticated**, they are redirected to `/store`.
 * - If **not authenticated**, the login form is shown.
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

  // If the user is NOT logged in, show the login form
  return <LoginForm />;
};

export default HomePage; // Export the component as the default page
