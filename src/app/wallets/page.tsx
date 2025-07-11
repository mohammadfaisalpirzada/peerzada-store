import Image from "next/image";
import Link from "next/link";
import { getWallets } from "./getWallets";
import imageUrlBuilder from '@sanity/image-url';
import client from "../../../sanity/sanityClient";

// Initialize builder
const builder = imageUrlBuilder(client);

// Type-safe alternative to 'any'
function urlFor(source: Record<string, unknown>) {
  return builder.image(source).width(200).url(); // Removed .height(200) as you had width only below
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

  // Define WhatsApp related constants and functions INSIDE the component
  // or before it if you prefer, but NOT as a duplicate export default function
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923458340669";

  function generateWhatsAppMessage(product: Product) {
    const productLink = `https://peerzada.store/wallets/${product._id}`;
    // Construct the message, including the product image URL if available
    let message = `I am interested in buying the product: ${product.title} priced at PKR ${product.price}.\nProduct link: ${productLink}`;

    if (product.image) {
      // It's generally not good practice to send an image URL directly in WhatsApp text message
      // as it won't render as an image. Users will just see a link.
      // However, if you specifically want to include it, here's how:
      const imageUrl = urlFor(product.image); // Get the URL for the product image
      message += `\nProduct image: ${imageUrl}`;
    }

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  console.log('Products:', products);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wallets</h1>
        <Link href="/" className="text-blue-600 font-semibold">Back</Link>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-4">Available Wallets</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {products && products.length > 0 ? products.map((product: Product) => {
            return (
              <div key={product._id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row items-center md:items-start">
                {product.image && (
                  <Image
                    src={urlFor(product.image)}
                    alt={product.title}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover mb-4 md:mb-0 md:mr-4"
                  />
                )}
                <div className="flex flex-col flex-grow text-left">
                  <div className="font-semibold text-gray-900 text-lg">{product.title}</div>
                  <div className="text-gray-700 text-base mt-1">PKR {product.price}</div>
                  {product.slug && product.slug.current ? (
                    <Link href={`/wallets/${product.slug.current}`} className="text-blue-600 mt-2 underline text-sm">More Details</Link>
                  ) : (
                    <span className="text-gray-400 mt-2 text-sm">No Details Available</span>
                  )}
                </div>
              </div>
            )
          }) : <p>No products available.</p>}
        </div>
      </section>
    </div>
  );
}