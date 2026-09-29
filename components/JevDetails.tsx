"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { JevMeta } from "@/lib/types";
import ProbabilityBar from "./ProbabilityBar";

export default function JevDetails({ meta }: { meta: JevMeta }) {
  const [open, setOpen] = useState(false);

  const dept = meta.answers?.department;
  const urg = meta.answers?.urgency;
  const frus = meta.answers?.frustration;

  const confidencePct = (n?: number) =>
    typeof n === "number" ? `${Math.round(n * 100)}%` : "—";

  return (
    <div className="bg-white rounded-xl ring-1 ring-gray-200/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/70 transition"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            AI classification details
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-5 border-t border-gray-100 pt-4">
          {/* Department */}
          {dept && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  Department
                </span>
                <span className="text-xs text-gray-500">
                  confidence {confidencePct(dept.confidence)}
                </span>
              </div>
              <ProbabilityBar
                probabilities={dept.probabilities}
                highlight={dept.choice}
              />
            </div>
          )}

          {/* Urgency */}
          {urg && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  Urgency
                </span>
                <span className="text-xs text-gray-500">
                  raw score {urg.noul.toFixed(2)}
                  {" · "}
                  threshold 0.50 → {urg.noul >= 0.5 ? "urgent" : "normal"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full ${
                    urg.noul >= 0.5
                      ? "bg-gradient-to-r from-rose-500 to-red-500"
                      : "bg-gradient-to-r from-emerald-400 to-teal-400"
                  }`}
                  style={{ width: `${Math.min(100, urg.noul * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Frustration */}
          {frus && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  Frustration
                </span>
                <span className="text-xs text-gray-500">
                  score {frus.score.toFixed(2)}
                  {" · "}
                  confidence {confidencePct(frus.confidence)}
                </span>
              </div>
              <ProbabilityBar
                probabilities={frus.probabilities}
                labels={frus.legend}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

