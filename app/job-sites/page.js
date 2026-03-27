'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Pin, PinOff } from 'lucide-react';
import useLocalStorageState from '../hooks/useLocalStorageState';

const JOB_SITES = [
    {
        name: 'LinkedIn Jobs',
        description: 'Large professional network with location and role-based filtering.',
        url: 'https://www.linkedin.com/jobs/',
        tag: 'Professional Network',
    },
    {
        name: 'Indeed',
        description: 'One of the biggest global job search engines with broad listings.',
        url: 'https://www.indeed.com/',
        tag: 'General',
    },
    {
        name: 'Glassdoor',
        description: 'Find openings along with salary insights and company reviews.',
        url: 'https://www.glassdoor.com/Job/',
        tag: 'Insights',
    },
    {
        name: 'Wellfound',
        description: 'Startup-focused platform for product, engineering, and design roles.',
        url: 'https://wellfound.com/jobs',
        tag: 'Startups',
    },
    {
        name: 'Remote OK',
        description: 'Remote-first jobs across software, design, and marketing.',
        url: 'https://remoteok.com/',
        tag: 'Remote',
    },
    {
        name: 'Y Combinator Jobs',
        description: 'Roles at YC-backed startups, especially engineering opportunities.',
        url: 'https://www.ycombinator.com/jobs',
        tag: 'Startup Network',
    },
    {
        name: 'AngelList Talent (Wellfound)',
        description: 'Startup hiring marketplace with direct employer connections.',
        url: 'https://wellfound.com/',
        tag: 'Direct Apply',
    },
    {
        name: 'Google Careers',
        description: 'Official portal for roles at Google across product and engineering.',
        url: 'https://careers.google.com/jobs/results/',
        tag: 'Company Portal',
    },
    {
        name: 'Microsoft Careers',
        description: 'Official portal for roles at Microsoft across product and engineering.',
        url: 'https://careers.microsoft.com/jobs/results/',
        tag: 'Company Portal',
    },
    {
        name: 'Naukri',
        description: 'Popular hiring platform for tech, product, and business roles in India.',
        url: 'https://www.naukri.com/',
        tag: 'India',
    },
    {
        name: 'Foundit',
        description: 'Regional-focused listings with strong coverage across APAC opportunities.',
        url: 'https://www.foundit.in/',
        tag: 'APAC',
    },
    {
        name: 'Cutshort',
        description: 'Startup and product company jobs with direct recruiter engagement.',
        url: 'https://cutshort.io/jobs',
        tag: 'Startups',
    },
    {
        name: 'Hired',
        description: 'Candidate-first marketplace where employers apply to you.',
        url: 'https://hired.com/',
        tag: 'Marketplace',
    },
    {
        name: 'Dice',
        description: 'Tech-focused job board with software and infrastructure roles.',
        url: 'https://www.dice.com/',
        tag: 'Tech',
    },
    {
        name: 'FlexJobs',
        description: 'Curated remote, hybrid, and flexible schedule opportunities.',
        url: 'https://www.flexjobs.com/',
        tag: 'Flexible',
    },
    {
        name: 'We Work Remotely',
        description: 'One of the largest communities dedicated to remote job openings.',
        url: 'https://weworkremotely.com/',
        tag: 'Remote',
    },
    {
        name: 'Built In',
        description: 'City-based tech jobs and startup opportunities with company profiles.',
        url: 'https://builtin.com/jobs',
        tag: 'Tech Cities',
    },
    {
        name: 'Remotive',
        description: 'Remote job board focused on engineering, product, and support roles.',
        url: 'https://remotive.com/remote-jobs',
        tag: 'Remote',
    },
    {
        name: 'Upwork',
        description: 'Freelance projects for developers and designers looking for contract work.',
        url: 'https://www.upwork.com/freelance-jobs/',
        tag: 'Freelance',
    },
    {
        name: 'Toptal',
        description: 'Premium freelance network for experienced engineers and designers.',
        url: 'https://www.toptal.com/talent/apply',
        tag: 'Freelance',
    },
    {
        name: 'Stack Overflow Jobs via Stack Overflow Talent',
        description: 'Developer-focused hiring destination connected with engineering communities.',
        url: 'https://stackoverflow.com/',
        tag: 'Developer Community',
    },
    {
        name: 'GitHub Jobs Alternatives',
        description: 'Community-maintained list of alternatives for engineering opportunities.',
        url: 'https://github.com/topics/job-board',
        tag: 'Community',
    },
];

