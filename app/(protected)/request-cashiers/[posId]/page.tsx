"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Users, 
  Clock, 
  DollarSign, 
  ArrowLeft, 
  ArrowRight, 
  Loader2,
  Calendar,
  UserPlus,
  CheckCircle,
  XCircle,
  ShoppingBag
} from "lucide-react";

export default function RequestCashiersPage() {
  const params = useParams();
  const router = useRouter();

  const posId = params.posId as string;

  const [posName, setPosName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [cashierCount, setCashierCount] = useState(1);
  const [cashiers, setCashiers] = useState([
    {
        openingCash: 100,
        shiftStart: "",
        shiftEnd: "",
    },
  ]);

  useEffect(() => {
    const loadPOS = async () => {
      try {
        const res = await fetch(
          `/api/pos?posId=${posId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch POS");
        }

        const data = await res.json();

        setPosName(data.current?.name || "POS");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (posId) {
      loadPOS();
    }
  }, [posId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading POS details...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-4 md:p-8">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                </button>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                  Request Cashiers
                </h1>
              </div>
              <div className="flex items-center gap-2 ml-12">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-gray-200/50">
                  <ShoppingBag className="w-4 h-4 text-violet-600" />
                  <span className="text-sm text-gray-600 font-medium">{posName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Number of Cashiers Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Users className="w-4 h-4 text-white" />
            </div>
            <label className="text-sm font-semibold text-gray-700">
              Number of Cashiers
            </label>
          </div>
          <p className="text-xs text-gray-400 mb-3 ml-11">
            Specify how many cashiers you want to request for this POS
          </p>

          <div className="ml-11">
            <input
              type="number"
              min={1}
              value={cashierCount}
              onChange={(e) => {
                const count = Number(e.target.value);

                setCashierCount(count);

                setCashiers(
                  Array.from({ length: count }, () => ({
                    openingCash: 100,
                    shiftStart: "",
                    shiftEnd: "",
                  }))
                );
              }}
              className="w-40 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
            />
          </div>
        </div>

        {/* Dynamic Cashier Forms */}
        <div className="space-y-4">
          {cashiers.map((cashier, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-sm font-semibold text-gray-700">
                  Cashier #{index + 1}
                </h2>
                <span className="ml-auto text-xs text-gray-400">New Request</span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Opening Cash
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">TND</span>
                    <input
                      type="number"
                      value={cashier.openingCash}
                      onChange={(e) => {
                        const updated = [...cashiers];
                        updated[index].openingCash = Number(e.target.value);
                        setCashiers(updated);
                      }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pl-12 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Shift Start
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={cashier.shiftStart}
                      onChange={(e) => {
                        const updated = [...cashiers];
                        updated[index].shiftStart = e.target.value;
                        setCashiers(updated);
                      }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Shift End
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={cashier.shiftEnd}
                      onChange={(e) => {
                        const updated = [...cashiers];
                        updated[index].shiftEnd = e.target.value;
                        setCashiers(updated);
                      }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit + Cancel Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={async () => {
              try {
                setSubmitting(true);

                await fetch("/api/cashier-requests", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    posId,
                    requestedCashiers: cashiers.length,
                    cashierConfigs: cashiers,
                  }),
                });

                router.push("/dashboard");
              } catch (err) {
                console.error(err);
              } finally {
                setSubmitting(false);
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Request
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

    </main>
  );
}