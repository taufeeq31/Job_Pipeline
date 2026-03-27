import JobTrackerApp from './components/JobTrackerApp';

export default function Home() {
    return (
        <main className="mx-auto flex w-full max-w-360 flex-1 flex-col px-4 py-7 sm:px-6 lg:px-8">
            <section className="rounded-xl border border-slate-900/10 bg-white/88 p-5 shadow-sm shadow-slate-900/5 sm:p-6">
                <JobTrackerApp />
            </section>
        </main>
    );
}
