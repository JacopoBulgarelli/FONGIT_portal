import type { ApplicationStatus } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    bg: "bg-gray-100",
    color: "text-gray-500",
    shortLabel: status,
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}
    >
      {config.shortLabel}
    </span>
  );
}
