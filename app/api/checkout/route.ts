import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      cart,
      posId,
      discount,
      paymentMethod,
      bankDetails,
      cashierId,
    } = body;

    //  get user from server
    const dbUser = await getOrCreateUser();
    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = dbUser.id;

    //  basic validation
    if (!cart || cart.length === 0 || !posId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // validate payment method
    if (paymentMethod !== "cash" && paymentMethod !== "bank") {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    //  bank validation
    if (paymentMethod === "bank") {
      if (!bankDetails?.name || !bankDetails?.number) {
        return NextResponse.json(
          { error: "Missing bank details" },
          { status: 400 }
        );
      }
    }

    //  calculate totals
    const subtotal = cart.reduce(
      (sum: number, item: any) =>
        sum + item.product.price * item.quantity,
      0
    );
    const discountValue = discount?.value || 0;
    const total = subtotal - (subtotal * discountValue) / 100;

    // check if pos exists
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

    //  create order
    const createdOrder = await prisma.order.create({
      data: {
        userId,
        posId,
        cashierId: cashierId || null,
        items: cart,
        total,
        discount,
        status:
          paymentMethod === "cash"
            ? "paid"
            : "pending",
        paymentDetails:
          paymentMethod === "bank"
            ? bankDetails
            : null,
      },
    });

    //  return order id
    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: "Checkout failed",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}