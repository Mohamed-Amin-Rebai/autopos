"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardUI({ userId }: { userId: string }) {
  const [posList, setPosList] = useState<any[]>([]);
  const [ordersMap, setOrdersMap] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

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
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPOS();
  }, [userId]);

  // ✅ LOADING STATE
  if (loading) {
    return <p className="p-6">Loading your dashboard...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        My POS Dashboard
      </h1>

      {/* ✅ EMPTY STATE */}
      {posList.length === 0 && (
        <p className="text-gray-500">
          No POS yet — create your first one 🚀
        </p>
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
            className="mb-6 border rounded p-4 bg-gray-50 shadow-sm"
          >
            {/* ✅ POS HEADER */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg">
                {pos.name}
              </h2>

              <button
                onClick={() => router.push(`/pos?posId=${pos.id}`)}
                className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
              >
                Open POS
              </button>
            </div>

            {/* ✅ STATS */}
            <div className="text-sm text-gray-600 mb-3">
              <p>Orders: {orders.length}</p>
              <p>Total Revenue: {totalRevenue.toFixed(2)} TND</p>
            </div>

            {/* ✅ ORDERS */}
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

                  {/* ✅ IMPROVED MARK AS PAID */}
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

                          // ✅ update UI instantly (NO reload)
                          setOrdersMap((prev: any) => ({
                            ...prev,
                            [pos.id]: prev[pos.id].map((o: any) =>
                              o.id === order.id
                                ? { ...o, status: "paid" }
                                : o
                            ),
                          }));
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
          </div>
        );
      })}
    </div>
  );
}