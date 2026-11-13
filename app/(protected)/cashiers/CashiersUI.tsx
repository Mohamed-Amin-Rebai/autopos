"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cashier, CashierManagementPOS } from "@/lib/types";
import {
  Users,
  Clock,
  DollarSign,
  Loader2,
  Edit2,
  Power,
  PowerOff,
  UserPlus,
  Search,
  Store,
  Save,
  X,
  Briefcase,
  UserCheck,
  UserX,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function CashiersUI() {
  const [posData, setPosData] = useState<CashierManagementPOS[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCashier, setEditingCashier] = useState<{
    id: string;
    shiftStart: string;
    shiftEnd: string;
    openingCash: number;
  } | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [visiblePins, setVisiblePins] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<Record<string, boolean>>({});

  // Reset PIN Modal state
  const [resetModalCashier, setResetModalCashier] = useState<{
    cashier: Cashier;
    posName: string;
  } | null>(null);
  const [customPinInput, setCustomPinInput] = useState("");
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  const router = useRouter();

  const loadCashiers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cashier-management");
      if (!res.ok) throw new Error("Failed to load cashiers");
      const data = await res.json();
      setPosData(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cashiers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCashiers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const getWorkStatus = (
    shiftStart?: string | null,
    shiftEnd?: string | null
  ) => {
    if (!shiftStart || !shiftEnd) return false;

    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = shiftStart.split(":").map(Number);
    const [endHour, endMinute] = shiftEnd.split(":").map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (start <= end) {
      return current >= start && current <= end;
    }

    return current >= start || current <= end;
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey((prev) => ({ ...prev, [key]: true }));
      toast.success("Copied to clipboard!");
      setTimeout(() => {
        setCopiedKey((prev) => ({ ...prev, [key]: false }));
      }, 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const togglePinVisibility = (id: string) => {
    setVisiblePins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCashierStatus = async (cashierId: string, currentStatus: boolean) => {
    try {
      setUpdatingId(cashierId);
      const res = await fetch(`/api/cashier/${cashierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cashierId, isActive: !currentStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to toggle status");
      }

      setPosData((prev) =>
        prev.map((pos) => ({
          ...pos,
          cashiers: pos.cashiers.map((c) =>
            c.id === cashierId ? { ...c, isActive: !currentStatus } : c
          ),
        }))
      );
      toast.success(`Cashier ${!currentStatus ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to toggle status");
    } finally {
      setUpdatingId(null);
    }
  };

  const updateCashierDetails = async () => {
    if (!editingCashier) return;

    try {
      setUpdatingId(editingCashier.id);
      const res = await fetch(`/api/cashier/${editingCashier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCashier),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update cashier");
      }

      const updated = await res.json();
      setPosData((prev) =>
        prev.map((pos) => ({
          ...pos,
          cashiers: pos.cashiers.map((c) =>
            c.id === updated.id ? { ...c, ...updated } : c
          ),
        }))
      );
      setEditingCashier(null);
      toast.success("Cashier updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to update cashier");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResetPin = async (autoGenerate: boolean) => {
    if (!resetModalCashier) return;

    let payload: { generatePin?: boolean; pin?: string } = {};

    if (autoGenerate) {
      payload = { generatePin: true };
    } else {
      const trimmed = customPinInput.trim();
      if (!/^\d{4,6}$/.test(trimmed)) {
        toast.error("PIN must be 4 to 6 numeric digits");
        return;
      }
      payload = { pin: trimmed };
    }

    try {
      setIsSubmittingReset(true);
      const res = await fetch(`/api/cashier/${resetModalCashier.cashier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to reset PIN");
      }

      const updated: Cashier = await res.json();

      setPosData((prev) =>
        prev.map((pos) => ({
          ...pos,
          cashiers: pos.cashiers.map((c) =>
            c.id === updated.id ? { ...c, ...updated } : c
          ),
        }))
      );

      setVisiblePins((prev) => ({ ...prev, [updated.id]: true }));
      toast.success(`PIN for ${updated.username} reset to ${updated.pin}!`);
      setResetModalCashier(null);
      setCustomPinInput("");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to reset PIN");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const filteredData = posData
    .map((pos) => ({
      ...pos,
      cashiers: pos.cashiers.filter((c) =>
        c.username.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((pos) => pos.cashiers.length > 0 || searchTerm === "");

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex items-center justify-center gap-3 py-12 bg-white rounded-2xl shadow-sm border border-gray-200/50">
          <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
          <span className="text-sm text-gray-600 font-medium">Loading cashiers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 space-y-6 px-4 sm:px-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            Cashier Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-12">
            Manage cashier accounts, view active PINs, and adjust station permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
            {posData.reduce((acc, pos) => acc + pos.cashiers.length, 0)} Total Cashiers
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cashiers by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm 
                       focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                       transition-all bg-gray-50/50 hover:bg-white"
          />
        </div>
      </div>

      {/* POS Cards */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No cashiers found</p>
          <p className="text-sm text-gray-400 mt-1">
            {searchTerm ? "Try adjusting your search" : "Request your first cashier to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredData.map((pos) => (
            <div
              key={pos.posId}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              {/* POS Header */}
              <div className="bg-gradient-to-r from-gray-50/80 to-white px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{pos.posName}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {pos.cashiers.length} cashier{pos.cashiers.length !== 1 ? "s" : ""} assigned
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/request-cashiers/${pos.posId}`)}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-xl
                             hover:from-violet-700 hover:to-indigo-700 transition-all duration-200
                             shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30
                             flex items-center gap-2 text-sm font-medium w-full sm:w-auto justify-center"
                >
                  <UserPlus className="w-4 h-4" />
                  Request Cashiers
                </button>
              </div>

              {/* Cashiers Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cashier
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Login PIN
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Terminal Link
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opening Cash
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shift
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Work Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pos.cashiers.map((cashier) => {
                      const isEditing = editingCashier?.id === cashier.id;
                      const isUpdating = updatingId === cashier.id;
                      const isOnShift = getWorkStatus(cashier.shiftStart, cashier.shiftEnd);
                      const isPinVisible = visiblePins[cashier.id] ?? false;
                      const isLocked =
                        cashier.lockedUntil && new Date(cashier.lockedUntil) > new Date();

                      return (
                        <tr key={cashier.id} className="hover:bg-gray-50/50 transition-colors group">
                          {/* Cashier Username */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shadow-sm flex-shrink-0">
                                <span className="text-xs font-semibold text-violet-700">
                                  {cashier.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-gray-800">
                                  {cashier.username}
                                </span>
                                {isLocked && (
                                  <span className="block text-[10px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
                                    <ShieldAlert className="w-3 h-3" />
                                    Temporarily Locked
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Login PIN */}
                          <td className="px-4 py-3">
                            <div className="inline-flex items-center gap-1.5 bg-gray-100/80 px-2.5 py-1 rounded-lg border border-gray-200/60">
                              <span className="font-mono text-xs font-bold text-gray-800 tracking-wider">
                                {isPinVisible
                                  ? cashier.pin || "Legacy Hash"
                                  : "••••"}
                              </span>
                              {cashier.pin && (
                                <>
                                  <button
                                    onClick={() => togglePinVisibility(cashier.id)}
                                    className="p-1 text-gray-400 hover:text-gray-700 transition"
                                    title={isPinVisible ? "Hide PIN" : "Reveal PIN"}
                                  >
                                    {isPinVisible ? (
                                      <EyeOff className="w-3.5 h-3.5" />
                                    ) : (
                                      <Eye className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(cashier.pin!, `pin-${cashier.id}`)}
                                    className="p-1 text-gray-400 hover:text-violet-600 transition"
                                    title="Copy PIN"
                                  >
                                    {copiedKey[`pin-${cashier.id}`] ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Terminal URL */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                const url = `${window.location.origin}/cashier/${cashier.id}`;
                                copyToClipboard(url, `url-${cashier.id}`);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-2.5 py-1 rounded-lg transition font-medium"
                              title="Copy Cashier Login Link"
                            >
                              {copiedKey[`url-${cashier.id}`] ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Terminal Link</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Opening Cash */}
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingCashier?.openingCash || 0}
                                onChange={(e) =>
                                  setEditingCashier((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          openingCash: parseFloat(e.target.value) || 0,
                                        }
                                      : null
                                  )
                                }
                                className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-sm 
                                           focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                                           bg-white"
                              />
                            ) : (
                              <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                                <DollarSign className="w-3.5 h-3.5" />
                                {cashier.openingCash} TND
                              </span>
                            )}
                          </td>

                          {/* Shift */}
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={editingCashier?.shiftStart || ""}
                                  onChange={(e) =>
                                    setEditingCashier((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            shiftStart: e.target.value,
                                          }
                                        : null
                                    )
                                  }
                                  className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm 
                                             focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                                             bg-white"
                                />
                                <span className="text-gray-300">→</span>
                                <input
                                  type="time"
                                  value={editingCashier?.shiftEnd || ""}
                                  onChange={(e) =>
                                    setEditingCashier((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            shiftEnd: e.target.value,
                                          }
                                        : null
                                    )
                                  }
                                  className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm 
                                             focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                                             bg-white"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm bg-gray-50 px-2 py-1 rounded-lg">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-gray-700 font-medium">
                                  {cashier.shiftStart || "--"}
                                </span>
                                <span className="text-gray-300">→</span>
                                <span className="text-gray-700 font-medium">
                                  {cashier.shiftEnd || "--"}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Work Status */}
                          <td className="px-4 py-3">
                            {cashier.isActive ? (
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  isOnShift
                                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                    : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                                }`}
                              >
                                {isOnShift ? (
                                  <>
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    On Shift
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3 h-3 mr-1" />
                                    Off Shift
                                  </>
                                )}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-200">
                                <UserX className="w-3 h-3 mr-1" />
                                Disabled
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                cashier.isActive
                                  ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                  : "bg-red-100 text-red-600 ring-1 ring-red-200"
                              }`}
                            >
                              {cashier.isActive ? "Enabled" : "Disabled"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={updateCashierDetails}
                                    disabled={isUpdating}
                                    className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 
                                               transition-all duration-200 disabled:opacity-50 hover:scale-105"
                                    title="Save changes"
                                  >
                                    {isUpdating ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Save className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setEditingCashier(null)}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 
                                               transition-all duration-200 hover:scale-105"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  {/* Reset PIN Button */}
                                  <button
                                    onClick={() => {
                                      setResetModalCashier({
                                        cashier,
                                        posName: pos.posName,
                                      });
                                      setCustomPinInput("");
                                    }}
                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 
                                               transition-all duration-200 hover:scale-105"
                                    title="Reset PIN / Password"
                                  >
                                    <Key className="w-4 h-4" />
                                  </button>

                                  {/* Edit Details */}
                                  <button
                                    onClick={() =>
                                      setEditingCashier({
                                        id: cashier.id,
                                        shiftStart: cashier.shiftStart || "",
                                        shiftEnd: cashier.shiftEnd || "",
                                        openingCash: cashier.openingCash,
                                      })
                                    }
                                    className="p-2 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 
                                               transition-all duration-200 hover:scale-105"
                                    title="Edit shift & opening cash"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>

                                  {/* Enable / Disable */}
                                  <button
                                    onClick={() =>
                                      toggleCashierStatus(cashier.id, cashier.isActive)
                                    }
                                    disabled={isUpdating}
                                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                                      cashier.isActive
                                        ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                                        : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                    } disabled:opacity-50`}
                                    title={
                                      cashier.isActive
                                        ? "Disable cashier"
                                        : "Enable cashier"
                                    }
                                  >
                                    {isUpdating ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : cashier.isActive ? (
                                      <PowerOff className="w-4 h-4" />
                                    ) : (
                                      <Power className="w-4 h-4" />
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESET PIN MODAL */}
      {resetModalCashier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setResetModalCashier(null);
                setCustomPinInput("");
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Reset Cashier PIN</h3>
                <p className="text-xs text-gray-500">
                  {resetModalCashier.cashier.username} • {resetModalCashier.posName}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-3 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Current PIN:</span>
                <span className="font-mono font-bold text-gray-800">
                  {resetModalCashier.cashier.pin || "None / Hash"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-gray-500">Station URL:</span>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/cashier/${resetModalCashier.cashier.id}`;
                    copyToClipboard(url, "modal-url");
                  }}
                  className="text-violet-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  Copy Terminal Link
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1.5">
                  Set Custom 4 to 6 Digit PIN
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 4829 or 102938"
                  value={customPinInput}
                  onChange={(e) => setCustomPinInput(e.target.value.replace(/\D/g, ""))}
                  className="w-full font-mono text-center text-lg tracking-widest px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
                />
                <p className="text-[11px] text-gray-400 mt-1 text-center">
                  Only numbers allowed (4 to 6 digits)
                </p>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-3 text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                disabled={isSubmittingReset}
                onClick={() => handleResetPin(true)}
                className="w-full py-2.5 px-4 bg-violet-50 hover:bg-violet-100 text-violet-700 text-sm font-semibold rounded-xl border border-violet-200 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-violet-600" />
                Auto-Generate Random 4-Digit PIN
              </button>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetModalCashier(null);
                    setCustomPinInput("");
                  }}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingReset || customPinInput.length < 4}
                  onClick={() => handleResetPin(false)}
                  className="flex-1 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmittingReset ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Custom PIN"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
