import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaStore, FaBlog, FaSearch, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { getCategories, CategoryInfo } from './explore/getCategories';

const navLinks = [
  {
    href: '/products',
    label: 'All Products',
    icon: <FaStore className="text-[#B80000] text-2xl font-bold" />,
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: <FaSearch className="text-[#007BFF] text-2xl font-bold" />,
  },
  {
    href: '/blogs',
    label: 'Blogs',
    icon: <FaBlog className="text-[#28A745] text-2xl font-bold" />,
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [allDropdownOpen, setAllDropdownOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // New state for mobile dropdown

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

  // Fetch categories from Sanity
  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats.filter(cat => cat.value !== 'all'));
    });
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

  // Split categories
  const firstTwo = categories.slice(0, 2);
  const rest = categories.slice(2);

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className={`text-2xl font-bold tracking-tight flex items-center gap-2 transition-colors duration-300 ${scrolled ? 'text-[#B80000]' : 'text-[#B80000]'}`}>
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <FaStore className="text-2xl" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-serif text-xl text-[#B80000]">Peerzada</span> {/* Changed to red */}
            <span className="text-xs text-gray-500 font-normal -mt-1">Premium Store</span>
          </div>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {/* First two categories as direct links */}
          {firstTwo.map(cat => (
            <Link
              key={cat.value}
              href={`/products?category=${cat.value}`}
              className={`flex items-center gap-2 transition-all duration-300 text-lg font-medium relative group ${scrolled ? 'text-gray-800 hover:text-[#B80000]' : 'text-gray-800 hover:text-[#B80000]'}`}
            >
              <span className="text-[#B80000] text-2xl font-bold">
                {cat.icon ? cat.icon : <FaStore />}
              </span>
              <span>{cat.name}</span>
            </Link>
          ))}
          {/* All Categories Mega Dropdown */}
          {rest.length > 0 && (
            <div className="relative group flex items-center" style={{ minHeight: '56px' }} onMouseEnter={() => setAllDropdownOpen(true)} onMouseLeave={() => { setAllDropdownOpen(false); setSubmenuOpen(null); }}>
              <button className={`flex items-center gap-2 transition-all duration-300 text-lg font-medium relative group px-4 py-2 rounded-md ${scrolled ? 'text-gray-800 hover:text-[#B80000]' : 'text-gray-800 hover:text-[#B80000]'}`}
                onClick={() => setAllDropdownOpen(v => !v)}
                type="button"
                style={{ minHeight: '48px' }}
              >
                <FaStore className="text-[#B80000] text-2xl font-bold" />
                <span>All Categories</span>
                <FaChevronDown className="ml-1 text-xs" />
              </button>
              <AnimatePresence>
                {allDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2 px-2 flex"
                    style={{ minHeight: '56px' }}
                  >
                    <div className="w-1/2">
                      {rest.map(cat => (
                        <div
                          key={cat.value}
                          className="relative"
                          onMouseEnter={() => setSubmenuOpen(cat.value)}
                          onMouseLeave={() => setSubmenuOpen(null)}
                        >
                          <Link
                            href={`/products?category=${cat.value}`}
                            className="block px-4 py-2 text-gray-800 hover:bg-[#B80000]/10 hover:text-[#B80000] transition-colors rounded flex items-center gap-2 min-h-[44px]"
                            onClick={() => setAllDropdownOpen(false)}
                          >
                            <span className="text-[#B80000] text-2xl font-bold">
                              {cat.icon ? cat.icon : <FaStore />}
                            </span>
                            {cat.name}
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <FaChevronRight className="inline ml-2 text-xs" />
                            )}
                          </Link>
                          {/* Submenu for subcategories */}
                          {cat.subcategories && cat.subcategories.length > 0 && submenuOpen === cat.value && (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-0 left-full w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2 px-2"
                              style={{ minHeight: '44px' }}
                            >
                              {cat.subcategories.map(subcat => (
                                <Link
                                  key={subcat.value}
                                  href={`/products?category=${cat.value}&subcategory=${subcat.value}`}
                                  className="block px-4 py-2 text-gray-800 hover:bg-[#B80000]/10 hover:text-[#B80000] transition-colors rounded min-h-[40px]"
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
              className={`flex items-center gap-2 transition-all duration-300 text-lg font-medium relative group ${scrolled ? 'text-gray-800 hover:text-[#B80000]' : 'text-gray-800 hover:text-[#B80000]'}`}
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
        </div>
        <motion.button
          className={`md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${scrolled ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-800'}`}
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
                      <div className="w-10 h-10 bg-gradient-to-br from-[#B80000] to-[#8B0000] rounded-xl flex items-center justify-center shadow-lg">
                        <FaStore className="text-white text-lg" />
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
                              {link.label === 'Blogs' && 'Latest articles'}
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
