'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

export default function BlogFooter() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Peerzada Blog
              </span>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Sharing knowledge, insights, and educational resources to help you grow and learn. 
              Explore our collection of articles, tutorials, and educational content.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-blue-600"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-blue-600"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-blue-600"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:contact@peerzada.com"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-blue-600"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  All Blogs
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Educational Resources
                </Link>
              </li>
              <li>
                <Link href="/resume" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  About Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blogs?category=technology" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/blogs?category=programming" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Programming
                </Link>
              </li>
              <li>
                <Link href="/education?category=tutorials" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/education?category=resources" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Learning Resources
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-gray-600 mb-4 md:mb-0">
              <span>© 2024 Peerzada Blog. Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>by</span>
              <Link href="/resume" className="text-blue-600 hover:text-blue-700 font-medium">
                Peerzada
              </Link>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-blue-600 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-600 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-blue-600 transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}