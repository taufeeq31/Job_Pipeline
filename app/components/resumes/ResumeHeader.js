import Link from 'next/link';

export default function ResumeHeader({ resumesCount, activeCount, archivedCount, overallStats }) {
    return (
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80">
                    Resume Library
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Resume Versions Tracker
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                    Link resumes to each application and compare outcomes using conversion metrics.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 font-medium text-slate-700">
                        Total: {resumesCount}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                        Active: {activeCount}
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                        Archived: {archivedCount}
                    </span>
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 font-medium text-cyan-700">
                        Linked Apps: {overallStats.applications}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                        Selected: {overallStats.selections}
                    </span>
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 font-medium text-rose-700">
                        Rejected: {overallStats.rejections}
                    </span>
                </div>
            </div>

            <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300/90 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
                Back to Tracker
            </Link>
        </div>
    );
}
