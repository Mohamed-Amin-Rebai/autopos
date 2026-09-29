import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existing) return existing;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("Clerk user has no email address");
  }

  try {
    return await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        name: clerkUser.firstName ?? null,
      },
    });
  } catch (err) {
    // Race: another request created the user between findUnique and create
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      });
      if (user) return user;
    }
    throw err;
  }
}