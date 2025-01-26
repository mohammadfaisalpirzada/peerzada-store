"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link"; // <-- import Link
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.min.css";


const NavBar = () => {
  const { data: session } = useSession();

  // Hamburger menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu if user clicks outside
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

  // Toggle the hamburger menu
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Show initials if no user image
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---- Top Row ---- */}
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative w-10 h-10 rounded-full border-2 border-white/80 overflow-hidden shadow-md transition-shadow duration-300">
              <Image
                src="/logo.png"
                alt="Website Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              P Store
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
            {/* Instagram => anchor is also fine if external or hash */}
            <a
              href="/walletPage"
              className="text-white text-sm font-medium hover:text-red-200 transition-colors duration-200 relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </a>

            <a
              href="/productSanity"
              className="text-white text-sm font-medium hover:text-red-200 transition-colors duration-200 relative group"
            >
              Sanity Products
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </a>
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

            {/* Heart icon (desktop only), centered */}
            <button title="Heart" className="hidden md:inline-flex items-center justify-center text-white w-8 h-8 rounded-full hover:bg-white/10 transition-colors duration-200">
              <i className="fas fa-heart text-lg"></i>
            </button>
            {/* Cart icon (desktop only), centered */}
            <button title="Cart" className="hidden md:inline-flex items-center justify-center text-white w-8 h-8 rounded-full hover:bg-white/10 transition-colors duration-200">
              <i className="fas fa-shopping-cart text-lg"></i>
            </button>

            {/* Profile (desktop only) */}
            <div className="hidden md:block">
              {session?.user?.image ? (
                <div className="relative w-9 h-9 rounded-full border-2 border-white/80 overflow-hidden shadow-md transition-all duration-300">
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-red-700 text-white flex items-center justify-center text-sm border-2 border-white/80 shadow-md">
                  {getInitials(session?.user?.name)}
                </div>
              )}
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
                  {/* Contact => anchor is just for #contact. If it's a separate route, use Link. */}
                  <a
                    href="#contact"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Contact
                  </a>
                  {/* About => anchor is just a placeholder. If a separate page, use Link. */}
                  <a
                    href="#about"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    About
                  </a>
                  <hr className="border-gray-200 my-1" />
                  <a
                    href="#cart"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View Cart
                  </a>
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <a
                    href="#checkout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Checkout
                  </a>
                  {/* Logout (disabled if logged out) */}
                  {session ? (
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      disabled
                      className="block w-full px-4 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed text-left"
                    >
                      Logout
                    </button>
                  )}
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
