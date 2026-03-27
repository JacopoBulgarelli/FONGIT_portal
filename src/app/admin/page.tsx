"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FongitLogo, StatusBadge } from "@/components/ui";
import { STATUS_CONFIG, PIPELINE_STAGES, ACTIVE_STATUSES } from "@/lib/constants";
import type { Application, ApplicationStatus } from "@/lib/types";

type Filter = ApplicationStatus | "all" | "active" | "outcome";

const FILTER_TABS: { key: Filter; label: string }[] = [
  { key: "all",              label: "All" },
  { key: "applied",          label: "Applied" },
  { key: "phone_call",       label: "Phone Call" },
  { key: "screening_meeting",label: "Screening" },
  { key: "active",           label: "In Program" },
  { key: "graduated",        label: "Graduated" },
  { key: "exited",           label: "Exited" },
  { key: "rejected",         label: "Rejected" },
];

function matchesFilter(app: Application, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "active") return ACTIVE_STATUSES.includes(app.status);
  if (filter === "outcome") return ["graduated", "exited", "rejected"].includes(app.status);
  return app.status === filter;
}

export default function AdminPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data.applications ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filtered = applications.filter((a) => matchesFilter(a, filter));

  const count = (f: Filter) => applications.filter((a) => matchesFilter(a, f)).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── Navy Top Bar ── */}
      <header className="bg-fongit-navy px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <FongitLogo size={24} variant="light" />
          <span className="text-[13px] font-medium text-white/50 border-l border-white/15 pl-5">
            Admin Dashboard
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <Link
            href="/admin/portfolio"
            className="px-4 py-2 text-[13px] font-medium text-white/70 bg-white/[0.08] border border-white/[0.15] rounded-md hover:bg-white/[0.12] transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-[13px] font-medium text-white/70 bg-white/[0.08] border border-white/[0.15] rounded-md hover:bg-white/[0.12] transition-colors"
          >
            ← Applicant View
          </Link>
          <button className="px-4 py-2 text-[13px] font-semibold text-fongit-navy bg-white rounded-md flex items-center gap-1.5 hover:bg-gray-100 transition-colors">
            ↗ Sync to Google Sheets
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* ── Stats Row ── */}
        <div className="grid grid-cols-5 gap-4 mb-7">
          {(
            [
              { label: "Total",      f: "all"      as Filter, colorClass: "text-gray-800" },
              { label: "Applied",    f: "applied"  as Filter, colorClass: "text-blue-600" },
              { label: "Screening",  f: "screening_meeting" as Filter, colorClass: "text-purple-600" },
              { label: "In Program", f: "active"   as Filter, colorClass: "text-fongit-navy" },
              { label: "Graduated",  f: "graduated"as Filter, colorClass: "text-green-700" },
            ]
          ).map((s) => (
            <div key={String(s.f)} className="card px-6 py-5">
              <div className={`text-3xl font-bold font-display ${s.colorClass}`}>
                {count(s.f)}
              </div>
              <div className="text-[13px] text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                filter === key
                  ? "bg-fongit-navy text-white"
                  : "bg-white text-gray-600 shadow-sm hover:shadow"
              }`}
            >
              {label} ({count(key)})
            </button>
          ))}
        </div>

        {/* ── Applications Table ── */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">Loading applications...</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">No applications in this stage.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {["Company", "Founder", "Sector", "Stage", "Location", "Score", "Pipeline", "Submitted"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase text-gray-500"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/${app.id}`}
                        className="font-semibold text-fongit-navy hover:underline"
                      >
                        {app.company.name}
                      </Link>
                      {app.programType && (
                        <span className="ml-1.5 text-[10px] text-gray-400">
                          {app.programType === "Life Sciences" ? "LS" : "Tech"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {app.team[0]?.firstName} {app.team[0]?.lastName}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {app.company.markets?.split(",")[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs font-medium">
                      {app.company.stage || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {app.company.location?.split(",")[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums">
                      {app.score !== null ? (
                        <span
                          className={`font-bold ${
                            app.score >= 80
                              ? "text-green-700"
                              : app.score >= 60
                                ? "text-orange-600"
                                : "text-red-600"
                          }`}
                        >
                          {app.score}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-[13px] tabular-nums">
                      {new Date(app.submittedAt).toLocaleDateString("en-CH")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
