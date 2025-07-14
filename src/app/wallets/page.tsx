import Image from "next/image";
import Link from "next/link";
import { getWallets } from "./getWallets";
import imageUrlBuilder from '@sanity/image-url';
import client from "../../../sanity/sanityClient";

// Initialize builder
const builder = imageUrlBuilder(client);

// Type-safe alternative to 'any'
function urlFor(source: Record<string, unknown>) {
  return builder.image(source).width(300).height(300).url();
}

// Define product type
type Product = {
  _id: string;
  title: string;
  slug?: { current: string };
  price: number;
  description?: string;
  brand?: string;
  color?: string;
  inStock?: boolean;
  image?: Record<string, unknown>;
};

export default async function WalletsPage() {
  const products: Product[] = await getWallets();

  console.log('Products:', products);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Premium Wallets</h1>
              <p className="text-gray-600 mt-1">Discover our collection of handcrafted leather wallets</p>
            </div>
            <Link 
               href="/" 
              className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products && products.length > 0 ? products.map((product: Product) => {
            return (
              <div 
                key={product._id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
              >
                {/* Product Image */}
                {product.image && (
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={urlFor(product.image)}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      PKR {product.price.toLocaleString()}
                    </span>
                    {product.inStock !== false && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  {product.slug && product.slug.current ? (
                    <Link 
                      href={`/wallets/${product.slug.current}`}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <button 
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 text-gray-400 font-medium rounded-xl cursor-not-allowed"
                    >
                      Details Unavailable
                    </button>
                  )}
                </div>
              </div>
            )
          }) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
              <p className="text-gray-600">Check back later for new arrivals!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}