export default function JobSitesPage() {
    const [pinnedSiteNames, setPinnedSiteNames, isPinnedSitesLoaded] = useLocalStorageState(
        'job-tracker.pinned-sites.v1',
        []
    );

    const pinnedSites = useMemo(
        () => JOB_SITES.filter((site) => pinnedSiteNames.includes(site.name)),
        [pinnedSiteNames]
    );

    const unpinnedSites = useMemo(
        () => JOB_SITES.filter((site) => !pinnedSiteNames.includes(site.name)),
        [pinnedSiteNames]
    );

    function togglePinnedSite(siteName) {
        setPinnedSiteNames((prev) => {
            if (!Array.isArray(prev)) {
                return [siteName];
            }

            return prev.includes(siteName)
                ? prev.filter((name) => name !== siteName)
                : [...prev, siteName];
        });
    }

    function isPinned(siteName) {
        return pinnedSiteNames.includes(siteName);
    }

    return (
        <main className="mx-auto flex w-full max-w-360 flex-1 flex-col px-4 py-8 sm:px-6 lg:px-10">
            <section className="rounded-3xl border border-white/60 bg-white/78 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:p-7">
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80">
                            Opportunities
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                            Popular Job Platforms
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                            Explore trusted websites to find and apply for new roles, then track
                            each application in your board.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300/90 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Back to Tracker
                    </Link>
                </div>

                <div className="relative mt-6 overflow-hidden rounded-3xl border border-amber-200/80 bg-linear-to-br from-amber-100/80 via-orange-50/70 to-rose-100/60 p-4 sm:p-5">
                    <div className="pointer-events-none absolute -top-12 -right-10 h-28 w-28 rounded-full bg-amber-300/40 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-rose-300/30 blur-2xl" />

                    <div className="relative flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800/80">
                                Fast Lane
                            </p>
                            <h2 className="mt-1 text-base font-semibold text-slate-900">
                                Your Pinned Sites
                            </h2>
                            <p className="mt-1 text-sm text-slate-700">
                                Keep your daily-apply platforms right here.
                            </p>
                        </div>

                        <span className="rounded-full border border-amber-300/80 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-amber-700 shadow-sm shadow-amber-900/10">
                            {pinnedSites.length} pinned
                        </span>
                    </div>

                    {isPinnedSitesLoaded && pinnedSites.length > 0 ? (
                        <div className="relative mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {pinnedSites.map((site) => (
                                <div
                                    key={`pinned-${site.name}`}
                                    className="rounded-xl border border-amber-300/80 bg-white/92 p-2.5 shadow-sm shadow-amber-900/10"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {site.name}
                                        </p>
                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                                            Pinned
                                        </span>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2">
                                        <a
                                            href={site.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center rounded-md border border-amber-300/90 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                                        >
                                            Open
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => togglePinnedSite(site.name)}
                                            className="inline-flex items-center rounded-md border border-slate-300/90 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative mt-4 rounded-xl border border-dashed border-amber-300/80 bg-white/70 p-3.5">
                            <p className="text-sm font-medium text-slate-700">
                                Nothing pinned yet.
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                                Use the Pin button below any platform to build your quick list.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {pinnedSites.concat(unpinnedSites).map((site) => (
                        <article
                            key={site.name}
                            className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm shadow-slate-900/5"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-base font-semibold text-slate-900">
                                    {site.name}
                                </h2>
                                <span className="rounded-full bg-cyan-100 px-2 py-1 text-[11px] font-medium text-cyan-700">
                                    {site.tag}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{site.description}</p>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <a
                                    href={site.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center rounded-lg border border-slate-300/90 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    Visit Site
                                </a>
                                <button
                                    type="button"
                                    onClick={() => togglePinnedSite(site.name)}
                                    className={`inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                        isPinned(site.name)
                                            ? 'border-amber-300/90 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                            : 'border-slate-300/90 text-slate-700 hover:bg-slate-100'
                                    }`}
                                    aria-label={isPinned(site.name) ? 'Unpin site' : 'Pin site'}
                                    title={isPinned(site.name) ? 'Unpin site' : 'Pin site'}
                                >
                                    {isPinned(site.name) ? (
                                        <PinOff size={16} aria-hidden="true" />
                                    ) : (
                                        <Pin size={16} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
