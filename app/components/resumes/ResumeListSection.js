import ResumeCard from './ResumeCard';

export default function ResumeListSection({
    isResumesLoaded,
    sortedResumes,
    analyticsByResumeId,
    onEdit,
    onToggleArchive,
    onDelete,
}) {
    return (
        <section className="mt-5">
            {!isResumesLoaded ? (
                <p className="text-sm text-slate-600">Loading resume versions...</p>
            ) : sortedResumes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300/90 bg-white/80 p-4 sm:p-5">
                    <p className="text-sm font-medium text-slate-800">No resume versions yet.</p>
                    <p className="mt-1 text-sm text-slate-600">
                        Add your first resume type to start tracking usage across applications.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {sortedResumes.map((resume) => (
                        <ResumeCard
                            key={resume.id}
                            resume={resume}
                            stats={analyticsByResumeId[resume.id]}
                            onEdit={onEdit}
                            onToggleArchive={onToggleArchive}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
