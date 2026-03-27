export default function ResumeCard({ resume, stats, onEdit, onToggleArchive, onDelete }) {
    return (
        <article className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm shadow-slate-900/5">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">{resume.title}</h3>
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
                    <p className="mt-1 font-semibold text-slate-800">{stats?.applications || 0}</p>
                </div>
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
                    <p className="text-slate-500">Interviews</p>
                    <p className="mt-1 font-semibold text-slate-800">{stats?.interviews || 0}</p>
                </div>
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
                    <p className="text-slate-500">Selected</p>
                    <p className="mt-1 font-semibold text-slate-800">{stats?.selections || 0}</p>
                </div>
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
                    <p className="text-slate-500">Rejected</p>
                    <p className="mt-1 font-semibold text-slate-800">{stats?.rejections || 0}</p>
                </div>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <p>
                    <span className="font-medium text-slate-700">Type:</span> {resume.type}
                </p>
                <p>
                    <span className="font-medium text-slate-700">Updated:</span>{' '}
                    {resume.updatedAt || 'Not set'}
                </p>
                <p>
                    <span className="font-medium text-slate-700">Last manually marked use:</span>{' '}
                    {resume.lastUsedAt || 'Not used yet'}
                </p>
                <p>
                    <span className="font-medium text-slate-700">Used count:</span>{' '}
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
                    onClick={() => onEdit(resume.id)}
                    className="rounded-lg border border-slate-300/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => onToggleArchive(resume.id)}
                    className="rounded-lg border border-amber-200/90 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                >
                    {resume.status === 'archived' ? 'Unarchive' : 'Archive'}
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(resume.id)}
                    className="rounded-lg border border-rose-200/90 px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                >
                    Delete
                </button>
            </div>
        </article>
    );
}
