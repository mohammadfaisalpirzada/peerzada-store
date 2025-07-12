import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="text-center bg-transparent border-none shadow-none">
          <Image
            src="/images/logo.svg"
            alt="Peerzada Store Logo"
            width={180}
            height={180}
            priority
            className="mx-auto mb-6 bg-transparent border-none shadow-none"
            style={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            PEERZADA.STORE
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg leading-relaxed max-w-sm">
            Discover premium wallets and accessories. Shop with confidence and style!
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-4 w-full">
          <Link href="/explore" className="w-full">
            <button 
              className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl py-4 px-6 text-lg transition-all duration-300 shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-center gap-3">
                <span>🛍️</span>
                <span>Explore the Store</span>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </Link>

          <Link href="/wallets" className="w-full">
            <button 
              className="w-full group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-2xl py-4 px-6 text-lg transition-all duration-300 shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-4 focus:ring-red-300 transform hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-center gap-3">
                <span>👛</span>
                <span>Our Wallets</span>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </Link>

          <Link href="/more" className="w-full">
            <button 
              className="w-full group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-2xl py-4 px-6 text-lg transition-all duration-300 shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-center gap-3">
                <span>📝</span>
                <span>Explore Blogs</span>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Quality • Style • Trust
          </p>
        </div>
      </div>
    </div>
  );
}