import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const posList = await prisma.pOS.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posList.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const posIds = posList.map((p) => p.id);

    const allCashiers = await prisma.cashier.findMany({
      where: {
        posId: {
          in: posIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        openingCash: true,
        shiftStart: true,
        shiftEnd: true,
        isActive: true,
        createdAt: true,
        posId: true,
      },
    });

    const result = posList.map((pos) => {
      const cashiers = allCashiers.filter(
        (cashier) => cashier.posId === pos.id
      );

      return {
        posId: pos.id,
        posName: pos.name,
        cashiers,
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.error(
      "Cashier management fetch error:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load cashier management data",
      },
      {
        status: 500,
      }
    );
  }
}