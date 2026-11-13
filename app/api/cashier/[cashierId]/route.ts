import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { isValidObjectId } from "@/lib/isValidObjectId";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ cashierId: string }> }
) {
  try {
    const { cashierId } = await params;

    const cookieStore = await cookies();

    const token =
      cookieStore.get("cashier_session")
        ?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (!isValidObjectId(cashierId)) {
      return NextResponse.json(
        { error: "Invalid cashier ID" },
        { status: 400 }
      );
    }

    const session = await prisma.cashierSession.findUnique({
      where: {
        token,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: "Session expired",
        },
        {
          status: 401,
        }
      );
    }

    if (session.cashierId !== cashierId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

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


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ cashierId: string }> }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { cashierId } = await params;

    if (!cashierId) {
      return NextResponse.json(
        { error: "Cashier ID is required" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(cashierId)) {
      return NextResponse.json(
        { error: "Invalid cashier ID" },
        { status: 400 }
      );
    }

    const cashier = await prisma.cashier.findUnique({
      where: {
        id: cashierId,
      },
      include: {
        pos: true,
      },
    });

    if (!cashier) {
      return NextResponse.json(
        { error: "Cashier not found" },
        { status: 404 }
      );
    }

    // Allow POS owner or Admin
    if (cashier.pos.userId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You can only manage cashiers for your own POS" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    let newPin: string | undefined = undefined;
    let passwordHash: string | undefined = undefined;

    if (body.generatePin) {
      newPin = crypto.randomInt(1000, 10000).toString();
      passwordHash = await bcrypt.hash(newPin, 10);
    } else if (body.pin !== undefined) {
      const pinStr = String(body.pin).trim();
      if (!/^\d{4,6}$/.test(pinStr)) {
        return NextResponse.json(
          { error: "PIN must be between 4 and 6 digits (numbers only)" },
          { status: 400 }
        );
      }
      newPin = pinStr;
      passwordHash = await bcrypt.hash(pinStr, 10);
    }

    const updatedCashier = await prisma.cashier.update({
      where: {
        id: cashierId,
      },
      data: {
        ...(body.isActive !== undefined && {
          isActive: body.isActive,
        }),

        ...(body.shiftStart !== undefined && {
          shiftStart: body.shiftStart,
        }),

        ...(body.shiftEnd !== undefined && {
          shiftEnd: body.shiftEnd,
        }),

        ...(body.openingCash !== undefined && {
          openingCash: body.openingCash,
        }),

        ...(newPin !== undefined && {
          pin: newPin,
          passwordHash,
          failedAttempts: 0,
          lockedUntil: null,
        }),
      },
      select: {
        id: true,
        username: true,
        pin: true,
        openingCash: true,
        shiftStart: true,
        shiftEnd: true,
        isActive: true,
        lockedUntil: true,
        createdAt: true,
        posId: true,
      },
    });

    return NextResponse.json(updatedCashier);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to update cashier",
      },
      {
        status: 500,
      }
    );
  }
}