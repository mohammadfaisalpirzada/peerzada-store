"use client";

import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginForm = () => {
  const [loading, setLoading] = useState(true); // Used to check session status
  const [signingIn, setSigningIn] = useState(false); // Used for login button state
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/store"); // Redirect if already logged in
      } else {
        setLoading(false); // Allow login form to render
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (provider: "google" | "github") => {
    setSigningIn(true);
    try {
      const result = await signIn(provider, { redirect: false });
      if (result?.ok) {
        router.push("/store"); // Redirect to store on successful login
      } else {
        console.error(`Login with ${provider} failed:`, result?.error);
      }
    } catch (error) {
      console.error(`Error logging in with ${provider}:`, error);
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-lg font-semibold">Checking login status...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-red-600">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Sign in to continue to your account
        </p>
        <button
          onClick={() => handleLogin("github")}
          disabled={signingIn}
          className={`w-full mt-6 py-2 px-4 rounded-lg text-white ${
            signingIn ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
          } focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2`}
        >
          {signingIn ? "Signing in with GitHub..." : "Sign in with GitHub"}
        </button>
        <button
          onClick={() => handleLogin("google")}
          disabled={signingIn}
          className={`w-full mt-4 py-2 px-4 rounded-lg text-white ${
            signingIn ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
        >
          {signingIn ? "Signing in with Google..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
