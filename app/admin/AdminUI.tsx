"use client";

import { useEffect, useState } from "react";

export default function AdminUI() {
  const [users, setUsers] = useState<any[]>([]);
  const [posList, setPosList] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPOS, setSelectedPOS] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // ✅ load users
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  // ✅ load POS
  const loadPOS = async (userId: string) => {
    setLoading(true);

    try {
      setSelectedUser(userId);
      setSelectedPOS(null);
      setOrders([]);

      const res = await fetch(`/api/pos?userId=${userId}`);
      const data = await res.json();

      setPosList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ load orders
  const loadOrders = async (posId: string) => {
    setLoading(true);

    try {
      setSelectedPOS(posId);

      const res = await fetch(`/api/orders?posId=${posId}`);
      const data = await res.json();

      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ✅ HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor users, POS systems, and orders
        </p>
      </div>

      {/* ✅ MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ✅ USERS */}
        <div className="bg-white border rounded-2xl shadow-sm p-4 flex flex-col">

          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Users
          </h2>

          <div className="flex-1 overflow-y-auto space-y-2">

            {users.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-4">
                No users found
              </p>
            )}

            {users.map((u) => (
              <div
                key={u.id}
                onClick={() => loadPOS(u.id)}
                className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-all
                ${
                  selectedUser === u.id
                    ? "bg-black text-white shadow"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {u.email}
              </div>
            ))}

          </div>
        </div>

        {/* ✅ POS */}
        <div className="bg-white border rounded-2xl shadow-sm p-4 flex flex-col">

          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            POS Systems
          </h2>

          <div className="flex-1 overflow-y-auto space-y-2">

            {selectedUser && posList.length === 0 && !loading && (
              <p className="text-xs text-gray-400 text-center mt-4">
                No POS for this user
              </p>
            )}

            {posList.map((p) => (
              <div
                key={p.id}
                onClick={() => loadOrders(p.id)}
                className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-all
                ${
                  selectedPOS === p.id
                    ? "bg-black text-white shadow"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {p.name}
              </div>
            ))}

          </div>
        </div>

        {/* ✅ ORDERS */}
        <div className="bg-white border rounded-2xl shadow-sm p-4 flex flex-col">

          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Orders
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3">

            {selectedPOS && orders.length === 0 && !loading && (
              <p className="text-xs text-gray-400 text-center mt-4">
                No orders for this POS
              </p>
            )}

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 border rounded-xl p-3 text-xs shadow-sm"
              >

                {/* ✅ ORDER INFO */}
                <div className="flex justify-between mb-1">
                  <span className="font-medium">
                    {order.total} TND
                  </span>

                  <span
                    className={
                      order.status === "paid"
                        ? "text-green-600 font-medium"
                        : "text-yellow-600 font-medium"
                    }
                  >
                    {order.status}
                  </span>
                </div>

                {/* ✅ ACTION */}
                {order.status === "pending" && (
                  <button
                    disabled={updatingOrderId === order.id}
                    onClick={async () => {
                      try {
                        setUpdatingOrderId(order.id);

                        await fetch("/api/orders/update", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            orderId: order.id,
                          }),
                        });

                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === order.id
                              ? { ...o, status: "paid" }
                              : o
                          )
                        );
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setUpdatingOrderId(null);
                      }
                    }}
                    className="mt-2 w-full text-xs bg-green-600 text-white py-1.5 rounded-lg 
                              hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updatingOrderId === order.id
                      ? "Updating..."
                      : "Mark as Paid"}
                  </button>
                )}

              </div>
            ))}

          </div>
        </div>

      </div>

      {/* ✅ GLOBAL LOADING */}
      {loading && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Loading...
        </div>
      )}

    </div>
  );
}