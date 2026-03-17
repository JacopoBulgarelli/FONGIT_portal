import type {
  CompanyInfo,
  TeamMember,
  ProjectInfo,
  MarketIPInfo,
  FongitFitInfo,
  DocumentsInfo,
  ScoreBreakdown,
  Stage,
} from "./types";

// ── Weights ──────────────────────────────────────────────────────────────────

const WEIGHTS = {
  team: 0.25,
  project: 0.25,
  genevaFit: 0.20,
  marketIP: 0.15,
  completeness: 0.15,
} as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

function filled(val: string | null | undefined): boolean {
  return !!val && val.trim().length > 0;
}

function clamp(n: number): number {
  return Math.round(Math.max(0, Math.min(100, n)));
}

// ── Category scorers ─────────────────────────────────────────────────────────

function scoreTeam(team: TeamMember[]): number {
  if (team.length === 0) return 0;

  // Base: more founders = stronger signal (up to 30 pts)
  const countScore = Math.min(team.length * 15, 30);

  // Per-member quality (average across team, up to 70 pts)
  const memberScores = team.map((m) => {
    let s = 0;
    if (filled(m.firstName) && filled(m.lastName)) s += 10;
    if (filled(m.email)) s += 10;
    if (filled(m.role)) s += 10;
    if (filled(m.description)) s += 20;
    if (filled(m.skills)) s += 15;
    if (filled(m.linkedin)) s += 20;
    if (filled(m.amazingBuild)) s += 15;
    return s;
  });
  const avgMember = memberScores.reduce((a, b) => a + b, 0) / memberScores.length;
  const qualityScore = avgMember * 0.7;

  return clamp(countScore + qualityScore);
}

function scoreProject(company: CompanyInfo, project: ProjectInfo): number {
  let s = 0;

  // Stage (up to 40 pts)
  const stageMap: Record<Stage, number> = {
    Idea: 10,
    Prototype: 40,
    Users: 70,
    "Paying Users": 100,
  };
  if (company.stage && company.stage in stageMap) {
    s += stageMap[company.stage as Stage] * 0.4;
  }

  // Revenue signals (up to 20 pts)
  if (filled(project.totalRaised) && project.totalRaised !== "CHF 0" && project.totalRaised !== "0") {
    s += 10;
  }
  if (filled(company.revenueLast12m) && company.revenueLast12m !== "CHF 0" && company.revenueLast12m !== "0") {
    s += 10;
  }

  // Problem & differentiation filled (up to 25 pts)
  if (filled(project.problemStatement)) s += 15;
  if (filled(project.differentiation)) s += 10;

  // Achievements (up to 15 pts)
  if (filled(project.statusAchievements)) s += 15;

  return clamp(s);
}

function scoreGenevaFit(fongitFit: FongitFitInfo): number {
  const statuses = fongitFit.genevaStatus;
  if (statuses.length === 0) return 0;

  let best = 0;
  if (statuses.includes("Based in Geneva")) best = 100;
  else if (statuses.includes("Based near Geneva")) best = 75;
  else if (statuses.includes("Willing to relocate to Geneva")) best = 45;

  // Swiss work permit is a bonus
  if (statuses.includes("I have a valid Swiss work permit")) {
    best = Math.min(100, best + 20);
  }

  // Bonus for explaining how FONGIT can help
  if (filled(fongitFit.howCanFongitHelp)) best = Math.min(100, best + 5);

  return clamp(best);
}

function scoreMarketIP(marketIP: MarketIPInfo): number {
  let s = 0;

  // IP described (up to 40 pts)
  if (filled(marketIP.intellectualProperty)) {
    const len = marketIP.intellectualProperty.trim().length;
    s += len > 100 ? 40 : len > 30 ? 25 : 15;
  }

  // Prior support described (up to 20 pts)
  if (filled(marketIP.priorSupport)) s += 20;

  // Research org connections (up to 40 pts)
  const orgs = marketIP.researchOrgs.filter((o) => o !== "None");
  if (orgs.length > 0) {
    s += Math.min(orgs.length * 15, 40);
  }

  return clamp(s);
}

function scoreCompleteness(
  company: CompanyInfo,
  team: TeamMember[],
  project: ProjectInfo,
  marketIP: MarketIPInfo,
  fongitFit: FongitFitInfo,
  documents: DocumentsInfo
): number {
  const fields: boolean[] = [
    // Company (14 fields)
    filled(company.name),
    filled(company.website),
    filled(company.shortDescription),
    filled(company.location),
    filled(company.foundedDate),
    filled(company.stage),
    filled(company.revenueLast30d),
    filled(company.revenueLast12m),
    filled(company.detailedDescription),
    filled(company.differentiation),
    filled(company.isIncorporated),
    company.customerTypes.length > 0,
    company.productChannels.length > 0,
    filled(company.markets),
    // Team — at least lead founder has name + email
    team.length > 0 && filled(team[0]?.firstName),
    team.length > 0 && filled(team[0]?.lastName),
    team.length > 0 && filled(team[0]?.email),
    // Project
    filled(project.problemStatement),
    filled(project.differentiation),
    filled(project.statusAchievements),
    filled(project.raisingMoney),
    // Market & IP
    filled(marketIP.intellectualProperty),
    marketIP.researchOrgs.length > 0,
    // FONGIT Fit
    fongitFit.genevaStatus.length > 0,
    filled(fongitFit.howCanFongitHelp),
    fongitFit.supportSeeking.length > 0,
    filled(fongitFit.backupEmail),
    // Documents
    filled(documents.productVideoUrl),
  ];

  const filledCount = fields.filter(Boolean).length;
  return clamp((filledCount / fields.length) * 100);
}

// ── Main scoring function ────────────────────────────────────────────────────

export interface ScoringResult {
  score: number;
  scoreBreakdown: ScoreBreakdown;
}

export function scoreApplication(app: {
  company: CompanyInfo;
  team: TeamMember[];
  project: ProjectInfo;
  marketIP: MarketIPInfo;
  fongitFit: FongitFitInfo;
  documents: DocumentsInfo;
}): ScoringResult {
  const breakdown: ScoreBreakdown = {
    team: scoreTeam(app.team),
    project: scoreProject(app.company, app.project),
    genevaFit: scoreGenevaFit(app.fongitFit),
    marketIP: scoreMarketIP(app.marketIP),
    completeness: scoreCompleteness(
      app.company,
      app.team,
      app.project,
      app.marketIP,
      app.fongitFit,
      app.documents
    ),
  };

  const composite =
    breakdown.team * WEIGHTS.team +
    breakdown.project * WEIGHTS.project +
    breakdown.genevaFit * WEIGHTS.genevaFit +
    breakdown.marketIP * WEIGHTS.marketIP +
    breakdown.completeness * WEIGHTS.completeness;

  return {
    score: Math.round(composite),
    scoreBreakdown: breakdown,
  };
}
