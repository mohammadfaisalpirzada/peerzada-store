import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStore, FaWallet, FaBlog, FaSearch, FaHeart } from 'react-icons/fa';

const navLinks = [
  { href: '/explore', label: 'Explore', icon: <FaSearch /> },
  { href: '/products', label: 'Products', icon: <FaStore /> },
  { href: '/wallets', label: 'Wallets', icon: <FaWallet /> },
  { href: '/blogs', label: 'Blogs', icon: <FaBlog /> },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 mt-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#B80000] opacity-20 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut'
        }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#2563EB] opacity-20 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
          delay: 2
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand section */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-4">
              <FaStore className="text-2xl text-[#B80000]" />
              <span className="font-serif">Peerzada</span>
            </Link>
            <p className="text-gray-400 text-center md:text-left mb-6">Premium quality products for your everyday needs.</p>
            <div className="flex gap-4">
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#B80000] hover:text-white transition-all duration-300"
                whileHover={{ y: -3 }}
              >
                <FaSearch />
              </motion.a>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#B80000] hover:text-white transition-all duration-300"
                whileHover={{ y: -3 }}
              >
                <FaStore />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#B80000] hover:text-white transition-all duration-300"
                whileHover={{ y: -3 }}
              >
                <FaWallet />
              </motion.a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-6 relative">
              <span className="relative z-10">Quick Links</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#B80000] opacity-70 z-0"></span>
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {navLinks.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <motion.span 
                    className="text-[#B80000]"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    {link.icon}
                  </motion.span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-6 relative">
              <span className="relative z-10">Contact Us</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#B80000] opacity-70 z-0"></span>
            </h3>
            <p className="text-gray-400 mb-4">Have questions? Reach out to us!</p>
            <a href="tel:+923458340668" className="text-gray-400 hover:text-white transition-colors mb-2 flex items-center gap-2">
              <span className="text-[#B80000]">📞</span> +92 345 8340668
            </a>
            <a href="mailto:info@peerzada.store" className="text-gray-400 hover:text-white transition-colors mb-6 flex items-center gap-2">
              <span className="text-[#B80000]">✉️</span> info@peerzada.store
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>&copy; {new Date().getFullYear()} Peerzada Store</span>
            <FaHeart className="text-[#B80000] animate-pulse" />
            <span>All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}