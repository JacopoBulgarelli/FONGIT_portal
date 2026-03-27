import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { ApplicationModel } from "@/lib/models/Application";
import { updateApplicationRow } from "@/lib/googleSheets";
import type { Application } from "@/lib/types";

// ── GET /api/applications/[id] ───────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const doc = await ApplicationModel.findById(id);
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ application: doc.toJSON() });
}

// ── PATCH /api/applications/[id] ─────────────────────────────────────────────
// Update status, score, internalNotes, or any admin-editable field.

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await request.json();

  // Only allow updating admin-safe fields
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

  // Fire-and-forget — Sheets failures must not block the response
  void updateApplicationRow(updated);

  return NextResponse.json({ application: updated });
}
