import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const posId = searchParams.get("posId");

    if (!posId) {
      return NextResponse.json(
        { error: "posId required" },
        { status: 400 }
      );
    }

    const pos = await prisma.pOS.findUnique({
      where: {
        id: posId,
      },
    });

    if (!pos) {
      return NextResponse.json(
        { error: "POS not found" },
        { status: 404 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        posId: posId,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("❌ Fetch orders error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}