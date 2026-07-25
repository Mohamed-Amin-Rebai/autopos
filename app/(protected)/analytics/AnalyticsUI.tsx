"use client";

import { useEffect, useState } from "react";
import type { AnalyticsData } from "@/lib/types";
import { toast } from "sonner";
import { 
  TrendingUp,
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock, 
  Package, 
  BarChart3,
  Loader2,
  Calendar,
  Tag
} from "lucide-react";

export default function AnalyticsUI() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPOS, setSelectedPOS] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {

        setLoading(true);
        const res = await fetch("/api/analytics");
        const response = await res.json();
        setAnalytics(response.analytics);
        if (response.analytics.length > 0) {
          setSelectedPOS(response.analytics[0].posId);
        }

      } catch (err) {
        console.error("Failed to load analytics:", err);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const selectedData = analytics.find(a => a.posId === selectedPOS) || analytics[0];

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2) + ' TND';
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!selectedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">Start selling to see your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-4 md:p-8">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Track performance across all your POS systems
            </p>
          </div>
          
          {/* POS Selector */}
          {analytics.length > 1 && (
            <div className="flex items-center gap-2">
              <select
                value={selectedPOS || ''}
                onChange={(e) => setSelectedPOS(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
              >
                {analytics.map((data) => (
                  <option key={data.posId} value={data.posId}>
                    {data.posName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Revenue */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(selectedData.revenue)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {selectedData.orderCount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(selectedData.averageOrderValue)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Cashiers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Cashiers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {selectedData.cashiers.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* DAILY REVENUE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Daily Revenue</h3>
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {selectedData.dailyRevenue.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No daily revenue data</p>
              ) : (
                selectedData.dailyRevenue.slice().reverse().map((day) => (
                  <div key={day.date} className="flex items-center justify-between text-sm bg-gray-50 rounded-xl px-4 py-2.5">
                    <span className="text-gray-600">{day.date}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(day.revenue)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CASHIER PERFORMANCE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Cashier Performance</h3>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {selectedData.cashiers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No cashiers assigned</p>
              ) : (
                selectedData.cashiers.map((cashier) => (
                  <div key={cashier.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                          <span className="text-xs font-semibold text-violet-700">
                            {cashier.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-sm text-gray-800">{cashier.username}</span>
                      </div>
                      <span className="text-xs text-gray-400">Opening: {formatCurrency(cashier.openingCash)}</span>
                    </div>
                    <div className="flex justify-around text-xs">
                      <div className="text-center">
                        <p className="text-gray-400">Orders</p>
                        <p className="font-semibold text-gray-700">{cashier.orders}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Revenue</p>
                        <p className="font-semibold text-emerald-600">{formatCurrency(cashier.revenue)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Avg Order</p>
                        <p className="font-semibold text-violet-600">
                          {cashier.orders > 0 ? formatCurrency(cashier.revenue / cashier.orders) : '0.00 TND'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TOP PRODUCTS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Top Products</h3>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {selectedData.topProducts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No products sold yet</p>
              ) : (
                selectedData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-gray-50 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-violet-600 w-5">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        {product.category && (
                          <p className="text-xs text-gray-400">{product.category}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{product.quantity} sold</p>
                      <p className="text-xs text-emerald-600">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TOP CATEGORIES */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Tag className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Top Categories</h3>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {selectedData.topCategories.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No categories yet</p>
              ) : (
                selectedData.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-gray-50 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-violet-600 w-5">
                        #{index + 1}
                      </span>
                      <span className="font-medium text-gray-800">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">{formatCurrency(category.revenue)}</p>
                      <p className="text-xs text-gray-400">
                        Category Revenue
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* BUSIEST HOURS */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Busiest Hours</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {selectedData.busiestHours.length === 0 ? (
                <p className="text-sm text-gray-400 text-center col-span-full py-4">No order data available</p>
              ) : (
                selectedData.busiestHours.map((hour, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 text-center border border-gray-200/50 hover:border-amber-200/50 transition-all">
                    <p className="text-lg font-bold text-amber-600">{hour.hour}</p>
                    <p className="text-xs text-gray-500">{hour.orders} orders</p>
                    {index === 0 && (
                      <span className="inline-block mt-1 text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Peak
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}