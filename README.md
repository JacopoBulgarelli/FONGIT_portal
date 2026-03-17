# FONGIT Application Portal

Custom startup application portal for FONGIT — replacing the F6S-based workflow with a branded, data-owning solution.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page (Welcome / Apply)
│   ├── layout.tsx                # Root layout with metadata
│   ├── globals.css               # Tailwind + custom styles
│   ├── apply/
│   │   └── page.tsx              # Multi-step application form
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard (list + filter)
│   │   └── [id]/
│   │       └── page.tsx          # Application detail + review
│   └── api/
│       └── applications/
│           └── route.ts          # REST API (stub, ready for DB)
├── components/
│   ├── ui/                       # Shared UI components
│   │   ├── Input.tsx
│   │   ├── SelectButtons.tsx
│   │   ├── FileUpload.tsx
│   │   ├── FongitLogo.tsx
│   │   ├── StepHeader.tsx
│   │   ├── StatusBadge.tsx
│   │   └── index.ts
│   └── steps/                    # Application form step components
│       ├── StepCompany.tsx
│       ├── StepTeam.tsx
│       ├── StepProject.tsx
│       ├── StepMarketIP.tsx
│       ├── StepFongitFit.tsx
│       ├── StepDocuments.tsx
│       ├── StepReview.tsx
│       └── index.ts
└── lib/
    ├── types.ts                  # TypeScript types (full data model)
    ├── constants.ts              # Steps config, status config, options
    └── mock-data.ts              # Mock applications for development
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with apply buttons |
| `/apply` | Multi-step application form |
| `/admin` | Admin dashboard with application table |
| `/admin/[id]` | Application detail and review |
| `/api/applications` | REST API endpoint (GET, POST) |

## Next Steps (Production)

1. **Database**: Connect Supabase (PostgreSQL) or MongoDB Atlas
2. **Auth**: Add NextAuth or Supabase Auth for applicant + admin login
3. **File uploads**: Integrate Supabase Storage or S3 for pitch decks
4. **Google Sheets sync**: Wire up Sheets API v4 for auto-sync
5. **Form state**: Add proper form state management (React Hook Form or Zustand)
6. **Validation**: Add Zod schemas for form + API validation
7. **Email**: Set up confirmation emails (Resend or SendGrid)
8. **Deploy**: Push to Vercel for auto-deploy

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with FONGIT brand colors
- **Icons**: Lucide React
