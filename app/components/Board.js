import Column from './Column';

export default function Board({ columns, jobsByColumn, onEdit, onDelete, dragEnabled }) {
    return (
        <section className="mt-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {columns.map((column) => (
                    <Column
                        key={column.id}
                        column={column}
                        cards={jobsByColumn[column.id] || []}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        dragEnabled={dragEnabled}
                    />
                ))}
            </div>
        </section>
    );
}
