import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStore, FaWallet, FaBlog, FaSearch, FaHeart, FaPhone, FaEnvelope, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const navLinks = [
  { href: '/explore', label: 'Explore', icon: <FaSearch /> },
  { href: '/products', label: 'Products', icon: <FaStore /> },
  { href: '/wallets', label: 'Wallets', icon: <FaWallet /> },
  { href: '/blogs', label: 'Blogs', icon: <FaBlog /> },
];

const socialLinks = [
  { href: 'https://twitter.com', icon: <FaTwitter />, label: 'Twitter' },
  { href: 'https://www.facebook.com/peerzadastore', icon: <FaFacebook />, label: 'Facebook' },
  { href: 'https://www.instagram.com/peerzadastore/', icon: <FaInstagram />, label: 'Instagram' },
  { href: 'https://www.linkedin.com/in/mohammad-faisal-peerzada-b57563180/', icon: <FaLinkedin />, label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white mt-20 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,0,0,0.1),transparent_50%)]"></div>
      </div>
      
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-[#B80000] to-red-600 opacity-10 blur-2xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut'
        }}
      />
      <motion.div 
        className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 blur-2xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
          delay: 2
        }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="p-2 bg-gradient-to-br from-[#B80000] to-red-600 rounded-xl shadow-lg"
                >
                  <FaStore className="text-xl text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Peerzada
                  </h2>
                  <p className="text-xs text-gray-400 -mt-1">Premium Store</p>
                </div>
              </Link>
              
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Discover premium quality products crafted for your everyday needs. 
                Experience excellence in every purchase.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#B80000] hover:border-[#B80000] transition-all duration-300 group"
                    whileHover={{ y: -2, scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-6 relative">
              <span className="relative">
                Quick Links
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#B80000] to-red-600 rounded-full"></span>
              </span>
            </h3>
            <div className="space-y-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                >
                  <Link 
                    href={link.href} 
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group py-1"
                  >
                    <motion.span 
                      className="text-[#B80000] group-hover:text-white transition-colors duration-300"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      {link.icon}
                    </motion.span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-6 relative">
              <span className="relative">
                Get in Touch
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#B80000] to-red-600 rounded-full"></span>
              </span>
            </h3>
            <div className="space-y-4">
              <motion.a 
                href="tel:+923458340668" 
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#B80000]/20 flex items-center justify-center group-hover:bg-[#B80000] transition-colors duration-300">
                  <FaPhone className="text-sm text-[#B80000] group-hover:text-white" />
                </div>
                <span className="text-sm">Call Now</span>
              </motion.a>
              
              <motion.a 
                href="mailto:info@peerzada.store" 
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#B80000]/20 flex items-center justify-center group-hover:bg-[#B80000] transition-colors duration-300">
                  <FaEnvelope className="text-sm text-[#B80000] group-hover:text-white" />
                </div>
                <span className="text-sm">info@peerzada.store</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-800/50 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span>&copy; {new Date().getFullYear()} Peerzada Store</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <FaHeart className="text-[#B80000]" />
                </motion.div>
                <span>All rights reserved</span>
              </div>
              
              {/* Developer Credit */}
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="text-gray-500">Crafted by</span>
                <Link 
                  href="/resume" 
                  className="text-[#B80000] hover:text-white transition-colors font-medium relative group"
                >
                  <span className="relative">
                    Muhammad Faisal Peerzada
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </motion.div>
            </div>
            
            {/* Legal Links */}
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors relative group">
                <span>Privacy Policy</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="hover:text-white transition-colors relative group">
                <span>Terms of Service</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="hover:text-white transition-colors relative group">
                <span>Shipping Info</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}