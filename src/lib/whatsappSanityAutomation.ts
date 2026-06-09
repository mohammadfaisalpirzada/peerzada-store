import { createHash } from 'crypto';
import { createClient } from '@sanity/client';

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';

export type WhatsAppImportItem = {
  imageUrl: string;
  description?: string;
  title?: string;
  caption?: string;
  sourceId?: string;
  postedAt?: string;
  groupName?: string;
};

type SubcategoryLookup = {
  title?: string;
  value?: string;
  description?: string;
};

type CategoryLookup = {
  _id: string;
  title: string;
  value?: string;
  description?: string;
  subcategories?: SubcategoryLookup[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96);
}

function normalizeText(value: string) {
  return value.toLowerCase();
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function getSanityConfig() {
  const projectId =
    process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'k5n7yxex';
  const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN;

  const missing: string[] = [];

  if (!token) missing.push('SANITY_API_TOKEN');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return { projectId, dataset, token };
}

function getSanityClient() {
  const { projectId, dataset, token } = getSanityConfig();

  return createClient({
    projectId,
    dataset,
    token,
    apiVersion,
    useCdn: false,
  });
}

function getImageExtension(contentType: string | null) {
  switch (contentType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    case 'image/svg+xml':
      return 'svg';
    default:
      return 'jpg';
  }
}

function buildTitle(item: WhatsAppImportItem) {
  const baseText = item.title?.trim() || item.caption?.trim() || item.description?.trim() || '';
  const firstLine = baseText.split(/\r?\n/)[0]?.trim() || '';

  return firstLine.slice(0, 80) || `WhatsApp Product ${new Date().toISOString().slice(0, 10)}`;
}

function buildDescription(item: WhatsAppImportItem) {
  const parts = [item.description?.trim(), item.caption?.trim()].filter(Boolean);

  if (parts.length > 0) {
    return parts.join('\n\n');
  }

  const sourceLabel = item.groupName?.trim() ? ` from ${item.groupName.trim()}` : '';
  return `Imported automatically from WhatsApp${sourceLabel}.`;
}

async function findBestCategoryMatch(client: ReturnType<typeof createClient>, text: string) {
  const categories = await client.fetch<CategoryLookup[]>(`
    *[_type == "category"] {
      _id,
      title,
      description,
      "value": value.current,
      "subcategories": subcategories[]{
        title,
        description,
        "value": coalesce(value.current, value)
      }
    }
  `);

  if (!categories?.length) {
    return {};
  }

  const tokens = tokenize(text);

  if (!tokens.length) {
    return {};
  }

  let bestCategory: CategoryLookup | undefined;
  let bestSubcategory: SubcategoryLookup | undefined;
  let bestScore = 0;

  for (const category of categories) {
    const categoryText = normalizeText(
      [category.title, category.value, category.description].filter(Boolean).join(' ')
    );

    let categoryScore = 0;
    for (const token of tokens) {
      if (categoryText.includes(token)) {
        categoryScore += token.length;
      }
    }

    if (categoryScore > bestScore) {
      bestCategory = category;
      bestSubcategory = undefined;
      bestScore = categoryScore;
    }

    for (const subcategory of category.subcategories || []) {
      const subcategoryText = normalizeText(
        [subcategory.title, subcategory.value, subcategory.description].filter(Boolean).join(' ')
      );

      let subcategoryScore = categoryScore;
      for (const token of tokens) {
        if (subcategoryText.includes(token)) {
          subcategoryScore += token.length + 1;
        }
      }

      if (subcategoryScore > bestScore) {
        bestCategory = category;
        bestSubcategory = subcategory;
        bestScore = subcategoryScore;
      }
    }
  }

  if (!bestCategory || bestScore === 0) {
    return {};
  }

  return {
    category: {
      _type: 'reference' as const,
      _ref: bestCategory._id,
    },
    categoryTitle: bestCategory.title,
    subcategory: bestSubcategory?.value,
    subcategoryTitle: bestSubcategory?.title,
  };
}

export async function createProductFromWhatsAppItem(item: WhatsAppImportItem) {
  if (!item.imageUrl?.trim()) {
    throw new Error('The `imageUrl` field is required.');
  }

  const sanityClient = getSanityClient();
  const title = buildTitle(item);
  const description = buildDescription(item);
  const uniqueSeed = [item.sourceId, item.imageUrl, item.postedAt, item.groupName]
    .filter(Boolean)
    .join('|');
  const documentId = `whatsapp-product-${createHash('sha1')
    .update(uniqueSeed || `${item.imageUrl}|${title}`)
    .digest('hex')
    .slice(0, 24)}`;

  const existingProduct = await sanityClient.fetch<{ _id: string; title?: string } | null>(
    `*[_id == $id][0]{_id, title}`,
    { id: documentId }
  );

  if (existingProduct) {
    return {
      productId: existingProduct._id,
      title: existingProduct.title || title,
      skipped: true,
    };
  }

  let validatedUrl: URL;

  try {
    validatedUrl = new URL(item.imageUrl.trim());
  } catch {
    throw new Error('Invalid image URL provided.');
  }

  if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
    throw new Error('Only http and https image URLs are supported.');
  }

  const imageResponse = await fetch(validatedUrl.toString(), {
    headers: {
      'User-Agent': 'peerzada-store-whatsapp-sync/1.0',
    },
    cache: 'no-store',
  });

  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image from external URL (status ${imageResponse.status}).`);
  }

  const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

  if (!contentType.startsWith('image/')) {
    throw new Error(`URL did not return an image. Received content-type: ${contentType}`);
  }

  const categoryMatch = await findBestCategoryMatch(
    sanityClient,
    [title, description, item.groupName].filter(Boolean).join(' ')
  );

  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${slugify(title) || 'whatsapp-product'}-${Date.now()}.${getImageExtension(contentType)}`;

  const uploadedAsset = await sanityClient.assets.upload('image', buffer, {
    filename: fileName,
    contentType,
  });

  const imageReference = {
    _type: 'image' as const,
    asset: {
      _type: 'reference' as const,
      _ref: uploadedAsset._id,
    },
  };

  const createdProduct = await sanityClient.createOrReplace({
    _id: documentId,
    _type: 'product',
    title,
    description,
    slug: {
      _type: 'slug',
      current: slugify(title) || `whatsapp-product-${Date.now()}`,
    },
    ...(categoryMatch.category ? { category: categoryMatch.category } : {}),
    ...(categoryMatch.subcategory ? { subcategory: categoryMatch.subcategory } : {}),
    mainImage: imageReference,
    image: imageReference,
    images: [
      {
        ...imageReference,
        alt: title,
      },
    ],
    brand: item.groupName?.trim() || 'WhatsApp Import',
    inStock: true,
  });

  return {
    productId: createdProduct._id,
    assetId: uploadedAsset._id,
    title,
    category: categoryMatch.categoryTitle,
    subcategory: categoryMatch.subcategoryTitle,
    skipped: false,
  };
}
