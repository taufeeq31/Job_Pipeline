'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import {
    closestCorners,
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import Link from 'next/link';
import {
    Briefcase,
    CalendarDays,
    CheckCircle2,
    Inbox,
    MessageSquare,
    Plus,
    Sparkles,
} from 'lucide-react';
import Board from './Board';
import ApplicationForm from './ApplicationForm';
import useLocalStorageState from '../hooks/useLocalStorageState';

function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
}

const COLUMNS = [
    { id: 'applied', title: 'Applied' },
    { id: 'response-received', title: 'Response Received' },
    { id: 'interview', title: 'Interview' },
    { id: 'selected-rejected', title: 'Selected / Rejected' },
];

const INITIAL_JOBS = [];

const EMPTY_FORM = {
    company: '',
    role: '',
    department: '',
    salary: '',
    contacts: '',
    dateApplied: getTodayDate(),
    responseDate: '',
    interviewDates: [],
    followUpDays: 5,
    status: 'applied',
    notes: '',
    feedback: '',
    jobLink: '',
    resumeId: '',
    resumeTitle: '',
    resumeType: '',
    result: 'Pending',
};

function normalizeFollowUpDays(value) {
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) return 5;
    return Math.min(Math.max(Math.round(parsedValue), 1), 30);
}

function MetricCard({ label, value, accentClass, Icon }) {
    return (
        <article className="rounded-lg border border-slate-900/10 bg-white p-4 shadow-sm shadow-slate-900/5">
            <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {label}
                </p>
                <Icon size={16} className="text-cyan-700" aria-hidden="true" />
            </div>
            <p className={`mt-2 text-2xl font-bold tracking-tight ${accentClass}`}>{value}</p>
        </article>
    );
}

