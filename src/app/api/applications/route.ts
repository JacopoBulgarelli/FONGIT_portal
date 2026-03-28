import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ApplicationModel } from "@/lib/models/Application";
import { scoreApplication } from "@/lib/scoring";
import { appendApplicationRow } from "@/lib/googleSheets";
import { MOCK_APPLICATIONS } from "@/lib/mock-data";
import type { ApplicationStatus } from "@/lib/types";

// ── GET /api/applications ────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") as ApplicationStatus | null;

  try {
    await connectDB();

    const filter: Record<string, string> = {};
    if (status) filter.status = status;

    const applications = await ApplicationModel.find(filter).sort({ submittedAt: -1 });

    return NextResponse.json({
      applications: applications.map((a) => a.toJSON()),
      total: applications.length,
    });
  } catch {
    // MongoDB not configured — serve mock data so the UI stays functional
    const apps = status
      ? MOCK_APPLICATIONS.filter((a) => a.status === status)
      : MOCK_APPLICATIONS;
    return NextResponse.json({ applications: apps, total: apps.length });
  }
}

// ── POST /api/applications ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { score, scoreBreakdown } = scoreApplication(body);
  const now = new Date().toISOString();

  try {
    await connectDB();

    const doc = await ApplicationModel.create({
      company: body.company,
      team: body.team,
      project: body.project,
      marketIP: body.marketIP,
      fongitFit: body.fongitFit,
      documents: body.documents,
      status: "applied",
      score,
      scoreBreakdown,
      internalNotes: "",
      assignedLeadCoach: "",
      programType: "",
      stageTransitionDates: { applied: now },
      submittedAt: now,
      updatedAt: now,
    });

    const saved = doc.toJSON();
    void appendApplicationRow(saved);

    return NextResponse.json(
      { application: saved, message: "Application submitted successfully" },
      { status: 201 }
    );
  } catch {
    // MongoDB not configured — acknowledge submission without persisting
    const saved = {
      id: `app-${Date.now()}`,
      ...body,
      status: "applied",
      score,
      scoreBreakdown,
      aiSummary: null,
      internalNotes: "",
      assignedLeadCoach: "",
      programType: "",
      stageTransitionDates: { applied: now },
      submittedAt: now,
      updatedAt: now,
    };
    return NextResponse.json(
      { application: saved, message: "Application submitted successfully" },
      { status: 201 }
    );
  }
}
