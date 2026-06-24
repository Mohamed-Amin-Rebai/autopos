import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, posId, discount, paymentMethod } = body;

    const dbUser = await getOrCreateUser();
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = dbUser.id;


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