import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://collabs.eu.org',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1, // This tells Google this is the most important page
    },
  ];
}