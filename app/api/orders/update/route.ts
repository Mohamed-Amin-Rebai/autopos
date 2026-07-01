import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function POST(req: Request) {
  try {
    //  check auth + role
    const user = await getOrCreateUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    //  parse request body
    const body = await req.json();
    const { orderId } = body;

    // validate orderId
    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    // check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    // check if order is already paid
    if (order.status === "paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }

    //  update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "paid",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
    });

  } catch (err) {
    console.error("❌ Update order error:", err);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}