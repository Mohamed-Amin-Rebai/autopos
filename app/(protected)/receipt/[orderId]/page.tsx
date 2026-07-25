import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReceiptPrintButton from "@/components/ReceiptPrintButton";
import type { CartItem } from "@/lib/types";
import { cookies } from "next/headers";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {

  const cookieStore = await cookies();
  const token = cookieStore.get("cashier_session") ?.value;
  if (!token) {
    notFound();
  }

  const session = await prisma.cashierSession.findUnique({
    where: {
      token,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    notFound();
  }

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order || order.cashierId !== session.cashierId) {
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