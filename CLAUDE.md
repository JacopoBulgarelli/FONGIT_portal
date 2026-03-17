# FONGIT Application Portal — Project Context

## What This Project Is

This is a custom startup application portal for **FONGIT** (Fondation Genevoise pour l'Innovation Technologique), a Geneva-based innovation incubator that has supported 250+ startups over 35 years. FONGIT currently uses **F6S** (a third-party platform) to collect startup applications. The goal of this project is to replace F6S with a fully owned, branded portal that gives FONGIT control over their data pipeline.

This project is being built as part of a job opportunity. The Managing Director (Antonio Gambardella) asked for a prototype exploring whether FONGIT could replace F6S with a clean custom interface. The prototype was built and demoed successfully. Now we are moving from prototype to production.

## Current State

The project is a **Next.js 14** app (App Router, TypeScript, Tailwind CSS) scaffolded with proper component architecture. Here is what exists and works:

### What's built (frontend only, no backend wired):
- **Landing page** (`/`) — welcome page with "Apply as Company" and "Solo Founder" entry points
- **Multi-step application form** (`/apply`) — 7-step wizard with fixed navy sidebar navigation. Steps: Company, Team, Project, Market & IP, FONGIT Fit, Documents, Review
- **Admin dashboard** (`/admin`) — application list with status filtering (New, Under Review, Accepted, Declined), stats row, and sortable table
- **Application detail view** (`/admin/[id]`) — full application review with sections, scoring, internal notes, action buttons (Accept, Decline, etc.), and Google Sheets sync indicator
- **Shared UI components** — Input, SelectButtons (pill toggles), FileUpload, FongitLogo, StepHeader, StatusBadge
- **Full TypeScript data model** (`lib/types.ts`) — mirrors every field collected in the F6S form
- **Mock data** (`lib/mock-data.ts`) — 7 realistic startup applications with full detail
- **API route stub** (`/api/applications`) — GET and POST endpoints with TODO markers

### What's NOT built yet:
- No form state management — the form components render but don't collect/persist data
- No database connection — everything uses mock data
- No authentication — no login for applicants or admin
- No file upload backend — the FileUpload component is UI only
- No Google Sheets sync — the button exists but doesn't do anything
- No email notifications
- No form validation

## Architecture Decisions Already Made

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom FONGIT brand colors defined in `tailwind.config.ts` (navy: #142850, navy-light: #1b3a6b)
- **Fonts**: DM Serif Display (headings) + DM Sans (body), loaded via Google Fonts in globals.css
- **Component pattern**: Barrel exports from `components/ui/index.ts` and `components/steps/index.ts`
- **Data model**: Fully typed in `lib/types.ts` — this should be the source of truth for database schema

## What Needs To Be Done (In Priority Order)

### Phase 1 — Make the form functional
1. **Form state management**: Add React Hook Form or Zustand (or both) so the multi-step form actually collects and persists data across steps. The form state should match the `Application` type in `lib/types.ts`.
2. **Form validation**: Add Zod schemas that validate each step. Required fields are marked in the components with `required` prop.
3. **Wire the Review step**: `StepReview.tsx` currently shows placeholder data. It should render a real summary of the entered form data.
4. **POST on submit**: When the user submits, POST the form data to `/api/applications`.

### Phase 2 — Backend & Database
5. **Database**: Connect Supabase (PostgreSQL) or MongoDB Atlas. Create tables/collections matching the types in `lib/types.ts`. The data model has: Application (main), with nested CompanyInfo, TeamMember[], ProjectInfo, MarketIPInfo, FongitFitInfo, DocumentsInfo.
6. **API routes**: Replace mock data in the GET endpoint with real database queries. Implement the POST endpoint to save applications. Add PATCH for status updates from admin.
7. **File uploads**: Integrate Supabase Storage or AWS S3 for pitch deck and document uploads. The FileUpload component needs to actually upload files and return URLs.
8. **Authentication**: Add NextAuth or Supabase Auth. Applicants authenticate via email link or Google/LinkedIn OAuth. Admin users authenticate via organizational accounts. Add middleware to protect `/admin` routes.

### Phase 3 — Google Sheets Sync
9. **Sheets API integration**: When a new application is submitted or a status changes, automatically write/update a row in a designated Google Sheet via Google Sheets API v4. The internal team currently uses Sheets for evaluation and tracking — this sync must preserve their workflow.

### Phase 4 — Automation & Intelligence (future)
10. **Email notifications**: Confirmation emails to applicants on submission. Status update emails. Internal alerts for new applications.
11. **Automated scoring**: Configurable scoring engine based on weighted criteria (team, stage, Geneva presence, sector, IP).
12. **AI-assisted review**: LLM summaries of applications, pitch deck analysis.
13. **Portfolio analytics dashboard**: Sector distribution, cohort analysis, outcome tracking.

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/lib/types.ts` | **Start here.** Full TypeScript data model for applications |
| `src/lib/constants.ts` | Step configs, status configs, all select option arrays |
| `src/lib/mock-data.ts` | 7 mock applications — use as reference for data shape |
| `src/app/apply/page.tsx` | The multi-step form orchestrator (step navigation, sidebar) |
| `src/components/steps/` | Individual form step components (one per section) |
| `src/components/ui/` | Shared UI components used across the app |
| `src/app/admin/page.tsx` | Admin dashboard with table and filtering |
| `src/app/admin/[id]/page.tsx` | Application detail and review page |
| `src/app/api/applications/route.ts` | API endpoint stub with TODO comments |
| `tailwind.config.ts` | FONGIT brand colors defined here |

## Style & Brand Guidelines

- **Primary color**: Navy blue (#142850) — used for sidebar, top bars, buttons, headings
- **Design feel**: Clean, professional, Swiss institutional. Not Silicon Valley flashy.
- **Sidebar**: Fixed position, navy background, white text with transparency layers
- **Admin top bar**: Navy background matching sidebar
- **Cards**: White background, subtle border, small shadow (`card` class in globals.css)
- **Buttons**: Defined as utility classes in globals.css (btn-primary, btn-secondary, btn-success, btn-danger-soft)
- **Typography**: DM Serif Display for display headings, DM Sans for everything else

## Context About FONGIT

- Non-profit foundation in Geneva, supported by the Canton of Geneva
- Supports deep tech and high-impact startups
- Provides coaching, legal support, admin, financing (up to CHF 150K per startup)
- Sectors: ICT, MedTech, CleanTech, BioTech, FinTech, Deep Tech
- Connected to UNIGE, HUG, EPFL, HESSO, Campus Biotech, CERN
- Applicants must be based in Geneva or willing to relocate
- The internal team uses Google Sheets for evaluation and tracking — this workflow must be preserved
