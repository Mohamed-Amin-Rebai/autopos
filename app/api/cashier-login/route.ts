import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { isIP } from "node:net";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      username,
      password,
      cashierId,
    } = body;

    try {
      const rateLimit = await checkRateLimit(
        "cashierLogin",
        getClientIp(req) || "unknown"
      );
      if (!rateLimit.success) {
        return rateLimitResponse(rateLimit);
      }
    } catch (error) {
      console.error("Cashier login rate limiter error:", error);
      return NextResponse.json(
        { error: "Rate limiting service unavailable" },
        { status: 503 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const cashier = await prisma.cashier.findUnique({
      where: {
        username,
      },
    });

    if (!cashier) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (cashier.id !== cashierId) {
      return NextResponse.json(
        { error: "Invalid cashier page" },
        { status: 401 }
      );
    }

    // Check account lockout (brute-force throttling)
    if (cashier.lockedUntil && cashier.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (cashier.lockedUntil.getTime() - Date.now()) / (1000 * 60)
      );
      return NextResponse.json(
        {
          error: `Account is temporarily locked due to repeated failed login attempts. Try again in ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}.`,
        },
        { status: 429 }
      );
    }

    const clientIp = getClientIp(req);

    if (
      cashier.allowedIp &&
      (!clientIp || !isIP(clientIp) || clientIp !== cashier.allowedIp)
    ) {
      return NextResponse.json(
        { error: "This cashier account may only be used from the authorized network" },
        { status: 403 }
      );
    }

    // Verify against 4-6 digit PIN or hashed password
    const isPinMatch = cashier.pin ? cashier.pin === password : false;
    const isHashMatch = await bcrypt.compare(password, cashier.passwordHash);
    const isValid = isPinMatch || isHashMatch;

    if (!isValid) {
      const newAttempts = (cashier.failedAttempts || 0) + 1;
      const MAX_ATTEMPTS = 5;
      const willLock = newAttempts >= MAX_ATTEMPTS;
      const lockedUntil = willLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await prisma.cashier.update({
        where: { id: cashier.id },
        data: {
          failedAttempts: willLock ? 0 : newAttempts,
          lockedUntil,
        },
      });

      if (willLock) {
        return NextResponse.json(
          {
            error: "Too many failed attempts. Account has been locked for 15 minutes.",
          },
          { status: 429 }
        );
      }

      const remaining = MAX_ATTEMPTS - newAttempts;
      return NextResponse.json(
        {
          error: `Invalid credentials. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining before lockout.`,
        },
        { status: 401 }
      );
    }

    if (!cashier.isActive) {
      return NextResponse.json(
        { error: "Cashier account is disabled" },
        { status: 403 }
      );
    }

    // Successful login: reset failed attempts counter if previously incremented
    if (cashier.failedAttempts > 0 || cashier.lockedUntil) {
      await prisma.cashier.update({
        where: { id: cashier.id },
        data: {
          failedAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    await prisma.cashierSession.deleteMany({
      where: {
        cashierId: cashier.id,
      },
    });

    if (cashier.shiftStart && cashier.shiftEnd) {
      const now = new Date();

      const current =
        now.getHours() * 60 +
        now.getMinutes();

      const [startHour, startMinute] =
        cashier.shiftStart.split(":").map(Number);

      const [endHour, endMinute] =
        cashier.shiftEnd.split(":").map(Number);

      const start =
        startHour * 60 + startMinute;

      const end =
        endHour * 60 + endMinute;

      let inShift = false;

      if (start <= end) {
        inShift =
          current >= start &&
          current <= end;
      } else {
        inShift =
          current >= start ||
          current <= end;
      }

      if (!inShift) {
        return NextResponse.json(
          {
            error:
              "You can only access this POS during your assigned shift",
          },
          {
            status: 403,
          }
        );
      }
    }

    const token = crypto.randomUUID();

    await prisma.cashierSession.create({
      data: {
        cashierId: cashier.id,
        token,
        expiresAt: new Date(
          Date.now() + 1000 * 60 * 60 * 12
        ), // 12 hours
      },
    });

    const cookieStore = await cookies();

    cookieStore.set(
      "cashier_session",
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
      }
    );

    return NextResponse.json({
      success: true,
      cashierId: cashier.id,
      posId: cashier.posId,
      username: cashier.username,
      openingCash: cashier.openingCash,
    });



  } catch (err) {
    console.error("Cashier login error:", err);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}