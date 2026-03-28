import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { ApplicationModel } from "@/lib/models/Application";
import { updateApplicationRow } from "@/lib/googleSheets";
import { MOCK_APPLICATIONS } from "@/lib/mock-data";
import type { Application } from "@/lib/types";

// ── GET /api/applications/[id] ───────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const doc = await ApplicationModel.findById(id);
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ application: doc.toJSON() });
  } catch {
    // MongoDB not configured — look up in mock data
    const app = MOCK_APPLICATIONS.find((a) => a.id === id);
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ application: app });
  }
}

// ── PATCH /api/applications/[id] ─────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const allowed: Record<string, unknown> = {};
    for (const key of [
      "status", "score", "internalNotes",
      "assignedLeadCoach", "programType", "stageTransitionDates",
    ] as const) {
      if (key in body) allowed[key] = body[key];
    }
    allowed.updatedAt = new Date().toISOString();

    const doc = await ApplicationModel.findByIdAndUpdate(id, allowed, { new: true });
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = doc.toJSON() as Application;
    void updateApplicationRow(updated);

    return NextResponse.json({ application: updated });
  } catch {
    // MongoDB not configured — return optimistic update over mock app (won't persist)
    const app = MOCK_APPLICATIONS.find((a) => a.id === id);
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ application: { ...app, ...body, updatedAt: new Date().toISOString() } });
  }
}
