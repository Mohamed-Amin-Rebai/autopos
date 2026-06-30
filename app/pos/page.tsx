"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryList from "@/components/CategoryList";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import ChatPanel from "@/components/ChatPanel";
import { POSData } from "@/lib/types";

import {
  ArrowLeft,
  Download,
  Save,
  Loader2,
  Sparkles
} from "lucide-react";

export default function POSPage() {
  const [data, setData] = useState<POSData | null>(null);
  const [historyFromDB, setHistoryFromDB] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  // ✅ get posId
  const urlParams = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;
  const posId = urlParams?.get("posId");

  useEffect(() => {
    const fetchPOS = async () => {
      try {
        if (!posId) return;

        setLoading(true);

        const res = await fetch(`/api/pos?posId=${posId}`);
        const response = await res.json();

        if (response) {
          setData(response.current);
          setHistoryFromDB(response.history || []);

          if (response.current.categories?.length > 0) {
            setSelectedCategory(response.current.categories[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPOS();
  }, [posId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading POS system...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-600 mb-4">Go back and generate a new POS configuration.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const hasCategories = data?.categories && data.categories.length > 0;

  // ✅ cart logic
  const addToCart = (product: any) => {
    const existing = cart.find(
      (item) => item.product.id === product.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.product.id !== id));
  };

  const increaseQty = (id: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart(
      cart
        .map((item) =>
          item.product.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const goBack = () => {
    router.push("/");
  };

  const exportJson = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "pos-config.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!posId) {
      alert("Missing POS ID");
      return;
    }
    try {
      await fetch("/api/pos/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          posId,
        }),
      });

      // ✅ refresh from DB after save
      const res = await fetch(`/api/pos?posId=${posId}`);
      const updated = await res.json();

      setData(updated.current);
      setHistoryFromDB(updated.history);

      alert("✅ POS saved successfully");
    } catch (err) {
      alert("❌ Failed to save POS");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex flex-col">

      {/* ✅ TOP BAR - Premium */}
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">

          <button
            onClick={goBack}
            className="group flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-all hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="w-px h-6 bg-gray-200" />

          <button
            onClick={exportJson}
            className="group flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-all hover:bg-gray-100 rounded-lg"
          >
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-sm font-medium">Export</span>
          </button>

          <div className="w-px h-6 bg-gray-200" />
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="group flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-all hover:bg-gray-100 rounded-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Save POS</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* ✅ POS MAIN - Grid Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4">
        <div className="flex gap-4">
          
          {/* CATEGORY */}
          {hasCategories && (
            <div className="w-[200px] flex-shrink-0">
              <CategoryList
                categories={data.categories}
                selected={selectedCategory}
                setSelected={setSelectedCategory}
              />
            </div>
          )}

          {/* PRODUCTS */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={data.products}
              selectedCategory={selectedCategory}
              addToCart={addToCart}
              hasCategories={hasCategories}
            />
          </div>

          {/* CART */}
          <div className="w-[340px] flex-shrink-0">
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              data={data}
            />
          </div>

        </div>
      </div>

      {/* ✅ CHAT BELOW - Premium */}
      <div className="max-w-7xl mx-auto w-full p-4 pt-0">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden transition-all hover:shadow-xl">
          <div className="p-4">
            <ChatPanel
              data={data}
              historyFromDB={historyFromDB}
              onUpdate={(newData: POSData) => setData(newData)}
            />
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 20px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </main>
  );
}