"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [posList, setPosList] = useState<any[]>([]);
  const [ordersMap, setOrdersMap] = useState<any>({});

  const userId = "000000000000000000000000"; // temp user

  // ✅ LOAD POS
  useEffect(() => {
    const fetchPOS = async () => {
      const res = await fetch(`/api/pos?userId=${userId}`);
      const data = await res.json();

      setPosList(data);

      // ✅ fetch orders for each POS
      data.forEach(async (pos: any) => {
        const res = await fetch(`/api/orders?posId=${pos.id}`);
        const orders = await res.json();

        setOrdersMap((prev: any) => ({
          ...prev,
          [pos.id]: orders,
        }));
      });
    };

    fetchPOS();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        My POS Dashboard
      </h1>

      {posList.length === 0 && (
        <p className="text-gray-500">No POS yet</p>
      )}

      {posList.map((pos) => {
        const orders = ordersMap[pos.id] || [];

        const totalRevenue = orders.reduce(
          (sum: number, o: any) => sum + o.total,
          0
        );

        return (
          <div
            key={pos.id}
            className="mb-6 border rounded p-4 bg-gray-50"
          >
            {/* ✅ POS HEADER */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg">
                {pos.name}
              </h2>

              <button
                onClick={() =>
                  (window.location.href = `/pos?posId=${pos.id}`)
                }
                className="text-sm bg-black text-white px-2 py-1 rounded"
              >
                Open POS
              </button>
            </div>

            {/* ✅ STATS */}
            <div className="text-sm text-gray-600 mb-3">
              <p>Orders: {orders.length}</p>
              <p>Total Revenue: {totalRevenue.toFixed(2)} TND</p>
            </div>

            {/* ✅ ORDERS LIST */}
            <div>
              {orders.length === 0 && (
                <p className="text-sm text-gray-400">
                  No orders yet
                </p>
              )}

              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="bg-white border p-2 mb-2 rounded text-sm"
                >
                  <p>
                    <strong>Total:</strong> {order.total} TND
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}