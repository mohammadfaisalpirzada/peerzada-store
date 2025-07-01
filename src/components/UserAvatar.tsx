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
        <Image
          src="/images/user.jpg"
          alt="User Avatar"
          width={40}
          height={40}
          onClick={() => setOpen(!open)}
          className="h-10 w-10 rounded-full border-2 border-red-600 cursor-pointer object-cover"
        />
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
