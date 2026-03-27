'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import useLocalStorageState from '../hooks/useLocalStorageState';

function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
}

const EMPTY_RESUME = {
    title: '',
    type: 'General',
    targetRole: '',
    fileLink: '',
    notes: '',
};

const RESUME_TYPES = ['General', 'Frontend', 'Backend', 'Full Stack', 'Data', 'Product', 'Design'];

export default function ResumesPage() {
    const [resumes, setResumes, isResumesLoaded] = useLocalStorageState(
        'job-tracker.resumes.v1',
        []
    );
    const [jobs, , isJobsLoaded] = useLocalStorageState('job-tracker.jobs.v2', []);
    const [formValues, setFormValues] = useState(EMPTY_RESUME);
    const [editingResumeId, setEditingResumeId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const shouldShowForm =
        isFormOpen || Boolean(editingResumeId) || (isResumesLoaded && resumes.length === 0);

    const sortedResumes = useMemo(
        () =>
            [...resumes].sort((a, b) => {
                const timeA = new Date(a.updatedAt || '1970-01-01').getTime();
                const timeB = new Date(b.updatedAt || '1970-01-01').getTime();
                return timeB - timeA;
            }),
        [resumes]
    );

    const activeCount = resumes.filter((resume) => resume.status === 'active').length;
    const archivedCount = resumes.filter((resume) => resume.status === 'archived').length;

    const analyticsByResumeId = useMemo(() => {
        function isResponseStatus(status) {
            return ['response-received', 'interview', 'selected-rejected'].includes(status);
        }

        function isInterviewStatus(status) {
            return ['interview', 'selected-rejected'].includes(status);
        }

        return resumes.reduce((acc, resume) => {
            const linkedJobs = jobs.filter((job) => job.resumeId === resume.id);
            const applications = linkedJobs.length;
            const responses = linkedJobs.filter((job) => isResponseStatus(job.status)).length;
            const interviews = linkedJobs.filter((job) => isInterviewStatus(job.status)).length;
            const selections = linkedJobs.filter(
                (job) => job.status === 'selected-rejected' && job.result === 'Selected'
            ).length;
            const rejections = linkedJobs.filter(
                (job) => job.status === 'selected-rejected' && job.result === 'Rejected'
            ).length;
            const decisions = selections + rejections;

            const responseRate = applications > 0 ? (responses / applications) * 100 : 0;
            const interviewRate = applications > 0 ? (interviews / applications) * 100 : 0;
            const selectionRate = applications > 0 ? (selections / applications) * 100 : 0;
            const rejectionRate = applications > 0 ? (rejections / applications) * 100 : 0;
            const decisionRate = applications > 0 ? (decisions / applications) * 100 : 0;
            const winRate = decisions > 0 ? (selections / decisions) * 100 : 0;
            const score = winRate * 3 + interviewRate * 2 + responseRate - rejectionRate;

            acc[resume.id] = {
                applications,
                responses,
                interviews,
                selections,
                rejections,
                decisions,
                responseRate,
                interviewRate,
                selectionRate,
                rejectionRate,
                decisionRate,
                winRate,
                score,
            };

            return acc;
        }, {});
    }, [jobs, resumes]);

    const overallStats = useMemo(() => {
        const allStats = Object.values(analyticsByResumeId);

        return allStats.reduce(
            (acc, stats) => {
                acc.applications += stats.applications;
                acc.responses += stats.responses;
                acc.interviews += stats.interviews;
                acc.selections += stats.selections;
                acc.rejections += stats.rejections;
                acc.decisions += stats.decisions;
                return acc;
            },
            {
                applications: 0,
                responses: 0,
                interviews: 0,
                selections: 0,
                rejections: 0,
                decisions: 0,
            }
        );
    }, [analyticsByResumeId]);

    const bestPerformingResume = useMemo(() => {
        const eligibleResumes = resumes.filter(
            (resume) => (analyticsByResumeId[resume.id]?.applications || 0) > 0
        );

        if (eligibleResumes.length === 0) {
            return null;
        }

        return eligibleResumes.reduce((bestResume, resume) => {
            if (!bestResume) return resume;

            const currentScore = analyticsByResumeId[resume.id]?.score || 0;
            const bestScore = analyticsByResumeId[bestResume.id]?.score || 0;

            if (currentScore === bestScore) {
                const currentApps = analyticsByResumeId[resume.id]?.applications || 0;
                const bestApps = analyticsByResumeId[bestResume.id]?.applications || 0;
                return currentApps > bestApps ? resume : bestResume;
            }

            return currentScore > bestScore ? resume : bestResume;
        }, null);
    }, [analyticsByResumeId, resumes]);

    function formatRate(rate) {
        return `${Math.round(rate)}%`;
    }

    function updateField(event) {
        const { name, value } = event.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function resetForm() {
        setFormValues(EMPTY_RESUME);
        setEditingResumeId(null);
        setIsFormOpen(false);
    }

    function openCreateForm() {
        setFormValues(EMPTY_RESUME);
        setEditingResumeId(null);
        setIsFormOpen(true);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const payload = {
            title: formValues.title.trim(),
            type: formValues.type,
            targetRole: formValues.targetRole.trim(),
            fileLink: formValues.fileLink.trim(),
            notes: formValues.notes.trim(),
            updatedAt: getTodayDate(),
        };

        if (!payload.title) return;

        if (editingResumeId) {
            setResumes((prev) =>
                prev.map((resume) =>
                    resume.id === editingResumeId
                        ? {
                              ...resume,
                              ...payload,
                          }
                        : resume
                )
            );
            resetForm();
            return;
        }

        setResumes((prev) => [
            {
                id: crypto.randomUUID(),
                ...payload,
                createdAt: getTodayDate(),
                lastUsedAt: '',
                usedCount: 0,
                status: 'active',
            },
            ...prev,
        ]);

        resetForm();
    }

    function handleEdit(resumeId) {
        const resume = resumes.find((item) => item.id === resumeId);
        if (!resume) return;

        setFormValues({
            title: resume.title || '',
            type: resume.type || 'General',
            targetRole: resume.targetRole || '',
            fileLink: resume.fileLink || '',
            notes: resume.notes || '',
        });
        setEditingResumeId(resume.id);
        setIsFormOpen(true);
    }

    function handleDelete(resumeId) {
        const resume = resumes.find((item) => item.id === resumeId);
        const message = resume
            ? `Delete resume \"${resume.title}\"?`
            : 'Delete this resume version?';

        if (!window.confirm(message)) {
            return;
        }

        setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
        if (editingResumeId === resumeId) {
            resetForm();
        }
    }

    function markUsedToday(resumeId) {
        setResumes((prev) =>
            prev.map((resume) =>
                resume.id === resumeId
                    ? {
                          ...resume,
                          lastUsedAt: getTodayDate(),
                          usedCount: (resume.usedCount || 0) + 1,
                          updatedAt: getTodayDate(),
                      }
                    : resume
            )
        );
    }

    function toggleArchive(resumeId) {
        setResumes((prev) =>
            prev.map((resume) =>
                resume.id === resumeId
                    ? {
                          ...resume,
                          status: resume.status === 'archived' ? 'active' : 'archived',
                          updatedAt: getTodayDate(),
                      }
                    : resume
            )
        );
    }

    return (
        <main className="mx-auto flex w-full max-w-360 flex-1 flex-col px-4 py-8 sm:px-6 lg:px-10">
            <section className="rounded-3xl border border-white/60 bg-white/78 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:p-7">
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80">
                            Resume Library
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                            Resume Versions Tracker
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                            Link resumes to each application and compare outcomes using conversion
                            metrics.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 font-medium text-slate-700">
                                Total: {resumes.length}
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

                <section className="mt-5 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm shadow-slate-900/5 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-base font-semibold text-slate-900">
                            {editingResumeId ? 'Edit Resume Version' : 'Add Resume Version'}
                        </h2>

                        {!shouldShowForm ? (
                            <button
                                type="button"
                                onClick={openCreateForm}
                                className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-slate-900/10 transition hover:bg-slate-800"
                            >
                                + Add Resume
                            </button>
                        ) : null}
                    </div>

                    {shouldShowForm ? (
                        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-medium text-slate-600">
                                    Resume Name
                                </span>
                                <input
                                    required
                                    name="title"
                                    value={formValues.title}
                                    onChange={updateField}
                                    placeholder="Frontend Resume v3"
                                    className="rounded-lg border border-slate-300/90 bg-white/95 px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500 transition focus:ring-2"
                                />
                            </label>

                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-medium text-slate-600">Type</span>
                                <select
                                    name="type"
                                    value={formValues.type}
                                    onChange={updateField}
                                    className="rounded-lg border border-slate-300/90 bg-white/95 px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500 transition focus:ring-2"
                                >
                                    {RESUME_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="sm:col-span-2 flex flex-col gap-1.5">
                                <span className="text-xs font-medium text-slate-600">
                                    Target Role
                                </span>
                                <input
                                    name="targetRole"
                                    value={formValues.targetRole}
                                    onChange={updateField}
                                    placeholder="Frontend Engineer, Product Engineer"
                                    className="rounded-lg border border-slate-300/90 bg-white/95 px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500 transition focus:ring-2"
                                />
                            </label>

                            <label className="sm:col-span-2 flex flex-col gap-1.5">
                                <span className="text-xs font-medium text-slate-600">
                                    Resume Link
                                </span>
                                <input
                                    type="url"
                                    name="fileLink"
                                    value={formValues.fileLink}
                                    onChange={updateField}
                                    placeholder="https://drive.google.com/..."
                                    className="rounded-lg border border-slate-300/90 bg-white/95 px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500 transition focus:ring-2"
                                />
                            </label>

                            <label className="sm:col-span-2 flex flex-col gap-1.5">
                                <span className="text-xs font-medium text-slate-600">Notes</span>
                                <textarea
                                    rows={2}
                                    name="notes"
                                    value={formValues.notes}
                                    onChange={updateField}
                                    placeholder="Focuses on React + performance projects"
                                    className="rounded-lg border border-slate-300/90 bg-white/95 px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500 transition focus:ring-2"
                                />
                            </label>

                            <div className="sm:col-span-2 mt-1 flex flex-wrap items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg border border-slate-300/90 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    {editingResumeId ? 'Cancel Edit' : 'Close'}
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-slate-900/10 transition hover:bg-slate-800"
                                >
                                    {editingResumeId ? 'Save Resume' : 'Add Resume'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="mt-3 text-sm text-slate-600">
                            Form is closed to keep this page focused. Click Add Resume when you need
                            it.
                        </p>
                    )}
                </section>

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
                                {formatRate(
                                    analyticsByResumeId[bestPerformingResume.id]?.winRate || 0
                                )}
                            </span>{' '}
                            win rate after final decisions.
                        </p>
                    ) : (
                        <p className="mt-3 text-sm text-slate-600">
                            Start linking resumes in your applications to unlock conversion
                            insights.
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

                <section className="mt-5">
                    {!isResumesLoaded ? (
                        <p className="text-sm text-slate-600">Loading resume versions...</p>
                    ) : sortedResumes.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300/90 bg-white/80 p-4 sm:p-5">
                            <p className="text-sm font-medium text-slate-800">
                                No resume versions yet.
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                                Add your first resume type to start tracking usage across
                                applications.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {sortedResumes.map((resume) => (
                                <article
                                    key={resume.id}
                                    className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm shadow-slate-900/5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">
                                                {resume.title}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {resume.targetRole || 'No target role set'}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                                                resume.status === 'archived'
                                                    ? 'bg-slate-200 text-slate-600'
                                                    : 'bg-emerald-100 text-emerald-700'
                                            }`}
                                        >
                                            {resume.status === 'archived' ? 'Archived' : 'Active'}
                                        </span>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                        <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
                                            <p className="text-slate-500">Applications</p>
                                            <p className="mt-1 font-semibold text-slate-800">
                                                {analyticsByResumeId[resume.id]?.applications || 0}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
                                            <p className="text-slate-500">Interviews</p>
                                            <p className="mt-1 font-semibold text-slate-800">
                                                {analyticsByResumeId[resume.id]?.interviews || 0}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
                                            <p className="text-slate-500">Selected</p>
                                            <p className="mt-1 font-semibold text-slate-800">
                                                {analyticsByResumeId[resume.id]?.selections || 0}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
                                            <p className="text-slate-500">Rejected</p>
                                            <p className="mt-1 font-semibold text-slate-800">
                                                {analyticsByResumeId[resume.id]?.rejections || 0}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                                        <p>
                                            <span className="font-medium text-slate-700">
                                                Type:
                                            </span>{' '}
                                            {resume.type}
                                        </p>
                                        <p>
                                            <span className="font-medium text-slate-700">
                                                Updated:
                                            </span>{' '}
                                            {resume.updatedAt || 'Not set'}
                                        </p>
                                        <p>
                                            <span className="font-medium text-slate-700">
                                                Last manually marked use:
                                            </span>{' '}
                                            {resume.lastUsedAt || 'Not used yet'}
                                        </p>
                                        <p>
                                            <span className="font-medium text-slate-700">
                                                Used count:
                                            </span>{' '}
                                            {resume.usedCount || 0}
                                        </p>
                                    </div>

                                    {resume.notes ? (
                                        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                            {resume.notes}
                                        </p>
                                    ) : null}

                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        {resume.fileLink ? (
                                            <a
                                                href={resume.fileLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-lg border border-slate-300/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                            >
                                                Open Resume
                                            </a>
                                        ) : null}
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(resume.id)}
                                            className="rounded-lg border border-slate-300/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => toggleArchive(resume.id)}
                                            className="rounded-lg border border-amber-200/90 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                                        >
                                            {resume.status === 'archived' ? 'Unarchive' : 'Archive'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(resume.id)}
                                            className="rounded-lg border border-rose-200/90 px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}
