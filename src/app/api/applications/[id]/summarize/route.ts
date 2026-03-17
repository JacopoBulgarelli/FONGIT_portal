import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { connectDB } from "@/lib/mongodb";
import { ApplicationModel } from "@/lib/models/Application";
import type { Application } from "@/lib/types";

// ── Structured output schema ──────────────────────────────────────────────────

const SummarySchema = z.object({
  overview: z
    .string()
    .describe("2-3 sentence overview of the startup — what they do, where they are, and why it matters."),
  strengths: z
    .array(z.string())
    .describe("3-5 key strengths of this application. Be specific and concise — one strength per item."),
  risks: z
    .array(z.string())
    .describe("2-4 key risks or concerns. Be honest and specific — one risk per item."),
  recommendedAction: z
    .string()
    .describe(
      "A single, direct recommended action for the FONGIT team: 'Accept', 'Invite to interview', 'Request more information', or 'Decline' — followed by a one-sentence justification."
    ),
});

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(app: Application): string {
  const lead = app.team[0];
  const teamList = app.team
    .map((m) => `  - ${m.firstName} ${m.lastName} (${m.role || "Founder"})${m.linkedin ? " — LinkedIn: " + m.linkedin : ""}`)
    .join("\n");

  return `You are a senior investment analyst at FONGIT, a Geneva-based deep tech incubator. Review the following startup application and provide a structured summary for the internal team.

Be direct, specific, and honest. FONGIT supports high-impact startups in ICT, MedTech, CleanTech, BioTech, FinTech, and Deep Tech. Key criteria: strong founding team, clear problem/solution, Geneva connection, and genuine innovation.

---
COMPANY: ${app.company.name || "N/A"}
Website: ${app.company.website || "N/A"}
Location: ${app.company.location || "N/A"}
Stage: ${app.company.stage || "N/A"}
Incorporated: ${app.company.isIncorporated || "N/A"}
Founded: ${app.company.foundedDate || "N/A"}
Markets: ${app.company.markets || "N/A"}
Customer types: ${app.company.customerTypes.join(", ") || "N/A"}

SHORT DESCRIPTION:
${app.company.shortDescription || "N/A"}

DETAILED DESCRIPTION:
${app.company.detailedDescription || "N/A"}

DIFFERENTIATION:
${app.company.differentiation || "N/A"}

Revenue (last month): ${app.company.revenueLast30d || "N/A"}
Revenue (last 12m): ${app.company.revenueLast12m || "N/A"}

---
LEAD FOUNDER: ${lead ? `${lead.firstName} ${lead.lastName} — ${lead.role || "Founder"}` : "N/A"}
${lead?.email ? `Email: ${lead.email}` : ""}

TEAM (${app.team.length} member${app.team.length === 1 ? "" : "s"}):
${teamList || "N/A"}

${lead?.description ? `LEAD FOUNDER BIO:\n${lead.description}\n` : ""}
${lead?.skills ? `SKILLS: ${lead.skills}\n` : ""}
${lead?.amazingBuild ? `ACHIEVEMENT: ${lead.amazingBuild}\n` : ""}

---
PROBLEM BEING SOLVED:
${app.project.problemStatement || "N/A"}

SOLUTION & DIFFERENTIATION:
${app.project.differentiation || "N/A"}

STATUS & ACHIEVEMENTS:
${app.project.statusAchievements || "N/A"}

Raising money: ${app.project.raisingMoney || "N/A"}
Total raised: ${app.project.totalRaised || "N/A"}
Runway: ${app.project.runwayMonths ? app.project.runwayMonths + " months" : "N/A"}
Investors: ${app.project.investors || "None listed"}

---
INTELLECTUAL PROPERTY:
${app.marketIP.intellectualProperty || "N/A"}

PRIOR SUPPORT:
${app.marketIP.priorSupport || "N/A"}

RESEARCH ORG CONNECTIONS: ${app.marketIP.researchOrgs.filter((o) => o !== "None").join(", ") || "None"}

---
GENEVA STATUS: ${app.fongitFit.genevaStatus.join(", ") || "Not specified"}
PERMIT DETAILS: ${app.fongitFit.permitDetails || "N/A"}
HOW FONGIT CAN HELP: ${app.fongitFit.howCanFongitHelp || "N/A"}
SUPPORT SOUGHT: ${app.fongitFit.supportSeeking.join(", ") || "N/A"}
REFERRAL: ${app.fongitFit.referralSource || "N/A"}

AUTOMATED SCORE: ${app.score !== null ? `${app.score}/100` : "Not scored"}
---`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Guard: API key required
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI features are not configured. Set ANTHROPIC_API_KEY in .env.local." },
      { status: 503 }
    );
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const doc = await ApplicationModel.findById(id);
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const app = doc.toJSON() as Application;
  const client = new Anthropic();

  // Use streaming + finalMessage() to avoid timeout on long inputs,
  // then parse the structured output via the Zod schema.
  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: buildPrompt(app) }],
    output_config: {
      format: zodOutputFormat(SummarySchema),
    },
  });

  const response = await stream.finalMessage();

  // Extract the JSON text block
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
  }

  const parsed = SummarySchema.parse(JSON.parse(textBlock.text));

  const aiSummary = {
    ...parsed,
    generatedAt: new Date().toISOString(),
  };

  // Persist to the application document
  const updated = await ApplicationModel.findByIdAndUpdate(
    id,
    { aiSummary, updatedAt: new Date().toISOString() },
    { new: true }
  );

  return NextResponse.json({ aiSummary: updated!.toJSON().aiSummary });
}
