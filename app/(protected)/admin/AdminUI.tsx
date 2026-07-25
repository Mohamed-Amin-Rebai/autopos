"use client";

import { useEffect, useState } from "react";
import AdminCashierRequests from "@/components/AdminCashierRequests";
import { User , POSSummary , Order} from "@/lib/types";
import { toast } from "sonner";
import { 
  Users, 
  ShoppingBag, 
  Package, 
  Loader2, 
  CheckCircle, 
  Clock,
  ArrowUpRight,
} from "lucide-react";

export default function AdminUI() {
  const [users, setUsers] = useState<User[]>([]);
  const [posList, setPosList] = useState<POSSummary[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPOS, setSelectedPOS] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/users");

        if (!res.ok) {
          throw new Error("Failed to load users");
        }

        const data = await res.json();
        setUsers(data.users);

      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // load POS
  const loadPOS = async (userId: string) => {
    setLoading(true);

    try {
      setSelectedUser(userId);
      setSelectedPOS(null);
      setOrders([]);

      const res = await fetch(`/api/pos/user/${userId}`);

      if (!res.ok) {
        throw new Error("Failed to load POS");
      }

      const data = await res.json();

      setPosList(data.posList);

    } catch (err) {
      console.error(err);
        toast.error("Failed to load POS");
    } finally {
      setLoading(false);
    }
  };

  // load orders
  const loadOrders = async (posId: string) => {
    setLoading(true);

    try {
      setSelectedPOS(posId);

      const res = await fetch(`/api/orders/${posId}`);

      if (!res.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await res.json();
      setOrders(data);

    } catch (err) {
      console.error(err);
        toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // update order
  const updateOrder = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);

      const res = await fetch("/api/orders/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "paid" }
            : o
        )
      );
      toast.success("Order marked as paid");

    } catch (err) {
      console.error(err);
      toast.error("Failed to update order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Get stats
  const totalUsers = users.length;
  const totalPOS = posList.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const paidOrders = orders.filter(o => o.status === "paid").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-4 md:p-8">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Monitor users, POS systems, and orders in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-600">All systems online</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">POS Systems</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalPOS}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{pendingOrders}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Paid Orders</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{paidOrders}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* USERS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-700">Users</h2>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {totalUsers}
                </span>
              </div>
            </div>

            <div className="p-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 text-center">No users found</p>
                </div>
              )}

              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => loadPOS(u.id)}
                  className={`group cursor-pointer px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                  ${
                    selectedUser === u.id
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                      : "hover:bg-gray-50 text-gray-700 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{u.email}</span>
                    {selectedUser === u.id && (
                      <ArrowUpRight className="w-4 h-4 text-white/70" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* POS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-700">POS Systems</h2>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {totalPOS}
                </span>
              </div>
            </div>

            <div className="p-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {selectedUser && posList.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 text-center">No POS for this user</p>
                </div>
              )}

              {!selectedUser && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 text-center">Select a user to view POS</p>
                </div>
              )}

              {posList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => loadOrders(p.id)}
                  className={`group cursor-pointer px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                  ${
                    selectedPOS === p.id
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                      : "hover:bg-gray-50 text-gray-700 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{p.name}</span>
                    {selectedPOS === p.id && (
                      <ArrowUpRight className="w-4 h-4 text-white/70" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDERS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-700">Orders</h2>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {orders.length}
                </span>
              </div>
            </div>

            <div className="p-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {selectedPOS && orders.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 text-center">No orders for this POS</p>
                </div>
              )}

              {!selectedPOS && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 text-center">Select a POS to view orders</p>
                </div>
              )}

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200 last:mb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {order.total} TND
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          order.status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION */}
                  {order.status === "pending" && (
                    <button
                      disabled={updatingOrderId === order.id}
                      onClick={() => updateOrder(order.id)}
                      className="mt-2 w-full text-xs font-medium bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2 rounded-xl 
                                hover:from-emerald-700 hover:to-green-700 transition-all duration-200 
                                disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20
                                hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                    >
                      {updatingOrderId === order.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mark as Paid
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* CASHIER REQUESTS */}
      <AdminCashierRequests />

      {/* GLOBAL LOADING */}
      {loading && (
        <div className="max-w-7xl mx-auto mt-6">
          <div className="flex items-center justify-center gap-3 py-4 bg-white rounded-2xl shadow-sm border border-gray-200/50">
            <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
            <span className="text-sm text-gray-600 font-medium">Loading...</span>
          </div>
        </div>
      )}

    </div>
  );
}