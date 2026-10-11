import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Collections | Customised Gifts & Accessories Karachi PK',
  description: 'Explore trending customized gifts, engraved wallets, keychain combos, and luxury accessories at Peerzada Store. Fast delivery across Karachi and all Pakistan.',
  keywords: [
    'explore customised gifts',
    'customized wallets karachi',
    'gift deals pakistan',
    'accessories online karachi',
    'peerzada store explore'
  ],
  alternates: {
    canonical: 'https://peerzada.store/explore',
  },
  openGraph: {
    title: 'Explore Collections | Customised Gifts & Accessories Karachi PK',
    description: 'Explore trending customized gifts, engraved wallets, and accessories at Peerzada Store.',
    url: 'https://peerzada.store/explore',
    siteName: 'Peerzada Store',
    images: [
      {
        url: 'https://peerzada.store/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Explore Peerzada Store - Customised Gifts Karachi'
      }
    ],
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
