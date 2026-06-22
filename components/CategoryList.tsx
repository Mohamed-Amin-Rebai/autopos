export default function CategoryList({
  categories,
  selected,
  setSelected,
}: any) {
  return (
    <div className="w-1/4 border-r bg-gray-50 flex flex-col">
      
      {/* ✅ TITLE */}
      <div className="p-4 border-b">
        <h3 className="font-bold text-lg">Categories</h3>
      </div>

      {/* ✅ CATEGORY LIST */}
      <div className="p-4 flex flex-col gap-2">
        {categories.map((cat: string) => (
          <div
            key={cat}
            className={`flex items-center px-3 py-2 rounded cursor-pointer transition-all ${
              selected === cat
                ? "bg-black text-white shadow"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setSelected(cat)}
          >
            
            <span
              className={`w-2 h-2 mr-2 rounded-full ${
                selected === cat ? "bg-white" : "bg-gray-400"
              }`}
            ></span>

            
            <span className="font-medium">{cat}</span>
          </div>
        ))}


      </div>
    </div>
  );
}

