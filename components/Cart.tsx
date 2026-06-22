export default function Cart({
  cart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  discount
}: any) {
  const subtotal = cart.reduce(
    (sum: number, item: any) =>
      sum + item.product.price * item.quantity,
    0
  );

  const total = subtotal - (subtotal * (discount || 0)) / 100;

  return (
    <div className="w-1/4 border-l p-4 bg-gray-50 overflow-y-auto">
      <h3 className="font-bold mb-2">Panier</h3>

      {cart.length === 0 && (
        <p className="text-gray-500">Panier is empty</p>
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

      <div className="mt-4">
        <p>Subtotal: {subtotal.toFixed(2)} TND</p>

        {discount > 0 && (
          <p className="text-green-600">
            Discount: {discount}%
          </p>
        )}

        <p className="font-bold mt-2">
          Total: {total.toFixed(2)} TND
        </p>
      </div>
    </div>
  );
}