"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FongitLogo, StatusBadge } from "@/components/ui";
import { STATUS_CONFIG, PIPELINE_STAGES } from "@/lib/constants";
import type { Application, ApplicationStatus, ScoreBreakdown, AISummary } from "@/lib/types";

// Visual groups for the pipeline indicator
const PIPELINE_GROUPS = [
  { label: "Intake",    stages: ["applied", "phone_call", "screening_meeting"] as ApplicationStatus[] },
  { label: "Innov. Init.", stages: ["ii_1", "ii_2", "ii_3"] as ApplicationStatus[] },
  { label: "Init. Support", stages: ["is_1", "is_2", "is_3"] as ApplicationStatus[] },
  { label: "Full Support", stages: ["full_support"] as ApplicationStatus[] },
  { label: "Outcome",  stages: ["graduated", "exited", "rejected"] as ApplicationStatus[] },
];

function PipelineIndicator({
  current,
  onAdvance,
  disabled,
}: {
  current: ApplicationStatus;
  onAdvance: (s: ApplicationStatus) => void;
  disabled: boolean;
}) {
  const currentIdx = PIPELINE_STAGES.indexOf(current);
  const isTerminal = ["graduated", "exited", "rejected"].includes(current);

  return (
    <div className="card px-6 py-5 mb-3">
      <div className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-4">
        Pipeline Stage
      </div>
      {/* Group headers */}
      <div className="flex gap-1 mb-1">
        {PIPELINE_GROUPS.map((g) => (
          <div
            key={g.label}
            style={{ flex: g.stages.length }}
            className="text-[10px] text-center text-gray-400 font-medium tracking-wide"
          >
            {g.label}
          </div>
        ))}
      </div>
      {/* Stage dots */}
      <div className="flex gap-1 items-center">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isPast    = idx < currentIdx;
          const isCurrent = stage === current;
          const isFuture  = idx > currentIdx;
          const cfg = STATUS_CONFIG[stage];
          return (
            <button
              key={stage}
              onClick={() => !disabled && !isCurrent && onAdvance(stage)}
              disabled={disabled || isCurrent}
              title={cfg.label}
              className={`flex-1 h-7 rounded-sm text-[10px] font-semibold transition-all duration-150
                ${isCurrent ? `${cfg.bg} ${cfg.color} ring-2 ring-offset-1 ring-current` : ""}
                ${isPast    ? "bg-fongit-navy/10 text-fongit-navy/60" : ""}
                ${isFuture  ? "bg-gray-100 text-gray-400 hover:bg-gray-200" : ""}
                ${disabled  ? "cursor-default" : isCurrent ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {cfg.shortLabel}
            </button>
          );
        })}
      </div>
      {!isTerminal && (
        <div className="text-[11px] text-gray-400 mt-2">
          Click any stage to move the startup there.
        </div>
      )}
    </div>
  );
}

const SCORE_CATEGORIES: { key: keyof ScoreBreakdown; label: string; weight: string }[] = [
  { key: "team", label: "Team Strength", weight: "25%" },
  { key: "project", label: "Project Maturity", weight: "25%" },
  { key: "genevaFit", label: "Geneva Fit", weight: "20%" },
  { key: "marketIP", label: "Market & IP", weight: "15%" },
  { key: "completeness", label: "Completeness", weight: "15%" },
];

function ScoreBreakdownBars({ breakdown }: { breakdown: ScoreBreakdown }) {
  return (
    <div className="space-y-3">
      {SCORE_CATEGORIES.map(({ key, label, weight }) => {
        const value = breakdown[key];
        const color =
          value >= 80
            ? "bg-green-500"
            : value >= 60
              ? "bg-orange-400"
              : value >= 30
                ? "bg-orange-300"
                : "bg-red-400";
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-medium text-gray-700">
                {label}
                <span className="text-gray-400 font-normal ml-1.5">({weight})</span>
              </span>
              <span
                className={`text-[13px] font-bold tabular-nums ${
                  value >= 80
                    ? "text-green-700"
                    : value >= 60
                      ? "text-orange-600"
                      : "text-red-600"
                }`}
              >
                {value}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AISummaryCard({
  id,
  summary,
  onSummaryGenerated,
}: {
  id: string;
  summary: AISummary | null;
  onSummaryGenerated: (s: AISummary) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [unconfigured, setUnconfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setGenerating(true);
    setError(null);
    const res = await fetch(`/api/applications/${id}/summarize`, { method: "POST" });
    if (res.status === 503) {
      setUnconfigured(true);
      setGenerating(false);
      return;
    }
    if (!res.ok) {
      setError("Failed to generate summary. Please try again.");
      setGenerating(false);
      return;
    }
    const data = await res.json();
    onSummaryGenerated(data.aiSummary);
    setGenerating(false);
  };

  return (
    <div className="card px-6 py-6 mb-3">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] font-bold tracking-widest uppercase text-gray-500">
          AI Summary
          <span className="ml-2 text-[10px] font-normal normal-case tracking-normal text-gray-400">
            claude-opus-4-6
          </span>
        </div>
        {!unconfigured && !summary && (
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-fongit-navy text-white text-[13px] font-medium rounded-md hover:bg-fongit-navy-light transition-colors disabled:opacity-50"
          >
            {generating ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              "✦ Generate AI Summary"
            )}
          </button>
        )}
        {summary && !generating && (
          <button
            onClick={generate}
            disabled={generating}
            className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            Regenerate
          </button>
        )}
      </div>

      {unconfigured && (
        <div className="text-[13px] text-gray-400 bg-gray-50 rounded-md px-4 py-3">
          AI features are not configured. Add <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">ANTHROPIC_API_KEY</code> to <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code> to enable this feature.
        </div>
      )}

      {error && (
        <div className="text-[13px] text-red-600 bg-red-50 rounded-md px-4 py-3">{error}</div>
      )}

      {generating && !summary && (
        <div className="space-y-2.5 animate-pulse">
          <div className="h-3.5 bg-gray-100 rounded w-full" />
          <div className="h-3.5 bg-gray-100 rounded w-5/6" />
          <div className="h-3.5 bg-gray-100 rounded w-4/6" />
        </div>
      )}

      {summary && (
        <div className="space-y-4">
          {/* Overview */}
          <p className="text-sm leading-relaxed text-gray-700">{summary.overview}</p>

          {/* Strengths */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-green-700 mb-2">
              Strengths
            </div>
            <ul className="space-y-1.5">
              {summary.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    ✓
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-600 mb-2">
              Risks
            </div>
            <ul className="space-y-1.5">
              {summary.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    !
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended action */}
          <div className="px-4 py-3 bg-fongit-navy/5 border border-fongit-navy/10 rounded-md">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-fongit-navy mb-1">
              Recommended Action
            </div>
            <p className="text-[13px] text-gray-800 font-medium">{summary.recommendedAction}</p>
          </div>

          <div className="text-[11px] text-gray-400">
            Generated {new Date(summary.generatedAt).toLocaleString("en-CH")}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [leadCoach, setLeadCoach] = useState("");
  const [programType, setProgramType] = useState<"Tech" | "Life Sciences" | "">("");

  const fetchApp = useCallback(async () => {
    const res = await fetch(`/api/applications/${id}`);
    if (res.ok) {
      const data = await res.json();
      setApp(data.application);
      setNotes(data.application.internalNotes ?? "");
      setAiSummary(data.application.aiSummary ?? null);
      setLeadCoach(data.application.assignedLeadCoach ?? "");
      setProgramType(data.application.programType ?? "");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchApp();
  }, [fetchApp]);

  const updateStatus = async (status: ApplicationStatus) => {
    setUpdating(true);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, internalNotes: notes }),
    });
    if (res.ok) {
      const data = await res.json();
      setApp(data.application);
    }
    setUpdating(false);
  };

  const advanceStage = async (status: ApplicationStatus) => {
    if (!app) return;
    setUpdating(true);
    const newDates = {
      ...(app.stageTransitionDates ?? {}),
      [status]: new Date().toISOString(),
    };
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, stageTransitionDates: newDates }),
    });
    if (res.ok) {
      const data = await res.json();
      setApp(data.application);
    }
    setUpdating(false);
  };

  const saveMetadata = async () => {
    setUpdating(true);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedLeadCoach: leadCoach, programType }),
    });
    if (res.ok) {
      const data = await res.json();
      setApp(data.application);
    }
    setUpdating(false);
  };

  const saveNotes = async () => {
    setUpdating(true);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internalNotes: notes }),
    });
    if (res.ok) {
      const data = await res.json();
      setApp(data.application);
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-gray-800 mb-2">
            Application not found
          </h1>
          <Link href="/admin" className="text-fongit-navy underline text-sm">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: "Problem Statement",
      content: app.project.problemStatement,
    },
    {
      title: "Solution & Differentiation",
      content: app.project.differentiation,
    },
    {
      title: "Traction & Status",
      content: app.project.statusAchievements,
    },
    {
      title: "Team",
      content: app.team?.length
        ? app.team
            .map((m) => `${m.firstName} ${m.lastName}${m.role ? ` (${m.role})` : ""}${m.description ? ` — ${m.description}` : ""}`)
            .join("\n")
        : "",
    },
    {
      title: "IP & Research Links",
      content: [
        app.marketIP?.intellectualProperty,
        app.marketIP?.researchOrgs?.length
          ? `Connected with: ${app.marketIP.researchOrgs.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      title: "FONGIT Fit",
      content: [
        app.fongitFit?.genevaStatus?.join(", "),
        app.fongitFit?.supportSeeking?.length ? `Seeking: ${app.fongitFit.supportSeeking.join(", ")}` : "",
        app.project?.runwayMonths ? `Runway: ${app.project.runwayMonths} months` : "",
        app.fongitFit?.howCanFongitHelp,
      ]
        .filter(Boolean)
        .join(". ")
        .replace(/\.\./g, "."),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── Navy Top Bar ── */}
      <header className="bg-fongit-navy px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FongitLogo size={24} variant="light" />
          <span className="text-[13px] text-white/50 border-l border-white/15 pl-4">
            Application Review
          </span>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 text-[13px] font-medium text-white/70 bg-white/[0.08] border border-white/[0.15] rounded-md hover:bg-white/[0.12] transition-colors"
        >
          ← Back to all applications
        </Link>
      </header>

      <div className="max-w-[800px] mx-auto px-6 py-8 animate-fade-up">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-fongit-navy mb-1">
              {app.company.name}
            </h1>
            <p className="text-[15px] text-gray-500">
              {app.team[0]?.firstName} {app.team[0]?.lastName}
              {app.company.markets ? ` · ${app.company.markets.split(",")[0].trim()}` : ""}
              {app.company.location ? ` · ${app.company.location}` : ""}
            </p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        {/* ── Pipeline Indicator ── */}
        <PipelineIndicator
          current={app.status}
          onAdvance={advanceStage}
          disabled={updating}
        />

        {/* ── Metadata (coach / program type) ── */}
        <div className="card px-6 py-5 mb-5">
          <div className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-3">
            Program Details
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-[11px] text-gray-500 mb-1">Lead Coach</label>
              <input
                type="text"
                value={leadCoach}
                onChange={(e) => setLeadCoach(e.target.value)}
                placeholder="Unassigned"
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-fongit-navy transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Program Type</label>
              <select
                value={programType}
                onChange={(e) => setProgramType(e.target.value as "Tech" | "Life Sciences" | "")}
                className="px-3 py-2 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-fongit-navy transition-colors bg-white"
              >
                <option value="">Not set</option>
                <option value="Tech">Tech</option>
                <option value="Life Sciences">Life Sciences</option>
              </select>
            </div>
            <button
              onClick={saveMetadata}
              disabled={updating}
              className="btn-secondary text-sm py-2 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>

        {/* ── Detail Sections ── */}
        {sections.map((section) => (
          <div key={section.title} className="card px-6 py-5 mb-3">
            <div className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">
              {section.title}
            </div>
            <div className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {section.content}
            </div>
          </div>
        ))}

        {/* ── Scoring Breakdown ── */}
        {app.score !== null && app.scoreBreakdown && (
          <div className="card px-6 py-6 mt-5 mb-3">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-bold tracking-widest uppercase text-gray-500">
                Automated Score
              </div>
              <div
                className={`text-3xl font-bold font-display ${
                  app.score >= 80
                    ? "text-green-700"
                    : app.score >= 60
                      ? "text-orange-600"
                      : "text-red-600"
                }`}
              >
                {app.score}/100
              </div>
            </div>
            <ScoreBreakdownBars breakdown={app.scoreBreakdown} />
          </div>
        )}

        {/* ── AI Summary ── */}
        <AISummaryCard
          id={id}
          summary={aiSummary}
          onSummaryGenerated={setAiSummary}
        />

        {/* ── Evaluation ── */}
        <div className="card px-6 py-6">
          <div className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-3">
            Evaluation
          </div>

          <textarea
            className="w-full px-3.5 py-3 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-fongit-navy transition-colors resize-y mb-4"
            placeholder="Add evaluation notes for the team..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex gap-2.5">
            <button
              onClick={() => advanceStage("ii_1")}
              disabled={updating}
              className="px-5 py-2.5 bg-fongit-navy text-white rounded-md text-sm font-semibold hover:bg-fongit-navy-light transition-colors disabled:opacity-50"
            >
              → Move to II-1
            </button>
            <button
              onClick={() => advanceStage("phone_call")}
              disabled={updating}
              className="btn-secondary text-sm py-2.5 disabled:opacity-50"
            >
              → Phone Call
            </button>
            <button
              onClick={saveNotes}
              disabled={updating}
              className="btn-secondary text-sm py-2.5 disabled:opacity-50"
            >
              Save Notes
            </button>
            <button
              onClick={() => advanceStage("rejected")}
              disabled={updating}
              className="btn-danger-soft disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
