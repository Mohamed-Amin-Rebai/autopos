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
    <div className="p-6 grid grid-cols-3 gap-6">

      {/* USERS */}
      <div>
        <h2 className="font-bold mb-3">Users</h2>

        {users.length === 0 && (
          <p className="text-sm text-gray-400">No users found</p>
        )}

        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => loadPOS(u.id)}
            className={`p-2 border mb-2 cursor-pointer ${
              selectedUser === u.id
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {u.email}
          </div>
        ))}
      </div>

      {/* POS */}
      <div>
        <h2 className="font-bold mb-3">POS</h2>

        {selectedUser && posList.length === 0 && !loading && (
          <p className="text-sm text-gray-400">
            This user has no POS yet
          </p>
        )}

        {posList.map((p) => (
          <div
            key={p.id}
            onClick={() => loadOrders(p.id)}
            className={`p-2 border mb-2 cursor-pointer ${
              selectedPOS === p.id
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {p.name}
          </div>
        ))}
      </div>

      {/* ORDERS */}
      <div>
        <h2 className="font-bold mb-3">Orders</h2>

        {selectedPOS && orders.length === 0 && !loading && (
          <p className="text-sm text-gray-400">
            No orders for this POS
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="border p-2 mb-2 bg-white rounded text-sm"
          >
            <p>
              <strong>Total:</strong> {order.total} TND
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  order.status === "paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              >
                {order.status}
              </span>
            </p>

            {/* ✅ improved action */}
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

                    // ✅ update UI instantly (no reload)
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
                className="mt-1 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {updatingOrderId === order.id
                  ? "Updating..."
                  : "Mark as Paid"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ✅ GLOBAL LOADING */}
      {loading && (
        <p className="col-span-3 text-center text-sm text-gray-500">
          Loading...
        </p>
      )}

    </div>
  );
}