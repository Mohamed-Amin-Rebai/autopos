"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Calendar,
  UserPlus,
  ArrowRight
} from "lucide-react";

export default function AdminCashierRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await fetch("/api/cashier-requests");

        if (!res.ok) {
          throw new Error("Failed to load requests");
        }

        const data = await res.json();
        setRequests(data);

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
                        {configs.map((config: any, index: number) => (
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

                  {/* Approve Button */}
                  <button
                    className="w-full mt-2 text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-xl 
                              hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 
                              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20
                              hover:shadow-violet-500/30 flex items-center justify-center gap-2"
                    disabled={approvingId === request.id}
                    onClick={async () => {
                      try {
                        setApprovingId(request.id);

                        const res = await fetch(
                          "/api/cashier-requests/approve",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              requestId: request.id,
                            }),
                          }
                        );

                        const data = await res.json();
                        console.log(data);

                        setRequests((prev) =>
                          prev.filter((r) => r.id !== request.id)
                        );

                      } catch (err) {
                        console.error(err);
                      } finally {
                        setApprovingId(null);
                      }
                    }}
                  >
                    {approvingId === request.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve Request
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}