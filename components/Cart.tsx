import { useState } from "react";
import { ShoppingCart, Trash2, Minus, Plus, CreditCard, Wallet, Banknote, X } from "lucide-react";

export default function Cart({
  cart,
  posId,
  cashierId,
  onClearCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  data
}: any) {

  const [showPayment, setShowPayment] = useState(false);
  const [method, setMethod] = useState("cash");
  const [processing, setProcessing] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountNumber , setAccountNumber ] = useState("");

  const subtotal = cart.reduce(
    (sum: number, item: any) =>
      sum + item.product.price * item.quantity,
    0
  );

  const activeDiscount =
    data?.discounts?.find((d: any) => d.active) || {
      name: "None",
      value: 0
    };

  const discountValue = activeDiscount.value;
  const discountAmount = (subtotal * discountValue) / 100;
  const total = subtotal - discountAmount;

  const handlePayment = async () => {
    if (!cart.length) {
      alert("Cart is empty");
      return;
    }

    if (!posId) {
      alert("Missing POS ID");
      return;
    }

    if (method === "bank") {
      if (!accountName || !accountNumber) {
        alert("Please fill bank details");
        return;
      }
    }


    try {
      setProcessing(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          posId,
          cashierId,
          discount: activeDiscount,
          paymentMethod: method,
          bankDetails: method === "bank"
            ? { name: accountName, number: accountNumber }
            : null
        }),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      alert("✅ Order created successfully");
      setAccountName("");
      setAccountNumber("");
      setShowPayment(false);
      onClearCart();

    } catch {
      alert("❌ Error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">

      {/* ✅ HEADER */}
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <ShoppingCart className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm tracking-wide">
            Shopping Cart
          </h3>
          {cart.length > 0 && (
            <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 px-2.5 py-1 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </div>
      </div>

      {/* ✅ ITEMS LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">

        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-sm text-gray-400 font-medium">Your cart is empty</p>
            <p className="text-xs text-gray-300 mt-1">Add items to get started</p>
          </div>
        )}

        {cart.map((item: any) => (
          <div
            key={item.product.id}
            className="group bg-gray-50/80 rounded-xl p-3 border border-gray-100/80 
                       hover:border-indigo-200/50 transition-all hover:shadow-md"
          >

            {/* PRODUCT INFO */}
            <div className="flex gap-3">
              
              {/* Mini image */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200/50 overflow-hidden">
                {item.product.image ? (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {item.product.name}
                  </p>
                  <button
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors 
                               opacity-0 group-hover:opacity-100"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.product.price} TND × {item.quantity}
                  <span className="ml-2 font-medium text-gray-700">
                    = {(item.product.price * item.quantity).toFixed(2)} TND
                  </span>
                </p>
                
                {/* QUANTITY CONTROLS */}
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-lg 
                               bg-white border border-gray-200 hover:border-indigo-300 
                               hover:bg-indigo-50 transition-all text-gray-600 hover:text-indigo-600"
                    onClick={() => decreaseQty(item.product.id)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="text-sm font-medium w-5 text-center text-gray-700">
                    {item.quantity}
                  </span>

                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-lg 
                               bg-white border border-gray-200 hover:border-indigo-300 
                               hover:bg-indigo-50 transition-all text-gray-600 hover:text-indigo-600"
                    onClick={() => increaseQty(item.product.id)}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ TOTALS */}
      {cart.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-200/60 bg-gray-50/80">
          
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-gray-700">{subtotal.toFixed(2)} TND</span>
          </div>

          {discountValue > 0 && (
            <div className="flex justify-between text-sm mb-2">
              <span className="text-emerald-600">Discount ({activeDiscount.name})</span>
              <span className="text-emerald-600 font-medium">-{discountAmount.toFixed(2)} TND</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-gray-200/60">
            <span className="text-base font-semibold text-gray-800">Total</span>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900">{total.toFixed(2)}</span>
              <span className="text-sm font-medium text-gray-500 ml-1">TND</span>
            </div>
          </div>

          {/* PAY BUTTON */}
          {!showPayment && (
            <button
              onClick={() => setShowPayment(true)}
              className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white 
                         py-3 rounded-xl text-sm font-medium 
                         hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] 
                         transition-all duration-200"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      )}

      {/* ✅ PAYMENT PANEL */}
      {showPayment && cart.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-200/60 bg-white">
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Payment Method
            </p>
            <button
              onClick={() => setShowPayment(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* METHOD SELECTOR */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { id: "cash", label: "Cash", icon: Banknote },
              { id: "bank", label: "Bank Transfer", icon: Wallet },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${method === id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-[1.01]"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* CASH INFO */}
          {method === "cash" && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100/50">
              <p className="text-xs text-blue-700">
                Customer will pay in cash at checkout
              </p>
            </div>
          )}

          {/* BANK FORM */}
          {method === "bank" && (
            <div className="space-y-2 mb-4">
              <input
                placeholder="IBAN / Account Number"
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                           focus:border-indigo-500 transition-all"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <input
                placeholder="Account Holder Name"
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                           focus:border-indigo-500 transition-all"               
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
          )}

          {/* TOTAL DISPLAY */}
          <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-600">Amount to pay</span>
            <span className="text-lg font-bold text-gray-900">{total.toFixed(2)} TND</span>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowPayment(false)}
              className="w-1/3 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-medium 
                         hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Back
            </button>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-2/3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white 
                         py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                         hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02]
                         disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                         flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}