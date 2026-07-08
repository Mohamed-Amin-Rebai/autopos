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
      return NextResponse.json(
        { error: "No POS found for user" },
        { status: 404 }
      );
    }

    const result = await Promise.all(
      posList.map(async (pos : any) => {
        const cashiers = await prisma.cashier.findMany({
          where: {
            posId: pos.id,
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
          },
        });

        return {
          posId: pos.id,
          posName: pos.name,
          cashiers,
        };
      })
    );

    return NextResponse.json(result);

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