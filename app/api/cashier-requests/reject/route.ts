import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID required" },
        { status: 400 }
      );
    }

    const request = await prisma.cashierRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { error: "Already approved or rejected" },
        { status: 400 }
      );
    }


    await prisma.$transaction(async (tx) => {
        await tx.cashierRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: "rejected",
            },
        });

        const pos = await tx.pOS.findUnique({
            where: {
                id: request.posId,
            },
            select: {
                name: true,
            },
        });

        await tx.notification.create({
            data: {
                userId: request.ownerId,
                title: "Cashier Request Rejected",
                message: `Your cashier request for "${pos?.name ?? request.posId}" has been Rejected.`,
            },
        });
    });

    return NextResponse.json({
      success: true,
    });

  } catch {
    return NextResponse.json(
      { error: "Failed to reject request" },
      { status: 500 }
    );
  }
}