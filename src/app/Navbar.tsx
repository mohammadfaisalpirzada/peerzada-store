'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
import { FaStore, FaSearch, FaBars, FaTimes, FaChevronDown, FaChevronRight, FaUser, FaSignOutAlt, FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/lib/cart-context';
=======
import { FaStore, FaSearch, FaBars, FaTimes, FaChevronDown, FaChevronRight, FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
>>>>>>> b90f073074e47867f00f4d3160483e133d433369
import { CategoryInfo } from './explore/getCategories';

const navLinks = [
  {
    href: '/products',
    label: 'All Products',
    icon: <FaStore className="text-[#B80000] text-lg" />,
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: <FaSearch className="text-[#007BFF] text-lg" />,
  },
];

function CartIcon() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-1.5 transition-all duration-300 text-sm font-medium text-gray-800 hover:text-[#B80000] group"
    >
      <motion.div
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="relative"
      >
        <FaShoppingCart className="text-lg" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#B80000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </motion.div>
      <span className="hidden sm:inline">Cart</span>
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [allDropdownOpen, setAllDropdownOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // New state for mobile dropdown
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Fetch categories via API route (server-side Sanity query avoids CORS issues)
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then((cats) => {
        setCategories(cats.filter((cat: CategoryInfo) => cat.value !== 'all'));
      })
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  // Split categories
  const firstTwo = categories.slice(0, 2);

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className={`font-bold tracking-tight flex items-center gap-2.5 transition-colors duration-300 ${scrolled ? 'text-[#B80000]' : 'text-[#B80000]'}`}>
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="relative"
          >
            <Image
              src="/images/logo.svg"
              alt="Peerzada Store Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-serif text-lg text-[#B80000] leading-tight">Peerzada</span>
            <span className="text-[10px] text-gray-500 font-normal -mt-0.5">Premium Store</span>
          </div>
        </Link>
        <div className="hidden md:flex gap-4 items-center">
          {/* First two categories as direct links */}
          {firstTwo.map(cat => (
            <Link
              key={cat.value}
              href={`/products?category=${cat.value}`}
              className={`flex items-center gap-1.5 transition-all duration-300 text-sm font-medium relative group ${scrolled ? 'text-gray-800 hover:text-[#B80000]' : 'text-gray-800 hover:text-[#B80000]'}`}
            >
              <span className="text-[#B80000] text-lg">
                {cat.icon ? cat.icon : <FaStore />}
              </span>
              <span>{cat.name}</span>
            </Link>
          ))}
          {/* All Categories Mega Dropdown */}
          {categories.length > 0 && (
            <div 
              className="relative group flex items-center" 
              onMouseEnter={() => setAllDropdownOpen(true)} 
              onMouseLeave={() => { setAllDropdownOpen(false); setSubmenuOpen(null); }}
            >
              <button 
                className={`flex items-center gap-1.5 transition-all duration-300 text-sm font-medium relative group px-2 py-1.5 rounded-md ${scrolled ? 'text-gray-800 hover:text-[#B80000]' : 'text-gray-800 hover:text-[#B80000]'}`}
                onClick={() => setAllDropdownOpen(v => !v)}
                type="button"
              >
                <FaStore className="text-[#B80000] text-lg" />
                <span>All Categories</span>
                <FaChevronDown className={`ml-0.5 text-[10px] transition-transform duration-200 ${allDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {allDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-[60] py-4 px-2"
                    style={{ 
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="grid grid-cols-1 gap-1">
                      {categories.map(cat => (
                        <div
                          key={cat.value}
                          className="relative"
                          onMouseEnter={() => setSubmenuOpen(cat.value)}
                          onMouseLeave={() => setSubmenuOpen(null)}
                        >
                          <Link
                            href={`/products?category=${cat.value}`}
                            className="group flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gradient-to-r hover:from-[#B80000]/5 hover:to-[#B80000]/10 hover:text-[#B80000] transition-all duration-200 rounded-lg"
                            onClick={() => setAllDropdownOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[#B80000] text-xl">
                                {cat.icon ? cat.icon : <FaStore />}
                              </span>
                              <span className="font-medium">{cat.name}</span>
                            </div>
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <FaChevronRight className="text-xs text-gray-400 group-hover:text-[#B80000] transition-colors" />
                            )}
                          </Link>
                          {/* Submenu for subcategories */}
                          {cat.subcategories && cat.subcategories.length > 0 && submenuOpen === cat.value && (
                            <motion.div
                              initial={{ opacity: 0, x: 10, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: 10, scale: 0.95 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className="absolute top-0 left-full ml-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-[70] py-3 px-2"
                              style={{ 
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              {cat.subcategories.map(subcat => (
                                <Link
                                  key={subcat.value}
                                  href={`/products?category=${cat.value}&subcategory=${subcat.value}`}
                                  className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-[#B80000]/5 hover:to-[#B80000]/10 hover:text-[#B80000] transition-all duration-200 rounded-lg font-medium"
                                  onClick={() => { setAllDropdownOpen(false); setSubmenuOpen(null); }}
                                >
                                  {subcat.title}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {/* End Mega Dropdown */}
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex items-center gap-1.5 transition-all duration-300 text-sm font-medium relative group ${scrolled ? 'text-gray-800 hover:text-[#B80000]' : 'text-gray-800 hover:text-[#B80000]'}`}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {link.icon}
              </motion.div>
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          
<<<<<<< HEAD
          {/* Cart Icon */}
          <CartIcon />
          
=======
>>>>>>> b90f073074e47867f00f4d3160483e133d433369
          {/* Profile / Sign In */}
          {status === 'authenticated' && session?.user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 group"
                type="button"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-7 h-7 text-gray-600 group-hover:text-[#B80000] transition-colors" />
                )}
                <span className="text-sm font-semibold text-gray-800 group-hover:text-[#B80000] transition-colors hidden sm:inline">
                  {session.user.name?.split(' ')[0] || 'Account'}
                </span>
                <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[60]"
                    style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email || ''}</p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#B80000]/5 hover:text-[#B80000] transition-colors"
                    >
                      <FaUser className="text-gray-400 w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      type="button"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign In
            </Link>
          )}
        </div>
        <motion.button
          className={`md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 ${scrolled ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-800'}`}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: menuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaBars className="text-lg" />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Enhanced Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-[60] md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Modern Glassmorphism Mobile Menu */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[70] md:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glassmorphism Background */}
              <div className="h-full w-full border-l border-gray-300/30 shadow-2xl">
                
                {/* Header Section */}
                <div className="relative p-6 border-b border-gray-300/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg p-1">
                        <Image
                          src="/images/logo.svg"
                          alt="Peerzada Store Logo"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Peerzada</h2>
                        <p className="text-xs text-gray-500">Premium Store</p>
                      </div>
                    </div>
                    
                    <button
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors cursor-pointer z-10 relative"
                      onClick={() => setMenuOpen(false)}
                      type="button"
                      aria-label="Close menu"
                    >
                      <FaTimes className="text-gray-700 text-lg" />
                    </button>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="p-6 space-y-2 pb-20">
                  {/* First two categories as direct links */}
                  {firstTwo.map(cat => (
                    <Link
                      key={cat.value}
                      href={`/products?category=${cat.value}`}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-white/60 hover:from-[#B80000]/10 hover:to-[#8B0000]/5 border border-gray-200/50 hover:border-[#B80000]/20 transition-all duration-300 shadow-sm hover:shadow-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-[#B80000]/20 group-hover:to-[#8B0000]/10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm">
                          <span className="text-gray-600 group-hover:text-[#B80000] text-xl transition-colors">
                            {cat.icon ? cat.icon : <FaStore />}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-900 font-semibold text-lg group-hover:text-[#B80000] transition-colors">
                            {cat.name}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        className="text-gray-400 group-hover:text-[#B80000] transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <FaChevronRight />
                      </motion.div>
                    </Link>
                  ))}
                
                  {/* Categories Dropdown showing all categories */}
                  <div className="mb-2">
                    <button
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white shadow-md border border-gray-200/50 text-gray-900 font-semibold text-lg group hover:text-[#B80000] transition-colors mb-2"
                      onClick={() => setDropdownOpen(v => !v)}
                      type="button"
                    >
                      <span className="flex items-center gap-2">
                        <FaStore className="text-[#B80000] text-2xl font-bold" /> Categories
                      </span>
                      <FaChevronDown className={`ml-2 text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2"
                        >
                          {categories.map(cat => (
                            <Link
                              key={cat.value}
                              href={`/products?category=${cat.value}`}
                              className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-[#B80000]/10 hover:text-[#B80000] transition-colors rounded-2xl text-lg font-semibold bg-white shadow mb-2"
                              onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}
                            >
                              <span className="text-[#B80000] text-2xl font-bold">
                                {cat.icon ? cat.icon : <FaStore />}
                              </span>
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                
                  {/* Sign In / User Profile Button (Mobile) */}
                  {status === 'authenticated' && session?.user ? (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-white/60 border border-gray-200/50 shadow-sm mb-2">
                        <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-200/50">
                          {session.user.image ? (
                            <Image
                              src={session.user.image}
                              alt={session.user.name || 'User'}
                              width={44}
                              height={44}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="w-11 h-11 text-gray-400" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-semibold text-base truncate">{session.user.name || 'User'}</p>
                            <p className="text-gray-500 text-sm truncate">{session.user.email || ''}</p>
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-[#B80000]/5 hover:text-[#B80000] transition-colors mb-1"
                        >
                          <FaUser className="text-gray-400 w-4 h-4" />
                          <span className="font-medium">My Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            signOut({ callbackUrl: '/' });
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                          type="button"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1,
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <Link
                        href="/login"
                        className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#B80000] to-red-600 text-white hover:from-red-700 hover:to-[#B80000] border border-[#B80000]/20 transition-all duration-300 shadow-md hover:shadow-lg"
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-white font-semibold text-lg">Sign In</span>
                            <p className="text-white/70 text-sm">Access your account</p>
                          </div>
                        </div>
                        <motion.div
                          className="text-white/70 group-hover:text-white transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )}

<<<<<<< HEAD
                  {/* Cart link (mobile) */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <Link
                      href="/cart"
                      className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-white/60 hover:from-[#B80000]/10 hover:to-[#8B0000]/5 border border-gray-200/50 hover:border-[#B80000]/20 transition-all duration-300 shadow-sm hover:shadow-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-[#B80000]/20 group-hover:to-[#8B0000]/10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm">
                          <FaShoppingCart className="text-gray-600 group-hover:text-[#B80000] text-xl transition-colors" />
                        </div>
                        <div>
                          <span className="text-gray-900 font-semibold text-lg group-hover:text-[#B80000] transition-colors">
                            Cart
                          </span>
                          <p className="text-gray-500 text-sm">View your items</p>
                        </div>
                      </div>
                      <motion.div
                        className="text-gray-400 group-hover:text-[#B80000] transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <FaChevronRight />
                      </motion.div>
                    </Link>
                  </motion.div>

=======
>>>>>>> b90f073074e47867f00f4d3160483e133d433369
                  {/* Other nav links */}
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1 + 0.2,
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-white/60 hover:from-[#B80000]/10 hover:to-[#8B0000]/5 border border-gray-200/50 hover:border-[#B80000]/20 transition-all duration-300 shadow-sm hover:shadow-md"
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-[#B80000]/20 group-hover:to-[#8B0000]/10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm">
                            <span className="text-gray-600 group-hover:text-[#B80000] text-xl transition-colors">
                              {link.icon}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-900 font-semibold text-lg group-hover:text-[#B80000] transition-colors">
                              {link.label}
                            </span>
                            <p className="text-gray-500 text-sm">
                              {link.label === 'Explore' && 'Discover new items'}
                              {link.label === 'All Products' && 'Browse our catalog'}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          className="text-gray-400 group-hover:text-[#B80000] transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <FaChevronRight />
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-6 w-20 h-20 bg-gradient-to-br from-[#B80000]/10 to-transparent rounded-full blur-xl"></div>
                <div className="absolute bottom-32 left-6 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl"></div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
