'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
    { href: '/', label: 'Tracker' },
    { href: '/resumes', label: 'Resumes' },
    { href: '/job-sites', label: 'Job Sites' },
];

function isActivePath(pathname, href) {
    if (href === '/') {
        return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppNavbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-360 px-4 py-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between gap-3">
                    <Link
                        href="/"
                        className="rounded-none px-1 py-1 text-xl font-bold tracking-tight text-slate-900 transition-all duration-200 hover:text-cyan-700"
                    >
                        Job Application Tracker
                    </Link>

                    <nav
                        className="hidden items-center justify-end gap-1 sm:gap-2 md:flex"
                        aria-label="Primary"
                    >
                        {NAV_LINKS.map((link) => {
                            const active = isActivePath(pathname, link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`rounded-none px-3 py-2 text-base font-semibold transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-lg ${
                                        active
                                            ? 'bg-cyan-700/12 text-cyan-700'
                                            : 'text-slate-700 hover:bg-slate-900/6 hover:text-cyan-700'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-expanded={isOpen}
                        aria-controls="primary-nav-mobile"
                        className="inline-flex items-center justify-center p-2 text-slate-900 transition-colors duration-200 hover:bg-slate-900/6 hover:text-cyan-700 md:hidden"
                    >
                        <span className="sr-only">Toggle navigation</span>
                        {isOpen ? (
                            <X size={24} aria-hidden="true" />
                        ) : (
                            <Menu size={24} aria-hidden="true" />
                        )}
                    </button>
                </div>

                {isOpen ? (
                    <nav
                        id="primary-nav-mobile"
                        className="mt-3 flex flex-col bg-white/85 md:hidden"
                        aria-label="Primary mobile"
                    >
                        {NAV_LINKS.map((link) => {
                            const active = isActivePath(pathname, link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`rounded-none px-2 py-3 text-lg font-semibold transition-all duration-200 ${
                                        active
                                            ? 'bg-cyan-700/12 text-cyan-700'
                                            : 'text-slate-700 hover:bg-slate-900/6 hover:text-cyan-700'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                ) : null}
            </div>
        </header>
    );
}
