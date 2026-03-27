'use client';

import { useDroppable } from '@dnd-kit/core';
import JobCard from './JobCard';

const STATUS_LABELS = {
    applied: 'Applied',
    'response-received': 'InProgress',
    interview: 'Interview',
    'selected-rejected': 'Selected / Rejected',
};

export default function Column({ column, cards, onEdit, onDelete, dragEnabled }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `column-${column.id}`,
        data: {
            type: 'column',
            status: column.id,
        },
    });

    return (
        <article
            ref={setNodeRef}
            className={`rounded-xl border p-4 shadow-sm shadow-slate-900/5 transition-all duration-200 ease-out ${
                isOver
                    ? 'border-cyan-700/50 bg-cyan-700/10 shadow-md shadow-cyan-700/10'
                    : 'border-slate-900/10 bg-white/85 hover:border-cyan-700/25 hover:bg-cyan-700/5'
            }`}
        >
            <header className="mb-4 flex items-center justify-between gap-2 border-b border-slate-900/10 pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-900">
                    {column.title}
                </h2>
                <span className="rounded-md bg-slate-900/5 px-2.5 py-1 text-xs font-semibold text-slate-900">
                    {cards.length}
                </span>
            </header>

            <div className="space-y-3">
                {cards.map((card) => (
                    <JobCard
                        key={card.id}
                        job={card}
                        statusLabel={STATUS_LABELS[card.status] || card.status}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        dragEnabled={dragEnabled}
                    />
                ))}

                {cards.length === 0 ? (
                    <div className="rounded-md border border-dashed border-slate-900/20 bg-slate-900/5 p-3 text-xs text-slate-700">
                        Drop a card here
                    </div>
                ) : null}
            </div>
        </article>
    );
}
