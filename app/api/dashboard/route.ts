import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posList = await prisma.pOS.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        cashiers: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            username: true,
            openingCash: true,
            shiftStart: true,
            shiftEnd: true,
            isActive: true,
            createdAt: true,
          },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
            userId: true,
            posId: true,
            cashierId: true,
            items: true,
            total: true,
            discount: true,
            paymentDetails: true,
            status: true,
            receiptNumber: true,
            idempotencyKey: true,
            createdAt: true,
          },
        },
      },
    });

    if (posList.length === 0) {
      return NextResponse.json({ success: true, posList: [] });
    }

    const posIds = posList.map((pos) => pos.id);
    const [summaryTotals, orderCounts] = await Promise.all([
      prisma.analyticsSummary.groupBy({
        by: ["posId"],
        where: { posId: { in: posIds } },
        _sum: {
          revenue: true,
          orderCount: true,
        },
      }),
      prisma.order.groupBy({
        by: ["posId", "status"],
        where: { posId: { in: posIds } },
        _count: { _all: true },
      }),
    ]);

    const summariesByPos = new Map(
      summaryTotals.map((summary) => [
        summary.posId,
        {
          revenue: summary._sum.revenue ?? 0,
          paidOrders: summary._sum.orderCount ?? 0,
        },
      ]),
    );
    const countsByPos = new Map<string, {
      totalOrders: number;
      pendingOrders: number;
      paidOrders: number;
    }>();

    for (const count of orderCounts) {
      const current = countsByPos.get(count.posId) ?? {
        totalOrders: 0,
        pendingOrders: 0,
        paidOrders: 0,
      };
      const total = count._count._all;
      current.totalOrders += total;
      if (count.status === "pending") current.pendingOrders += total;
      if (count.status === "paid") current.paidOrders += total;
      countsByPos.set(count.posId, current);
    }

    return NextResponse.json({
      success: true,
      posList: posList.map(({ orders, cashiers, ...pos }) => {
        const summary = summariesByPos.get(pos.id) ?? {
          revenue: 0,
          paidOrders: 0,
        };
        const counts = countsByPos.get(pos.id) ?? {
          totalOrders: 0,
          pendingOrders: 0,
          paidOrders: summary.paidOrders,
        };

        return {
          ...pos,
          orders,
          cashiers,
          stats: {
            ...counts,
            paidOrders: counts.paidOrders || summary.paidOrders,
            revenue: summary.revenue,
            averageOrderValue: summary.paidOrders > 0
              ? summary.revenue / summary.paidOrders
              : 0,
          },
        };
      }),
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 },
    );
  }
}
