"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, DollarSign } from "lucide-react";

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

    <div className="p-6 max-w-6xl mx-auto">

      {/* ✅ HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your POS systems and track performance
        </p>
      </div>

      {/* ✅ EMPTY STATE */}
      {posList.length === 0 && (
        <div className="bg-white border rounded-2xl p-6 text-center shadow-sm">
          <p className="text-gray-500">
            No POS yet — create your first one 🚀
          </p>
        </div>
      )}

      {/* ✅ GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {posList.map((pos) => {
          const orders = ordersMap[pos.id] || [];

          const totalRevenue = orders.reduce(
            (sum: number, o: any) => sum + o.total,
            0
          );

          return (
            <div
              key={pos.id}
              className="relative bg-white border rounded-2xl p-5 shadow-sm transition-all duration-300
                        hover:shadow-xl hover:-translate-y-1 
                        before:absolute before:inset-0 before:rounded-2xl 
                        before:opacity-0 hover:before:opacity-10
                        before:bg-gradient-to-r before:from-purple-500 before:via-blue-500 before:to-indigo-500
                        before:transition-all before:duration-300"
            >

              {/* ✅ HEADER */}
              <div className="flex justify-between items-center mb-5 relative z-10">
                <h2 className="font-semibold text-lg">
                  {pos.name}
                </h2>

                <button
                  onClick={() => router.push(`/pos?posId=${pos.id}`)}
                  className="text-sm bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
                >
                  Open
                </button>
              </div>

              {/* ✅ STATS */}
              <div className="flex justify-between mb-5 relative z-10">

                {/* ORDERS */}
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ShoppingBag size={16} className="text-gray-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Orders
                    </p>
                    <p className="font-semibold text-sm">
                      {orders.length}
                    </p>
                  </div>
                </div>

                {/* REVENUE */}
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <DollarSign size={16} className="text-gray-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Revenue
                    </p>
                    <p className="font-semibold text-sm">
                      {totalRevenue.toFixed(2)} TND
                    </p>
                  </div>
                </div>

              </div>

              {/* ✅ RECENT ORDERS */}
              <div className="space-y-2 relative z-10">

                {orders.length === 0 && (
                  <p className="text-xs text-gray-400">
                    No orders yet
                  </p>
                )}

                {orders.slice(0, 3).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center text-xs bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <span>{order.total} TND</span>

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
                ))}

              </div>

              {/* ✅ QUICK ACTION */}
              {orders.some((o: any) => o.status === "pending") && (
                <button
                  className="mt-4 w-full text-xs bg-green-600 text-white py-2 rounded-lg 
                            hover:bg-green-700 transition disabled:opacity-50 relative z-10"
                  disabled={!!updatingOrderId}
                  onClick={async () => {
                    try {
                      const pending = orders.find((o: any) => o.status === "pending");
                      if (!pending) return;

                      setUpdatingOrderId(pending.id);

                      await fetch("/api/orders/update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderId: pending.id }),
                      });

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
                  {updatingOrderId ? "Updating..." : "Mark one as Paid"}
                </button>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}