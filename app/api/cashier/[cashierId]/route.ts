import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

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
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { cashierId } = await params;

    if (!cashierId) {
      return NextResponse.json(
        { error: "Cashier ID is required" },
        { status: 400 }
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

    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const updatedCashier =
      await prisma.cashier.update({
        where: {
          id: cashierId,
        },
        data: {
          ...(body.isActive !== undefined && {
            isActive: body.isActive,
          }),

          ...(body.shiftStart && {
            shiftStart: body.shiftStart,
          }),

          ...(body.shiftEnd && {
            shiftEnd: body.shiftEnd,
          }),

          ...(body.openingCash !== undefined && {
            openingCash: body.openingCash,
          }),
        },
      });

    return NextResponse.json(
      updatedCashier
    );
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