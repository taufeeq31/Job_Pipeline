export default function ResumeInsightsSection({
    overallStats,
    bestPerformingResume,
    analyticsByResumeId,
    formatRate,
}) {
    return (
        <section className="mt-5 rounded-2xl border border-cyan-200/80 bg-cyan-50/45 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80">
                        Performance Insights
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-slate-900">
                        Resume Outcomes Snapshot
                    </h2>
                </div>
                <span className="rounded-full border border-cyan-200 bg-white/80 px-2.5 py-1 text-xs font-medium text-cyan-700">
                    {overallStats.applications} tracked applications
                </span>
            </div>

            {bestPerformingResume ? (
                <p className="mt-3 text-sm text-slate-700">
                    Best performer:{' '}
                    <span className="font-semibold text-slate-900">
                        {bestPerformingResume.title}
                    </span>{' '}
                    with{' '}
                    <span className="font-semibold text-cyan-800">
                        {formatRate(analyticsByResumeId[bestPerformingResume.id]?.winRate || 0)}
                    </span>{' '}
                    win rate after final decisions.
                </p>
            ) : (
                <p className="mt-3 text-sm text-slate-600">
                    Start linking resumes in your applications to unlock conversion insights.
                </p>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-xl border border-slate-200/90 bg-white/90 p-3">
                    <p className="text-xs text-slate-500">Applications</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                        {overallStats.applications}
                    </p>
                </article>
                <article className="rounded-xl border border-slate-200/90 bg-white/90 p-3">
                    <p className="text-xs text-slate-500">Selections</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                        {overallStats.selections}
                    </p>
                </article>
                <article className="rounded-xl border border-slate-200/90 bg-white/90 p-3">
                    <p className="text-xs text-slate-500">Rejections</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                        {overallStats.rejections}
                    </p>
                </article>
                <article className="rounded-xl border border-slate-200/90 bg-white/90 p-3">
                    <p className="text-xs text-slate-500">Win Rate</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                        {formatRate(
                            overallStats.decisions > 0
                                ? (overallStats.selections / overallStats.decisions) * 100
                                : 0
                        )}
                    </p>
                </article>
            </div>
        </section>
    );
}
