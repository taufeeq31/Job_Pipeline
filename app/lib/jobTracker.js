export const COLUMNS = [
    { id: 'applied', title: 'Applied' },
    { id: 'response-received', title: 'Response Received' },
    { id: 'interview', title: 'Interview' },
    { id: 'selected-rejected', title: 'Selected / Rejected' },
];

export const STATUS_LABELS = {
    applied: 'Applied',
    'response-received': 'Response Received',
    interview: 'Interview',
    'selected-rejected': 'Selected / Rejected',
};

export const EMPTY_FORM = {
    company: '',
    role: '',
    dateApplied: '',
    status: 'applied',
    notes: '',
    feedback: '',
    jobLink: '',
    result: 'Selected',
};

export const INITIAL_JOBS = [
    {
        id: 'a1',
        company: 'Aster Labs',
        role: 'Frontend Developer',
        dateApplied: '2026-03-18',
        status: 'applied',
        notes: 'Applied via careers page.',
        feedback: '',
        jobLink: 'https://example.com/jobs/aster-frontend',
        result: 'Selected',
    },
    {
        id: 'r1',
        company: 'NovaWorks',
        role: 'Product Engineer',
        dateApplied: '2026-03-14',
        status: 'response-received',
        notes: 'Recruiter responded after 2 days.',
        feedback: '',
        jobLink: 'https://example.com/jobs/novaworks-product-engineer',
        result: 'Selected',
    },
    {
        id: 'i1',
        company: 'BrightLayer',
        role: 'Software Engineer',
        dateApplied: '2026-03-08',
        status: 'interview',
        notes: 'Technical interview scheduled for Monday.',
        feedback: 'Strong JS fundamentals.',
        jobLink: 'https://example.com/jobs/brightlayer-software-engineer',
        result: 'Selected',
    },
    {
        id: 'f1',
        company: 'Quantum Bridge',
        role: 'React Developer',
        dateApplied: '2026-02-26',
        status: 'selected-rejected',
        notes: 'Completed all rounds.',
        feedback: 'Great communication.',
        jobLink: 'https://example.com/jobs/quantum-react-role',
        result: 'Selected',
    },
];

export function normalizeJob(job) {
    return {
        id: job.id,
        company: job.company || '',
        role: job.role || '',
        dateApplied: job.dateApplied || '',
        status: job.status || 'applied',
        notes: job.notes || '',
        feedback: job.feedback || '',
        jobLink: job.jobLink || '',
        result: job.result || 'Selected',
    };
}

export function filterAndSortJobs(jobs, controls) {
    const query = controls.searchQuery.trim().toLowerCase();

    const filtered = jobs.filter((job) => {
        const matchesQuery =
            query.length === 0 ||
            job.company.toLowerCase().includes(query) ||
            job.role.toLowerCase().includes(query);

        const matchesStatus =
            controls.statusFilter === 'all' || job.status === controls.statusFilter;

        return matchesQuery && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
        const timeA = new Date(a.dateApplied || '1970-01-01').getTime();
        const timeB = new Date(b.dateApplied || '1970-01-01').getTime();
        return controls.sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return sorted;
}

export function groupJobsByColumn(jobs) {
    return COLUMNS.reduce((acc, column) => {
        acc[column.id] = jobs.filter((job) => job.status === column.id);
        return acc;
    }, {});
}

function escapeCsv(value) {
    const stringValue = String(value ?? '');
    if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

export function jobsToCsv(jobs) {
    const headers = [
        'id',
        'company',
        'role',
        'dateApplied',
        'status',
        'notes',
        'feedback',
        'jobLink',
        'result',
    ];

    const rows = jobs.map((job) =>
        [
            job.id,
            job.company,
            job.role,
            job.dateApplied,
            STATUS_LABELS[job.status] || job.status,
            job.notes,
            job.feedback,
            job.jobLink,
            job.result,
        ]
            .map(escapeCsv)
            .join(',')
    );

    return [headers.join(','), ...rows].join('\n');
}
