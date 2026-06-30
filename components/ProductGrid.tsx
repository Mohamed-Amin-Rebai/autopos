import { Package as PackageIcon } from "lucide-react";

export default function ProductGrid({
  products,
  selectedCategory,
  addToCart,
  hasCategories,
}: any) {

  const displayedProducts =
    hasCategories && selectedCategory
      ? products.filter((p: any) => p.category === selectedCategory)
      : products;

  return (
    <div
      className={`
        ${hasCategories ? "flex-1" : "w-full"} 
        grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent
      `}
    >

      {/* ✅ EMPTY STATE - Enhanced */}
      {displayedProducts.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
          <PackageIcon className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-sm font-medium">
            No products in this category
          </p>
          <p className="text-xs mt-1">
            Try selecting a different category
          </p>
        </div>
      )}

      {displayedProducts.map((p: any) => (
        <div
          key={p.id}
          onClick={() => addToCart(p)}
          className="group cursor-pointer bg-white rounded-2xl border border-gray-200/60 shadow-sm 
                     p-4 flex flex-col transition-all duration-300 
                     hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-200/80"
        >

          {/* ✅ IMAGE - Enhanced */}
          <div className="mb-3 relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="h-28 flex flex-col items-center justify-center text-gray-300">
                <PackageIcon className="w-12 h-12 mb-2" />
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* ✅ CONTENT - Enhanced */}
          <div className="flex flex-col flex-1 space-y-2">

            {/* NAME */}
            <h4 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 
                           transition-colors group-hover:text-indigo-600">
              {p.name}
            </h4>

            {/* BRAND */}
            {p.brand && (
              <p className="text-xs text-gray-400 font-medium">
                {p.brand}
              </p>
            )}

            {/* PRICE */}
            <p className="text-lg font-bold text-gray-900 pt-1 border-t border-gray-100/80">
              {p.price} TND
            </p>

            {/* ✅ ATTRIBUTES - As chips */}
            {p.attributes && Object.keys(p.attributes).length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {Object.entries(p.attributes)
                  .slice(0, 2)
                  .map(([k, v]) => (
                    <span key={k} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {k}: {String(v)}
                    </span>
                  ))}
                {Object.keys(p.attributes).length > 2 && (
                  <span className="text-[10px] text-gray-400">+{Object.keys(p.attributes).length - 2}</span>
                )}
              </div>
            )}

          </div>

          {/* ✅ CTA BUTTON - Enhanced */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(p);
            }}
            className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white 
                       py-2.5 rounded-xl text-sm font-medium 
                       transition-all duration-200 
                       hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] 
                       active:scale-[0.98]"
          >
            Add to Cart
          </button>

        </div>
      ))}
    </div>
  );
}