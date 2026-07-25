import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import type { AnalyticsProduct, AnalyticsCategory, CartItem } from "@/lib/types";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const posList = await prisma.pOS.findMany({
      where: {
        userId: user.id,
      },
    });

    if (posList.length === 0) {
      return NextResponse.json({
        success: true,
        analytics: [],
      });
    }

    const posIds = posList.map((p) => p.id);

    const [orders, cashiers] = await Promise.all([
      prisma.order.findMany({
        where: {
          posId: {
            in: posIds,
          },
        },
      }),

      prisma.cashier.findMany({
        where: {
          posId: {
            in: posIds,
          },
        },
      }),
    ]);

    const analytics = posList.map((pos) => {

      const posOrders = orders.filter(
        (order) => order.posId === pos.id
      );

      const posCashiers = cashiers.filter(
        (cashier) => cashier.posId === pos.id
      );
        

        // =========================
        // REVENUE
        // =========================

      const revenue = posOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );

      const orderCount = posOrders.length;

      const averageOrderValue = orderCount > 0
          ? revenue / orderCount
          : 0;

        // =========================
        // DAILY REVENUE
        // =========================

      const revenueByDay: Record<string, number> = {};

      posOrders.forEach((order) => {
        const day = new Date(order.createdAt)
          .toISOString()
          .split("T")[0];

        revenueByDay[day] = (revenueByDay[day] || 0) + order.total;
      });

      const dailyRevenue = Object.entries(
        revenueByDay
      ).map(([date, revenue]) => ({
        date,
        revenue,
      }));

        // =========================
        // PRODUCTS & CATEGORIES
        // AFTER DISCOUNT
        // =========================

      const productMap: Record<string,AnalyticsProduct> = {};
      const categoryMap: Record<string,AnalyticsCategory> = {};

      posOrders.forEach((order) => {
        const items = order.items as CartItem[];

        const subtotal = items.reduce(
          (sum, item) =>
            sum +
            item.product.price *
              item.quantity,
          0
        );

        const factor = subtotal > 0 ? order.total / subtotal : 1;

        items.forEach((item) => {
          const product = item.product;

          const revenueAfterDiscount = product.price * item.quantity * factor;

          if (!productMap[product.name]) {
            productMap[product.name] = {
              name: product.name,
              quantity: 0,
              revenue: 0,
              category: product.category || "Uncategorized",
            };
          }

          productMap[product.name].quantity += item.quantity;
          productMap[product.name].revenue += revenueAfterDiscount;
          const category = product.category || "Uncategorized";

          if (!categoryMap[category]) {
            categoryMap[category] = {
              category,
              revenue: 0,
            };
          }

          categoryMap[category].revenue += revenueAfterDiscount;
        });
      });

      const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

      const topCategories = Object.values(
        categoryMap
      ).sort((a, b) => b.revenue - a.revenue);

        // =========================
        // BUSIEST HOURS
        // =========================

      const hourMap: Record<number,number> = {};

      posOrders.forEach((order) => {
        const hour =
          new Date(
            order.createdAt
          ).getHours();

        hourMap[hour] =
          (hourMap[hour] || 0) + 1;
      });

      const busiestHours =
        Object.entries(hourMap)
          .map(([hour, orders]) => ({
            hour: hour.toString().padStart(2, "0") + ":00",
            orders,
          }))
          .sort((a, b) =>
            Number(b.orders) -
            Number(a.orders)
          )
          .slice(0, 5);

        // =========================
        // CASHIER PERFORMANCE
        // =========================

        const cashierPerformance = posCashiers.map(
          (cashier) => {
            const cashierOrders = posOrders.filter(
              (order) => order.cashierId === cashier.id
            );

            const cashierRevenue = cashierOrders.reduce(
              (sum,order) => sum + order.total, 0
            );

            return {
              id: cashier.id,
              username: cashier.username,
              openingCash: cashier.openingCash,
              orders: cashierOrders.length,
              revenue: cashierRevenue,
            };
          }
        );

        return {
          posId: pos.id,
          posName: pos.name,
          revenue,
          orderCount,
          averageOrderValue,
          dailyRevenue,
          cashiers:cashierPerformance,
          topProducts,
          topCategories,
          busiestHours,
        };
      }
    );

    return NextResponse.json({
      success: true,
      analytics,
    });


  } catch (err) {

    console.error("Analytics error:",err);
    return NextResponse.json(
      { error: "Failed to load analytics"},
      { status: 500}
    );
  }
}