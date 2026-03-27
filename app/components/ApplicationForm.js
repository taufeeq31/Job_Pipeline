'use client';

import { useState } from 'react';
import Link from 'next/link';

function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
}

const EMPTY_FORM = {
    company: '',
    role: '',
    department: '',
    salary: '',
    contacts: '',
    dateApplied: getTodayDate(),
    responseDate: '',
    interviewDates: [],
    interviewDatesInput: '',
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

export default function ApplicationForm({
    initialValues,
    statuses,
    resumes = [],
    onCancel,
    onSubmit,
    mode,
}) {
    const initialInterviewDates = Array.isArray(initialValues.interviewDates)
        ? initialValues.interviewDates.join(', ')
        : '';
    const [isQuickMode, setIsQuickMode] = useState(mode !== 'edit');

    const [formValues, setFormValues] = useState({
        ...EMPTY_FORM,
        ...initialValues,
        dateApplied: initialValues.dateApplied || getTodayDate(),
        interviewDatesInput: initialInterviewDates,
    });
    const [resultError, setResultError] = useState('');

    const selectedResumeMissing =
        formValues.resumeId && !resumes.some((resume) => resume.id === formValues.resumeId);

    function updateField(event) {
        const { name, value } = event.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'status' && value !== 'selected-rejected') {
            setResultError('');
        }

        if (name === 'result' && value !== 'Pending') {
            setResultError('');
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (formValues.status === 'selected-rejected' && formValues.result === 'Pending') {
            setResultError('Please confirm whether this application was Selected or Rejected.');
            return;
        }

        const interviewDates = formValues.interviewDatesInput
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);

        onSubmit({
            ...formValues,
            company: formValues.company.trim(),
            role: formValues.role.trim(),
            dateApplied: formValues.dateApplied || getTodayDate(),
            resumeId: formValues.resumeId || '',
            interviewDates,
        });

        setResultError('');
    }

    const showResult = formValues.status === 'selected-rejected';
    const fieldClass =
        'rounded-md border border-slate-900/20 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition duration-200 focus:border-cyan-700/50 focus:ring-2 focus:ring-cyan-700/20';

    return (
        <section className="mt-0 rounded-xl border border-slate-900/10 bg-white p-5 shadow-sm shadow-slate-900/5 sm:p-6">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {mode === 'edit' ? 'Edit Application' : 'Add New Application'}
            </h2>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-md border border-cyan-700/25 bg-cyan-700/10 px-3 py-2 text-xs text-cyan-700">
                <p>Quick add keeps only essentials visible so you can log applications faster.</p>
                <button
                    type="button"
                    onClick={() => setIsQuickMode((prev) => !prev)}
                    className="rounded-md border border-cyan-700/30 bg-white px-2.5 py-1 font-medium text-cyan-700 transition duration-200 hover:bg-cyan-700/10"
                >
                    {isQuickMode ? 'Show all fields' : 'Use quick add'}
                </button>
            </div>

            <form className="mt-5 grid gap-3.5 sm:grid-cols-2" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-600">Company</span>
                    <input
                        required
                        name="company"
                        value={formValues.company}
                        onChange={updateField}
                        className={fieldClass}
                    />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-600">Role</span>
                    <input
                        required
                        name="role"
                        value={formValues.role}
                        onChange={updateField}
                        className={fieldClass}
                    />
                </label>

                <label className="sm:col-span-2 flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-600">Job Link (Optional)</span>
                    <input
                        type="url"
                        name="jobLink"
                        value={formValues.jobLink}
                        onChange={updateField}
                        placeholder="https://company.com/jobs/frontend-role"
                        className={fieldClass}
                    />
                </label>

                <label className="sm:col-span-2 flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-600">Resume Used</span>
                        <Link
                            href="/resumes"
                            className="text-xs font-medium text-cyan-700 underline underline-offset-2"
                        >
                            Manage resumes
                        </Link>
                    </div>
                    <select
                        name="resumeId"
                        value={formValues.resumeId}
                        onChange={updateField}
                        className={fieldClass}
                    >
                        <option value="">No resume linked</option>
                        {selectedResumeMissing ? (
                            <option value={formValues.resumeId}>
                                {formValues.resumeTitle || 'Previously selected resume (deleted)'}
                            </option>
                        ) : null}
                        {resumes.map((resume) => (
                            <option key={resume.id} value={resume.id}>
                                {resume.title}
                                {resume.type ? ` (${resume.type})` : ''}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500">
                        Linking a resume lets the tracker calculate response and interview
                        conversion rates.
                    </p>
                </label>

                {isQuickMode ? null : (
                    <>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Department</span>
                            <input
                                name="department"
                                value={formValues.department}
                                onChange={updateField}
                                placeholder="Engineering"
                                className={fieldClass}
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Salary</span>
                            <input
                                name="salary"
                                value={formValues.salary}
                                onChange={updateField}
                                placeholder="120,000 USD"
                                className={fieldClass}
                            />
                        </label>

                        <label className="sm:col-span-2 flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Contacts</span>
                            <input
                                name="contacts"
                                value={formValues.contacts}
                                onChange={updateField}
                                placeholder="Recruiter name, email, or phone"
                                className={fieldClass}
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Date Applied</span>
                            <input
                                type="date"
                                name="dateApplied"
                                value={formValues.dateApplied}
                                onChange={updateField}
                                className={fieldClass}
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Status</span>
                            <select
                                name="status"
                                value={formValues.status}
                                onChange={updateField}
                                className={fieldClass}
                            >
                                {statuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.title}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">
                                Response Date
                            </span>
                            <input
                                type="date"
                                name="responseDate"
                                value={formValues.responseDate}
                                onChange={updateField}
                                className={fieldClass}
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">
                                Follow-up (days)
                            </span>
                            <input
                                min={1}
                                max={30}
                                type="number"
                                name="followUpDays"
                                value={formValues.followUpDays}
                                onChange={updateField}
                                className={fieldClass}
                            />
                        </label>

                        <label className="sm:col-span-2 flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">
                                Interview Dates
                            </span>
                            <input
                                name="interviewDatesInput"
                                value={formValues.interviewDatesInput}
                                onChange={updateField}
                                placeholder="2026-03-15, 2026-03-21"
                                className={fieldClass}
                            />
                        </label>

                        <label className="sm:col-span-2 flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Notes</span>
                            <textarea
                                rows={2}
                                name="notes"
                                value={formValues.notes}
                                onChange={updateField}
                                className={fieldClass}
                            />
                        </label>

                        <label className="sm:col-span-2 flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Feedback</span>
                            <textarea
                                rows={2}
                                name="feedback"
                                value={formValues.feedback}
                                onChange={updateField}
                                className={fieldClass}
                            />
                        </label>

                        {showResult ? (
                            <div className="sm:col-span-2 rounded-md border border-cyan-700/30 bg-cyan-700/10 p-3.5">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                                    Final Decision
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    Was this application selected or rejected?
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormValues((prev) => ({
                                                ...prev,
                                                result: 'Selected',
                                            }));
                                            setResultError('');
                                        }}
                                        className={`rounded-md border px-3.5 py-2 text-sm font-medium transition duration-200 ${
                                            formValues.result === 'Selected'
                                                ? 'border-cyan-700/40 bg-white text-cyan-700'
                                                : 'border-slate-900/20 bg-white text-slate-700 hover:bg-slate-900/5'
                                        }`}
                                    >
                                        Selected
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormValues((prev) => ({
                                                ...prev,
                                                result: 'Rejected',
                                            }));
                                            setResultError('');
                                        }}
                                        className={`rounded-md border px-3.5 py-2 text-sm font-medium transition duration-200 ${
                                            formValues.result === 'Rejected'
                                                ? 'border-slate-900/35 bg-white text-slate-800'
                                                : 'border-slate-900/20 bg-white text-slate-700 hover:bg-slate-900/5'
                                        }`}
                                    >
                                        Rejected
                                    </button>
                                </div>

                                {resultError ? (
                                    <p className="mt-2 text-xs font-medium text-cyan-700">
                                        {resultError}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}
                    </>
                )}

                <div className="sm:col-span-2 mt-1 flex flex-wrap items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md border border-slate-900/20 px-4 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-900/5"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-slate-900/10 transition duration-200 hover:bg-cyan-700/90"
                    >
                        {mode === 'edit' ? 'Save Changes' : 'Create Application'}
                    </button>
                </div>
            </form>
        </section>
    );
}
