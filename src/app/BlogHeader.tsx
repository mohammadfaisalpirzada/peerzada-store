'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, User, Mail, BookOpen, GraduationCap } from 'lucide-react';
import Image from 'next/image';

export default function BlogHeader() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/95 via-blue-50/90 to-purple-50/95 backdrop-blur-xl border-b border-purple-200/50 shadow-xl"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-purple-600">
            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
          </svg>
        </div>
        <div className="absolute top-0 left-1/4 w-24 h-24 opacity-3">
          <BookOpen className="w-full h-full text-blue-500" />
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <Link href="/education" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white p-2 rounded-xl shadow-lg">
                <Image 
                  src="/images/mastersahub_logo.png" 
                  alt="Master Sahub's Logo" 
                  width={40} 
                  height={40} 
                  className="h-10 w-10"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent tracking-tight">
<<<<<<< HEAD
                Master Sahub&apos;s
=======
                Master Sahub&rsquo;s
>>>>>>> b90f073 (login added)
              </span>
              <span className="text-xs text-gray-600 font-medium tracking-wide">
                Educational Hub
              </span>
            </div>
          </Link>

          {/* Enhanced Navigation */}
           <nav className="hidden md:flex items-center space-x-6">
             <Link 
               href="/"
               className="group flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-700 hover:text-red-800 transition-all duration-300 shadow-sm hover:shadow-md"
             >
               <Home className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform duration-200" />
               <span className="font-semibold">Main Page</span>
             </Link>
            <Link 
              href="/blogs" 
              className="group flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 text-gray-700 hover:text-green-700 transition-all duration-300 hover:shadow-md"
            >
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Blogs</span>
            </Link>
            <Link 
              href="/education" 
              className="group flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-gray-700 hover:text-purple-700 transition-all duration-300 hover:shadow-md"
            >
              <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Education</span>
            </Link>
            <Link 
              href="/resume" 
              className="group flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 text-gray-700 hover:text-orange-700 transition-all duration-300 hover:shadow-md"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">About</span>
            </Link>
          </nav>

          {/* Enhanced Contact Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="mailto:contact@peerzada.com"
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
            >
              <Mail className="w-5 h-5" />
              <span>Contact</span>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
            </Link>
          </motion.div>

          {/* Enhanced Mobile Menu Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className="block w-5 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mb-1 rounded-full"></span>
              <span className="block w-5 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mb-1 rounded-full"></span>
              <span className="block w-5 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}