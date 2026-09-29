"use client";

import { useEffect, useState } from "react";
import {
  LifeBuoy,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronDown,
} from "lucide-react";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

type Ticket = {
  id: string;
  title: string;
  message: string;
  status: TicketStatus;
  resolution: string | null;
  department: string | null;
  urgency: boolean | null;
  frustration: number | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_META: Record<
  TicketStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  OPEN: {
    label: "Open",
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
    icon: AlertCircle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60",
    icon: Loader2,
  },
  RESOLVED: {
    label: "Resolved",
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
    icon: CheckCircle2,
  },
};

export default function SupportPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);

  async function loadTickets() {
    try {
      setTicketsLoading(true);
      const res = await fetch("/api/tickets");
      if (!res.ok) throw new Error("Failed to load tickets");
      const data: Ticket[] = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTicketsLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create ticket");
      }

      const created: Ticket = await res.json();

      setTitle("");
      setMessage("");
      setSuccess(true);

      // Prepend optimistically, then refresh in background
      setTickets((prev) => [created, ...prev]);
      loadTickets();

      // Auto-hide success after a few seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to submit ticket."
      );
    } finally {
      setLoading(false);
    }
  }

  const openCount = tickets.filter((t) => t.status !== "RESOLVED").length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-10 left-0 w-[400px] h-[200px] bg-gradient-to-r from-violet-200/30 to-indigo-200/30 rounded-full blur-3xl" />
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <LifeBuoy className="w-6 h-6 text-white" strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Support Center
              </h1>
              <p className="mt-2 text-gray-600">
                Need help? Submit a ticket and our team will review it.
              </p>

              {tickets.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white ring-1 ring-gray-200 text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {tickets.length} total
                  </span>
                  {openCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 ring-1 ring-amber-200/60 text-amber-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      {openCount} open
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Ticket Card */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Submit a new ticket
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Unable to access cashier account"
                className="w-full border border-gray-200 rounded-xl p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="Describe your issue in as much detail as possible..."
                className="w-full border border-gray-200 rounded-xl p-3 text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Ticket
                  </>
                )}
              </button>

              {success && (
                <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200/60 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  Ticket submitted successfully.
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 ring-1 ring-rose-200/60 px-3 py-2 rounded-xl">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Tickets List */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your tickets
            </h2>
            {tickets.length > 0 && (
              <button
                onClick={loadTickets}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Refresh
              </button>
            )}
          </div>

          {ticketsLoading && tickets.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gray-50 flex items-center justify-center">
                <LifeBuoy className="w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-3 text-gray-500 text-sm">
                You haven&apos;t submitted any tickets yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => {
                const meta = STATUS_META[ticket.status];
                const StatusIcon = meta.icon;
                const isOpen = openTicketId === ticket.id;

                return (
                  <div
                    key={ticket.id}
                    className="bg-white border border-gray-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() =>
                        setOpenTicketId(isOpen ? null : ticket.id)
                      }
                      className="w-full text-left p-5 flex items-start gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${meta.className}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {meta.label}
                          </span>

                          {ticket.department && (
                            <span className="text-xs text-gray-500 capitalize">
                              {ticket.department.replace("_", " ")}
                            </span>
                          )}

                          {ticket.urgency && (
                            <span className="text-xs text-rose-600 font-medium">
                              • Urgent
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 font-semibold text-gray-900 truncate">
                          {ticket.title}
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                        <div className="pt-4">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {ticket.message}
                          </p>

                          {ticket.status === "RESOLVED" && (
                            <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 ring-1 ring-emerald-200/50">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-semibold text-emerald-800">
                                  Resolution
                                </span>
                              </div>
                              <p className="text-sm text-emerald-900/80 whitespace-pre-wrap">
                                {ticket.resolution ||
                                  "No resolution details provided."}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}