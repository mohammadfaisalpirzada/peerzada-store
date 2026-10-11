import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from './ClientLayout';
import SessionProvider from './SessionProvider';
import { CartProvider } from '@/lib/cart-context';
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://peerzada.store"),
  title: {
    default: "Peerzada Store | Customised Gifts, Wallets & Online Shopping Karachi, Pakistan (PK)",
    template: "%s | Peerzada Store PK"
  },
  description: "Shop premium customised gifts, customized leather wallets, engraved keychain combos, and luxury accessories online in Karachi & across Pakistan (PK). Cash on Delivery, best prices & fast nationwide delivery.",
  keywords: [
    "customised gifts",
    "customised gifts karachi",
    "customized gifts karachi",
    "customized wallets pakistan",
    "customised wallets pk",
    "online shopping karachi",
    "online shopping pakistan",
    "customized gift items pk",
    "leather wallets karachi",
    "customised keychains pakistan",
    "peerzada store",
    "peerzada store pk",
    "best online gifts pakistan",
    "personalized gifts karachi",
    "customised name wallets",
    "cash on delivery gifts karachi",
    "online store pk"
  ],
  authors: [{ name: "Peerzada Store", url: "https://peerzada.store" }],
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
    locale: "en_PK",
    url: "https://peerzada.store/",
    siteName: "Peerzada Store",
    title: "Peerzada Store | Customised Gifts, Wallets & Online Shopping Karachi, Pakistan (PK)",
    description: "Shop premium customised gifts, customized leather wallets, and luxury accessories online in Karachi & nationwide Pakistan. Cash on Delivery available.",
    images: [
      {
        url: "https://peerzada.store/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Peerzada Store - Customised Gifts & Wallets Karachi Pakistan"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peerzada Store | Customised Gifts, Wallets & Online Shopping Karachi, Pakistan (PK)", 
    description: "Shop premium customised gifts, customized leather wallets, and luxury accessories online in Karachi & across Pakistan. Fast delivery.",
    images: ["https://peerzada.store/images/logo.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION || undefined,
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
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": ["OnlineStore", "LocalBusiness"],
    "name": "Peerzada Store",
    "alternateName": [
      "Peerzada Store Karachi",
      "Peerzada Store PK",
      "Peerzada Online Store",
      "Peerzada Customized Gifts"
    ],
    "url": "https://peerzada.store",
    "logo": "https://peerzada.store/images/logo.png",
    "image": "https://peerzada.store/images/logo.png",
    "description": "Leading online store in Karachi, Pakistan offering customized leather wallets, engraved gift sets, keychains, and accessories with nationwide Cash on Delivery.",
    "telephone": "+923458340668",
    "priceRange": "PKR 500 - PKR 15000",
    "currenciesAccepted": "PKR",
    "paymentAccepted": "Cash on Delivery, Bank Transfer, EasyPaisa, JazzCash",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "24.8607",
      "longitude": "67.0011"
    },
    "areaServed": [
      { "@type": "City", "name": "Karachi" },
      { "@type": "Country", "name": "Pakistan" }
    ],
    "sameAs": [
      "https://www.facebook.com/peerzadastore",
      "https://www.instagram.com/peerzadastore/",
      "https://peerzada.store"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+923458340668",
      "contactType": "customer service",
      "contactOption": "HearingImpairedSupported",
      "areaServed": "PK",
      "availableLanguage": ["en", "ur"]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Peerzada Store",
    "url": "https://peerzada.store",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://peerzada.store/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I order customised gifts online in Karachi and across Pakistan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can browse our customized wallets, keychains, and gift deals on Peerzada Store, add them to your cart, or click 'Query' / 'Chat on WhatsApp' to order directly with custom names and pictures."
        }
      },
      {
        "@type": "Question",
        "name": "Does Peerzada Store provide Cash on Delivery (COD) in Karachi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer fast Cash on Delivery (COD) services all across Karachi and every major city in Pakistan (PK)."
        }
      },
      {
        "@type": "Question",
        "name": "How long does delivery take for customised gifts and wallets?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In Karachi, orders typically deliver within 24 to 48 hours. Nationwide deliveries across Pakistan take 3 to 5 business days."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get my name or photo engraved on leather wallets and accessories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we specialize in custom name engraving and personalized photo printing on premium leather wallets, pens, keychains, and gift boxes."
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        {/* Canonical signals */}
        <link rel="canonical" href="https://peerzada.store/" />
        <meta property="og:url" content="https://peerzada.store/" />
        <meta name="twitter:url" content="https://peerzada.store/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#B80000" />
        
        {/* Geo meta tags for Karachi / Pakistan local search ranking */}
        <meta name="geo.region" content="PK-SD" />
        <meta name="geo.placename" content="Karachi" />
        <meta name="geo.position" content="24.8607;67.0011" />
        <meta name="ICBM" content="24.8607, 67.0011" />
        
        {/* Stronger redirect for www */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.location.hostname === 'www.peerzada.store') {
                  window.location.replace('https://peerzada.store' + window.location.pathname + window.location.search);
                }
              })();
            `
          }}
        />
        
        {/* Store & Local Business JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(storeSchema)
          }}
        />
        
        {/* SearchAction JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />

        {/* FAQ JSON-LD for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      </head>
      <body className="antialiased">
        <SessionProvider>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
          <SpeedInsights />
        </SessionProvider>
      </body>
    </html>
  );
}
