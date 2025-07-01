"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import UserAvatar from "./UserAvatar";

const NavBar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 transition-shadow duration-300">
              <Image
                src="/images/logo.svg"
                alt="Website Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide whitespace-nowrap">
              Peerzada Store
            </h1>
          </div>

          {/* Center: Desktop links */}
          <div className="hidden md:flex space-x-8">
            {/* Home => '/' (use Link) */}
            <Link
              href="/"
              className="text-white text-sm font-medium hover:text-red-200 transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </Link>
            {/* Instagram => anchor is also fine if external or hash */}
            <Link
              href="/walletPage"
              className="text-white text-sm font-medium hover:text-red-200 transition-colors duration-200 relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </Link>

            {/* Facebook => external link => <a> is OK */}
            <a
              href="https://www.facebook.com/peerzadastore"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-medium hover:text-red-200 transition-colors duration-200 relative group"
            >
              Facebook
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </a>
            {/* Contact => anchor is just for #contact. If it's a separate route, use Link. */}
            <Link
              href="/contact"
              className="text-white text-sm font-medium hover:text-red-200 transition-colors duration-200 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </Link>
          </div>

          {/* Right: Search, Icons, User Profile, Hamburger */}
          <div className="flex items-center space-x-6">
            {/* Search bar (desktop only) */}
            <div className="relative hidden md:flex items-center">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="bg-white/10 text-white placeholder-white/70 text-sm
                  rounded-full px-4 py-2 w-64
                  focus:outline-none focus:ring-2 focus:ring-white/50
                  transition-all duration-200"
              />
              <i className="fas fa-search text-white/70 absolute right-4"></i>
            </div>

            {/* Profile (desktop only) */}
            <div className="hidden md:block">
              <UserAvatar />
            </div>

            {/* Hamburger menu (always visible) */}
            <div className="relative" ref={menuRef}>
              <button
                title="Menu"
                className="text-white hover:bg-white/10 rounded-lg p-2 transition-colors duration-200 flex items-center justify-center"
                onClick={toggleMenu}
              >
                <i className="fas fa-bars text-lg"></i>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl py-2 w-48 z-50">
                  {/* Home => '/' (Link again) */}
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Home
                  </Link>
                  {/* Products => '/walletPage' (Link again) */}
                  <Link
                    href="/walletPage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Products
                  </Link>
                  {/* Contact => anchor is just for #contact. If it's a separate route, use Link. */}
                  <Link
                    href="/contact"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Contact
                  </Link>
                  {/* Facebook => external link => <a> is OK */}
                  <a
                    href="https://www.facebook.com/peerzadastore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Facebook
                  </a>
                  <hr className="border-gray-200 my-1" />
                  {/* Logout (disabled if logged out) */}
                  {session ? (
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                    >
                      Logout
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
