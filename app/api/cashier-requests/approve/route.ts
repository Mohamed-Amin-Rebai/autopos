import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID required" },
        { status: 400 }
      );
    }

    const request = await prisma.cashierRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (request.status === "approved") {
      return NextResponse.json(
        { error: "Already approved" },
        { status: 400 }
      );
    }

    const cashiers = [];

    for (let i = 1; i <= request.requestedCashiers; i++) {
      const cashier = await prisma.cashier.create({
        data: {
          posId: request.posId,
          username: `cashier_${request.posId}_${i}`,
          passwordHash: "temp123",
          openingCash: 100,
        },
      });

      cashiers.push({
        id: cashier.id,
        username: cashier.username,
        password: "temp123",
      });
    }

    await prisma.cashierRequest.update({
      where: {
        id: request.id,
      },
      data: {
        status: "approved",
      },
    });

    return NextResponse.json({
      success: true,
      cashiers,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to approve request" },
      { status: 500 }
    );
  }
}