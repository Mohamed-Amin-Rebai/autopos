import type { TicketStatus } from "@/lib/types";

export const STATUS_META: Record<
  TicketStatus,
  { label: string; className: string; dot: string }
> = {
  OPEN: {
    label: "Open",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60",
    dot: "bg-blue-500",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
    dot: "bg-emerald-500",
  },
};

export const FRUSTRATION_LABELS = ["Calm", "Frustrated", "Very upset"];