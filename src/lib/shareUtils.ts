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
 * Downloads image as a binary File object using our local proxy to bypass CORS
 */
export async function fetchProductImageFile(imageUrl: string, title: string): Promise<File | null> {
  try {
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) return null;
    const blob = await res.blob();
    const mimeType = blob.type || 'image/jpeg';
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
    const cleanName = title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30) || 'peerzada_product';
    return new File([blob], `${cleanName}.${ext}`, { type: mimeType });
  } catch (err) {
    console.error('Failed to convert product image to file:', err);
    return null;
  }
}

/**
 * Downloads image directly to device storage
 */
export async function downloadProductImage(imageUrl: string, title: string): Promise<boolean> {
  try {
    const file = await fetchProductImageFile(imageUrl, title);
    if (!file) return false;
    const blobUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    return true;
  } catch (err) {
    console.error('Download image error:', err);
    return false;
  }
}

/**
 * Generates the clean WhatsApp message link for customer queries
 * Designed so WhatsApp automatically generates rich card preview with the product picture
 */
export function getWhatsAppQueryUrl(
  product: ShareableProduct,
  customDetails?: string,
  clientOrigin?: string
): string {
  const origin = clientOrigin || (typeof window !== 'undefined' ? window.location.origin : DEFAULT_ORIGIN);
  const productUrl = getProductPageUrl(product, origin);
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
    customDetails ? `\n📝 *Customization / Details:*\n${customDetails}` : null,
    ``,
    `🔗 *Product Link:*`,
    productUrl,
  ].filter((line) => line !== null);

  const message = lines.join('\n');
  return `https://wa.me/${WHATSAPP_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates clean text for 1-click sharing (without ugly raw CDN links)
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
    cleanDescription ? `${cleanDescription}...` : '',
    `🔗 ${productUrl}`,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    title: `${product.title} | Peerzada Store`,
    text: shareText,
    url: productUrl,
    imageUrl,
  };
}
