# JobOrbit — Job Board & Placement Portal

A frontend-only React implementation of a Job Board & Placement Portal.

Stack: **React 18 · React Router · JavaScript/JSX · CSS · localStorage** (no backend, no Tailwind/Bootstrap/Redux/Material UI).

## Status

This build wires the previously-unused core architecture (auth, storage, filtering, status transitions, and all shared components) into a full page/routing layer. See `PROGRESS.md` for exactly what exists, what's still open, and how to verify it.

## Run

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Demo accounts

- Applicant: `applicant@example.com` / `applicant123`
- Recruiter: `recruiter@example.com` / `recruiter123`

## Architecture

- `src/context/AuthContext.jsx` — login/register/logout, current user persisted in localStorage
- `src/context/DataContext.jsx` — single source of truth for jobs, applications, saved jobs, profile, job alerts (backed by `src/utils/storage.js`)
- `src/utils/filterJobs.js` — centralized `filterJobs()`, `paginate()`, `recommendJobs()`
- `src/utils/statusTransitions.js` — centralized `STATUS_TRANSITIONS` / `canTransitionStatus()`
- `src/utils/validation.js` — plain-JS field & resume-file validation, profile completion calculation
- `src/components/*` — reusable UI (JobCard, Filters, Modal, Pagination, StatusBadge, ApplicationTracker, ProtectedRoute, RoleRoute, StatCard, ProfileCompletion, EmptyState, Navbar)
- `src/pages/*` — route-level pages (public, applicant, recruiter)
- `src/App.jsx` — route tree with `ProtectedRoute` / `RoleRoute` guards
- `src/data/mockData.js` — seed data (only used the very first time localStorage is empty)

## Next backend phase (out of scope here)

Replace localStorage with a real API: auth provider, Express/MongoDB or similar, resume file storage, server-side authorization, email notifications.
