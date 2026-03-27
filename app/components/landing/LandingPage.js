import Link from 'next/link';
import { ArrowRight, BarChart3, BriefcaseBusiness, Grip, Sparkles, TrendingUp } from 'lucide-react';

const features = [
    {
        title: 'Track Applications',
        description:
            'Store every role, company, and status in one clean board so nothing slips through.',
        Icon: BriefcaseBusiness,
    },
    {
        title: 'Drag & Drop Workflow',
        description:
            'Move cards from Applied to Interview in seconds with a smooth, intuitive workflow.',
        Icon: Grip,
    },
    {
        title: 'Resume Insights',
        description: 'Attach resume versions per role and learn what gets better response rates.',
        Icon: Sparkles,
    },
    {
        title: 'Analytics Dashboard',
        description:
            'Watch trends, interviews, and outcomes to improve your search strategy over time.',
        Icon: BarChart3,
    },
];

const steps = [
    {
        number: '01',
        title: 'Add Job',
        description: 'Capture the role, company, and applied date in a few quick fields.',
    },
    {
        number: '02',
        title: 'Track Progress',
        description: 'Drag cards across stages as responses and interviews come in.',
    },
    {
        number: '03',
        title: 'Get Insights',
        description: 'Review outcomes and resume performance to focus your next applications.',
    },
];

const previewColumns = [
    {
        title: 'Applied',
        cards: [
            { company: 'Northpeak', role: 'Frontend Engineer' },
            { company: 'Horizon Labs', role: 'Product Designer' },
        ],
    },
    {
        title: 'Response Received',
        cards: [{ company: 'Cloudline', role: 'React Developer' }],
    },
    {
        title: 'Interview',
        cards: [{ company: 'Aster Tech', role: 'UI Engineer' }],
    },
    {
        title: 'Selected / Rejected',
        cards: [{ company: 'Novacore', role: 'Frontend Developer' }],
    },
];

function HeroSection() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-slate-900/10 bg-white/90 p-6 shadow-sm shadow-slate-900/5 sm:p-8 lg:p-10">
            <div
                className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-700/10 blur-3xl"
                aria-hidden="true"
            />
            <div
                className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-700/10 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                    <p className="inline-flex items-center gap-2 rounded-full border border-cyan-700/20 bg-cyan-700/10 px-3 py-1 text-xs font-semibold text-cyan-700">
                        <TrendingUp size={14} aria-hidden="true" />
                        Job Application Tracker
                    </p>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Land Better Roles With a Smarter Tracking System
                    </h1>

                    <p className="mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
                        Organize applications, move through interview stages, and learn what
                        actually works, all in one focused workspace.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-700"
                        >
                            Start Tracking Jobs
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                        <p className="text-xs text-slate-500 sm:text-sm">
                            Free to start. Fast setup. Built for focused job hunts.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-900/10 bg-background p-4 shadow-sm shadow-slate-900/5 sm:p-5">
                    <div className="rounded-2xl border border-slate-900/10 bg-white/95 p-4">
                        <div className="flex items-center justify-between border-b border-slate-900/10 pb-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Weekly Snapshot
                                </p>
                                <p className="text-xs text-slate-500">This week</p>
                            </div>
                            <span className="rounded-full bg-cyan-700/10 px-2.5 py-1 text-xs font-medium text-cyan-700">
                                +24%
                            </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <MiniStat label="Applied" value="18" />
                            <MiniStat label="Interviews" value="6" />
                            <MiniStat label="Responses" value="9" />
                            <MiniStat label="Offers" value="2" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MiniStat({ label, value }) {
    return (
        <article className="rounded-xl border border-slate-900/10 bg-white p-3 shadow-sm shadow-slate-900/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-700/30">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">{value}</p>
        </article>
    );
}

function FeaturesSection() {
    return (
        <section className="mt-10 sm:mt-14">
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Everything You Need To Stay On Top
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                    A focused workflow designed to keep your search organized, visible, and moving.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map(({ title, description, Icon }) => (
                    <article
                        key={title}
                        className="group rounded-2xl border border-slate-900/10 bg-white/90 p-5 shadow-sm shadow-slate-900/5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-700/25 hover:shadow-md hover:shadow-cyan-700/10"
                    >
                        <div className="inline-flex rounded-xl border border-cyan-700/25 bg-cyan-700/10 p-2.5 text-cyan-700 transition-all duration-200 group-hover:bg-cyan-700 group-hover:text-white">
                            <Icon size={18} aria-hidden="true" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

function HowItWorksSection() {
    return (
        <section className="mt-10 rounded-2xl border border-slate-900/10 bg-white/90 p-6 shadow-sm shadow-slate-900/5 sm:mt-14 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                How It Works
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Three simple steps from application to insight.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                {steps.map((step) => (
                    <article
                        key={step.number}
                        className="rounded-2xl border border-slate-900/10 bg-background p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-700/30"
                    >
                        <p className="text-xs font-semibold tracking-[0.12em] text-cyan-700">
                            STEP {step.number}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

function PreviewSection() {
    return (
        <section className="mt-10 sm:mt-14">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Board Preview
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 sm:text-base">
                        A clean Kanban flow that mirrors your live tracker experience.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-900/10 bg-white/90 p-4 shadow-sm shadow-slate-900/5 sm:p-5">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {previewColumns.map((column) => (
                        <article
                            key={column.title}
                            className="rounded-2xl border border-slate-900/10 bg-background p-3"
                        >
                            <header className="mb-3 flex items-center justify-between border-b border-slate-900/10 pb-2">
                                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-900">
                                    {column.title}
                                </h3>
                                <span className="rounded-md bg-slate-900/5 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                    {column.cards.length}
                                </span>
                            </header>

                            <div className="space-y-2.5">
                                {column.cards.map((card) => (
                                    <article
                                        key={`${column.title}-${card.company}`}
                                        className="rounded-xl border border-slate-900/10 border-l-2 border-l-cyan-700/45 bg-white p-3 shadow-sm shadow-slate-900/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-700/35"
                                    >
                                        <p className="text-sm font-semibold text-slate-900">
                                            {card.company}
                                        </p>
                                        <p className="text-xs text-slate-600">{card.role}</p>
                                    </article>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section className="mt-10 rounded-2xl border border-cyan-700/20 bg-cyan-700/10 p-6 shadow-sm shadow-cyan-700/10 sm:mt-14 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Ready To Take Control Of Your Job Search?
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 sm:text-base">
                        Start now and turn scattered applications into a clear, repeatable system.
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-700 md:w-auto"
                >
                    Try It Free
                    <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}

function FooterSection() {
    return (
        <footer className="mt-10 border-t border-slate-900/10 py-6 sm:mt-14">
            <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium text-slate-900">Job Application Tracker</p>
                <nav className="flex flex-wrap items-center gap-4">
                    <a href="#" className="transition-colors duration-200 hover:text-cyan-700">
                        Features
                    </a>
                    <a href="#" className="transition-colors duration-200 hover:text-cyan-700">
                        Pricing
                    </a>
                    <a href="#" className="transition-colors duration-200 hover:text-cyan-700">
                        Contact
                    </a>
                </nav>
            </div>
        </footer>
    );
}

export default function LandingPage() {
    return (
        <main className="mx-auto flex w-full max-w-360 flex-1 flex-col px-4 py-7 sm:px-6 lg:px-8">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <PreviewSection />
            <CTASection />
            <FooterSection />
        </main>
    );
}
