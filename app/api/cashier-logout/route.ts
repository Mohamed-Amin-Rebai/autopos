import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get("cashier_session")
        ?.value;

    if (token) {
      await prisma.cashierSession.deleteMany({
        where: { token },
      });
    }

    cookieStore.delete("cashier_session");

    return Response.json({
      success: true,
    });

  } catch (error) {
    console.error("Cashier logout error:",error);

    return Response.json(
      {
        error: "Logout failed",
      },
      {
        status: 500,
      }
    );
  }
}