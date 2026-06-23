import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, userId, posId, discount, paymentMethod } = body;

    if (!cart || cart.length === 0 || !userId || !posId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const subtotal = cart.reduce(
      (sum: number, item: any) =>
        sum + item.product.price * item.quantity,
      0
    );

    const discountValue = discount?.value || 0;

    const total = subtotal - (subtotal * discountValue) / 100;

    await prisma.order.create({
      data: {
        userId,
        posId,
        items: cart,
        total,
        discount,
        status: paymentMethod === "cash" ? "paid" : "pending",
      },
    });
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Checkout failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}