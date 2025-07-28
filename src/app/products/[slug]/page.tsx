import { getProductBySlug, getProducts } from '../getProducts';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import OrderForm from '../OrderForm';
import { use } from 'react';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product: any) => ({ slug: String(product.slug) }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: PageProps) {
  const { slug } = use(params);
  const product = use(getProductBySlug(slug));
  if (!product) {
    return <div className="text-center py-20 text-2xl">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-sm p-8">
          <div className="w-full md:w-1/2">
            {product.image && (
              <Image
                src={urlFor(product.image).url()}
                alt={product.title}
                width={500}
                height={500}
                className="rounded-lg object-cover w-full h-auto"
              />
            )}
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex gap-4 mb-2">
              <span className="font-semibold">Color:</span>
              <span>{product.color || 'N/A'}</span>
            </div>
            {product.subcategory && product.category?.subcategories && (
              <div className="flex gap-4 mb-2">
                <span className="font-semibold">Subcategory:</span>
                <span>{
                  product.category.subcategories.find(
                    (subcat: any) => subcat.value === product.subcategory
                  )?.title || product.subcategory
                }</span>
              </div>
            )}
            <div className="flex gap-4 mb-2">
              <span className="font-semibold">Price:</span>
              <span>Rs. {product.price}</span>
            </div>
            <div className="flex gap-4 mb-2">
              <span className="font-semibold">Stock:</span>
              <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            <OrderForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}