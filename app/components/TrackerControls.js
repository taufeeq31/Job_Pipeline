export default function TrackerControls({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    sortOrder,
    onSortOrderChange,
    statuses,
    isDarkMode,
    onToggleDarkMode,
    onExportCsv,
}) {
    return (
        <section
            className={`mt-5 rounded-2xl border p-4 shadow-sm sm:p-5 ${
                isDarkMode
                    ? 'border-slate-700/80 bg-slate-900/60 shadow-black/10'
                    : 'border-slate-200/90 bg-white/88 shadow-slate-900/5'
            }`}
        >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <label className="flex flex-col gap-1.5 xl:col-span-2">
                    <span
                        className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                        Search (Company or Role)
                    </span>
                    <input
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="e.g. Frontend Developer"
                        className={`rounded-lg border px-3 py-2 text-sm outline-none ring-cyan-500 transition focus:ring-2 ${
                            isDarkMode
                                ? 'border-slate-600/90 bg-slate-800/90 text-slate-100'
                                : 'border-slate-300/90 bg-white/95 text-slate-800'
                        }`}
                    />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span
                        className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                        Filter Status
                    </span>
                    <select
                        value={statusFilter}
                        onChange={(event) => onStatusFilterChange(event.target.value)}
                        className={`rounded-lg border px-3 py-2 text-sm outline-none ring-cyan-500 transition focus:ring-2 ${
                            isDarkMode
                                ? 'border-slate-600/90 bg-slate-800/90 text-slate-100'
                                : 'border-slate-300/90 bg-white/95 text-slate-800'
                        }`}
                    >
                        <option value="all">All Statuses</option>
                        {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.title}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5">
                    <span
                        className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                        Sort by Date
                    </span>
                    <select
                        value={sortOrder}
                        onChange={(event) => onSortOrderChange(event.target.value)}
                        className={`rounded-lg border px-3 py-2 text-sm outline-none ring-cyan-500 transition focus:ring-2 ${
                            isDarkMode
                                ? 'border-slate-600/90 bg-slate-800/90 text-slate-100'
                                : 'border-slate-300/90 bg-white/95 text-slate-800'
                        }`}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </label>

                <div className="flex items-end gap-2 md:justify-end">
                    <button
                        type="button"
                        onClick={onExportCsv}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                            isDarkMode
                                ? 'border-slate-500/90 text-slate-100 hover:bg-slate-700/70'
                                : 'border-slate-300/90 text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        Export CSV
                    </button>
                    <button
                        type="button"
                        onClick={onToggleDarkMode}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isDarkMode
                                ? 'bg-slate-100 text-slate-900 hover:bg-white'
                                : 'bg-slate-900 text-white shadow-sm shadow-slate-900/10 hover:bg-slate-800'
                        }`}
                    >
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </div>
        </section>
    );
}
