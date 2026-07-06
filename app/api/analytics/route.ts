import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

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
        return NextResponse.json([]);
    }

    const analytics = await Promise.all(
      posList.map(async (pos: any) => {
        const orders = await prisma.order.findMany({
          where: {
            posId: pos.id,
          },
        });

        const cashiers = await prisma.cashier.findMany({
          where: {
            posId: pos.id,
          },
        });

        // =========================
        // REVENUE
        // =========================

        const revenue = orders.reduce(
          (sum: number, order: any) => sum + order.total,
          0
        );

        const orderCount = orders.length;

        const averageOrderValue =
          orderCount > 0
            ? revenue / orderCount
            : 0;

        // =========================
        // DAILY REVENUE
        // =========================

        const revenueByDay: Record<string, number> = {};

        orders.forEach((order: any) => {
          const day = new Date(order.createdAt)
            .toISOString()
            .split("T")[0];

          revenueByDay[day] =
            (revenueByDay[day] || 0) + order.total;
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

        const productMap: Record<
          string,
          {
            name: string;
            quantity: number;
            revenue: number;
            category?: string;
          }
        > = {};

        const categoryMap: Record<
          string,
          {
            category: string;
            revenue: number;
          }
        > = {};

        orders.forEach((order: any) => {
          const items = order.items as any[];

          const subtotal = items.reduce(
            (sum: number, item: any) =>
              sum +
              item.product.price *
                item.quantity,
            0
          );

          const factor =
            subtotal > 0
              ? order.total / subtotal
              : 1;

          items.forEach((item: any) => {
            const product = item.product;

            const revenueAfterDiscount =
              product.price *
              item.quantity *
              factor;

            if (!productMap[product.name]) {
              productMap[product.name] = {
                name: product.name,
                quantity: 0,
                revenue: 0,
                category:
                  product.category ||
                  "Uncategorized",
              };
            }

            productMap[product.name].quantity +=
              item.quantity;

            productMap[product.name].revenue +=
              revenueAfterDiscount;

            const category =
              product.category ||
              "Uncategorized";

            if (!categoryMap[category]) {
              categoryMap[category] = {
                category,
                revenue: 0,
              };
            }

            categoryMap[category].revenue +=
              revenueAfterDiscount;
          });
        });

        const topProducts = Object.values(
          productMap
        )
          .sort(
            (a, b) =>
              b.quantity - a.quantity
          )
          .slice(0, 5);

        const topCategories = Object.values(
          categoryMap
        ).sort(
          (a, b) =>
            b.revenue - a.revenue
        );

        // =========================
        // BUSIEST HOURS
        // =========================

        const hourMap: Record<
          number,
          number
        > = {};

        orders.forEach((order: any) => {
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
              hour:
                hour.toString().padStart(
                  2,
                  "0"
                ) + ":00",
              orders,
            }))
            .sort(
              (a, b) =>
                Number(b.orders) -
                Number(a.orders)
            )
            .slice(0, 5);

        // =========================
        // CASHIER PERFORMANCE
        // =========================

        const cashierPerformance =
          cashiers.map(
            (cashier: any) => {
              const cashierOrders =
                orders.filter(
                  (order: any) =>
                    order.cashierId ===
                    cashier.id
                );

              const cashierRevenue =
                cashierOrders.reduce(
                  (
                    sum: number,
                    order: any
                  ) =>
                    sum + order.total,
                  0
                );

              return {
                id: cashier.id,
                username:
                  cashier.username,
                openingCash:
                  cashier.openingCash,
                orders:
                  cashierOrders.length,
                revenue:
                  cashierRevenue,
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

          cashiers:
            cashierPerformance,

          topProducts,
          topCategories,

          busiestHours,
        };
      })
    );

    return NextResponse.json(
      analytics
    );
  } catch (err) {
    console.error(
      "Analytics error:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load analytics",
      },
      {
        status: 500,
      }
    );
  }
}