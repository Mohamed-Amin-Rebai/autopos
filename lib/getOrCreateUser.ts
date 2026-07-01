import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const user  = await currentUser();
  if (!user ) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (existing) return existing;

  // ✅ create new user in DB
  return await prisma.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress || "",
      name: user.firstName || "",
    },
  });
}