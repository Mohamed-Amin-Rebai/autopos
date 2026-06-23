import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error("❌ Users fetch error:", err);
    return NextResponse.json([], { status: 500 });
  }
}