import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { username, password } = body;

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