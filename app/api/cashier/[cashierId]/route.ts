import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ cashierId: string }> }
) {
  try {
    const { cashierId } = await params;

    const cashier = await prisma.cashier.findUnique({
      where: {
        id: cashierId,
      },
    });

    if (!cashier) {
      return NextResponse.json(
        { error: "Cashier not found" },
        { status: 404 }
      );
    }

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

    return NextResponse.json({
      cashier: {
        id: cashier.id,
        username: cashier.username,
        openingCash: cashier.openingCash,
        posId: cashier.posId,
      },
      pos: pos.data,
    });

  } catch (err) {
    console.error("Cashier fetch error:", err);

    return NextResponse.json(
      {
        error: "Failed to load cashier",
      },
      {
        status: 500,
      }
    );
  }
}