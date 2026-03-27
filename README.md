# Job Application Tracker

A focused job-search workspace built with Next.js that helps you:

- Track applications in a Kanban-style board.
- Move roles through hiring stages with drag and drop.
- Save and compare resume versions.
- Pin favorite job platforms for quick access.
- Keep all data locally in your browser (no backend required).

## Features

### Application Tracking

- Create, edit, and delete job applications.
- Track each application through:
    - Applied
    - Response Received
    - Interview
    - Selected / Rejected
- Capture details like role, department, contacts, salary, notes, and job link.
- Record outcomes for final-stage applications.

### Drag-and-Drop Workflow

- Reorder status by dragging job cards between columns.
- Mobile + desktop friendly interactions using dnd-kit sensors.

### Resume Management

- Create multiple resume versions.
- Link applications to a resume variant.
- Track usage and performance metrics per resume.

### Job Sites Hub

- Curated list of popular job platforms.
- Pin/unpin favorite sites for a quick daily workflow.

### Local-First Persistence

- Data is stored in `localStorage`.
- Includes cross-tab sync for smoother multi-tab usage.
- No account setup or cloud dependency.

## Routes

- `/` -> Main tracker board
- `/home` -> Landing page
- `/resumes` -> Resume management and insights
- `/job-sites` -> Job platform list with pinned shortcuts

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- lucide-react icons
- dnd-kit for drag-and-drop
- ESLint 9 + eslint-config-next

## Project Structure

```text
app/
	components/
		AppNavbar.js
		JobTrackerApp.js
		ApplicationForm.js
		Board.js
		Column.js
		JobCard.js
		TrackerControls.js
		landing/
		resumes/
	hooks/
		useLocalStorageState.js
	lib/
		jobTracker.js
	page.js
	home/page.js
	resumes/page.js
	job-sites/page.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start local development server.
- `npm run build` - Build for production.
- `npm run start` - Run production build locally.
- `npm run lint` - Run ESLint checks.

## Data Storage Keys

The app currently uses these `localStorage` keys:

- `job-tracker.jobs.v2`
- `job-tracker.resumes.v1`
- `job-tracker.pinned-sites.v1`

If schema changes are introduced, version keys should be incremented to avoid parsing old data with new structures.

## Notes for Contributors

- This project is currently client-side and local-first.
- Prefer small, modular components under `app/components`.
- Keep UI changes responsive (mobile + desktop).
- If adding new persisted state, follow the existing key versioning pattern.

## Build Status

- Latest local production build: passing (`npm run build`).
