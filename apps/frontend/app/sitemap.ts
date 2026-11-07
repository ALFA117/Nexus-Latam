import type { MetadataRoute } from 'next';

const BASE = 'https://nexus-latam-kappa.vercel.app';
const ROUTES = ['', '/demo', '/pitch', '/agents', '/trades', '/yield', '/compliance', '/audit'];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({ url: `${BASE}${r}`, changeFrequency: 'weekly', priority: r ? 0.6 : 1 }));
}
