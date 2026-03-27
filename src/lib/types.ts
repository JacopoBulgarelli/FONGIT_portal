// ── Application Data Model ───────────────────────────────────────────────────
// This mirrors every field collected in the F6S form, structured for our DB.

export type ApplicationStatus =
  | "applied"
  | "phone_call"
  | "screening_meeting"
  | "ii_1" | "ii_2" | "ii_3"
  | "is_1" | "is_2" | "is_3"
  | "full_support"
  | "graduated"
  | "exited"
  | "rejected";

export type ProgramType = "Tech" | "Life Sciences" | "";
export type Stage = "Idea" | "Prototype" | "Users" | "Paying Users";
export type CustomerType = "B2B" | "B2C" | "B2G" | "Marketplace" | "Licensing";
export type ProductChannel = "Desktop" | "Mobile" | "Server Software" | "Hardware" | "API" | "Wearable" | "iOS";
export type SupportType =
  | "Incubator Hosting"
  | "Accounting & Admin"
  | "Coaching"
  | "Project Initiation"
  | "Access to Financing"
  | "Innovation Community";
export type ResearchOrg = "UNIGE" | "HUG" | "EPFL" | "HESSO" | "Campus Biotech" | "CERN" | "Other" | "None";
export type GenevaStatus =
  | "Based in Geneva"
  | "Based near Geneva"
  | "Willing to relocate to Geneva"
  | "I have a valid Swiss work permit";

// ── Company ──
export interface CompanyInfo {
  name: string;
  website: string;
  shortDescription: string;
  location: string;
  foundedDate: string; // YYYY-MM
  stage: Stage | "";
  revenueLast30d: string;
  revenueLast12m: string;
  detailedDescription: string;
  differentiation: string;
  isIncorporated: "Yes" | "No" | "In Progress" | "";
  customerTypes: CustomerType[];
  productChannels: ProductChannel[];
  markets: string;
}

// ── Team ──
export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  description: string;
  skills: string;
  amazingBuild: string;
  linkedin: string;
  phone: string;
}

// ── Project ──
export interface ProjectInfo {
  problemStatement: string;
  differentiation: string;
  statusAchievements: string;
  raisingMoney: "Yes, actively" | "Planning to soon" | "Not yet" | "Bootstrapping" | "";
  totalRaised: string;
  runwayMonths: string;
  investors: string;
}

// ── Market & IP ──
export interface MarketIPInfo {
  intellectualProperty: string;
  priorSupport: string;
  researchOrgs: ResearchOrg[];
}

// ── FONGIT Fit ──
export interface FongitFitInfo {
  genevaStatus: GenevaStatus[];
  permitDetails: string;
  howCanFongitHelp: string;
  supportSeeking: SupportType[];
  referralSource: string;
  backupEmail: string;
}

// ── Documents ──
export interface DocumentsInfo {
  pitchDeckUrl: string | null;
  additionalDocsUrl: string | null;
  productVideoUrl: string;
  teamVideoUrl: string;
}

// ── AI Summary ──
export interface AISummary {
  overview: string;
  strengths: string[];
  risks: string[];
  recommendedAction: string;
  generatedAt: string; // ISO date
}

// ── Score Breakdown ──
export interface ScoreBreakdown {
  team: number;        // 0-100, weight 25%
  project: number;     // 0-100, weight 25%
  genevaFit: number;   // 0-100, weight 20%
  marketIP: number;    // 0-100, weight 15%
  completeness: number; // 0-100, weight 15%
}

// ── Full Application ──
export interface Application {
  id: string;
  company: CompanyInfo;
  team: TeamMember[];
  project: ProjectInfo;
  marketIP: MarketIPInfo;
  fongitFit: FongitFitInfo;
  documents: DocumentsInfo;
  // Admin fields
  status: ApplicationStatus;
  score: number | null;
  scoreBreakdown: ScoreBreakdown | null;
  aiSummary: AISummary | null;
  internalNotes: string;
  assignedLeadCoach: string;
  programType: ProgramType;
  stageTransitionDates: Partial<Record<ApplicationStatus, string>>;
  submittedAt: string; // ISO date
  updatedAt: string;
}

// ── Step Config ──
export interface StepConfig {
  id: string;
  label: string;
  icon: string;
}
