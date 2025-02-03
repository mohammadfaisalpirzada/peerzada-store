"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

const LoginForm = () => {
  const [signingIn, setSigningIn] = useState(false);

  const handleLogin = async (provider: "google" | "github") => {
    setSigningIn(true);
    try {
      await signIn(provider, { callbackUrl: "/store" }); // Redirect to /store on successful login
    } catch (error) {
      console.error(`Error logging in with ${provider}:`, error);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-red-600">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mt-2">Sign in to continue</p>
        <button
          onClick={() => handleLogin("github")}
          disabled={signingIn}
          className={`w-full mt-6 py-2 px-4 rounded-lg text-white ${
            signingIn ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {signingIn ? "Signing in with GitHub..." : "Sign in with GitHub"}
        </button>
        <button
          onClick={() => handleLogin("google")}
          disabled={signingIn}
          className={`w-full mt-4 py-2 px-4 rounded-lg text-white ${
            signingIn ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {signingIn ? "Signing in with Google..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;