"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  UserX
} from "lucide-react";

interface Cashier {
  id: string;
  username: string;
  openingCash: number;
  shiftStart: string | null;
  shiftEnd: string | null;
  isActive: boolean;
  createdAt: string;
}

interface POSData {
  posId: string;
  posName: string;
  cashiers: Cashier[];
}

export default function CashiersUI() {
  const [posData, setPosData] = useState<POSData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCashier, setEditingCashier] = useState<{
    id: string;
    shiftStart: string;
    shiftEnd: string;
    openingCash: number;
    } | null>(null);
    
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadCashiers();
  }, []);

  const getWorkStatus = (
    shiftStart?: string | null,
    shiftEnd?: string | null
    ) => {
    if (!shiftStart || !shiftEnd) {
        return false;
    }

    const now = new Date();

    const current =
        now.getHours() * 60 +
        now.getMinutes();

    const [startHour, startMinute] =
        shiftStart.split(":").map(Number);

    const [endHour, endMinute] =
        shiftEnd.split(":").map(Number);

    const start =
        startHour * 60 + startMinute;

    const end =
        endHour * 60 + endMinute;

    if (start <= end) {
        return (
        current >= start &&
        current <= end
        );
    }

    return (
        current >= start ||
        current <= end
    );
    };

  const loadCashiers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cashier-management");
      if (!res.ok) throw new Error("Failed to load cashiers");
      const data = await res.json();
      setPosData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCashierStatus = async (cashierId: string, currentStatus: boolean) => {
    try {
      setUpdatingId(cashierId);
      const res = await fetch(`/api/cashier/${cashierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cashierId, isActive: !currentStatus })
      });
      
      if (!res.ok) throw new Error("Failed to toggle status");
      
      setPosData(prev => prev.map(pos => ({
        ...pos,
        cashiers: pos.cashiers.map(c => 
          c.id === cashierId ? { ...c, isActive: !currentStatus } : c
        )
      })));
    } catch (err) {
      console.error(err);
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
        body: JSON.stringify(editingCashier)
      });
      
      if (!res.ok) throw new Error("Failed to update cashier");
      
      const updated = await res.json();
      setPosData(prev => prev.map(pos => ({
        ...pos,
        cashiers: pos.cashiers.map(c => 
          c.id === updated.id ? updated : c
        )
      })));
      setEditingCashier(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredData = posData.map(pos => ({
    ...pos,
    cashiers: pos.cashiers.filter(c => 
      c.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }))

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
    <div className="max-w-7xl mx-auto mt-6 space-y-6 px-4 sm:px-6">
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
            Manage all cashiers across your POS locations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
            {posData.reduce((acc, pos) => acc + pos.cashiers.length, 0)} Total
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
                      {pos.cashiers.length} cashier{pos.cashiers.length !== 1 ? 's' : ''}
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

                      return (
                        <tr key={cashier.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shadow-sm">
                                <span className="text-xs font-semibold text-violet-700">
                                  {cashier.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {cashier.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingCashier?.openingCash || 0}
                                onChange={(e) => setEditingCashier(prev => prev ? {
                                  ...prev,
                                  openingCash: parseFloat(e.target.value) || 0
                                } : null)}
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
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={editingCashier?.shiftStart || ''}
                                  onChange={(e) => setEditingCashier(prev => prev ? {
                                    ...prev,
                                    shiftStart: e.target.value
                                  } : null)}
                                  className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm 
                                             focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                                             bg-white"
                                />
                                <span className="text-gray-300">→</span>
                                <input
                                  type="time"
                                  value={editingCashier?.shiftEnd || ''}
                                  onChange={(e) => setEditingCashier(prev => prev ? {
                                    ...prev,
                                    shiftEnd: e.target.value
                                  } : null)}
                                  className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm 
                                             focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                                             bg-white"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm bg-gray-50 px-2 py-1 rounded-lg">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-gray-700 font-medium">{cashier.shiftStart || '--'}</span>
                                <span className="text-gray-300">→</span>
                                <span className="text-gray-700 font-medium">{cashier.shiftEnd || '--'}</span>
                              </div>
                            )}
                          </td>
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
                                Off Shift
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              cashier.isActive
                                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                                : 'bg-red-100 text-red-600 ring-1 ring-red-200'
                            }`}>
                              {cashier.isActive ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
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
                                  <button
                                    onClick={() => setEditingCashier({
                                      id: cashier.id,   
                                      shiftStart: cashier.shiftStart || '',
                                      shiftEnd: cashier.shiftEnd || '',
                                      openingCash: cashier.openingCash,
                                    })}
                                    className="p-2 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 
                                               transition-all duration-200 hover:scale-105 opacity-0 group-hover:opacity-100"
                                    title="Edit cashier"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => toggleCashierStatus(cashier.id, cashier.isActive)}
                                    disabled={isUpdating}
                                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                                      cashier.isActive
                                        ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                    } disabled:opacity-50`}
                                    title={cashier.isActive ? 'Disable cashier' : 'Enable cashier'}
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
    </div>
  );
}