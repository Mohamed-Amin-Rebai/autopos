import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      username,
      password,
      cashierId,
    } = body;

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

    const clientIp =
      req.headers.get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim() ?? null;


    if (cashier.allowedIp && clientIp !== cashier.allowedIp) { 
      return NextResponse.json( 
        { error: "This cashier account may only be used from the authorized network", },
        { status: 403, } 
      ); 
    }

    const isValid = await bcrypt.compare(
      password,
      cashier.passwordHash
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!cashier.isActive) {
      return NextResponse.json(
        { error: "Cashier account is disabled" },
        { status: 403 }
      );
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