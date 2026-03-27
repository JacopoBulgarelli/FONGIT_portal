import mongoose, { Schema, type Document } from "mongoose";
import type { Application } from "@/lib/types";

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const TeamMemberSchema = new Schema(
  {
    id: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    role: { type: String, default: "" },
    description: { type: String, default: "" },
    skills: { type: String, default: "" },
    amazingBuild: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const CompanyInfoSchema = new Schema(
  {
    name: { type: String, default: "" },
    website: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    location: { type: String, default: "" },
    foundedDate: { type: String, default: "" },
    stage: { type: String, default: "" },
    revenueLast30d: { type: String, default: "" },
    revenueLast12m: { type: String, default: "" },
    detailedDescription: { type: String, default: "" },
    differentiation: { type: String, default: "" },
    isIncorporated: { type: String, default: "" },
    customerTypes: { type: [String], default: [] },
    productChannels: { type: [String], default: [] },
    markets: { type: String, default: "" },
  },
  { _id: false }
);

const ProjectInfoSchema = new Schema(
  {
    problemStatement: { type: String, default: "" },
    differentiation: { type: String, default: "" },
    statusAchievements: { type: String, default: "" },
    raisingMoney: { type: String, default: "" },
    totalRaised: { type: String, default: "" },
    runwayMonths: { type: String, default: "" },
    investors: { type: String, default: "" },
  },
  { _id: false }
);

const MarketIPInfoSchema = new Schema(
  {
    intellectualProperty: { type: String, default: "" },
    priorSupport: { type: String, default: "" },
    researchOrgs: { type: [String], default: [] },
  },
  { _id: false }
);

const FongitFitInfoSchema = new Schema(
  {
    genevaStatus: { type: [String], default: [] },
    permitDetails: { type: String, default: "" },
    howCanFongitHelp: { type: String, default: "" },
    supportSeeking: { type: [String], default: [] },
    referralSource: { type: String, default: "" },
    backupEmail: { type: String, default: "" },
  },
  { _id: false }
);

const DocumentsInfoSchema = new Schema(
  {
    pitchDeckUrl: { type: String, default: null },
    additionalDocsUrl: { type: String, default: null },
    productVideoUrl: { type: String, default: "" },
    teamVideoUrl: { type: String, default: "" },
  },
  { _id: false }
);

// ── Main Application schema ──────────────────────────────────────────────────

const ApplicationSchema = new Schema(
  {
    company: { type: CompanyInfoSchema, required: true },
    team: { type: [TeamMemberSchema], default: [] },
    project: { type: ProjectInfoSchema, required: true },
    marketIP: { type: MarketIPInfoSchema, required: true },
    fongitFit: { type: FongitFitInfoSchema, required: true },
    documents: { type: DocumentsInfoSchema, required: true },
    status: {
      type: String,
      enum: [
        "applied", "phone_call", "screening_meeting",
        "ii_1", "ii_2", "ii_3",
        "is_1", "is_2", "is_3",
        "full_support", "graduated", "exited", "rejected",
      ],
      default: "applied",
    },
    assignedLeadCoach: { type: String, default: "" },
    programType: { type: String, enum: ["Tech", "Life Sciences", ""], default: "" },
    stageTransitionDates: { type: Map, of: String, default: {} },
    score: { type: Number, default: null },
    scoreBreakdown: {
      type: new Schema(
        {
          team: { type: Number, default: 0 },
          project: { type: Number, default: 0 },
          genevaFit: { type: Number, default: 0 },
          marketIP: { type: Number, default: 0 },
          completeness: { type: Number, default: 0 },
        },
        { _id: false }
      ),
      default: null,
    },
    aiSummary: {
      type: new Schema(
        {
          overview: { type: String, default: "" },
          strengths: { type: [String], default: [] },
          risks: { type: [String], default: [] },
          recommendedAction: { type: String, default: "" },
          generatedAt: { type: String, default: "" },
        },
        { _id: false }
      ),
      default: null,
    },
    internalNotes: { type: String, default: "" },
    submittedAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    toJSON: {
      // Map _id to id and remove __v for a cleaner API response
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export type ApplicationDocument = Document & Omit<Application, "id">;

export const ApplicationModel =
  mongoose.models.Application ??
  mongoose.model<ApplicationDocument>("Application", ApplicationSchema);
