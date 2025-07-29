import { getProductBySlug, getProducts } from '../getProducts';
import OrderForm from '../OrderForm';
import ImageGallery from '../../components/ImageGallery';
import type { Metadata } from 'next';
import Link from 'next/link';

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const product = await getProductBySlug(slug);
    
    if (!product) {
      return {
        title: 'Product Not Found | Peerzada Store',
        description: 'The requested product could not be found.',
      };
    }

    const imageUrl = product.imageUrls?.[0] || product.imageUrl || 'https://peerzada.store/images/logo.png';
    
    return {
      title: `${product.title} | Peerzada Store`,
      description: `${product.description} - Price: PKR ${product.price}. Shop now at Peerzada Store with fast delivery across Pakistan.`,
      keywords: [
        product.title,
        product.category?.title,
        product.subcategory,
        product.brand,
        'Pakistan',
        'online shopping',
        'peerzada store'
      ].filter(Boolean),
      openGraph: {
        title: `${product.title} | Peerzada Store`,
        description: `${product.description} - Price: PKR ${product.price}`,
        images: [
          {
            url: imageUrl.startsWith('http') ? imageUrl : `https://peerzada.store${imageUrl}`,
            width: 800,
            height: 600,
            alt: product.title,
          }
        ],
        type: 'website',
        url: `https://peerzada.store/products/${slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} | Peerzada Store`,
        description: `${product.description} - Price: PKR ${product.price}`,
        images: [imageUrl.startsWith('http') ? imageUrl : `https://peerzada.store${imageUrl}`],
      },
      alternates: {
        canonical: `https://peerzada.store/products/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Peerzada Store',
      description: 'Shop premium products at Peerzada Store.',
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error('Error fetching product:', error);
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h1>
            <p className="text-gray-600 mb-4">Please check your Sanity configuration.</p>
            <Link 
              href="/products" 
              className="bg-[#B80000] text-white px-6 py-2 rounded-lg hover:bg-[#A00000] transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link 
              href="/products" 
              className="bg-[#B80000] text-white px-6 py-2 rounded-lg hover:bg-[#A00000] transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
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

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "description": product.description,
            "image": product.imageUrls?.[0] || product.imageUrl,
            "brand": {
              "@type": "Brand",
              "name": product.brand || "Peerzada Store"
            },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "PKR",
              "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Peerzada Store"
              }
            }
          })
        }}
      />
    </div>
  );
}