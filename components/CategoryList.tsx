import { Grid3x3, ChevronRight } from "lucide-react";

export default function CategoryList({
  categories,
  selected,
  setSelected,
}: any) {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden transition-all hover:shadow-xl">
      
      {/* ✅ HEADER */}
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <Grid3x3 className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm tracking-wide">
            Categories
          </h3>
          <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {categories.length}
          </span>
        </div>
      </div>


      {/* ✅ LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {categories.map((cat: string) => {
          const isActive = selected === cat;
          
          return (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`
                group w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                ${isActive 
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]" 
                  : "text-gray-600 hover:bg-gray-50 hover:scale-[1.01]"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                  {cat}
                </span>
                {isActive ? (
                  <span className="flex-shrink-0 text-xs font-medium bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}