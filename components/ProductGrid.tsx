export default function ProductGrid({
  products,
  selectedCategory,
  addToCart,
  hasCategories,
}: any) {
  // ✅ decide what to show
  const displayedProducts =
    hasCategories && selectedCategory
      ? products.filter((p: any) => p.category === selectedCategory)
      : products;

  return (
    <div
      className={`${
        hasCategories ? "w-2/4" : "w-3/4"
      } grid grid-cols-2 gap-4 p-4 overflow-y-auto`}
    >
      {displayedProducts.map((p: any) => (
        <div
          key={p.id}
          className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer hover:scale-[1.02]"
          onClick={() => addToCart(p)}
        >
          {/* ✅ IMAGE */}
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              className="h-24 w-full object-cover rounded mb-2"
            />
          ) : (
            <div className="h-24 bg-gray-200 mb-2 rounded flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}

          <h4 className="font-bold text-lg">{p.name}</h4>

          <p className="text-green-600 font-semibold">
            {p.price} TND
          </p>

          {p.brand && (
            <p className="text-sm text-gray-500">{p.brand}</p>
          )}

          <div className="mt-2 text-xs text-gray-500">
            {Object.entries(p.attributes || {}).map(([k, v]) => (
              <div key={k}>
                {k}: {String(v)}
              </div>
            ))}
          </div>

          <button className="mt-3 w-full bg-black text-white py-1 hover:bg-gray-800 cursor-pointer">
            Add
          </button>
        </div>
      ))}
    </div>
  );
}