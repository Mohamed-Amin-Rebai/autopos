"use client";

import { useEffect, useState } from "react";
import {
  CashierRequest,
  CashierRequestConfig, 
  GeneratedCashierCredentials,
} from "@/lib/types";

import { 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Loader2,
  UserPlus,
  ArrowRight
} from "lucide-react";

export default function AdminCashierRequests() {
  const [requests, setRequests] = useState<CashierRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [generatedCashiers, setGeneratedCashiers] = useState<GeneratedCashierCredentials[]>([]);
  const [showCredentials, setShowCredentials] = useState(false);

  const approveRequest = async (requestId: string) => {
    try {
      setApprovingId(requestId);

      const res = await fetch("/api/cashier-requests/approve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Approval failed");
      }

      if (data.cashiers) {
        setGeneratedCashiers(data.cashiers);
        setShowCredentials(true);
      }

      setRequests((prev) =>
        prev.filter(
          (r) => r.id !== requestId
        )
      );

    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      setApprovingId(requestId);

      const res = await fetch("/api/cashier-requests/reject",
        {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
          },
          body: JSON.stringify({
            requestId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reject failed");
      }

      setRequests((prev) =>
        prev.filter(
          (r) => r.id !== requestId
        )
      );

    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await fetch("/api/cashier-requests");

        if (!res.ok) {
          throw new Error("Failed to load requests");
        }

        const data = await res.json();
        setRequests(data.requests || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex items-center justify-center gap-3 py-4 bg-white rounded-2xl shadow-sm border border-gray-200/50">
          <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
          <span className="text-sm text-gray-600 font-medium">Loading cashier requests...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {showCredentials && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Cashiers Created Successfully
                </h2>
                <p className="text-sm text-amber-600 font-medium">
                  ⚠️ Save these credentials immediately
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <p className="text-sm text-amber-700 flex items-center gap-2">
                <span className="text-base">📌</span>
                These credentials won&apos;t be shown again. Store them securely.
              </p>
            </div>

            {/* Cashier Cards */}
            <div className="space-y-3">
              {generatedCashiers.map((cashier, index) => (
                <div
                  key={cashier.id}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-500/20">
                        <span className="text-xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        Cashier #{index + 1}
                      </span>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Username</span>
                      <span className="font-mono text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                        {cashier.username}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Password</span>
                      <span className="font-mono text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                        {cashier.password}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">URL</span>
                      <span className="font-mono text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                        {cashier.url}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-200/50">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Shift
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {cashier.shiftStart} <span className="text-gray-400">→</span> {cashier.shiftEnd}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowCredentials(false);
                setGeneratedCashiers([]);
              }}
              className="mt-5 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl 
                        hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 
                        shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30
                        font-medium text-sm flex items-center justify-center gap-2"
            >
              <span>✓</span>
              I&apos;ve Saved the Credentials
            </button>
          </div>
        </div>
      )}
    
    <div className="max-w-7xl mx-auto mt-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md transition-shadow">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-gray-700">Pending Cashier Requests</h2>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {requests.length}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {requests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400 text-center">No pending requests</p>
              <p className="text-xs text-gray-400 mt-1">All cashier requests have been processed</p>
            </div>
          )}

          <div className="space-y-4">
            {requests.map((request) => {
              const configs = request.cashierConfigs || [];
              return (
                <div
                  key={request.id}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Request Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          POS: <span className="text-violet-600">{request.posId}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <UserPlus className="w-3 h-3" />
                            {request.requestedCashiers} cashiers requested
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            request.status === "pending" 
                              ? "bg-amber-100 text-amber-700" 
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cashier Configs */}
                  {configs.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Cashier Details
                      </p>
                      <div className="space-y-2">
                        {configs.map((config: CashierRequestConfig, index: number) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-3 border border-gray-200/50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-violet-700">
                                    {index + 1}
                                  </span>
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                  Cashier #{index + 1}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1 text-emerald-600">
                                  <DollarSign className="w-3 h-3" />
                                  {config.openingCash} TND
                                </span>
                                <span className="flex items-center gap-1 text-amber-600">
                                  <Clock className="w-3 h-3" />
                                  {config.shiftStart} → {config.shiftEnd}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Approve and Reject Buttons */}
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      disabled={approvingId === request.id}
                      onClick={() => approveRequest(request.id)}
                      className="
                        px-4 py-2.5 text-xs font-medium
                        bg-gradient-to-r from-violet-600 to-indigo-600
                        text-white py-2.5 rounded-xl
                        hover:from-violet-700 hover:to-indigo-700
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-lg shadow-violet-500/20
                        hover:shadow-violet-500/30
                        flex items-center justify-center gap-2
                      "
                    >
                      {approvingId === request.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      disabled={approvingId === request.id}
                      onClick={() => rejectRequest(request.id)}
                      className="
                        px-4 py-2.5 text-xs font-medium
                        bg-gradient-to-r from-red-500 to-rose-500
                        text-white py-2.5 rounded-xl
                        hover:from-red-600 hover:to-rose-600
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-lg shadow-red-500/20
                        hover:shadow-red-500/30
                        flex items-center justify-center gap-2
                      "
                    >
                      Reject
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}