export default function JobTrackerApp() {
    const [jobs, setJobs, isJobsLoaded] = useLocalStorageState('job-tracker.jobs.v2', INITIAL_JOBS);
    const [resumes] = useLocalStorageState('job-tracker.resumes.v1', []);
    const [activeJobId, setActiveJobId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJobId, setEditingJobId] = useState(null);
    const [pendingDeleteJobId, setPendingDeleteJobId] = useState(null);
    const [pendingOutcomeJobId, setPendingOutcomeJobId] = useState(null);
    const isHydrated = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 120,
                tolerance: 8,
            },
        })
    );

    const jobsByColumn = useMemo(() => {
        if (!isJobsLoaded) {
            return COLUMNS.reduce((acc, column) => {
                acc[column.id] = [];
                return acc;
            }, {});
        }

        return COLUMNS.reduce((acc, column) => {
            acc[column.id] = jobs.filter((job) => job.status === column.id);
            return acc;
        }, {});
    }, [isJobsLoaded, jobs]);

    const activeJob = useMemo(
        () => jobs.find((job) => job.id === activeJobId) || null,
        [activeJobId, jobs]
    );

    const editingJob = useMemo(
        () => jobs.find((job) => job.id === editingJobId) || null,
        [editingJobId, jobs]
    );

    const pendingDeleteJob = useMemo(
        () => jobs.find((job) => job.id === pendingDeleteJobId) || null,
        [pendingDeleteJobId, jobs]
    );

    const pendingOutcomeJob = useMemo(
        () => jobs.find((job) => job.id === pendingOutcomeJobId) || null,
        [pendingOutcomeJobId, jobs]
    );

    const totalJobs = jobs.length;
    const responseCount = jobs.filter((job) => job.status === 'response-received').length;
    const interviewCount = jobs.filter((job) => job.status === 'interview').length;
    const selectedCount = jobs.filter(
        (job) => job.status === 'selected-rejected' && job.result === 'Selected'
    ).length;

    function openCreateForm() {
        setEditingJobId(null);
        setIsFormOpen(true);
    }

    function openEditForm(jobId) {
        setEditingJobId(jobId);
        setIsFormOpen(true);
    }

    function closeForm() {
        setIsFormOpen(false);
        setEditingJobId(null);
    }

    function createJob(values) {
        const normalizedJobLink = values.jobLink?.trim() || '';
        const linkedResume = resumes.find((resume) => resume.id === values.resumeId);
        const nextJob = {
            id: crypto.randomUUID(),
            ...values,
            company: values.company?.trim() || '',
            role: values.role?.trim() || '',
            department: values.department?.trim() || '',
            salary: values.salary?.trim() || '',
            contacts: values.contacts?.trim() || '',
            dateApplied: values.dateApplied || getTodayDate(),
            jobLink: normalizedJobLink,
            responseDate: values.responseDate || '',
            interviewDates: values.interviewDates || [],
            followUpDays: normalizeFollowUpDays(values.followUpDays),
            notes: values.notes?.trim() || '',
            feedback: values.feedback?.trim() || '',
            status: values.status || 'applied',
            resumeId: linkedResume?.id || '',
            resumeTitle: linkedResume?.title || '',
            resumeType: linkedResume?.type || '',
            result: values.status === 'selected-rejected' ? values.result : 'Pending',
        };

        setJobs((prevJobs) => [nextJob, ...prevJobs]);
        closeForm();
    }

    function updateJob(values) {
        if (!editingJobId) return;

        const linkedResume = resumes.find((resume) => resume.id === values.resumeId);

        setJobs((prevJobs) =>
            prevJobs.map((job) => {
                if (job.id !== editingJobId) return job;

                return {
                    ...job,
                    ...values,
                    company: values.company?.trim() || '',
                    role: values.role?.trim() || '',
                    department: values.department?.trim() || '',
                    salary: values.salary?.trim() || '',
                    contacts: values.contacts?.trim() || '',
                    dateApplied: values.dateApplied || getTodayDate(),
                    jobLink: values.jobLink?.trim() || '',
                    responseDate: values.responseDate || '',
                    interviewDates: values.interviewDates || [],
                    followUpDays: normalizeFollowUpDays(values.followUpDays),
                    notes: values.notes?.trim() || '',
                    feedback: values.feedback?.trim() || '',
                    status: values.status || 'applied',
                    resumeId: linkedResume?.id || '',
                    resumeTitle: linkedResume?.title || '',
                    resumeType: linkedResume?.type || '',
                    result: values.status === 'selected-rejected' ? values.result : 'Pending',
                };
            })
        );

        closeForm();
    }

    function requestDeleteJob(jobId) {
        setPendingDeleteJobId(jobId);
    }

    function closeDeleteModal() {
        setPendingDeleteJobId(null);
    }

    function confirmDeleteJob() {
        if (!pendingDeleteJobId) return;

        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== pendingDeleteJobId));
        if (editingJobId === pendingDeleteJobId) {
            closeForm();
        }

        closeDeleteModal();
    }

    function handleFormSubmit(values) {
        if (editingJobId) {
            updateJob(values);
            return;
        }

        createJob(values);
    }

    function getStatusFromDropTarget(over) {
        if (!over || !over.data.current) return null;
        return over.data.current.status || null;
    }

    function handleDragStart(event) {
        const draggedId = event.active.id.toString().replace('job-', '');
        setActiveJobId(draggedId);
    }

    function handleDragEnd(event) {
        const draggedId = event.active.id.toString().replace('job-', '');
        const nextStatus = getStatusFromDropTarget(event.over);
        const draggedJob = jobs.find((job) => job.id === draggedId);

        if (!nextStatus) {
            setActiveJobId(null);
            return;
        }

        setJobs((prevJobs) =>
            prevJobs.map((job) => {
                if (job.id !== draggedId) return job;

                return {
                    ...job,
                    status: nextStatus,
                    followUpDays: normalizeFollowUpDays(job.followUpDays),
                    result: nextStatus === 'selected-rejected' ? job.result : 'Pending',
                };
            })
        );

        if (
            nextStatus === 'selected-rejected' &&
            draggedJob &&
            (draggedJob.status !== 'selected-rejected' || draggedJob.result === 'Pending')
        ) {
            setPendingOutcomeJobId(draggedId);
        }

        setActiveJobId(null);
    }

    function handleDragCancel() {
        setActiveJobId(null);
    }

    function closeOutcomeModal() {
        setPendingOutcomeJobId(null);
    }

    function setFinalOutcome(result) {
        if (!pendingOutcomeJobId) return;

        setJobs((prevJobs) =>
            prevJobs.map((job) =>
                job.id === pendingOutcomeJobId
                    ? {
                          ...job,
                          status: 'selected-rejected',
                          result,
                      }
                    : job
            )
        );

        closeOutcomeModal();
    }

    const containerClass =
        'rounded-xl border border-slate-900/10 bg-white/92 p-5 shadow-sm shadow-slate-900/5 sm:p-6';

    return (
        <section className="space-y-6">
            <header className={containerClass}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
                            <Sparkles size={14} aria-hidden="true" />
                            Job Ops Dashboard
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Job Application Tracker
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                            Keep your applications organized in one place and move opportunities
                            through each hiring stage with drag and drop.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            href="/resumes"
                            className="inline-flex items-center gap-2 rounded-md border border-slate-900/20 bg-white/90 px-3.5 py-2 text-sm font-medium text-slate-800 transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-slate-900/5"
                        >
                            <Briefcase size={16} aria-hidden="true" />
                            Resume Tracker
                        </Link>
                        <Link
                            href="/job-sites"
                            className="inline-flex items-center gap-2 rounded-md border border-slate-900/20 bg-white/90 px-3.5 py-2 text-sm font-medium text-slate-800 transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-slate-900/5"
                        >
                            <MessageSquare size={16} aria-hidden="true" />
                            Find Jobs
                        </Link>
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-cyan-700/90 active:translate-y-0"
                        >
                            <Plus size={16} aria-hidden="true" />
                            New Application
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="Applied"
                    value={totalJobs}
                    accentClass="text-slate-900"
                    Icon={Briefcase}
                />
                <MetricCard
                    label="Responses"
                    value={responseCount}
                    accentClass="text-cyan-700"
                    Icon={MessageSquare}
                />
                <MetricCard
                    label="Interviews"
                    value={interviewCount}
                    accentClass="text-cyan-700"
                    Icon={CalendarDays}
                />
                <MetricCard
                    label="Selected"
                    value={selectedCount}
                    accentClass="text-cyan-700"
                    Icon={CheckCircle2}
                />
            </div>

            <div>
                <div id="job-board" className={containerClass}>
                    {isJobsLoaded && jobs.length === 0 ? (
                        <section className="rounded-lg border border-dashed border-slate-900/20 bg-slate-900/5 p-5 text-center sm:p-8">
                            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md border border-cyan-700/30 bg-cyan-700/10 text-cyan-700">
                                <Inbox size={18} aria-hidden="true" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Start by adding your first job
                            </h2>
                            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
                                The board is empty. Add your first application to begin tracking
                                progress, follow-ups, interviews, and outcomes.
                            </p>
                            <button
                                type="button"
                                onClick={openCreateForm}
                                className="mt-4 rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-cyan-700/90"
                            >
                                Add First Application
                            </button>
                        </section>
                    ) : null}

                    {isHydrated ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragCancel={handleDragCancel}
                        >
                            <Board
                                columns={COLUMNS}
                                jobsByColumn={jobsByColumn}
                                onEdit={openEditForm}
                                onDelete={requestDeleteJob}
                                dragEnabled
                            />

                            <DragOverlay
                                dropAnimation={{
                                    duration: 200,
                                    easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
                                }}
                            >
                                {activeJob ? (
                                    <div className="w-80 rounded-lg border border-cyan-700/35 bg-white/95 p-4 shadow-xl shadow-slate-900/15 transition-all duration-200 ease-out">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {activeJob.company}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {activeJob.role}
                                        </p>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    ) : (
                        <Board
                            columns={COLUMNS}
                            jobsByColumn={jobsByColumn}
                            onEdit={openEditForm}
                            onDelete={requestDeleteJob}
                            dragEnabled={false}
                        />
                    )}
                </div>
            </div>

            {isFormOpen ? (
                <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/35 p-4 backdrop-blur-sm sm:items-center">
                    <div className="max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-900/15 bg-white/70 p-2 shadow-xl shadow-slate-900/10">
                        <ApplicationForm
                            key={editingJobId || 'new'}
                            initialValues={editingJob || EMPTY_FORM}
                            statuses={COLUMNS}
                            resumes={resumes.filter((resume) => resume.status !== 'archived')}
                            onCancel={closeForm}
                            onSubmit={handleFormSubmit}
                            mode={editingJobId ? 'edit' : 'create'}
                        />
                    </div>
                </div>
            ) : null}

            {pendingDeleteJob ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-md rounded-lg border border-slate-900/15 bg-white p-5 shadow-lg shadow-slate-900/15">
                        <p className="text-sm font-semibold text-slate-900">Delete application?</p>
                        <p className="mt-2 text-sm text-slate-600">
                            This will remove{' '}
                            <span className="font-medium text-slate-800">
                                {pendingDeleteJob.company} - {pendingDeleteJob.role}
                            </span>{' '}
                            from your board.
                        </p>
                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                className="rounded-md border border-slate-900/20 px-3.5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-900/5"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteJob}
                                className="rounded-md border border-cyan-700/35 bg-cyan-700/10 px-3.5 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-700/15"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {pendingOutcomeJob ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-md rounded-lg border border-slate-900/15 bg-white p-5 shadow-lg shadow-slate-900/15">
                        <p className="text-sm font-semibold text-slate-900">Final decision?</p>
                        <p className="mt-2 text-sm text-slate-600">
                            For{' '}
                            <span className="font-medium text-slate-800">
                                {pendingOutcomeJob.company} - {pendingOutcomeJob.role}
                            </span>
                            , were you selected or rejected?
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeOutcomeModal}
                                className="rounded-md border border-slate-900/20 px-3.5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-900/5"
                            >
                                Decide later
                            </button>
                            <button
                                type="button"
                                onClick={() => setFinalOutcome('Rejected')}
                                className="rounded-md border border-cyan-700/35 bg-cyan-700/10 px-3.5 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-700/15"
                            >
                                Rejected
                            </button>
                            <button
                                type="button"
                                onClick={() => setFinalOutcome('Selected')}
                                className="rounded-md border border-cyan-700/35 bg-cyan-700/10 px-3.5 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-700/15"
                            >
                                Selected
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
