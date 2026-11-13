import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { recordPaidOrder } from "@/lib/analyticsSummary";

const MAX_BATCH_SIZE = 100;

export async function POST(request: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const cursor = typeof body.cursor === "string" ? body.cursor : undefined;
    const requestedBatchSize = Number(body.batchSize);
    const batchSize = Number.isInteger(requestedBatchSize) && requestedBatchSize > 0
      ? Math.min(requestedBatchSize, MAX_BATCH_SIZE)
      : MAX_BATCH_SIZE;

    const orders = await prisma.order.findMany({
      where: { status: "paid" },
      orderBy: { id: "asc" },
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      take: batchSize,
    });

    for (const order of orders) {
      await recordPaidOrder(order);
    }

    return NextResponse.json({
      success: true,
      processed: orders.length,
      nextCursor: orders.length === batchSize
        ? orders[orders.length - 1].id
        : null,
    });
  } catch (error) {
    console.error("Analytics backfill error:", error);
    return NextResponse.json(
      { error: "Failed to backfill analytics summaries" },
      { status: 500 },
    );
  }
}
