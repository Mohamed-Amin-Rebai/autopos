import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import bcrypt from "bcryptjs";

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

    // count existing cashiers for the POS to generate unique usernames
    const existingCashiersCount = await prisma.cashier.count({
      where: {
        posId: request.posId,
      },
    });

    const cashiers = [];
    const configs = request.cashierConfigs as any[];

    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      const password = Math.random().toString(36).slice(2, 10);
      const hashedPassword = await bcrypt.hash(password, 10);
      const cashier = await prisma.cashier.create({
        data: {
          posId: request.posId,
          username: `cashier_${request.posId}_${existingCashiersCount + i + 1}`,
          passwordHash: hashedPassword,
          openingCash: config.openingCash,
          shiftStart: config.shiftStart,
          shiftEnd: config.shiftEnd,
        },
      });

      cashiers.push({
        id: cashier.id,
        username: cashier.username,
        password,
        openingCash: cashier.openingCash,
        shiftStart: cashier.shiftStart,
        shiftEnd: cashier.shiftEnd,
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