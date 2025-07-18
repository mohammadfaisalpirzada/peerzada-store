import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Remove these imports as they're not needed here
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import dynamic from 'next/dynamic';

// Remove dynamic import with ssr: false
// const ClientLayout = dynamic(() => import('./ClientLayout'), { ssr: false });

// Import ClientLayout directly
import ClientLayout from './ClientLayout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peerzada Store | Best Wallets & Accessories",
  description: "Discover the best wallets and accessories. Shop with confidence and style at Peerzada Store.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.45db1c09.ico", sizes: "any" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
