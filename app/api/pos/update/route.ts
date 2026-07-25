import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import type { POSStoredData } from "@/lib/types";

export async function POST(req: Request) {

  const user = await getOrCreateUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { data, posId } = body;

    if (!data || !posId) {
      return NextResponse.json(
        { error: "Missing data or posId" },
        { status: 400 }
      );
    }

    // find POS
    const existing = await prisma.pOS.findUnique({
      where: { id: posId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "POS not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // extract previous history
    const existingData = existing.data as POSStoredData;

    const updatedData = {
      current: data,
      history: [
        ...(existingData?.history.slice(-20) || []),
        {
          label: "Manual save",
          data,
        },
      ],
    };

    // update DB
    const updated = await prisma.pOS.update({
      where: { id: posId },
      data: {
        data: updatedData,
      },
    });

    return NextResponse.json({
      success: true,
      posId: updated.id,
    });

  } catch (error) {
    console.error(
      "POS update failed",
      user.id,
      error
    );

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}