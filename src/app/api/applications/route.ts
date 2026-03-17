import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ApplicationModel } from "@/lib/models/Application";
import { scoreApplication } from "@/lib/scoring";
import { appendApplicationRow } from "@/lib/googleSheets";

// ── GET /api/applications ────────────────────────────────────────────────────
// Returns all applications. Supports ?status=new|review|accepted|rejected.

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  const filter: Record<string, string> = {};
  if (status && ["new", "review", "accepted", "rejected"].includes(status)) {
    filter.status = status;
  }

  const applications = await ApplicationModel.find(filter).sort({ submittedAt: -1 });

  return NextResponse.json({
    applications: applications.map((a) => a.toJSON()),
    total: applications.length,
  });
}

// ── POST /api/applications ───────────────────────────────────────────────────
// Creates a new application and saves it to MongoDB.

export async function POST(request: NextRequest) {
  await connectDB();

  const body = await request.json();

  const { score, scoreBreakdown } = scoreApplication(body);

  const doc = await ApplicationModel.create({
    company: body.company,
    team: body.team,
    project: body.project,
    marketIP: body.marketIP,
    fongitFit: body.fongitFit,
    documents: body.documents,
    status: "new",
    score,
    scoreBreakdown,
    internalNotes: "",
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const saved = doc.toJSON();

  // Fire-and-forget — Sheets failures must not block the response
  void appendApplicationRow(saved);

  return NextResponse.json(
    { application: saved, message: "Application submitted successfully" },
    { status: 201 }
  );
}
