import LandingPage from '../components/landing/LandingPage';

export const metadata = {
    title: 'Smart Job Search Workspace',
    description:
        'Plan your job hunt with a focused system for application tracking, resume strategy, and progress insights.',
    alternates: {
        canonical: '/home',
    },
};

export default function Landing() {
    return <LandingPage />;
}
