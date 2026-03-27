import { getSiteUrl } from './lib/siteUrl';

const ROUTES = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/home', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/resumes', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/job-sites', changeFrequency: 'weekly', priority: 0.8 },
];

export default function sitemap() {
    const siteUrl = getSiteUrl();
    const now = new Date();

    return ROUTES.map((route) => ({
        url: `${siteUrl}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
