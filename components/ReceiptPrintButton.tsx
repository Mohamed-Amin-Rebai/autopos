"use client";

export default function ReceiptPrintButton() {

  return (
    <button
      onClick={() => window.print()}
      className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg"
    >
      Print Receipt
    </button>
  );
}