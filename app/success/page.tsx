"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Success() {
  const params = useSearchParams();
  const router = useRouter();

  const sessionId = params.get("session_id");

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastOrder");

    if (saved) {
      setOrder(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="p-10 max-w-xl mx-auto">

      {/* ✅ HEADER */}
      <h1 className="text-green-600 text-2xl font-bold mb-4">
        ✅ Payment Successful
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Session ID: {sessionId}
      </p>

      {/* ✅ ORDER */}
      {order ? (
        <div className="border rounded p-4 bg-gray-50">

          <h2 className="font-bold mb-3 text-lg">
            Order Summary
          </h2>

          {order.cart.map((item: any, i: number) => (
            <div
              key={i}
              className="flex justify-between mb-1 text-sm"
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>

              <span>
                {(item.product.price * item.quantity).toFixed(2)} TND
              </span>
            </div>
          ))}

          <hr className="my-3" />

          <p className="text-sm">
            Subtotal: {order.subtotal.toFixed(2)} TND
          </p>

          <p className="text-green-600 text-sm">
            Discount: {order.discount.name} (-{order.discount.value}%)
          </p>

          <p className="font-bold text-lg mt-2">
            Total Paid: {order.total.toFixed(2)} TND
          </p>
        </div>
      ) : (
        <p>No order data found.</p>
      )}

      {/* ✅ BUTTON */}
      <button
        onClick={() => router.push("/pos")}
        className="mt-6 w-full bg-black text-white py-2 rounded"
      >
        Back to POS
      </button>

    </div>
  );
}