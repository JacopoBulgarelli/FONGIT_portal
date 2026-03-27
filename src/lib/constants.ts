import type { StepConfig, ApplicationStatus } from "./types";

export const APPLICATION_STEPS: StepConfig[] = [
  { id: "company", label: "Company", icon: "01" },
  { id: "team", label: "Team", icon: "02" },
  { id: "project", label: "Project", icon: "03" },
  { id: "market", label: "Market & IP", icon: "04" },
  { id: "support", label: "FONGIT Fit", icon: "05" },
  { id: "documents", label: "Documents", icon: "06" },
  { id: "review", label: "Review", icon: "✓" },
];

// ── Pipeline stages in order ──────────────────────────────────────────────────

export const PIPELINE_STAGES: ApplicationStatus[] = [
  "applied",
  "phone_call",
  "screening_meeting",
  "ii_1", "ii_2", "ii_3",
  "is_1", "is_2", "is_3",
  "full_support",
  "graduated",
  "exited",
  "rejected",
];

// Stages that are "active" (startup is in the program)
export const ACTIVE_STATUSES: ApplicationStatus[] = [
  "ii_1", "ii_2", "ii_3",
  "is_1", "is_2", "is_3",
  "full_support",
];

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; shortLabel: string; color: string; bg: string; group: string }
> = {
  applied:            { label: "Applied",             shortLabel: "Applied",    color: "text-blue-600",   bg: "bg-blue-50",   group: "pipeline" },
  phone_call:         { label: "Phone Call",          shortLabel: "Phone",      color: "text-blue-600",   bg: "bg-blue-50",   group: "pipeline" },
  screening_meeting:  { label: "Screening Meeting",   shortLabel: "Screening",  color: "text-purple-600", bg: "bg-purple-50", group: "pipeline" },
  ii_1:               { label: "Innovation Init. I",  shortLabel: "II-1",       color: "text-fongit-navy",bg: "bg-indigo-50", group: "innovation" },
  ii_2:               { label: "Innovation Init. II", shortLabel: "II-2",       color: "text-fongit-navy",bg: "bg-indigo-50", group: "innovation" },
  ii_3:               { label: "Innovation Init. III",shortLabel: "II-3",       color: "text-fongit-navy",bg: "bg-indigo-50", group: "innovation" },
  is_1:               { label: "Initial Support I",   shortLabel: "IS-1",       color: "text-fongit-navy",bg: "bg-violet-50", group: "support" },
  is_2:               { label: "Initial Support II",  shortLabel: "IS-2",       color: "text-fongit-navy",bg: "bg-violet-50", group: "support" },
  is_3:               { label: "Initial Support III", shortLabel: "IS-3",       color: "text-fongit-navy",bg: "bg-violet-50", group: "support" },
  full_support:       { label: "Full Support",        shortLabel: "Full",       color: "text-green-700",  bg: "bg-green-50",  group: "support" },
  graduated:          { label: "Graduated",           shortLabel: "Graduated",  color: "text-green-700",  bg: "bg-green-50",  group: "outcome" },
  exited:             { label: "Exited",              shortLabel: "Exited",     color: "text-gray-600",   bg: "bg-gray-100",  group: "outcome" },
  rejected:           { label: "Rejected",            shortLabel: "Rejected",   color: "text-red-600",    bg: "bg-red-50",    group: "outcome" },
};

export const STAGE_OPTIONS = ["Idea", "Prototype", "Users", "Paying Users"] as const;
export const CUSTOMER_OPTIONS = ["B2B", "B2C", "B2G", "Marketplace", "Licensing"] as const;
export const CHANNEL_OPTIONS = ["Desktop", "Mobile", "Server Software", "Hardware", "API", "Wearable", "iOS"] as const;
export const INCORPORATED_OPTIONS = ["Yes", "No", "In Progress"] as const;
export const RAISING_OPTIONS = ["Yes, actively", "Planning to soon", "Not yet", "Bootstrapping"] as const;
export const RESEARCH_ORGS = ["UNIGE", "HUG", "EPFL", "HESSO", "Campus Biotech", "CERN", "Other", "None"] as const;
export const GENEVA_OPTIONS = [
  "Based in Geneva",
  "Based near Geneva",
  "Willing to relocate to Geneva",
  "I have a valid Swiss work permit",
] as const;
export const SUPPORT_OPTIONS = [
  "Incubator Hosting",
  "Accounting & Admin",
  "Coaching",
  "Project Initiation",
  "Access to Financing",
  "Innovation Community",
] as const;
