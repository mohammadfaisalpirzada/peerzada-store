'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  // Make sure navbar and footer appear on all pages except landing page
  return (
    <>
      {!isLanding && <Navbar />}
      {children}
      {!isLanding && <Footer />}
    </>
  );
}