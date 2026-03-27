"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { FongitLogo } from "@/components/ui";
import { STATUS_CONFIG, ACTIVE_STATUSES } from "@/lib/constants";
import type { Application, ApplicationStatus } from "@/lib/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isActive(s: ApplicationStatus) {
  return ACTIVE_STATUSES.includes(s) || s === "full_support";
}
function isClosed(s: ApplicationStatus) {
  return s === "exited" || s === "rejected";
}
function isGraduated(s: ApplicationStatus) {
  return s === "graduated";
}

function getSector(app: Application) {
  return app.company.markets?.split(",")[0]?.trim() ?? "—";
}
function getEntryYear(app: Application) {
  return new Date(app.submittedAt).getFullYear();
}

// ── Stat tile ─────────────────────────────────────────────────────────────────

function Stat({ value, label, color = "text-fongit-navy" }: { value: number; label: string; color?: string }) {
  return (
    <div className="card px-5 py-4">
      <div className={`text-3xl font-bold font-display ${color}`}>{value}</div>
      <div className="text-[12px] text-gray-500 mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

// ── Portfolio page ────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  const [filterCoach, setFilterCoach] = useState("all");
  const [filterPhase, setFilterPhase] = useState<ApplicationStatus | "all" | "active">("all");
  const [filterProgramType, setFilterProgramType] = useState("all");

  const fetchApplications = useCallback(async () => {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data.applications ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // Derived filter options
  const allSectors = useMemo(() => {
    const s = new Set(applications.map(getSector).filter((x) => x !== "—"));
    return ["all", ...Array.from(s).sort()];
  }, [applications]);

  const allCoaches = useMemo(() => {
    const c = new Set(applications.map((a) => a.assignedLeadCoach).filter(Boolean));
    return ["all", ...Array.from(c).sort()];
  }, [applications]);

  // Stats
  const total      = applications.length;
  const activeCount    = applications.filter((a) => isActive(a.status)).length;
  const graduatedCount = applications.filter((a) => isGraduated(a.status)).length;
  const closedCount    = applications.filter((a) => isClosed(a.status)).length;
  const techCount      = applications.filter((a) => a.programType === "Tech").length;
  const lsCount        = applications.filter((a) => a.programType === "Life Sciences").length;

  // Phase stats (II + IS)
  const inII = applications.filter((a) => ["ii_1","ii_2","ii_3"].includes(a.status)).length;
  const inIS = applications.filter((a) => ["is_1","is_2","is_3"].includes(a.status)).length;
  const inFS = applications.filter((a) => a.status === "full_support").length;

  // Filtered rows
  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase();
      if (q) {
        const name = app.company.name?.toLowerCase() ?? "";
        const founders = app.team.map((m) => `${m.firstName} ${m.lastName}`.toLowerCase()).join(" ");
        if (!name.includes(q) && !founders.includes(q)) return false;
      }
      if (filterSector !== "all" && getSector(app) !== filterSector) return false;
      if (filterCoach !== "all" && app.assignedLeadCoach !== filterCoach) return false;
      if (filterProgramType !== "all" && app.programType !== filterProgramType) return false;
      if (filterPhase === "active" && !isActive(app.status)) return false;
      if (filterPhase !== "all" && filterPhase !== "active" && app.status !== filterPhase) return false;
      return true;
    });
  }, [applications, search, filterSector, filterCoach, filterPhase, filterProgramType]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── Top Bar ── */}
      <header className="bg-fongit-navy px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <FongitLogo size={24} variant="light" />
          <span className="text-[13px] font-medium text-white/50 border-l border-white/15 pl-5">
            Portfolio
          </span>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 text-[13px] font-medium text-white/70 bg-white/[0.08] border border-white/[0.15] rounded-md hover:bg-white/[0.12] transition-colors"
        >
          ← Dashboard
        </Link>
      </header>

      <div className="max-w-[1300px] mx-auto px-6 py-8">

        {/* ── Stats ── */}
        <div className="grid grid-cols-8 gap-3 mb-7">
          <Stat value={total}          label="Total"           color="text-gray-800" />
          <Stat value={activeCount}    label="Active"          color="text-fongit-navy" />
          <Stat value={graduatedCount} label="Graduated"       color="text-green-700" />
          <Stat value={closedCount}    label="Exited / Rejected" color="text-gray-500" />
          <Stat value={techCount}      label="Tech"            color="text-fongit-navy" />
          <Stat value={lsCount}        label="Life Sciences"   color="text-purple-600" />
          <Stat value={inII + inIS}    label="Innov. / Init. Support" color="text-fongit-navy" />
          <Stat value={inFS}           label="Full Support"    color="text-green-700" />
        </div>

        {/* ── Filters ── */}
        <div className="card px-5 py-4 mb-5 flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] text-gray-500 mb-1 font-medium tracking-wide uppercase">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Company or founder name…"
              className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-md text-sm outline-none focus:border-fongit-navy transition-colors"
            />
          </div>

          {/* Sector */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-medium tracking-wide uppercase">
              Field / Sector
            </label>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="px-3 py-2 border-[1.5px] border-gray-200 rounded-md text-sm bg-white outline-none focus:border-fongit-navy transition-colors"
            >
              {allSectors.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All sectors" : s}</option>
              ))}
            </select>
          </div>

          {/* Program Type */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-medium tracking-wide uppercase">
              Program
            </label>
            <select
              value={filterProgramType}
              onChange={(e) => setFilterProgramType(e.target.value)}
              className="px-3 py-2 border-[1.5px] border-gray-200 rounded-md text-sm bg-white outline-none focus:border-fongit-navy transition-colors"
            >
              <option value="all">All programs</option>
              <option value="Tech">Tech</option>
              <option value="Life Sciences">Life Sciences</option>
            </select>
          </div>

          {/* Pipeline Phase */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-medium tracking-wide uppercase">
              Phase
            </label>
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value as ApplicationStatus | "all" | "active")}
              className="px-3 py-2 border-[1.5px] border-gray-200 rounded-md text-sm bg-white outline-none focus:border-fongit-navy transition-colors"
            >
              <option value="all">All phases</option>
              <option value="active">Active (all)</option>
              <option value="applied">Applied</option>
              <option value="phone_call">Phone Call</option>
              <option value="screening_meeting">Screening</option>
              <option value="ii_1">II-1</option>
              <option value="ii_2">II-2</option>
              <option value="ii_3">II-3</option>
              <option value="is_1">IS-1</option>
              <option value="is_2">IS-2</option>
              <option value="is_3">IS-3</option>
              <option value="full_support">Full Support</option>
              <option value="graduated">Graduated</option>
              <option value="exited">Exited</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Lead Coach */}
          {allCoaches.length > 1 && (
            <div>
              <label className="block text-[11px] text-gray-500 mb-1 font-medium tracking-wide uppercase">
                Lead Coach
              </label>
              <select
                value={filterCoach}
                onChange={(e) => setFilterCoach(e.target.value)}
                className="px-3 py-2 border-[1.5px] border-gray-200 rounded-md text-sm bg-white outline-none focus:border-fongit-navy transition-colors"
              >
                {allCoaches.map((c) => (
                  <option key={c} value={c}>{c === "all" ? "All coaches" : c}</option>
                ))}
              </select>
            </div>
          )}

          {(search || filterSector !== "all" || filterCoach !== "all" || filterPhase !== "all" || filterProgramType !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilterSector("all");
                setFilterCoach("all");
                setFilterPhase("all");
                setFilterProgramType("all");
              }}
              className="px-3 py-2 text-[13px] text-gray-500 hover:text-gray-700 transition-colors self-end"
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">Loading portfolio…</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">No matching companies.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {[
                    "Company", "Co-founders", "Field", "Dev Stage",
                    "Incorp.", "City", "Coach", "Phase",
                    "Program", "Score", "Entry",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3.5 text-left text-[10px] font-bold tracking-widest uppercase text-gray-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const statusCfg = STATUS_CONFIG[app.status];
                  const founders = app.team
                    .slice(0, 2)
                    .map((m) => `${m.firstName} ${m.lastName}`.trim())
                    .join(", ");
                  return (
                    <tr
                      key={app.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-3 font-semibold">
                        <Link
                          href={`/admin/${app.id}`}
                          className="text-fongit-navy hover:underline"
                        >
                          {app.company.name}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-[13px]">
                        {founders || "—"}
                        {app.team.length > 2 && (
                          <span className="text-gray-400 ml-1">+{app.team.length - 2}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-[13px]">
                        {getSector(app)}
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-xs font-medium">
                        {app.company.stage || "—"}
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-[13px] tabular-nums">
                        {app.company.foundedDate
                          ? app.company.foundedDate.slice(0, 4)
                          : "—"}
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-[13px]">
                        {app.company.location?.split(",")[0] ?? "—"}
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-[13px]">
                        {app.assignedLeadCoach || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                          {statusCfg.shortLabel}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-gray-600">
                        {app.programType || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-3 py-3 tabular-nums">
                        {app.score !== null ? (
                          <span className={`font-bold ${
                            app.score >= 80 ? "text-green-700"
                            : app.score >= 60 ? "text-orange-600"
                            : "text-red-600"
                          }`}>
                            {app.score}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-gray-500 tabular-nums text-[13px]">
                        {getEntryYear(app)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-3 text-[12px] text-gray-400 text-right">
          {filtered.length} of {total} companies
        </div>
      </div>
    </div>
  );
}
