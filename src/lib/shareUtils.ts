import { urlFor } from '@/sanity/lib/image';

export interface ShareableProduct {
  _id?: string;
  title: string;
  slug?: { current: string } | string;
  price: number;
  description?: string;
  image?: any;
  imageUrl?: string;
  imageUrls?: string[];
  category?: { title?: string; value?: string } | string;
  subcategory?: string;
  color?: string;
  brand?: string;
  inStock?: boolean;
}

const DEFAULT_ORIGIN = 'https://peerzada.store';
const WHATSAPP_PHONE = '+923458340668';

export function getProductSlug(slug?: { current: string } | string): string {
  if (!slug) return '';
  if (typeof slug === 'string') return slug;
  return slug.current || '';
}

export function getProductImageUrl(product: ShareableProduct, origin: string = DEFAULT_ORIGIN): string {
  let url = '';

  if (product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0]) {
    url = product.imageUrls[0];
  } else if (product.imageUrl) {
    url = product.imageUrl;
  } else if (product.image) {
    try {
      url = urlFor(product.image).url();
    } catch {
      url = '';
    }
  }

  if (!url) {
    return `${origin}/images/logo.png`;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${origin}${cleanPath}`;
}

export function getProductPageUrl(product: ShareableProduct, origin: string = DEFAULT_ORIGIN): string {
  const slug = getProductSlug(product.slug);
  return `${origin}/products/${slug}`;
}

export function getCategoryTitle(product: ShareableProduct): string {
  if (!product.category) return '';
  if (typeof product.category === 'string') return product.category;
  return product.category.title || '';
}

/**
 * Generates the rich WhatsApp message and wa.me link for customer queries
 * Contains: Product Title, Price, Status, Direct Product Link, and Direct Picture Link
 */
export function getWhatsAppQueryUrl(
  product: ShareableProduct,
  customDetails?: string,
  clientOrigin?: string
): string {
  const origin = clientOrigin || (typeof window !== 'undefined' ? window.location.origin : DEFAULT_ORIGIN);
  const productUrl = getProductPageUrl(product, origin);
  const imageUrl = getProductImageUrl(product, origin);
  const categoryTitle = getCategoryTitle(product);
  const stockText = product.inStock === false ? '❌ Out of Stock' : '✅ In Stock';

  const lines = [
    `*Assalam-o-Alaikum!* 🌟`,
    `I have an inquiry regarding this product from Peerzada Store:`,
    ``,
    `📦 *Product:* ${product.title}`,
    `💰 *Price:* PKR ${product.price.toLocaleString()}`,
    categoryTitle ? `🏷️ *Category:* ${categoryTitle}` : null,
    product.color ? `🎨 *Color:* ${product.color}` : null,
    `📌 *Status:* ${stockText}`,
    ``,
    `🔗 *Product Link:*`,
    productUrl,
    ``,
    `🖼️ *Product Picture:*`,
    imageUrl,
    ``,
    customDetails ? `📝 *Customization / Query Details:*\n${customDetails}\n` : null,
    `Please share more details. Thank you!`,
  ].filter((line) => line !== null);

  const message = lines.join('\n');
  return `https://wa.me/${WHATSAPP_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates share data for 1-click sharing
 */
export function getProductShareData(product: ShareableProduct, clientOrigin?: string) {
  const origin = clientOrigin || (typeof window !== 'undefined' ? window.location.origin : DEFAULT_ORIGIN);
  const productUrl = getProductPageUrl(product, origin);
  const imageUrl = getProductImageUrl(product, origin);

  const cleanDescription = product.description
    ? product.description.replace(/\s+/g, ' ').slice(0, 100).trim()
    : '';

  const shareText = [
    `🛍️ *${product.title}*`,
    `💰 PKR ${product.price.toLocaleString()}`,
    cleanDescription ? `\n${cleanDescription}...` : '',
    `\n🖼️ Picture: ${imageUrl}`,
    `\n🔗 View Details: ${productUrl}`,
  ].join('\n');

  return {
    title: `${product.title} | Peerzada Store`,
    text: shareText,
    url: productUrl,
    imageUrl,
  };
}
