import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    return NextResponse.json({
      role: user?.role ?? "",
    });
  } catch (error) {
    console.error("User role sync failed:", error);
    return NextResponse.json(
      { error: "Failed to load user role" },
      { status: 500 },
    );
  }
}
