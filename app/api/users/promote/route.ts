import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "user") {
      return NextResponse.json({
        success: true,
        role: user.role,
      });
    }

    const client = await clerkClient();
    await client.users.updateUserMetadata(user.clerkId, {
      publicMetadata: {
        role: "manager",
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "manager" },
      select: { role: true },
    });

    return NextResponse.json({
      success: true,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("User promotion error:", error);
    return NextResponse.json(
      { error: "Failed to promote user" },
      { status: 500 }
    );
  }
}
