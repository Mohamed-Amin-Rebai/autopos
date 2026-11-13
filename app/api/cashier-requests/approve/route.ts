import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { isValidObjectId } from "@/lib/isValidObjectId";
import type { CashierRequestConfig, GeneratedCashierCredentials } from "@/lib/types";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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

    if (typeof requestId !== "string" || !isValidObjectId(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
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

    // fetch POS details for friendly usernames
    const pos = await prisma.pOS.findUnique({
      where: { id: request.posId },
      select: { name: true },
    });

    const posSlug = (pos?.name || "pos")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 8) || "pos";

    // count existing cashiers for the POS to generate unique usernames
    const existingCashiersCount = await prisma.cashier.count({
      where: {
        posId: request.posId,
      },
    });

    const cashiers: GeneratedCashierCredentials[] = [];
    const configs = request.cashierConfigs as CashierRequestConfig[];

    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        // Generate a secure 4-digit PIN (1000 - 9999) using crypto
        const pin = crypto.randomInt(1000, 10000).toString();
        const hashedPassword = await bcrypt.hash(pin, 10);

        const candidateUsername = `${posSlug}_c${existingCashiersCount + i + 1}`;
        const existingUsername = await tx.cashier.findUnique({
          where: { username: candidateUsername },
        });

        const finalUsername = existingUsername
          ? `${candidateUsername}_${crypto.randomBytes(2).toString("hex")}`
          : candidateUsername;

        const cashier = await tx.cashier.create({
          data: {
            posId: request.posId,
            username: finalUsername,
            passwordHash: hashedPassword,
            pin,
            openingCash: config.openingCash,
            shiftStart: config.shiftStart,
            shiftEnd: config.shiftEnd,
            allowedIp: config.allowedIp,
          },
        });

        cashiers.push({
          id: cashier.id,
          username: cashier.username,
          password: pin,
          pin,
          url: `/cashier/${cashier.id}`,
          openingCash: cashier.openingCash,
          shiftStart: cashier.shiftStart,
          shiftEnd: cashier.shiftEnd,
        });
      }

      await tx.cashierRequest.update({
        where: {
          id: request.id,
        },
        data: {
          status: "approved",
        },
      });

      await tx.notification.create({
        data: {
          userId: request.ownerId,
          title: "Cashier Request Approved",
          message: `Your cashier request for "${pos?.name ?? request.posId}" was approved! ${configs.length} cashier account(s) have been generated. You can view usernames, PINs, and reset credentials anytime in the Cashiers tab.`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      cashiers,
    });

  } catch (err) {

    console.error("Cashier approval error:",err);
    return NextResponse.json(
      { error: "Failed to approve request" },
      { status: 500 }
    );

  }
}