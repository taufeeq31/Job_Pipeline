'use client';

import { useSyncExternalStore } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const REMINDER_STATUSES = new Set(['applied', 'response-received']);

function addDays(dateString, days) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    date.setDate(date.getDate() + days);
    return date;
}

function formatDate(dateValue) {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
}

function getReminder(job) {
    if (!REMINDER_STATUSES.has(job.status)) return null;

    const baseDate =
        job.status === 'response-received' ? job.responseDate || job.dateApplied : job.dateApplied;
    const followUpDays = Number(job.followUpDays) || 5;
    const dueDate = addDays(baseDate, followUpDays);
    if (!dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueAtMidnight = new Date(dueDate);
    dueAtMidnight.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dueAtMidnight.getTime() - today.getTime()) / 86400000);

    if (diffDays < 0) {
        return {
            tone: 'overdue',
            text: `Follow-up overdue by ${Math.abs(diffDays)} day(s)`,
        };
    }

    if (diffDays === 0) {
        return {
            tone: 'today',
            text: 'Follow-up due today',
        };
    }

    return {
        tone: 'upcoming',
        text: `Follow-up in ${diffDays} day(s)`,
    };
}

function reminderClasses(tone) {
    if (tone === 'overdue') {
        return 'border-cyan-700/35 bg-cyan-700/10 text-cyan-700';
    }

    if (tone === 'today') {
        return 'border-cyan-700/35 bg-cyan-700/10 text-cyan-700';
    }

    return 'border-cyan-700/35 bg-cyan-700/10 text-cyan-700';
}

function cardOutcomeClasses(job) {
    if (job.status !== 'selected-rejected') {
        return 'border-slate-900/10 bg-white/95';
    }

    if (job.result === 'Selected') {
        return 'border-cyan-700/25 bg-cyan-700/5';
    }

    if (job.result === 'Rejected') {
        return 'border-slate-900/15 bg-slate-900/5';
    }

    return 'border-slate-900/10 bg-white/95';
}

export default function JobCard({ job, statusLabel, onEdit, onDelete, dragEnabled }) {
    const isHydrated = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    const { setNodeRef: setDropRef } = useDroppable({
        id: `job-drop-${job.id}`,
        data: {
            type: 'job',
            status: job.status,
        },
    });

    const {
        attributes,
        listeners,
        setNodeRef: setDragRef,
        transform,
        transition,
        isDragging,
    } = useDraggable({
        id: `job-${job.id}`,
        data: {
            type: 'job',
            status: job.status,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
    };

    const combinedRef = (node) => {
        setDropRef(node);
        setDragRef(node);
    };

    const dragProps = dragEnabled
        ? {
              ...listeners,
              ...attributes,
          }
        : {};

    const reminder = isHydrated ? getReminder(job) : null;
    const cardClasses = cardOutcomeClasses(job);
    const interactionClasses = dragEnabled
        ? 'cursor-grab touch-none active:cursor-grabbing'
        : 'cursor-default';
    const draggingClasses = isDragging
        ? 'border-cyan-700/40 shadow-lg shadow-slate-900/15'
        : 'hover:-translate-y-1 hover:border-cyan-700/35 hover:shadow-lg hover:shadow-cyan-700/20';

    return (
        <div
            ref={combinedRef}
            style={style}
            {...dragProps}
            className={`rounded-lg border-l-2 border-l-cyan-700/45 p-4 shadow-sm shadow-slate-900/5 transition-all duration-200 ease-out will-change-transform ${cardClasses} ${interactionClasses} ${draggingClasses}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-base font-bold tracking-tight text-slate-900">
                        {job.company}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">{job.role}</p>
                    <p className="mt-1 text-xs text-slate-500">Applied on {job.dateApplied}</p>
                </div>

                <span className="rounded-md bg-cyan-700/10 px-2 py-1 text-[11px] font-semibold text-cyan-700">
                    Drag
                </span>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                <p>
                    <span className="font-medium text-slate-700">Status:</span> {statusLabel}
                </p>
                {job.result && job.result !== 'Pending' ? (
                    <p>
                        <span className="font-medium text-slate-700">Result:</span> {job.result}
                    </p>
                ) : null}
                {job.feedback ? (
                    <p>
                        <span className="font-medium text-slate-700">Feedback:</span> {job.feedback}
                    </p>
                ) : null}
                {job.department ? (
                    <p>
                        <span className="font-medium text-slate-700">Department:</span>{' '}
                        {job.department}
                    </p>
                ) : null}
                {job.salary ? (
                    <p>
                        <span className="font-medium text-slate-700">Salary:</span> {job.salary}
                    </p>
                ) : null}
                {job.contacts ? (
                    <p>
                        <span className="font-medium text-slate-700">Contacts:</span> {job.contacts}
                    </p>
                ) : null}
                {job.jobLink ? (
                    <p>
                        <span className="font-medium text-slate-700">Job Link:</span>{' '}
                        <a
                            href={job.jobLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-700 underline decoration-cyan-700/40 underline-offset-2 hover:text-cyan-700"
                        >
                            Open posting
                        </a>
                    </p>
                ) : null}
                {job.resumeTitle ? (
                    <p>
                        <span className="font-medium text-slate-700">Resume:</span>{' '}
                        {job.resumeTitle}
                        {job.resumeType ? ` (${job.resumeType})` : ''}
                    </p>
                ) : null}

                {reminder ? (
                    <p
                        className={`inline-flex rounded-md border px-2 py-1 font-medium ${reminderClasses(
                            reminder.tone
                        )}`}
                    >
                        {reminder.text}
                    </p>
                ) : null}
            </div>

            <details className="mt-4 rounded-md border border-slate-900/10 bg-slate-900/5 px-3 py-2">
                <summary className="cursor-pointer text-xs font-semibold text-slate-700">
                    Timeline
                </summary>
                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <p>
                        <span className="font-medium text-slate-700">Applied:</span>{' '}
                        {formatDate(job.dateApplied) || 'Not set'}
                    </p>
                    <p>
                        <span className="font-medium text-slate-700">Response:</span>{' '}
                        {formatDate(job.responseDate) || 'Not set'}
                    </p>
                    <p>
                        <span className="font-medium text-slate-700">Interviews:</span>{' '}
                        {Array.isArray(job.interviewDates) && job.interviewDates.length > 0
                            ? job.interviewDates.map((date) => formatDate(date) || date).join(', ')
                            : 'Not set'}
                    </p>
                </div>
            </details>

            <div className="mt-4 flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={() => onEdit(job.id)}
                    className="rounded-md border border-slate-900/20 px-2.5 py-1 text-xs font-medium text-slate-800 transition hover:bg-slate-900/5"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(job.id)}
                    className="rounded-md border border-cyan-700/35 px-2.5 py-1 text-xs font-medium text-cyan-700 transition hover:bg-cyan-700/10"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
