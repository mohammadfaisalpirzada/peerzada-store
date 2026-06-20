'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import BlogHeader from './BlogHeader';
import BlogFooter from './BlogFooter';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
<<<<<<< HEAD
  const isLanding = pathname === '/';
  
  // Define pages that should have commerce navbar and footer
  const shouldShowCommerceNavAndFooter = () => {
    if (isLanding) return false;
=======
  
  // Define pages that should have commerce navbar and footer
  const shouldShowCommerceNavAndFooter = () => {
    // Show on landing page too (now an e-commerce landing page)
    if (pathname === '/') return true;
>>>>>>> b90f073 (login added)
    
    // Exclude blogs and educational resources
    if (pathname.startsWith('/blogs') || pathname.startsWith('/blog') || pathname.startsWith('/education')) {
      return false;
    }
    
    // Include specific pages: explore, products, wallets, etc.
<<<<<<< HEAD
    const includedPaths = ['/explore', '/products', '/wallets', '/premium', '/customised', '/gifts'];
=======
    const includedPaths = ['/explore', '/products', '/wallets', '/premium', '/customised', '/gifts', '/login', '/privacy'];
>>>>>>> b90f073 (login added)
    return includedPaths.some(path => pathname.startsWith(path)) || pathname === '/store';
  };
  
  // Define pages that should have blog header and footer
  const shouldShowBlogNavAndFooter = () => {
    return pathname.startsWith('/blogs') || pathname.startsWith('/blog') || pathname.startsWith('/education');
  };
  
  const showCommerceNavFooter = shouldShowCommerceNavAndFooter();
  const showBlogNavFooter = shouldShowBlogNavAndFooter();
  const showAnyHeader = showCommerceNavFooter || showBlogNavFooter;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Commerce Navbar - Show on commerce pages only */}
      {showCommerceNavFooter && <Navbar />}
      
      {/* Blog Header - Show on blog and education pages only */}
      {showBlogNavFooter && <BlogHeader />}
      
      {/* Main Content */}
<<<<<<< HEAD
      <main className={`flex-1 ${showAnyHeader ? 'pt-20' : ''}`}>
=======
      <main className={`flex-1 ${showAnyHeader ? 'pt-16' : ''}`}>
>>>>>>> b90f073 (login added)
        {children}
      </main>
      
      {/* Commerce Footer - Show on commerce pages only */}
      {showCommerceNavFooter && <Footer />}
      
      {/* Blog Footer - Show on blog and education pages only */}
      {showBlogNavFooter && <BlogFooter />}
    </div>
  );
}