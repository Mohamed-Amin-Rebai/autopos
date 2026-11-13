import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  const email =
    clerkUser.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("Clerk user has no email address");
  }

  const name = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ") || null;

  if (existing) {
    if (existing.email === email && existing.name === name) {
      return existing;
    }

    return prisma.user.update({
      where: { id: existing.id },
      data: { email, name },
    });
  }

  try {
    return await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        name,
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