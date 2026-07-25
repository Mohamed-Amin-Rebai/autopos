import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import CashierLogin from "./CashierLogin";
import CashierUI from "./CashierUI";

export default async function CashierPage({
  params,
}: {
  params: Promise<{ cashierId: string }>;
}) {
  const { cashierId } = await params;

  const cookieStore = await cookies();

  const token =
    cookieStore.get("cashier_session")
      ?.value;

  if (!token) {
    return (
      <CashierLogin cashierId={cashierId} />
    );
  }

  const session = await prisma.cashierSession.findUnique({
    where: {
      token,
    },
  });

  if (!session || session.cashierId !== cashierId || session.expiresAt < new Date()) {
    if (session && session.expiresAt < new Date()) {
      await prisma.cashierSession.delete({
        where: {
          id: session.id,
        },
      });
    }
    return (
      <CashierLogin cashierId={cashierId} />
    );
  }

  return (
    <CashierUI cashierId={cashierId} />
  );
}