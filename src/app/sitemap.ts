import { MetadataRoute } from 'next';

const BASE = 'https://monkeyman.vn';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '',           priority: 1.0, freq: 'weekly'  },
    { path: '/travels',   priority: 0.8, freq: 'weekly'  },
    { path: '/movies',    priority: 0.8, freq: 'monthly' },
    { path: '/experiences', priority: 0.7, freq: 'monthly' },
    { path: '/contact',   priority: 0.5, freq: 'yearly'  },
  ] as const;

  return routes.map(({ path, priority, freq }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));
}
