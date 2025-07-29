import { getProductBySlug, getProducts } from '../getProducts';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import OrderForm from '../OrderForm';
import ImageGallery from '../../components/ImageGallery';
import { use } from 'react';

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product: any) => ({ slug: String(product.slug) }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: PageProps) {
  const { slug } = use(params);
  
  let product;
  try {
    product = use(getProductBySlug(slug));
  } catch (error) {
    console.error('Error fetching product:', error);
    return <div className="text-center py-20 text-2xl">Error loading product. Please check your Sanity configuration.</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-2xl">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <ImageGallery
                images={product.imageUrls}
                imageUrl={product.imageUrl}
                title={product.title}
                className="w-full"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex gap-4 mb-2">
                  <span className="font-semibold">Category:</span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {product.category?.title || 'No category'}
                  </span>
                </div>
                {product.subcategory && (
                  <div className="flex gap-4 mb-2">
                    <span className="font-semibold">Subcategory:</span>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">{
                      product.category?.subcategories?.find(
                        (subcat: any) => subcat.value === product.subcategory
                      )?.title || product.subcategory
                    }</span>
                  </div>
                )}
                <div className="flex gap-4 mb-2">
                  <span className="font-semibold">Price:</span>
                  <span className="text-2xl font-bold text-[#B80000]">PKR {product.price}</span>
                </div>
                {product.brand && (
                  <div className="flex gap-4 mb-2">
                    <span className="font-semibold">Brand:</span>
                    <span>{product.brand}</span>
                  </div>
                )}
                {product.color && (
                  <div className="flex gap-4 mb-2">
                    <span className="font-semibold">Color:</span>
                    <span>{product.color}</span>
                  </div>
                )}
                <div className="flex gap-4 mb-4">
                  <span className="font-semibold">Availability:</span>
                  <span className={`text-sm font-medium px-2.5 py-0.5 rounded ${
                    product.inStock !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <OrderForm product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}