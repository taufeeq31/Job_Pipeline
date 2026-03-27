export default function ResumeFormSection({
    editingResumeId,
    shouldShowForm,
    openCreateForm,
    handleSubmit,
    formValues,
    updateField,
    resumeTypes,
    resetForm,
}) {
    return (
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
                        <span className="text-xs font-medium text-slate-600">Resume Name</span>
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
                            {resumeTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="sm:col-span-2 flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-slate-600">Target Role</span>
                        <input
                            name="targetRole"
                            value={formValues.targetRole}
                            onChange={updateField}
                            placeholder="Frontend Engineer, Product Engineer"
                            className="rounded-lg border border-slate-300/90 bg-white/95 px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500 transition focus:ring-2"
                        />
                    </label>

                    <label className="sm:col-span-2 flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-slate-600">Resume Link</span>
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
                    Form is closed to keep this page focused. Click Add Resume when you need it.
                </p>
            )}
        </section>
    );
}
