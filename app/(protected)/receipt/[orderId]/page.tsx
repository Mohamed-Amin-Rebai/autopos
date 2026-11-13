import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReceiptPrintButton from "@/components/ReceiptPrintButton";
import type { CartItem } from "@/lib/types";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { isValidObjectId } from "@/lib/isValidObjectId";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {

  const { orderId } = await params;
  if (!isValidObjectId(orderId)) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("cashier_session")?.value;
  const session = token
    ? await prisma.cashierSession.findUnique({ where: { token } })
    : null;
  const cashierCanView =
    !!session &&
    session.expiresAt >= new Date() &&
    session.cashierId === order.cashierId;
  const user = await getOrCreateUser();
  const ownerCanView =
    !!user &&
    (user.role === "admin" || order.userId === user.id);

  if (!cashierCanView && !ownerCanView) {
    notFound();
  }

  const items = order.items as CartItem[];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-md mx-auto border rounded-lg p-6">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            AutoPOS
          </h1>

          <p className="text-sm text-gray-500">
            Receipt
          </p>
        </div>

        <div className="space-y-1 text-sm mb-4">
          <p>
            Receipt #: {order.receiptNumber}
          </p>

          <p>
            Date: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <hr className="my-4" />

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between"
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>

              <span>
                {(item.product.price * item.quantity).toFixed(2)}
                {" "}TND
              </span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{order.total.toFixed(2)} TND</span>
        </div>

        <ReceiptPrintButton />

      </div>
    </div>
  );
}