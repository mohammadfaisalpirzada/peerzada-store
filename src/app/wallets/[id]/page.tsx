import Image from 'next/image';
import Link from 'next/link';
import { client } from '../../../sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

async function getWalletBySlug(slug) {
  const query = `*[_type == "wallet" && slug.current == $slug][0]`;
  return client.fetch(query, { slug });
}

export default async function WalletDetailPage({ params }) {
  const { id: slug } = params;
  const wallet = await getWalletBySlug(slug);

  if (!wallet) {
    return <div>Wallet not found</div>;
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923458340669';
  const message = `I want to add the wallet: ${wallet.title} priced at PKR ${wallet.price} to my WhatsApp cart.`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{wallet.title}</h1>
      {wallet.image && (
        <Image
          src={urlFor(wallet.image).width(600).url()}
          alt={wallet.title}
          width={600}
          height={400}
          className="rounded mb-6"
        />
      )}
      <div className="text-lg mb-4">Price: PKR {wallet.price}</div>
      <div className="mb-6">{wallet.description}</div>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add to WhatsApp cart
      </a>
      <div className="mt-4">
        <Link href="/wallets" className="text-blue-600 underline">
          Back to Wallets
        </Link>
      </div>
    </div>
  );
}