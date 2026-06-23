"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [posList, setPosList] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPOS, setSelectedPOS] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ LOAD USERS
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  // ✅ LOAD POS FOR USER
  const loadPOS = async (userId: string) => {
    setLoading(true);

    try {
      setSelectedUser(userId);
      setSelectedPOS(null);
      setOrders([]);

      const res = await fetch(`/api/pos?userId=${userId}`);

      if (!res.ok) {
        console.error("Failed to fetch");
        return;
      }

      const data = await res.json();
      setPosList(data);
      } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }  

  // ✅ LOAD ORDERS FOR POS
  const loadOrders = async (posId: string) => {

    setLoading(true);

    try {
      setSelectedPOS(posId);

      const res = await fetch(`/api/orders?posId=${posId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

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

      {/* ✅ USERS */}
      <div>
        <h2 className="font-bold mb-3">Users</h2>

        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => loadPOS(u.id)}
            className={`p-2 border mb-2 cursor-pointer ${
              selectedUser === u.id ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            {u.email}
          </div>
        ))}
      </div>

      {/* ✅ POS */}
      <div>
        <h2 className="font-bold mb-3">POS</h2>

        {posList.map((p) => (
          <div
            key={p.id}
            onClick={() => loadOrders(p.id)}
            className={`p-2 border mb-2 cursor-pointer ${
              selectedPOS  === p.id ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            {p.name}
          </div>
        ))}
      </div>

      {/* ✅ ORDERS */}
      <div>
        <h2 className="font-bold mb-3">Orders</h2>

        {selectedPOS && orders.length === 0 && (
          <p className="text-sm text-gray-500">
            No orders
          </p>
        )}

        {orders.map((o) => (
          <div
            key={o.id}
            className="border p-2 mb-2 bg-white"
          >
            <p><strong>Total:</strong> {o.total} TND</p>
            <p><strong>Status:</strong> {o.status}</p>
            <p className="text-xs text-gray-500">
              {new Date(o.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}