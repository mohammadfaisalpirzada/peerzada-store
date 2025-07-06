import Image from "next/image";
import Link from "next/link";
import { getProducts } from "./getProducts";
import imageUrlBuilder from '@sanity/image-url';
import client from "../../../sanity/sanityClient";

// Initialize builder
const builder = imageUrlBuilder(client);

// Type-safe alternative to 'any'
function urlFor(source: Record<string, unknown>) {
  return builder.image(source).width(200).url();
}

// Define product type
type Product = {
  _id: string;
  title: string;
  price: number;
  description?: string;
  brand?: string;
  category?: string;
  inStock?: boolean;
  image?: Record<string, unknown>; // Use Record<string, unknown> for image
};

export default async function ProductsPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/" className="text-blue-600 font-semibold">Back</Link>
      </header>

      <section className="mb-6">
        <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 p-4 flex items-center gap-4 shadow">
          <Image src="/images/banner1.jpg" alt="Big Sale" width={80} height={80} className="rounded-lg object-cover" />
          <div>
            <div className="text-lg font-bold text-white">Big Sale</div>
            <div className="text-white text-sm">Up to 50% off</div>
            <div className="text-white text-xs mt-1">Happening Now</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Top Products</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product: Product) => (
            <div key={product._id} className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
              {product.image && (
                <Image
                  src={urlFor(product.image)}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover mb-2"
                />
              )}
              <div className="font-semibold text-gray-800">{product.title}</div>
              <div className="text-gray-500 text-sm">${product.price}</div>
              <div className="text-xs text-gray-400 text-center mt-1">{product.description}</div>
              <div className="text-xs text-gray-500 mt-1">Brand: {product.brand || 'N/A'}</div>
              <div className="text-xs text-gray-500">Category: {product.category || 'N/A'}</div>
              <div className={`text-xs font-semibold mt-1 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
