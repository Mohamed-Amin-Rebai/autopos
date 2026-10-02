"use client";

import { AdminTicket } from "@/lib/types";
import { STATUS_META } from "@/lib/ticketMeta";
import TicketDetail from "./TicketDetail";
import {
  ChevronDown,
  Building2,
  Flame,
} from "lucide-react";


export default function TicketRow({
  ticket,
  expanded,
  onToggle,
  onUpdated,
}: {
  ticket: AdminTicket;
  expanded: boolean;
  onToggle: () => void;
  onUpdated: (t: AdminTicket) => void;
}) {
  const meta = STATUS_META[ticket.status];

  return (
    <div className="group">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-gray-50/70 transition"
      >
        <div className="flex items-start gap-3">
          <span
            className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">
                {ticket.title}
              </h3>

              <span
                className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${meta.className}`}
              >
                {meta.label}
              </span>

              {ticket.urgency && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 ring-1 ring-rose-200/60 px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3" />
                  Urgent
                </span>
              )}

              {ticket.department && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                  <Building2 className="w-3 h-3" />
                  {ticket.department.replace("_", " ")}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-500 truncate">
              {ticket.user?.email ?? ticket.userId}
              {" · "}
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Detail */}
      {expanded && (
        <TicketDetail ticket={ticket} onUpdated={onUpdated} />
      )}
    </div>
  );
}