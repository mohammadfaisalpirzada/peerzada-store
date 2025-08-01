import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: {
    default: "Peerzada Store | Premium Wallets, Accessories & Gifts",
    template: "%s | Peerzada Store"
  },
  description: "Shop premium wallets, accessories, customized gifts, and more at Peerzada Store. Quality products with fast delivery across Pakistan. Best prices guaranteed!",
  keywords: [
    "wallets Pakistan",
    "premium accessories", 
    "customized gifts",
    "leather wallets",
    "branded accessories",
    "online shopping Pakistan",
    "peerzada store",
    "quality products",
    "fast delivery",
    "best prices"
  ],
  authors: [{ name: "Peerzada Store" }],
  creator: "Peerzada Store",
  publisher: "Peerzada Store",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://peerzada.store/",
    siteName: "Peerzada Store",
    title: "Peerzada Store | Premium Wallets, Accessories & Gifts",
    description: "Shop premium wallets, accessories, customized gifts, and more at Peerzada Store. Quality products with fast delivery across Pakistan.",
    images: [
      {
        url: "https://peerzada.store/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Peerzada Store - Premium Wallets & Accessories"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peerzada Store | Premium Wallets, Accessories & Gifts", 
    description: "Shop premium wallets, accessories, customized gifts, and more at Peerzada Store. Quality products with fast delivery across Pakistan.",
    images: ["https://peerzada.store/images/logo.png"],
  },
  verification: {
    google: "your-google-verification-code", // Google Search Console se milega
  },
  alternates: {
    canonical: "https://peerzada.store/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.45db1c09.ico", sizes: "any" }
    ],
    apple: [
      { url: "/images/logo.png", sizes: "180x180", type: "image/png" }
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
      <head>
        <link rel="canonical" href="https://peerzada.store/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#B80000" />
        {/* Add redirect script for www version */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.location.hostname === 'www.peerzada.store') {
                window.location.replace('https://peerzada.store' + window.location.pathname + window.location.search);
              }
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Peerzada Store",
              "url": "https://peerzada.store",
              "logo": "https://peerzada.store/images/logo.png",
              "description": "Premium wallets, accessories, and customized gifts",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Pakistan"
              },
              "sameAs": [
                "https://peerzada.store"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
