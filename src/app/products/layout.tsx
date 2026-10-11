import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products & Customised Gifts | Peerzada Store Karachi, PK',
  description: 'Browse our collection of customized leather wallets, engraved gift sets, keychains, and accessories online. Cash on Delivery across Karachi & nationwide Pakistan.',
  keywords: [
    'customised gifts karachi',
    'customized wallets pakistan',
    'buy leather wallets pk',
    'online shopping karachi',
    'personalized gifts pakistan',
    'customized gifts pk',
    'peerzada store products'
  ],
  alternates: {
    canonical: 'https://peerzada.store/products',
  },
  openGraph: {
    title: 'All Products & Customised Gifts | Peerzada Store Karachi, PK',
    description: 'Browse our collection of customized leather wallets, engraved gift sets, and accessories online in Karachi & Pakistan.',
    url: 'https://peerzada.store/products',
    siteName: 'Peerzada Store',
    images: [
      {
        url: 'https://peerzada.store/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Peerzada Store Products - Karachi PK'
      }
    ],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
