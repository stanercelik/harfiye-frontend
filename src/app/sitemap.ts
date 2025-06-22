import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://harfiye.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/nasil-oynanir`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Gelecekte eklenecek sayfa
    // {
    //   url: `${baseUrl}/liderlik`,
    //   lastModified: new Date(),
    //   changeFrequency: 'daily',
    //   priority: 0.7,
    // }
  ]
} 