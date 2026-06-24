import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();

    // ✅ not logged in
    if (!clerkUser) {
      return NextResponse.json({ role: "guest" });
    }

    // ✅ find user in DB
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    // ✅ create if not exists
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: clerkUser.firstName || "",
          role: "user",
        },
      });
    }

    return NextResponse.json({
      role: user.role,
    });

  } catch (err) {
    console.error("❌ /api/me error:", err);

    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}