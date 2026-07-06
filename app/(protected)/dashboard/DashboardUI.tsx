"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, DollarSign, Package, Clock, CheckCircle, ArrowRight, Loader2, Users } from "lucide-react";

export default function DashboardUI({ userId }: { userId: string }) {
  const [posList, setPosList] = useState<any[]>([]);
  const [ordersMap, setOrdersMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [cashiersMap, setCashiersMap] = useState<Record<string, any[]>>({});

  const router = useRouter();

  useEffect(() => {
    const fetchPOS = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/pos?userId=${userId}`);
        const data = await res.json();

        setPosList(data);

        const ordersEntries = await Promise.all(
          data.map(async (pos: any) => {
            const res = await fetch(`/api/orders?posId=${pos.id}`);
            const orders = await res.json();
            return [pos.id, orders];
          })
        );
        setOrdersMap(Object.fromEntries(ordersEntries));

        const cashierEntries = await Promise.all(
          data.map(async (pos: any) => {
            const res = await fetch(`/api/cashiers?posId=${pos.id}`);
            const cashiers = await res.json();
            return [pos.id, cashiers];
          })
        );
        setCashiersMap(Object.fromEntries(cashierEntries));

      } catch (err) {
        console.error("POS Systems load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPOS();
  }, [userId]);

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading your POS Systems...</p>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-4 md:p-8">

      {/* ✅ HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
              My POS Systems
            </h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Manage your POS systems and Cashiers in one place
            </p>
          </div>
          {posList.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-600">{posList.length} POS system{posList.length > 1 ? 's' : ''} active</span>
            </div>
          )}
        </div>
      </div>

      {/* ✅ EMPTY STATE */}
      {posList.length === 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200/50 p-12 text-center hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No POS Yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first POS system to start managing your business
              </p>
              <button
                onClick={() => router.push("/welcome")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
              >
                Create Your First POS 🚀
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ GRID */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">

          {posList.map((pos) => {
            // const orders = ordersMap[pos.id] || [];
            const orders = Array.isArray(ordersMap[pos.id])
              ? ordersMap[pos.id]
              : [];
            const cashiers = cashiersMap[pos.id] || [];

            const totalRevenue = orders.reduce(
              (sum: number, o: any) => sum + o.total,
              0
            );

            const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
            const paidOrders = orders.filter((o: any) => o.status === "paid").length;

            return (
              <div
                key={pos.id}
                className="group relative bg-white rounded-3xl shadow-sm border border-gray-200/50 p-6 transition-all duration-300
                          hover:shadow-2xl hover:-translate-y-1 hover:border-gray-300/50
                          overflow-hidden"
              >
                {/* Background gradient glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-400 rounded-full blur-[100px] opacity-20" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400 rounded-full blur-[100px] opacity-20" />
                </div>

                {/* ✅ HEADER */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-semibold text-lg text-gray-900 truncate max-w-[150px]">
                      {pos.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => router.push(`/pos?posId=${pos.id}`)}
                    className="group/btn text-sm bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 flex items-center gap-1"
                  >
                    Open
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => router.push(`/request-cashiers/${pos.id}`)}
                    className="group/btn text-sm bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 flex items-center gap-1"
                  >
                    Request Cashiers
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                </div>

                {/* ✅ STATS */}
                <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">

                  {/* ORDERS */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200/50">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-violet-100 rounded-lg">
                        <ShoppingBag size={14} className="text-violet-600" />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Orders</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-xl font-bold text-gray-900">{orders.length}</p>
                      <div className="flex gap-1 text-[10px]">
                        {pendingOrders > 0 && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">{pendingOrders} pending</span>
                        )}
                        {paidOrders > 0 && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{paidOrders} paid</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* REVENUE */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200/50">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <DollarSign size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Revenue</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-xl font-bold text-gray-900">{totalRevenue.toFixed(2)} TND</p>
                      {orders.length > 0 && (
                        <span className="text-[10px] text-emerald-600 font-medium">
                          avg {(totalRevenue / orders.length).toFixed(2)} TND
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* ✅ RECENT ORDERS */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Recent Orders</span>
                    {orders.length > 3 && (
                      <span className="text-[10px] text-violet-600 font-medium">+{orders.length - 3} more</span>
                    )}
                  </div>

                  <div className="space-y-1.5">

                    {orders.length === 0 && (
                      <div className="text-center py-6">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-400">No orders yet</p>
                      </div>
                    )}

                    {orders.slice(0, 3).map((order: any) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center text-xs bg-white rounded-xl px-3 py-2.5 border border-gray-100 hover:border-gray-200 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            order.status === "paid" ? "bg-emerald-500" : "bg-amber-500"
                          }`} />
                          <span className="font-medium text-gray-700">{order.total} TND</span>
                        </div>

                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            order.status === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    ))}

                  </div>
                </div>

                {/* ✅ QUICK ACTION */}
                {orders.some((o: any) => o.status === "pending") && (
                  <button
                    className="mt-4 w-full text-xs font-medium bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2.5 rounded-xl 
                              hover:from-emerald-700 hover:to-green-700 transition-all duration-200 
                              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20
                              hover:shadow-emerald-500/30 relative z-10 flex items-center justify-center gap-2"
                    disabled={!!updatingOrderId}
                    onClick={async () => {
                      try {
                        const pending = orders.find((o: any) => o.status === "pending");
                        if (!pending) return;

                        setUpdatingOrderId(pending.id);

                        const res = await fetch("/api/orders/update", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ orderId: pending.id }),
                        });

                        if (!res.ok) {
                          throw new Error("Failed to update order");
                        }

                        setOrdersMap((prev: any) => ({
                          ...prev,
                          [pos.id]: prev[pos.id].map((o: any) =>
                            o.id === pending.id
                              ? { ...o, status: "paid" }
                              : o
                          ),
                        }))
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setUpdatingOrderId(null);
                      }
                    }}
                  >
                    {updatingOrderId ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark one as Paid
                      </>
                    )}
                  </button>
                )}

                {/* ✅ CASHIERS */}
                <div className="mt-4 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Cashiers
                    </p>
                    {cashiers.length > 0 && (
                      <span className="text-[10px] text-violet-600 font-medium">
                        {cashiers.length} active
                      </span>
                    )}
                  </div>

                  {cashiers.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-1.5">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-400">No cashiers assigned</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cashiers.map((cashier: any) => (
                        <div
                          key={cashier.id}
                          className="group/cashier bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200/50 hover:border-violet-200/50 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-violet-700">
                                  {cashier.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-800">
                                  {cashier.username}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                    <Clock className="w-2.5 h-2.5" />
                                    {cashier.shiftStart}
                                  </span>
                                  <span className="text-[10px] text-gray-400">→</span>
                                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                                    <Clock className="w-2.5 h-2.5" />
                                    {cashier.shiftEnd}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <p className="text-[10px] text-gray-400">Opening Cash</p>
                                <p className="text-xs font-semibold text-emerald-600">
                                  {cashier.openingCash} TND
                                </p>
                              </div>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}