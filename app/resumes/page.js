'use client';

import { useMemo, useState } from 'react';
import useLocalStorageState from '../hooks/useLocalStorageState';
import ResumeHeader from '../components/resumes/ResumeHeader';
import ResumeFormSection from '../components/resumes/ResumeFormSection';
import ResumeInsightsSection from '../components/resumes/ResumeInsightsSection';
import ResumeListSection from '../components/resumes/ResumeListSection';

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
                <ResumeHeader
                    resumesCount={resumes.length}
                    activeCount={activeCount}
                    archivedCount={archivedCount}
                    overallStats={overallStats}
                />

                <ResumeFormSection
                    editingResumeId={editingResumeId}
                    shouldShowForm={shouldShowForm}
                    openCreateForm={openCreateForm}
                    handleSubmit={handleSubmit}
                    formValues={formValues}
                    updateField={updateField}
                    resumeTypes={RESUME_TYPES}
                    resetForm={resetForm}
                />

                <ResumeInsightsSection
                    overallStats={overallStats}
                    bestPerformingResume={bestPerformingResume}
                    analyticsByResumeId={analyticsByResumeId}
                    formatRate={formatRate}
                />

                <ResumeListSection
                    isResumesLoaded={isResumesLoaded}
                    sortedResumes={sortedResumes}
                    analyticsByResumeId={analyticsByResumeId}
                    onEdit={handleEdit}
                    onToggleArchive={toggleArchive}
                    onDelete={handleDelete}
                />
            </section>
        </main>
    );
}
