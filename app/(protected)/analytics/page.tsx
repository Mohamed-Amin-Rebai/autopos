"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");

        if (!res.ok) {
          throw new Error("Failed to load analytics");
        }

        const data = await res.json();

        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const totalRevenue = analytics.reduce(
    (sum: number, pos: any) => sum + pos.revenue,
    0
  );

  const totalOrders = analytics.reduce(
    (sum: number, pos: any) => sum + pos.orderCount,
    0
  );

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0;

  return (
    <main className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Analytics Dashboard
      </h1>

      {/* OVERVIEW */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-gray-500">
            Total Revenue
          </p>
          <h2 className="text-3xl font-bold">
            {totalRevenue.toFixed(2)} TND
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>
          <h2 className="text-3xl font-bold">
            {totalOrders}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <p className="text-sm text-gray-500">
            Average Order Value
          </p>
          <h2 className="text-3xl font-bold">
            {averageOrderValue.toFixed(2)} TND
          </h2>
        </div>

      </div>

      {/* PER POS */}
      <div className="space-y-6">

        {analytics.map((pos: any) => (
          <div
            key={pos.posId}
            className="bg-white rounded-3xl p-6 border"
          >
            <h2 className="text-2xl font-bold mb-4">
              {pos.posName}
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Revenue
                </p>
                <p className="text-xl font-bold">
                  {pos.revenue.toFixed(2)} TND
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Orders
                </p>
                <p className="text-xl font-bold">
                  {pos.orderCount}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Avg Order
                </p>
                <p className="text-xl font-bold">
                  {pos.averageOrderValue.toFixed(2)} TND
                </p>
              </div>

                {/* daily revenue */}
              <div className="h-64 w-full mb-6">
                <ResponsiveContainer>
                    <LineChart data={pos.dailyRevenue}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={3}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>



            </div>

            {/* CASHIER PERFORMANCE */}
            <h3 className="font-semibold mb-3">
              Cashier Performance
            </h3>

            <div className="space-y-3">
              {pos.cashiers.length === 0 ? (
                <p className="text-gray-500">
                  No cashiers yet
                </p>
              ) : (
                pos.cashiers.map((cashier: any) => (
                  <div
                    key={cashier.id}
                    className="bg-gray-50 rounded-xl p-4 flex justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {cashier.username}
                      </p>

                      <p className="text-sm text-gray-500">
                        Opening Cash:{" "}
                        {cashier.openingCash} TND
                      </p>
                    </div>

                    <div className="text-right">
                      <p>
                        Orders: {cashier.orders}
                      </p>

                      <p className="font-semibold text-emerald-600">
                        {cashier.revenue.toFixed(2)} TND
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* top products */}
            <div className="mt-6">
                <h3 className="font-semibold mb-3">
                    Top Products
                </h3>

                <div className="space-y-2">
                    {pos.topProducts.map((product: any) => (
                    <div
                        key={product.name}
                        className="bg-gray-50 rounded-xl p-3 flex justify-between"
                    >
                        <span>{product.name}</span>

                        <span>
                        {product.quantity} sold
                        </span>
                    </div>
                    ))}
                </div>
            </div>

            {/* top categories */}
            <div className="mt-6">
                <h3 className="font-semibold mb-3">
                    Top Categories
                </h3>

                <div className="space-y-2">
                    {pos.topCategories.map((category: any) => (
                    <div
                        key={category.category}
                        className="bg-gray-50 rounded-xl p-3 flex justify-between"
                    >
                        <span>{category.category}</span>

                        <span>
                        {category.revenue.toFixed(2)} TND
                        </span>
                    </div>
                    ))}
                </div>
            </div>

            {/* busiest hours */}
            <div className="mt-6">
                <h3 className="font-semibold mb-3">
                    Busiest Hours
                </h3>

                <div className="space-y-2">
                    {pos.busiestHours.map((hour: any) => (
                    <div
                        key={hour.hour}
                        className="bg-gray-50 rounded-xl p-3 flex justify-between"
                    >
                        <span>{hour.hour}</span>

                        <span>
                        {hour.orders} orders
                        </span>
                    </div>
                    ))}
                </div>
            </div>

          </div>
        ))}

      </div>

    </main>
  );
}