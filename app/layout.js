import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppNavbar from './components/AppNavbar';
import { getSiteUrl } from './lib/siteUrl';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const siteUrl = getSiteUrl();
const siteDescription =
    'Track job applications, manage resume versions, and monitor interview outcomes in one focused workspace.';

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Job Application Tracker',
        template: '%s | Job Application Tracker',
    },
    description: siteDescription,
    applicationName: 'Job Application Tracker',
    keywords: [
        'job application tracker',
        'job search organizer',
        'resume manager',
        'interview tracking',
        'kanban job board',
    ],
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        url: '/',
        title: 'Job Application Tracker',
        description: siteDescription,
        siteName: 'Job Application Tracker',
    },
    twitter: {
        card: 'summary',
        title: 'Job Application Tracker',
        description: siteDescription,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <AppNavbar />
                {children}
                <Analytics />
            </body>
        </html>
    );
}
