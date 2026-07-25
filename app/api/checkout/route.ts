import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import type { CartItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      cart,
      posId,
      discount,
      paymentMethod,
      bankDetails,
      idempotencyKey,
    } = body;

    // validate idempotency key
    if (!idempotencyKey) {
      return NextResponse.json(
        { error: "Missing idempotency key" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    const token =
      cookieStore.get("cashier_session")
        ?.value;


    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // validate cashier session
    const session = await prisma.cashierSession.findUnique({
      where: {
        token,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }

    // verify cashier account
    const cashier = await prisma.cashier.findUnique({
      where: {
        id: session.cashierId,
      },
    });

    if (!cashier) {
      return NextResponse.json(
        { error: "Cashier not found" },
        { status: 404 }
      );
    }

    // validate cart and POS input
    if (!cart || cart.length === 0 || !posId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // validate bank payment details
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

    // calculate order totals
    const subtotal = cart.reduce(
      (sum: number, item: CartItem) =>
        sum + item.product.price * item.quantity,
      0
    );
    const discountValue = discount?.value || 0;
    const total = subtotal - (subtotal * discountValue) / 100;

    // prevent invalid or manipulated totals
    if (total <= 0) {
      return NextResponse.json(
        { error: "Invalid total" },
        { status: 400 }
      );
    }

    // verify cashier POS exists
    const pos = await prisma.pOS.findUnique({
      where: {
        id: cashier.posId,
      },
    });

    if (!pos) {
      return NextResponse.json(
        { error: "POS not found" },
        { status: 404 }
      );
    }

    // ensure cashier cannot submit orders for another POS
    if (posId !== cashier.posId) {
      return NextResponse.json(
        { error: "Invalid POS" },
        { status: 403 }
      );
    }

    const userId = pos.userId;

    // generate receipt number
    const receiptNumber =`RCPT-${new Date().getFullYear()}-${Date.now()}`;
    
    // prevent duplicate order creation
    const existingOrder = await prisma.order.findFirst({
      where: {
        idempotencyKey,
      },
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        receiptNumber: existingOrder.receiptNumber,
      });
    }

    // create order
    const createdOrder = await prisma.order.create({
      data: {
        userId,
        posId,
        cashierId: cashier.id,
        items: cart,
        total,
        discount,
        idempotencyKey,
        receiptNumber,
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

    // return receipt information
    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      receiptNumber: createdOrder.receiptNumber,
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