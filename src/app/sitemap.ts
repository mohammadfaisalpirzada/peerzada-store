import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://peerzada.store'
  const currentDate = new Date()
  
  // Static pages with optimized priorities and frequencies
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // Add additional important pages
    {
      url: `${baseUrl}/wallets`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Enhanced dynamic pages generation
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

    // Product pages with better SEO signals
    const productPages = products.map((product: any) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product._updatedAt ? new Date(product._updatedAt) : currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7, // Increased priority for product pages
    }))

    // Category pages with subcategory support
    const categoryPages = categories.map((category: any) => ({
      url: `${baseUrl}/products?category=${encodeURIComponent(category.value)}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Add subcategory pages if available
    const subcategoryPages: MetadataRoute.Sitemap = []
    categories.forEach((category: any) => {
      if (category.subcategories && Array.isArray(category.subcategories)) {
        category.subcategories.forEach((subcategory: any) => {
          subcategoryPages.push({
            url: `${baseUrl}/products?category=${encodeURIComponent(category.value)}&subcategory=${encodeURIComponent(subcategory.value)}`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.5,
          })
        })
      }
    })

    // Combine all pages and sort by priority
    const allPages = [...staticPages, ...productPages, ...categoryPages, ...subcategoryPages]
    
    // Sort by priority (highest first) for better SEO
    return allPages.sort((a, b) => (b.priority || 0) - (a.priority || 0))

  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error)
    // Return static pages with error logging
    return staticPages
  }
}