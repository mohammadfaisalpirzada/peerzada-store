"use client";

import React from "react";
import { signOut } from "next-auth/react";

const LogoutButton = ({ className }: { className?: string }) => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" }); // Redirect to login after logout
  };

  return (
    <button
      onClick={handleLogout}
      className={`py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 ${className}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
