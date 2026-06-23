import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const posId = searchParams.get("posId");
    const userId = searchParams.get("userId");

    // ✅ GET SINGLE POS BY ID
    if (posId) {
      const pos = await prisma.pOS.findUnique({
        where: { id: posId },
      });

      if (!pos) {
        return NextResponse.json(
          { error: "POS not found" },
          { status: 404 }
        );
      }

      // ✅ return full data (current + history)
      return NextResponse.json(pos.data);
    }

    // ✅ GET ALL POS FOR A USER
    if (userId) {
      const posList = await prisma.pOS.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(posList);
    }

    // ✅ fallback if nothing provided
    return NextResponse.json(
      { error: "posId or userId query param required" },
      { status: 400 }
    );
  } catch (err) {
    console.error("❌ Error fetching POS:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
