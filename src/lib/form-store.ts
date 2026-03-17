"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CompanyInfo,
  TeamMember,
  ProjectInfo,
  MarketIPInfo,
  FongitFitInfo,
  DocumentsInfo,
} from "./types";

// ── Default values ────────────────────────────────────────────────────────────

const DEFAULT_COMPANY: CompanyInfo = {
  name: "",
  website: "",
  shortDescription: "",
  location: "",
  foundedDate: "",
  stage: "",
  revenueLast30d: "",
  revenueLast12m: "",
  detailedDescription: "",
  differentiation: "",
  isIncorporated: "",
  customerTypes: [],
  productChannels: [],
  markets: "",
};

const DEFAULT_TEAM_MEMBER = (): TeamMember => ({
  id: crypto.randomUUID(),
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  description: "",
  skills: "",
  amazingBuild: "",
  linkedin: "",
  phone: "",
});

const DEFAULT_PROJECT: ProjectInfo = {
  problemStatement: "",
  differentiation: "",
  statusAchievements: "",
  raisingMoney: "",
  totalRaised: "",
  runwayMonths: "",
  investors: "",
};

const DEFAULT_MARKET_IP: MarketIPInfo = {
  intellectualProperty: "",
  priorSupport: "",
  researchOrgs: [],
};

const DEFAULT_FONGIT_FIT: FongitFitInfo = {
  genevaStatus: [],
  permitDetails: "",
  howCanFongitHelp: "",
  supportSeeking: [],
  referralSource: "",
  backupEmail: "",
};

const DEFAULT_DOCUMENTS: DocumentsInfo = {
  pitchDeckUrl: null,
  additionalDocsUrl: null,
  productVideoUrl: "",
  teamVideoUrl: "",
};

// ── Store interface ───────────────────────────────────────────────────────────

interface ApplicationStore {
  company: CompanyInfo;
  team: TeamMember[];
  project: ProjectInfo;
  marketIP: MarketIPInfo;
  fongitFit: FongitFitInfo;
  documents: DocumentsInfo;

  setCompany: (patch: Partial<CompanyInfo>) => void;
  setTeamMember: (index: number, patch: Partial<TeamMember>) => void;
  addTeamMember: () => void;
  removeTeamMember: (index: number) => void;
  setProject: (patch: Partial<ProjectInfo>) => void;
  setMarketIP: (patch: Partial<MarketIPInfo>) => void;
  setFongitFit: (patch: Partial<FongitFitInfo>) => void;
  setDocuments: (patch: Partial<DocumentsInfo>) => void;
  reset: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set) => ({
      company: DEFAULT_COMPANY,
      team: [DEFAULT_TEAM_MEMBER()],
      project: DEFAULT_PROJECT,
      marketIP: DEFAULT_MARKET_IP,
      fongitFit: DEFAULT_FONGIT_FIT,
      documents: DEFAULT_DOCUMENTS,

      setCompany: (patch) =>
        set((s) => ({ company: { ...s.company, ...patch } })),

      setTeamMember: (index, patch) =>
        set((s) => {
          const team = [...s.team];
          team[index] = { ...team[index], ...patch };
          return { team };
        }),

      addTeamMember: () =>
        set((s) => ({ team: [...s.team, DEFAULT_TEAM_MEMBER()] })),

      removeTeamMember: (index) =>
        set((s) => ({ team: s.team.filter((_, i) => i !== index) })),

      setProject: (patch) =>
        set((s) => ({ project: { ...s.project, ...patch } })),

      setMarketIP: (patch) =>
        set((s) => ({ marketIP: { ...s.marketIP, ...patch } })),

      setFongitFit: (patch) =>
        set((s) => ({ fongitFit: { ...s.fongitFit, ...patch } })),

      setDocuments: (patch) =>
        set((s) => ({ documents: { ...s.documents, ...patch } })),

      reset: () =>
        set({
          company: DEFAULT_COMPANY,
          team: [DEFAULT_TEAM_MEMBER()],
          project: DEFAULT_PROJECT,
          marketIP: DEFAULT_MARKET_IP,
          fongitFit: DEFAULT_FONGIT_FIT,
          documents: DEFAULT_DOCUMENTS,
        }),
    }),
    { name: "fongit-application-draft" }
  )
);
