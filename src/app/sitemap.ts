import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://peerzada.store'
  
  // Static pages - always return these
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Try to get dynamic pages, but don't fail if there's an error
  try {
    const { getProducts } = await import('./products/getProducts')
    const { getCategories } = await import('./explore/getCategories')
    
    const [products, categories] = await Promise.all([
      getProducts().catch(() => []),
      getCategories().catch(() => [])
    ])

    const productPages = products.map((product: any) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    const categoryPages = categories.map((category: any) => ({
      url: `${baseUrl}/products?category=${category.value}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    return [...staticPages, ...productPages, ...categoryPages]
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error)
    return staticPages
  }
}