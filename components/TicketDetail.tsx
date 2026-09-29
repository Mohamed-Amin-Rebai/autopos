"use client";

import { useEffect, useState } from "react";
import { User2, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminTicket, TicketStatus } from "@/lib/types";
import { STATUS_META, FRUSTRATION_LABELS } from "@/lib/ticketMeta";
import MetaChip from "./MetaChip";
import JevDetails from "./JevDetails";

export default function TicketDetail({
  ticket,
  onUpdated,
}: {
  ticket: AdminTicket;
  onUpdated: (t: AdminTicket) => void;
}) {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [resolution, setResolution] = useState(ticket.resolution ?? "");
  const [saving, setSaving] = useState(false);

  // If parent re-fetches and ticket prop changes, resync
  useEffect(() => {
    setStatus(ticket.status);
    setResolution(ticket.resolution ?? "");
  }, [ticket.status, ticket.resolution]);

  const dirty =
    status !== ticket.status || resolution !== (ticket.resolution ?? "");

  async function save() {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolution }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update ticket");
      }

      const updated: AdminTicket = await res.json();
      onUpdated(updated);
      toast.success(
        status === "RESOLVED"
          ? "Ticket resolved — user notified"
          : "Ticket updated"
      );
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 pb-5 pt-1 bg-gradient-to-b from-gray-50/50 to-white border-t border-gray-100">
      <div className="pt-4 space-y-5">
        {/* Reporter */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <User2 className="w-3.5 h-3.5 text-gray-400" />
          <span>
            From{" "}
            <span className="font-medium text-gray-900">
              {ticket.user?.name || ticket.user?.email || "Unknown user"}
            </span>
          </span>
        </div>

        {/* Message */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Message
          </h4>
          <p className="text-sm text-gray-800 whitespace-pre-wrap bg-white rounded-xl p-4 ring-1 ring-gray-200/60">
            {ticket.message}
          </p>
        </div>

        {/* JEV classification */}
        {(ticket.department || ticket.urgency != null || ticket.frustration != null) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MetaChip
              label="Department"
              value={ticket.department?.replace("_", " ") ?? "—"}
              tone="blue"
            />
            <MetaChip
              label="Urgency"
              value={ticket.urgency ? "Immediate attention" : "Normal"}
              tone={ticket.urgency ? "red" : "gray"}
            />
            <MetaChip
              label="Frustration"
              value={
                ticket.frustration != null
                  ? FRUSTRATION_LABELS[ticket.frustration] ??
                    `Score ${ticket.frustration}`
                  : "—"
              }
              tone={
                ticket.frustration && ticket.frustration >= 2
                  ? "red"
                  : ticket.frustration === 1
                  ? "amber"
                  : "gray"
              }
            />
          </div>
        )}

        {ticket.meta?.answers && (
          <JevDetails meta={ticket.meta} />
        )}

        {/* Admin controls */}
        <div className="bg-white rounded-xl p-4 ring-1 ring-gray-200/60 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {(["OPEN", "IN_PROGRESS", "RESOLVED"] as TicketStatus[]).map(
                (s) => {
                  const m = STATUS_META[s];
                  const active = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                        active
                          ? `${m.className} ring-2 ring-offset-1 ring-current/20`
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                      {m.label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Resolution
              {status !== "RESOLVED" && (
                <span className="ml-2 normal-case font-normal text-gray-400">
                  (optional — will be shown to user when resolved)
                </span>
              )}
            </label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={3}
              placeholder="Explain what was done to resolve this issue..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              Last updated {new Date(ticket.updatedAt).toLocaleString()}
            </p>

            <button
              onClick={save}
              disabled={!dirty || saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-sm shadow-violet-500/20 hover:shadow-violet-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

