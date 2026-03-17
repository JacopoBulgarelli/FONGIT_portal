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

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string }
> = {
  new: { label: "New", color: "text-blue-600", bg: "bg-blue-50" },
  review: { label: "Under Review", color: "text-orange-600", bg: "bg-orange-50" },
  accepted: { label: "Accepted", color: "text-green-700", bg: "bg-green-50" },
  rejected: { label: "Declined", color: "text-red-600", bg: "bg-red-50" },
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
