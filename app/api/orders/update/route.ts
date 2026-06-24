import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function POST(req: Request) {
  try {
    // ✅ check auth + role
    const user = await getOrCreateUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // ✅ parse request body
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    // ✅ update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "paid",
      },
    });

    return NextResponse.json(updatedOrder);

  } catch (err) {
    console.error("❌ Update order error:", err);

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}