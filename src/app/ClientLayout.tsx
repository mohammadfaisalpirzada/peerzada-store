'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavFooter = pathname !== '/education';
  
  return (
    <div className="min-h-screen flex flex-col">
      {showNavFooter && <Navbar />}
      <main className={`flex-1 ${showNavFooter ? 'pt-16' : ''}`}>
        {children}
      </main>
      {showNavFooter && <Footer />}
    </div>
  );
}