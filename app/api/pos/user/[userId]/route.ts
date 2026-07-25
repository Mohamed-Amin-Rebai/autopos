import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ userId: string }>;
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

    const { userId } = await params;

    const posList = await prisma.pOS.findMany({
      where: {
        userId:
          user.role === "admin"
            ? userId
            : user.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      posList,
    });

  } catch (err) {

    console.error("POS list fetch failed",err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    
  }
}