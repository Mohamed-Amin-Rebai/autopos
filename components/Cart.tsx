import { useState } from "react";

export default function Cart({
  cart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  data
}: any) {

  const [showPayment, setShowPayment] = useState(false);
  const [method, setMethod] = useState("cash");
  const [processing, setProcessing] = useState(false);

  // ✅ subtotal
  const subtotal = cart.reduce(
    (sum: number, item: any) =>
      sum + item.product.price * item.quantity,
    0
  );

  // ✅ active discount
  const activeDiscount =
    data?.discounts?.find((d: any) => d.active) || {
      name: "None",
      value: 0
    };

  const discountValue = activeDiscount.value;

  const total =
    subtotal - (subtotal * discountValue) / 100;

  // ✅ PAYMENT HANDLER
  const handlePayment = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const posId = urlParams.get("posId");

    try {
      await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          posId,
          userId: "000000000000000000000000",
          discount: activeDiscount,
          paymentMethod: method,
        }),
      });

      alert("✅ Order created successfully");
    } catch {
      alert("❌ Error");
    }
  };

  return (
    <div className="w-1/4 border-l p-4 bg-gray-50 overflow-y-auto">
      <h3 className="font-bold mb-2">Cart</h3>

      {cart.length === 0 && (
        <p className="text-gray-500">Cart is empty</p>
      )}

      {cart.map((item: any) => (
        <div
          key={item.product.id}
          className="mb-3 border p-3 rounded bg-white shadow-sm"
        >
          <div className="font-bold">
            {item.product.name}
          </div>

          <div className="text-sm">
            {item.product.price} TND x {item.quantity}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              className="px-2 bg-gray-300"
              onClick={() => decreaseQty(item.product.id)}
            >
              -
            </button>

            <button
              className="px-2 bg-gray-300"
              onClick={() => increaseQty(item.product.id)}
            >
              +
            </button>

            <button
              className="ml-auto text-red-500"
              onClick={() =>
                removeFromCart(item.product.id)
              }
            >
              remove
            </button>
          </div>
        </div>
      ))}

      {/* ✅ TOTAL */}
      <div className="mt-4 space-y-1">
        <p>Subtotal: {subtotal.toFixed(2)} TND</p>

        <p className="text-green-600">
          Discount: {activeDiscount.name} (-{discountValue}%)
        </p>

        <p className="font-bold mt-2">
          Total: {total.toFixed(2)} TND
        </p>
      </div>

      {/* ✅ PAY BUTTON */}
      {!showPayment && cart.length > 0 && (
        <button
          onClick={() => setShowPayment(true)}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded"
        >
          Pay
        </button>
      )}

      {/* ✅ PAYMENT UI */}
      {showPayment && (
        <div className="mt-4 border p-3 rounded bg-white space-y-3">

          {/* ✅ SELECT METHOD */}
          <div className="flex gap-2">
            {["cash", "bank"].map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-2 py-1 rounded ${
                  method === m
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* ✅ CASH */}
          {method === "cash" && (
            <p className="text-sm text-gray-600">
              Customer will pay with cash upon delivery.
            </p>
          )}


          {/* ✅ BANK */}
          {method === "bank" && (
            <div className="space-y-2">
              <input
                placeholder="IBAN"
                className="w-full border p-1"
              />
              <input
                placeholder="Account Name"
                className="w-full border p-1"
              />
            </div>
          )}

          {/* ✅ PROCESS BUTTON */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            {processing ? "Processing..." : "Confirm Payment"}
          </button>

        </div>
      )}
    </div>
  );
}