import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, posId } = body;

    if (!data || !posId) {
      return NextResponse.json(
        { error: "Missing data or posId" },
        { status: 400 }
      );
    }

    // ✅ find POS
    const existing = await prisma.pOS.findUnique({
      where: { id: posId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "POS not found" },
        { status: 404 }
      );
    }

    // ✅ extract previous history
    const existingData = existing.data as any;

    const updatedData = {
      current: data,
      history: [
        ...(existingData?.history || []),
        {
          label: "Manual save",
          data,
        },
      ],
    };

    // ✅ update DB
    const updated = await prisma.pOS.update({
      where: { id: posId },
      data: {
        data: updatedData,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ Update error:", err);

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}