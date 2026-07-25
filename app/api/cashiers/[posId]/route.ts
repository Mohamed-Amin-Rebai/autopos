import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ posId: string }>;
  }
) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { posId } = await params;

    const pos = await prisma.pOS.findUnique({
      where: {
        id: posId,
      },
      select: {
        userId: true,
      },
    });

    if (!pos) {
      return NextResponse.json(
        { error: "POS not found" },
        { status: 404 }
      );
    }

    if (
      pos.userId !== user.id &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const cashiers = await prisma.cashier.findMany({
      where: {
        posId,
      },
      select: {
        id: true,
        username: true,
        openingCash: true,
        shiftStart: true,
        shiftEnd: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      cashiers,
    });

  } catch (err) {

    console.error("Cashiers fetch error:",err);
    return NextResponse.json(
      { error: "Failed to fetch cashiers" },
      { status: 500 }
    );

  }
}