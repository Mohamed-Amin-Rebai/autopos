import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      posId,
      requestedCashiers,
      cashierConfigs,
    } = body;

    if (!posId) {
      return NextResponse.json(
        { error: "posId is required" },
        { status: 400 }
      );
    }

    if (!requestedCashiers || requestedCashiers < 1) {
      return NextResponse.json(
        { error: "Invalid cashier count" },
        { status: 400 }
      );
    }

    if (!cashierConfigs || !Array.isArray(cashierConfigs) || cashierConfigs.length !== requestedCashiers) {
      return NextResponse.json(
        { error: "Invalid cashier configuration" },
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

    // owner can only request for his own POS
    if (pos.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const request = await prisma.cashierRequest.create({
      data: {
        ownerId: user.id,
        posId,
        requestedCashiers,
        cashierConfigs,
      },
    });

    return NextResponse.json({
      success: true,
      requestId: request.id,
    });

  } catch (err) {
    console.error("Cashier request error:", err);

    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getOrCreateUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const requests = await prisma.cashierRequest.findMany({
      where: {
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);

  } catch (err) {
    console.error("Fetch requests error:", err);

    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}