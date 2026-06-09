'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import BlogHeader from './BlogHeader';
import BlogFooter from './BlogFooter';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  
  // Define pages that should have commerce navbar and footer
  const shouldShowCommerceNavAndFooter = () => {
    if (isLanding) return false;
    
    // Exclude blogs and educational resources
    if (pathname.startsWith('/blogs') || pathname.startsWith('/blog') || pathname.startsWith('/education')) {
      return false;
    }
    
    // Include specific pages: explore, products, wallets, etc.
    const includedPaths = ['/explore', '/products', '/wallets', '/premium', '/customised', '/gifts'];
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
      <main className={`flex-1 ${showAnyHeader ? 'pt-20' : ''}`}>
        {children}
      </main>
      
      {/* Commerce Footer - Show on commerce pages only */}
      {showCommerceNavFooter && <Footer />}
      
      {/* Blog Footer - Show on blog and education pages only */}
      {showBlogNavFooter && <BlogFooter />}
    </div>
  );
}