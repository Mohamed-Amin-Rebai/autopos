import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import type {
  AnalyticsCategory,
  AnalyticsProduct,
} from "@/lib/types";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asRecord<T>(value: unknown): Record<string, T> {
  return isRecord(value) ? value as Record<string, T> : {};
}

function getRangeDays(request: Request): number {
  const range = new URL(request.url).searchParams.get("range");
  return range === "90" ? 90 : 30;
}

export async function GET(request: Request) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rangeDays = getRangeDays(request);
    const endDate = new Date();
    const startDate = new Date(Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate() - (rangeDays - 1),
    ));
    const exclusiveEndDate = new Date(startDate);
    exclusiveEndDate.setUTCDate(exclusiveEndDate.getUTCDate() + rangeDays);

    const posList = await prisma.pOS.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    });

    if (posList.length === 0) {
      return NextResponse.json({ success: true, analytics: [] });
    }

    const posIds = posList.map((pos) => pos.id);
    const [summaries, cashiers] = await Promise.all([
      prisma.analyticsSummary.findMany({
        where: {
          userId: user.id,
          posId: { in: posIds },
          date: {
            gte: startDate,
            lt: exclusiveEndDate,
          },
        },
        orderBy: { date: "asc" },
      }),
      prisma.cashier.findMany({
        where: { posId: { in: posIds } },
        select: {
          id: true,
          posId: true,
          username: true,
          openingCash: true,
        },
      }),
    ]);

    const analytics = posList.map((pos) => {
      const posSummaries = summaries.filter((summary) => summary.posId === pos.id);
      const revenue = posSummaries.reduce(
        (sum, summary) => sum + summary.revenue,
        0,
      );
      const orderCount = posSummaries.reduce(
        (sum, summary) => sum + summary.orderCount,
        0,
      );
      const productMap: Record<string, AnalyticsProduct> = {};
      const categoryMap: Record<string, AnalyticsCategory> = {};
      const hourMap: Record<string, number> = {};
      const cashierMap: Record<string, {
        orders: number;
        revenue: number;
      }> = {};

      const dailyRevenue = posSummaries.map((summary) => ({
        date: summary.date.toISOString().split("T")[0],
        revenue: summary.revenue,
      }));

      for (const summary of posSummaries) {
        const products = asRecord<AnalyticsProduct>(summary.productStats);
        for (const [name, product] of Object.entries(products)) {
          const current = productMap[name] ?? {
            name,
            quantity: 0,
            revenue: 0,
            category: product.category || "Uncategorized",
          };
          current.quantity += product.quantity;
          current.revenue += product.revenue;
          productMap[name] = current;
        }

        const categories = asRecord<AnalyticsCategory>(summary.categoryStats);
        for (const [category, metric] of Object.entries(categories)) {
          const current = categoryMap[category] ?? {
            category,
            revenue: 0,
          };
          current.revenue += metric.revenue;
          categoryMap[category] = current;
        }

        const hours = asRecord<number>(summary.hourlyStats);
        for (const [hour, count] of Object.entries(hours)) {
          hourMap[hour] = (hourMap[hour] ?? 0) + count;
        }

        const cashiersForDay = asRecord<{
          id: string;
          orders: number;
          revenue: number;
        }>(summary.cashierStats);
        for (const [cashierId, metric] of Object.entries(cashiersForDay)) {
          const current = cashierMap[cashierId] ?? {
            orders: 0,
            revenue: 0,
          };
          current.orders += metric.orders;
          current.revenue += metric.revenue;
          cashierMap[cashierId] = current;
        }
      }

      const posCashiers = cashiers.filter((cashier) => cashier.posId === pos.id);
      const cashierPerformance = posCashiers.map((cashier) => ({
        id: cashier.id,
        username: cashier.username,
        openingCash: cashier.openingCash,
        orders: cashierMap[cashier.id]?.orders ?? 0,
        revenue: cashierMap[cashier.id]?.revenue ?? 0,
      }));

      return {
        posId: pos.id,
        posName: pos.name,
        revenue,
        orderCount,
        averageOrderValue: orderCount > 0 ? revenue / orderCount : 0,
        dailyRevenue,
        cashiers: cashierPerformance,
        topProducts: Object.values(productMap)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5),
        topCategories: Object.values(categoryMap)
          .sort((a, b) => b.revenue - a.revenue),
        busiestHours: Object.entries(hourMap)
          .map(([hour, orders]) => ({
            hour: `${hour.padStart(2, "0")}:00`,
            orders,
          }))
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 5),
      };
    });

    return NextResponse.json({
      success: true,
      rangeDays,
      analytics,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 },
    );
  }
}
