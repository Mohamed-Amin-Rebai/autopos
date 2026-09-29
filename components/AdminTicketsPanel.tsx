"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Ticket as TicketIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { AdminTicket, TicketStatus } from "@/lib/types";
import TicketRow from "./TicketRow";

const FILTERS: Array<{ key: "ALL" | TicketStatus; label: string }> = [
  { key: "ALL", label: "All" },
  { key: "OPEN", label: "Open" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "RESOLVED", label: "Resolved" },
];

type Props = {
  onCountChange?: (payload: { open: number; total: number }) => void;
};

export default function AdminTicketsPanel({ onCountChange }: Props) {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | TicketStatus>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/tickets");
      if (!res.ok) throw new Error("Failed to load tickets");
      const data: AdminTicket[] = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  // Notify parent of counts
  useEffect(() => {
    if (!onCountChange) return;
    const open = tickets.filter((t) => t.status !== "RESOLVED").length;
    onCountChange({ open, total: tickets.length });
  }, [tickets, onCountChange]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return tickets;
    return tickets.filter((t) => t.status === filter);
  }, [tickets, filter]);

  const counts = useMemo(
    () => ({
      ALL: tickets.length,
      OPEN: tickets.filter((t) => t.status === "OPEN").length,
      IN_PROGRESS: tickets.filter((t) => t.status === "IN_PROGRESS").length,
      RESOLVED: tickets.filter((t) => t.status === "RESOLVED").length,
    }),
    [tickets]
  );

  function handleTicketUpdated(updated: AdminTicket) {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <TicketIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-gray-700">
              Support Tickets
            </h2>
            {counts.OPEN > 0 && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {counts.OPEN} open
              </span>
            )}
          </div>

          <button
            onClick={loadTickets}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-violet-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const count = counts[f.key];
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                  active
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-500/20"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f.label}
                <span
                  className={`ml-1.5 ${
                    active ? "text-white/70" : "text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="max-h-[600px] overflow-y-auto">
        {loading && tickets.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading tickets...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <TicketIcon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400">
              {filter === "ALL"
                ? "No support tickets yet"
                : `No ${filter.toLowerCase().replace("_", " ")} tickets`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                expanded={expandedId === ticket.id}
                onToggle={() =>
                  setExpandedId(expandedId === ticket.id ? null : ticket.id)
                }
                onUpdated={handleTicketUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}