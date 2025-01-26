"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import LoginForm from "@/components/login/loginform";
import "@fortawesome/fontawesome-free/css/all.min.css";

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/store"); // Redirect to the store page if logged in
      } else {
        setLoading(false); // Show login form if not logged in
      }
    };
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-red-600">Checking login status...</div>
      </div>
    );
  }

  // Render the login form for unauthenticated users
  return <LoginForm />;
};

export default HomePage;
