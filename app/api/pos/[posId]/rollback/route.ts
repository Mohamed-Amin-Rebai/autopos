import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { isValidObjectId } from "@/lib/isValidObjectId";
import type { POSStoredData } from "@/lib/types";
import type { Prisma } from "@prisma/client";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ posId: string }>;
  },
) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { posId } = await params;
    if (!isValidObjectId(posId)) {
      return NextResponse.json({ error: "Invalid POS ID" }, { status: 400 });
    }

    const body = await req.json();
    const historyIndex = body.historyIndex;
    if (!Number.isInteger(historyIndex)) {
      return NextResponse.json(
        { error: "A valid history index is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.pOS.findUnique({ where: { id: posId } });
    if (!existing) {
      return NextResponse.json({ error: "POS not found" }, { status: 404 });
    }

    if (existing.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingData = existing.data as POSStoredData;
    const history = existingData.history ?? [];
    const selectedVersion = history[historyIndex];
    if (!selectedVersion) {
      return NextResponse.json(
        { error: "History version not found" },
        { status: 404 },
      );
    }

    const restoredData: POSStoredData = {
      current: selectedVersion.data,
      history: [
        ...history.slice(-19),
        {
          label: `Restored version ${historyIndex + 1}`,
          data: selectedVersion.data,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    const updated = await prisma.pOS.update({
      where: { id: posId },
      data: { data: restoredData as Prisma.InputJsonValue },
    });

    return NextResponse.json({
      success: true,
      current: restoredData.current,
      history: restoredData.history,
      posId: updated.id,
    });
  } catch (error) {
    console.error("POS rollback failed:", error);
    return NextResponse.json(
      { error: "Failed to restore POS version" },
      { status: 500 },
    );
  }
}
