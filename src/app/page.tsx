import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs sm:max-w-2xl">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={200}
          height={200}
          priority
          className="sm:w-[160px] sm:h-[160px] w-[160px] h-[160px]"
        />
        <h1 className="text-3xl font-bold text-center text-red-600">
          PEERZADA.STORE
        </h1>
        <p
          className="text-center text-gray-600 mb-6 sm:text-center sm:self-auto max-w-none mx-auto"
          style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 15 }}
        >
          Discover the best wallets and accessories. Shop with confidence and style!
        </p>
         <Link href="/explore">
          <button 
            className="w-full sm:w-auto px-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 text-lg transition-colors"
            style={{ fontFamily: 'Nunito Sans, sans-serif' }}
          >
            Explore the Store
          </button>
        </Link>
        <Link href="/wallets">
          <button 
            className="w-full sm:w-auto px-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl py-3 text-lg transition-colors"
            style={{ fontFamily: 'Nunito Sans, sans-serif' }}
          >
            Our Wallets
          </button>
        </Link>
        <Link href="/more">
          <button 
            className="w-full sm:w-auto px-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 text-lg transition-colors"
            style={{ fontFamily: 'Nunito Sans, sans-serif' }}
          >
            Explore Blogs
          </button>
        </Link>          
      </div>
    </div>
  );
}