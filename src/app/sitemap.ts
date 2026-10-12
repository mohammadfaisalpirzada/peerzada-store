import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://peerzada.store'
  const currentDate = new Date()
  
  // Static core pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/wallets`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    const { getProducts } = await import('./products/getProducts')
    const { getCategories } = await import('./explore/getCategories')
    
    const [products, categories] = await Promise.all([
      getProducts().catch((err) => {
        console.warn('Failed to fetch products for sitemap:', err)
        return []
      }),
      getCategories().catch((err) => {
        console.warn('Failed to fetch categories for sitemap:', err)
        return []
      })
    ])

    // Product pages with clean canonical slugs (No query parameters)
    const productPages: MetadataRoute.Sitemap = products
      .filter((product: any) => {
        const slug = typeof product?.slug === 'string' ? product.slug : product?.slug?.current
        return Boolean(slug)
      })
      .map((product: any) => {
        const slug = typeof product.slug === 'string' ? product.slug : product.slug.current
        return {
          url: `${baseUrl}/products/${encodeURIComponent(slug)}`,
          lastModified: product._updatedAt ? new Date(product._updatedAt) : currentDate,
          changeFrequency: 'daily',
          priority: 0.85,
        }
      })

    // Main Category pages (Single parameter, clean XML valid)
    const categoryPages: MetadataRoute.Sitemap = categories
      .filter((category: any) => Boolean(category?.value))
      .map((category: any) => ({
        url: `${baseUrl}/products?category=${encodeURIComponent(category.value)}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      }))

    // Combine all clean canonical pages
    const allPages = [...staticPages, ...productPages, ...categoryPages]
    
    return allPages.sort((a, b) => (b.priority || 0) - (a.priority || 0))

  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error)
    return staticPages
  }
}