export default function ActionsPanel({
  pay,
  applyDiscount,
}: any) {
  return (
    <div className="p-4 border-t flex gap-4">
      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={pay}
      >
        Pay
      </button>

      <button
        className="bg-yellow-500 px-4 py-2"
        onClick={applyDiscount}
      >
        Discount
      </button>
    </div>
  );
}
