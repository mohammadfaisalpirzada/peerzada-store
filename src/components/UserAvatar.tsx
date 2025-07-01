import { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function UserAvatar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {session?.user?.image ? (
        <Image
          src={session.user.image}
          alt="User Avatar"
          width={40}
          height={40}
          onClick={() => setOpen(!open)}
          className="h-10 w-10 rounded-full border-2 border-red-600 cursor-pointer object-cover"
        />
      ) : session?.user?.name ? (
        <div
          onClick={() => setOpen(!open)}
          className="h-10 w-10 rounded-full border-2 border-red-600 cursor-pointer bg-red-700 text-white flex items-center justify-center text-sm select-none"
        >
          {getInitials(session.user.name)}
        </div>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-red-600 bg-white text-red-600 cursor-pointer"
          aria-label="Login"
        >
          {/* Login SVG icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12l-3-3m0 0l3-3m-3 3h9" />
          </svg>
        </button>
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 text-sm">
          {!session ? (
            <button
              onClick={() => signIn()}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              🔐 Login
            </button>
          ) : (
            <>
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">👤 My Profile</Link>
              <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">📦 Orders</Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
