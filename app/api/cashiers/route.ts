import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function GET(req: Request) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const posId = searchParams.get("posId");

    if (!posId) {
      return NextResponse.json(
        { error: "posId required" },
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
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cashiers);

  } catch (err) {
    console.error("Cashiers fetch error:", err);

    return NextResponse.json(
      { error: "Failed to fetch cashiers" },
      { status: 500 }
    );
  }
}